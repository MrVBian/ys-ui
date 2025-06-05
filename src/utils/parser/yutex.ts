import {
  Inline,
  Block,
  InlineText,
  InlineTextOptions,
  CodeBlock,
  TableAlign,
  Table,
  MixCode,
  MixCodeItem,
  AlertType,
} from "./interface";

export interface Yutex {
  name: "yutex";
  version: string;
  blocks: Block[];
}

function createTextNode(text: string, props: string[]): InlineText {
  let withOptions = false;
  const options: InlineTextOptions = {
    type: "default",
    strong: false,
    italic: false,
    underline: false,
    delete: false,
    code: false,
  };
  for (const prop of props) {
    switch (prop) {
      case "default":
      case "success":
      case "info":
      case "warning":
      case "error":
        options.type = prop;
        withOptions = true;
        break;
      case "s":
      case "strong":
        options.strong = true;
        withOptions = true;
        break;
      case "i":
      case "italic":
        options.italic = true;
        withOptions = true;
        break;
      case "u":
      case "underline":
        options.underline = true;
        withOptions = true;
        break;
      case "d":
      case "delete":
        options.delete = true;
        withOptions = true;
        break;
      case "c":
      case "code":
        options.code = true;
        withOptions = true;
        break;
    }
  }
  if (withOptions) {
    return {
      type: "text",
      value: {
        content: text,
        options,
      },
    };
  }
  return { type: "text", value: text };
}

function processInline(text: string): Inline[] {
  const result: Inline[] = [];
  while (text.length > 0) {
    const match = text.match(
      /\\(link|text|newline|space|math|html)(?:\{([^{}]*)}\{([^{}]*)}|\{([^{}]*)}|\[([^[\]]*)])?/,
    );
    if (match) {
      if (match.index !== 0) {
        const value = text.slice(0, match.index);
        result.push({ type: "text", value });
        text = text.slice(match.index);
      }
      const type = match[1];
      switch (type) {
        case "link":
          if (match[2]) {
            let label = match[3];
            if (!label) label = match[2];
            result.push({
              type: "link",
              value: {
                label,
                href: match[2],
              },
            });
          }
          break;
        case "newline":
        case "space":
          result.push({ type, value: null });
          break;
        case "text":
          if (match[2])
            result.push(createTextNode(match[2], match[3].split("|")));
          break;
        case "math":
          if (match[2]) result.push({ type: "math", value: match[2] });
          else if (match[4]) result.push({ type: "math", value: match[4] });
          else if (match[5]) result.push({ type: "math", value: match[5] });
          break;
        case "html":
          if (match[2]) result.push({ type: "html", value: match[2] });
          else if (match[4]) result.push({ type: "html", value: match[4] });
          else if (match[5]) result.push({ type: "html", value: match[5] });
          break;
      }
      text = text.slice(match[0].length);
    } else {
      result.push({ type: "text", value: text });
      break;
    }
  }
  return result;
}

function processSection(node: Yutex, text: string): [string, boolean] {
  const match = text.match(/^\\section\{([^{}]*)}.*/);
  if (match && match[1].trim()) {
    node.blocks.push({
      type: "section",
      value: match[1].trim(),
    });
    return [text.slice(match[0].length), true];
  }
  return [text, false];
}

function processParagraph(node: Yutex, text: string): [string, boolean] {
  const match = text.match(
    /^\\begin\{paragraph}\{([^{}]*)}.*([\s\S]*?)\n\\end\{paragraph}.*/,
  );
  if (match && match[2].trim()) {
    node.blocks.push({
      type: "paragraph",
      value: {
        style: match[1].trim(),
        children: processInline(match[2].trim()),
      },
    });
    return [text.slice(match[0].length), true];
  }
  return [text, false];
}

function processBlockquote(node: Yutex, text: string): [string, boolean] {
  const match = text.match(
    /^\\begin\{blockquote}.*([\s\S]*?)\n\\end\{blockquote}.*/,
  );
  if (match && match[1].trim()) {
    node.blocks.push({
      type: "blockquote",
      value: processBlock(match[1].trim()),
    });
    return [text.slice(match[0].length), true];
  }
  return [text, false];
}

function createCodeBlockNode(text: string): [string, CodeBlock | undefined] {
  const match = text.match(
    /^\\begin\{code}\{([^{}]*)}.*([\s\S]*?)\n\\end\{code}\s*/,
  );
  if (match && match[2].trim()) {
    let language = match[1].trim();
    if (!language) language = "text";
    return [
      text.slice(match[0].length),
      {
        type: "codeblock",
        value: {
          code: match[2].trim(),
          language,
        },
      },
    ];
  }
  return [text, undefined];
}

function processCodeBlock(node: Yutex, text: string): [string, boolean] {
  const [nextText, codeBlock] = createCodeBlockNode(text);
  if (codeBlock) {
    node.blocks.push(codeBlock);
    return [nextText, true];
  }
  return [text, false];
}

function processMathBlock(node: Yutex, text: string): [string, boolean] {
  const match = text.match(/^\\begin\{math}.*([\s\S]*?)\n\\end\{math}.*/);
  if (match && match[1].trim()) {
    node.blocks.push({
      type: "mathblock",
      value: match[1].trim(),
    });
    return [text.slice(match[0].length), true];
  }
  return [text, false];
}

function processHtmlBlock(node: Yutex, text: string): [string, boolean] {
  const match = text.match(/^\\begin\{html}.*([\s\S]*?)\n\\end\{html}\s*/);
  if (match && match[1].trim()) {
    node.blocks.push({
      type: "htmlblock",
      value: match[1].trim(),
    });
    return [text.slice(match[0].length), true];
  }
  return [text, false];
}

function createTableRow(row: string): Inline[][] {
  row = row.replace(/^\|/, "").replace(/\|$/, "");
  const cells = row.split(" | ");
  const result: Inline[][] = [];
  for (const cell of cells) {
    result.push(processInline(cell.trim()));
  }
  return result;
}

function parseTableAlign(row: string): TableAlign[] {
  row = row.replace(/^\|/, "").replace(/\|$/, "");
  const cells = row.split(" | ");
  const result: TableAlign[] = [];
  for (let cell of cells) {
    cell = cell.trim();
    if (cell.startsWith(":") && cell.endsWith(":")) result.push("center");
    else if (cell.startsWith(":")) result.push("left");
    else if (cell.endsWith(":")) result.push("right");
    else result.push("left");
  }
  return result;
}

function createTableNode(text: string): Table | undefined {
  const rows = text.split("\n");
  if (rows.length < 3) return;
  const header = createTableRow(rows[0]);
  const column = header.length;
  let align = parseTableAlign(rows[1]);
  if (align.length > column) align = align.slice(0, column);
  else if (align.length < column) {
    for (let i = align.length; i < column; i++) align.push("left");
  }
  const body: Inline[][][] = [];
  for (let i = 2; i < rows.length; i++) {
    let item = createTableRow(rows[i]);
    if (item.length > column) item = item.slice(0, column);
    else if (item.length < column) {
      for (let i = item.length; i < column; i++) item.push([]);
    }
    body.push(item);
  }
  return { type: "table", value: { header, align, body } };
}

function processTable(node: Yutex, text: string): [string, boolean] {
  const match = text.match(/^\\begin\{table}.*([\s\S]*?)\n\\end\{table}.*/);
  if (match && match[1].trim()) {
    const tableNode = createTableNode(match[1].trim());
    if (tableNode) node.blocks.push(tableNode);
    return [text.slice(match[0].length), true];
  }
  return [text, false];
}

function processSample(node: Yutex, text: string): [string, boolean] {
  const match = text.match(
    /^\\begin\{sample}\{([1-9]\d*)}.*([\s\S]*?)\n\\sample\{input}.*([\s\S]*?)\n\\sample\{output}.*([\s\S]*?)\n\\end\{sample}.*/,
  );
  if (match && (match[2].trim() || match[3].trim() || match[4].trim())) {
    const index = parseInt(match[1]);
    const hint = processInline(match[2].trim());
    const input = match[3].trim();
    const output = match[4].trim();
    node.blocks.push({ type: "sample", value: { index, hint, input, output } });
    return [text.slice(match[0].length), true];
  }
  return [text, false];
}

function createMixCodeNode(text: string): MixCode {
  const result: MixCodeItem[] = [];
  while (text.length > 0) {
    const [nextText, codeBlock] = createCodeBlockNode(text);
    if (codeBlock) {
      result.push({
        ...codeBlock.value,
        label: "",
      });
      text = nextText;
      continue;
    }
    text = processUnknown(text);
  }
  return {
    type: "mixcode",
    value: {
      group: "",
      items: result,
    },
  };
}

function processMixCode(node: Yutex, text: string): [string, boolean] {
  const match = text.match(/^\\begin\{mixcode}.*([\s\S]*?)\n\\end\{mixcode}.*/);
  if (match && match[1].trim()) {
    const mixCodeNode = createMixCodeNode(match[1].trim());
    if (mixCodeNode) node.blocks.push(mixCodeNode);
    return [text.slice(match[0].length), true];
  }
  return [text, false];
}

function processAlert(node: Yutex, text: string): [string, boolean] {
  const match = text.match(
    /^\\begin\{alert}\{([^{}]*)}\{([^{}]+)}.*([\s\S]*?)\n\\end\{alert}.*/,
  );
  if (match && match[2].trim() && match[3].trim()) {
    let typ: AlertType;
    switch (match[1].trim()) {
      case "d":
      case "default":
        typ = "default";
        break;
      case "i":
      case "info":
        typ = "info";
        break;
      case "s":
      case "success":
        typ = "success";
        break;
      case "w":
      case "warning":
        typ = "warning";
        break;
      case "e":
      case "error":
        typ = "error";
        break;
      default:
        typ = "default";
        break;
    }
    node.blocks.push({
      type: "alert",
      value: {
        type: typ,
        title: match[2].trim(),
        content: match[3].trim(),
      },
    });
    return [text.slice(match[0].length), true];
  }
  return [text, false];
}

function processUnknown(text: string): string {
  return text.replace(/^.*/, "").trim();
}

function processBlock(text: string): Block[] {
  text = text.replace(/\r\n|\r/g, "\n");
  const isMatched = ([_text, _ok]: [string, boolean]) => {
    text = _text;
    return _ok;
  };
  const node: Yutex = {
    name: "yutex",
    version: "v1.0.3",
    blocks: [],
  };
  while (text.length > 0) {
    text = text.trim();
    if (isMatched(processSection(node, text))) continue;
    if (isMatched(processParagraph(node, text))) continue;
    if (isMatched(processBlockquote(node, text))) continue;
    if (isMatched(processCodeBlock(node, text))) continue;
    if (isMatched(processMathBlock(node, text))) continue;
    if (isMatched(processHtmlBlock(node, text))) continue;
    if (isMatched(processTable(node, text))) continue;
    if (isMatched(processSample(node, text))) continue;
    if (isMatched(processMixCode(node, text))) continue;
    if (isMatched(processAlert(node, text))) continue;
    text = processUnknown(text);
  }
  return node.blocks;
}

export default function (text: string): Yutex {
  return {
    name: "yutex",
    version: "v1.0.3",
    blocks: processBlock(text),
  };
}
