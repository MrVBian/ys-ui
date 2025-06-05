import {
  MonacoEditorLanguageClientWrapper,
  WrapperConfig,
} from "monaco-editor-wrapper";
import { useWorkerFactory } from "monaco-languageclient/workerFactory";
import {
  editor,
  Range,
  Selection,
  KeyCode,
} from "monaco-editor/esm/vs/editor/editor.api";

const configureMonacoWorkers = () => {
  useWorkerFactory({
    workerLoaders: {
      TextEditorWorker: () =>
        new Worker(
          new URL(
            "monaco-editor/esm/vs/editor/editor.worker.js",
            import.meta.url,
          ),
          { type: "module" },
        ),
    },
  });
};

export enum Emphasis {
  None = 0,
  Italic = 1,
  Bold = 2,
  Code = 4,
  StrikeThrough = 8,
}

function* splitToLines(range: Range) {
  const { startLineNumber: s, endLineNumber: e } = range;
  if (e === s) {
    yield range;
    return;
  }
  yield new Range(s, range.startColumn, s, Infinity);
  for (let i = s + 1; i < e; i++) {
    yield new Range(i, 1, i, Infinity);
  }
  yield new Range(e, 1, e, range.endColumn);
}

function getEmphasis(text: string): [Emphasis, number] {
  let emphasis = Emphasis.None;
  let i = 0;
  let k = text.length - 1;
  let repeat = 0;
  let prev = text.charCodeAt(0);

  if (k < 1) {
    return [Emphasis.None, 0]; // 长度不足 2 的肯定没有强调。
  }
  // 通过前一个字符 prev 和它重复的次数 repeat 来判断强调的类型。
  function check(): Emphasis {
    if (repeat === 0) {
      return Emphasis.None;
    }
    if (prev === 126 /* ~ */ && repeat === 2) {
      return Emphasis.StrikeThrough;
    }
    if (prev === 96 /* ` */) {
      return Emphasis.Code;
    }
    if (prev !== 42 /* * */ && prev !== 95 /* _ */) {
      return Emphasis.None;
    }
    if (repeat === 1) {
      return Emphasis.Italic;
    }
    if (repeat === 2) {
      return Emphasis.Bold;
    }
    return Emphasis.Bold | Emphasis.Italic;
  }

  for (; i < k; i++, k--, repeat++) {
    const c = text.charCodeAt(i);
    if (c !== text.charCodeAt(k)) {
      break; // 前后对称位置的字符不一样。
    }
    if (c !== prev) {
      const w = check();
      if (w === Emphasis.None) {
        break;
      }
      repeat = 0;
      prev = c;
      emphasis |= w;
    }
  }
  // 如果前面的字符串不是有效的强调，则要把长度回退到最后一个。
  const w = check();
  return [emphasis | w, w === Emphasis.None ? i - repeat : i];
}

function escape(text: string) {
  return text.replace(/([*`~_])/g, "\\$1");
}

class EmphasisCommand implements editor.ICommand {
  private readonly range: Selection;
  private readonly type: Emphasis;

  constructor(range: Selection, type: Emphasis) {
    this.range = range;
    this.type = type;
  }

  computeCursorState(_: unknown, helper: editor.ICursorStateComputerData) {
    const { range } = this;
    const ops = helper.getInverseEditOperations();
    if (ops.length === 0) return range;
    return new Selection(
      range.startLineNumber,
      ops[0].range.startColumn,
      range.endLineNumber,
      ops[ops.length - 1].range.endColumn,
    );
  }

  getEditOperations(
    model: editor.ITextModel,
    builder: editor.IEditOperationBuilder,
  ) {
    for (const x of splitToLines(this.range)) {
      const text = model.getValueInRange(x);
      if (text.length === 0) continue;
      const replacement = this.renovate(text);
      builder.addTrackedEditOperation(x, replacement);
    }
  }

  private renovate(text: string) {
    const [emphasis, remove] = getEmphasis(text);
    const changed = emphasis ^ this.type;
    const strings: string[] = [];

    if ((changed & Emphasis.Bold) !== 0) {
      strings.push("**");
    }
    if ((changed & Emphasis.Italic) !== 0) {
      strings.push("*");
    }
    if ((changed & Emphasis.StrikeThrough) !== 0) {
      strings.push("~~");
    }
    if ((changed & Emphasis.Code) !== 0) {
      strings.push("`");
    }

    const prefix = strings.join("");
    const suffix = strings.reverse().join("");

    text = text.slice(remove, text.length - remove);
    return `${prefix}${text}${suffix}`;
  }
}

class PrefixCommand implements editor.ICommand {
  private readonly range: Selection;
  private readonly prefix: string;
  private readonly repetend: number;

  constructor(range: Selection, prefix: string, repetend: number) {
    this.range = range;
    this.prefix = prefix;
    this.repetend = repetend;
  }

  computeCursorState(_: unknown, helper: editor.ICursorStateComputerData) {
    const { range } = this;
    if (range.startLineNumber === range.endLineNumber) {
      const ops = helper.getInverseEditOperations();
      if (ops.length > 0) {
        return new Selection(
          range.startLineNumber,
          ops[0].range.endColumn,
          range.startLineNumber,
          ops[0].range.endColumn,
        );
      }
    }
    return new Selection(
      range.startLineNumber,
      1,
      range.endLineNumber,
      Infinity,
    );
  }
  getEditOperations(
    model: editor.ITextModel,
    builder: editor.IEditOperationBuilder,
  ) {
    const escapePrefix = escape(this.prefix);
    const reg1 = new RegExp(`^${escapePrefix}{${this.repetend}} +`);
    const reg2 =
      this.repetend > 1 &&
      new RegExp(`^${escapePrefix}{1,${this.repetend - 1}} +`);
    for (const x of splitToLines(this.range)) {
      const r = new Range(x.startLineNumber, 1, x.endLineNumber, Infinity);
      const text = model.getValueInRange(r);
      if (reg1.test(text)) {
        builder.addEditOperation(r, text.replace(reg1, ""));
      } else if (reg2 && reg2.test(text)) {
        builder.addEditOperation(r, this.prefix + text);
      } else {
        builder.addEditOperation(r, this.prefix + " " + text);
      }
    }
  }
}

class LinkCommand implements editor.ICommand {
  private readonly range: Selection;
  private readonly prefix: string;
  private readonly linkPrefix: string;
  private readonly title: string;

  constructor(
    range: Selection,
    prefix: string,
    linkPrefix: string,
    title: string,
  ) {
    this.range = range;
    this.prefix = prefix;
    this.linkPrefix = linkPrefix;
    this.title = title;
  }

  computeCursorState(_: unknown, helper: editor.ICursorStateComputerData) {
    const { range } = this;
    const ops = helper.getInverseEditOperations();
    if (range.startLineNumber !== range.endLineNumber || ops.length === 0) {
      return range;
    }
    let column = ops[0].range.endColumn - 1;
    const text = ops[0].text;
    if (/^http[s]?:\/\//.test(text)) {
      column = ops[0].range.startColumn + 1;
    }
    return new Selection(
      range.startLineNumber,
      column,
      range.startLineNumber,
      column,
    );
  }
  getEditOperations(
    model: editor.ITextModel,
    builder: editor.IEditOperationBuilder,
  ) {
    const { range, prefix, linkPrefix, title } = this;
    if (range.startLineNumber === range.endLineNumber) {
      const text = model.getValueInRange(range);
      if (/^http[s]?:\/\//.test(text)) {
        builder.addEditOperation(range, `${prefix}[${title}](${text})`);
      } else {
        builder.addEditOperation(
          range,
          `${prefix}[${title}${text}](${linkPrefix})`,
        );
      }
    }
  }
}

export class MarkdownToolBar {
  private wrapper: MonacoEditorLanguageClientWrapper;

  constructor(wrapper: MonacoEditorLanguageClientWrapper) {
    this.wrapper = wrapper;
  }
  toggleEmphasis(type: Emphasis) {
    const editor = this.wrapper.getEditor()!;
    const commands = editor
      .getSelections()!
      .map((s) => new EmphasisCommand(s, type));
    editor.focus();
    editor.executeCommands(null, commands);
  }
  togglePrefix(prefix: string, repetend: number = 1) {
    const editor = this.wrapper.getEditor()!;
    const commands = editor
      .getSelections()!
      .map((s) => new PrefixCommand(s, prefix, repetend));
    editor.focus();
    editor.executeCommands(null, commands);
  }
  addLink(prefix: string, linkPrefix: string, title: string = "") {
    const editor = this.wrapper.getEditor()!;
    const commands = editor
      .getSelections()!
      .map((s) => new LinkCommand(s, prefix, linkPrefix, title));
    editor.focus();
    editor.executeCommands(null, commands);
  }
  registerListMonitor(ordered: boolean = true) {
    const editor = this.wrapper.getEditor()!;
    const model = editor.getModel()!;
    const checkPreNo = (line: number) => {
      const edits: editor.IIdentifiedSingleEditOperation[] = [];
      let nextNo: number | null = null;
      let cur = 1;
      let clear = false;
      let hasNext = false;
      const reg1 = ordered ? /^(\d+)\. +/ : /^\* +/;
      const reg2 = ordered ? /^(\d+)\.[\s]+$/ : /^\*[\s]+$/;
      for (let i = 1; i <= line; i++) {
        const range = new Range(i, 1, i, Infinity);
        const text = model.getValueInRange(range);
        const match = text.match(reg1);
        if (!match) {
          let j = i - 1;
          for (; j >= 1; j--) {
            const r = new Range(j, 1, j, Infinity);
            const t = model.getValueInRange(r);
            if (!reg2.test(t)) {
              break;
            }
          }
          if (j > 0 && j + 1 !== i) {
            edits.push({
              range: new Range(j + 1, 1, i, Infinity),
              text: "",
            });
          }
          cur = 1;
          continue;
        }
        if (ordered) {
          const no = parseInt(match[1]);
          if (no !== cur) {
            edits.push({
              range: new Range(i, 1, i, match[1].length + 1),
              text: cur.toString(),
            });
          }
          cur += 1;
        }
        if (i === line) {
          nextNo = cur;
          hasNext = true;
          clear = reg2.test(text);
        }
      }
      return {
        edits: edits.filter((e) => !clear || e.range.startLineNumber !== line),
        nextNo,
        hasNext,
        clear,
      };
    };
    editor.onKeyDown((e) => {
      if (e.keyCode === KeyCode.Enter) {
        const range = editor.getSelection()!;
        if (
          range.startColumn === 1 ||
          range.startLineNumber !== range.endLineNumber ||
          range.startColumn !== range.endColumn
        ) {
          return;
        }
        const { edits, nextNo, hasNext, clear } = checkPreNo(
          range.startLineNumber,
        );
        if (hasNext) {
          e.preventDefault();
          if (clear) {
            edits.push({
              range: new Range(
                range.startLineNumber,
                1,
                range.startLineNumber,
                Infinity,
              ),
              text: "",
              forceMoveMarkers: true,
            });
          } else {
            edits.push({
              range,
              text: ordered ? `\n${nextNo}. ` : "\n* ",
              forceMoveMarkers: true,
            });
          }
        }
        if (edits.length > 0) {
          editor.pushUndoStop(); // 开始一个撤销操作
          editor.executeEdits("", edits);
          editor.pushUndoStop(); // 结束一个撤销操作
          editor.revealPositionInCenter(editor.getPosition()!); // 强制光标显示在编辑器中心
        }
      }
    });
  }
}

export const initWrapper = async (
  wrapper: MonacoEditorLanguageClientWrapper,
  config: WrapperConfig,
) => {
  if (!config.editorAppConfig) {
    config.editorAppConfig = {};
  }
  config.editorAppConfig.monacoWorkerFactory = configureMonacoWorkers;
  await wrapper.initAndStart(config);
};
