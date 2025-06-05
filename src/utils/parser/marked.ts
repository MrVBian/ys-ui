import { useWebWorkerFn } from "@vueuse/core";
import type {
  Block,
  Inline,
  InlineText,
  InlineTextOptions,
  List,
  MixCodeItem,
} from "./interface";
import {
  Tokens,
  type Token,
  type MarkedToken,
  type TokenizerAndRendererExtension,
} from "marked";

export type MarkedInline =
  | Tokens.Strong
  | Tokens.Em
  | Tokens.Del
  | Tokens.Text
  | Tokens.Escape;
export type MarkedBlock =
  | Tokens.Heading
  | Tokens.TableCell
  | Tokens.Blockquote
  | Tokens.Paragraph;

export interface Marked {
  name: "marked";
  version: string;
  blocks: Block[];
}

export default useWebWorkerFn(
  (src: string) => {
    const marked = globalThis.marked;
    const mathInline = {
      name: "math",
      level: "inline",
      start(src: string) {
        const idx = src.indexOf("$");
        if (idx > 0) {
          if (src[idx - 1] === "\\") {
            return -1;
          }
        }
        return idx;
      },
      tokenizer(src: string) {
        const match = src.match(/^\$([^$\n]+?)\$/);
        if (match) {
          return {
            type: "math",
            raw: match[0],
            text: match[1].trim(),
          };
        }
      },
    };
    const mathBlock = {
      name: "mathblock",
      level: "block",
      start(src: string) {
        return src.indexOf("$$");
      },
      tokenizer(src: string) {
        const match = src.match(/^\${2}\s*\n([^$]+?)\n\${2}/);
        if (match) {
          return {
            type: "mathblock",
            raw: match[0],
            text: match[1].trim(),
          };
        }
      },
    };
    marked.use({
      extensions: [mathInline, mathBlock] as TokenizerAndRendererExtension[],
    });
    function parseInlineText(
      inline: MarkedInline,
      opts: InlineTextOptions,
    ): InlineText[] {
      if (inline.type === "escape") {
        return [
          {
            type: "text",
            value: inline.text,
          },
        ];
      }
      if (!inline.tokens) {
        if (
          opts.strong ||
          opts.italic ||
          opts.underline ||
          opts.delete ||
          opts.code
        ) {
          return [
            {
              type: "text",
              value: {
                content: inline.text,
                options: opts,
              },
            },
          ];
        } else {
          return [
            {
              type: "text",
              value: inline.text,
            },
          ];
        }
      }
      const inlines: InlineText[] = [];
      for (let i = 0; i < inline.tokens.length; ++i) {
        const token = inline.tokens[i] as MarkedToken;
        if (token.type === "text") {
          if ("tokens" in token && token.tokens && token.tokens.length) {
            inlines.push(...parseInlineText(token, opts));
          } else {
            if (
              opts.strong ||
              opts.italic ||
              opts.underline ||
              opts.delete ||
              opts.code
            ) {
              inlines.push({
                type: "text",
                value: {
                  content: token.text,
                  options: opts,
                },
              });
            } else {
              inlines.push({
                type: "text",
                value: token.text,
              });
            }
          }
        } else if (token.type === "codespan") {
          inlines.push({
            type: "text",
            value: {
              content: token.text,
              options: { ...opts, code: true },
            },
          });
        } else if (token.type === "strong") {
          inlines.push(...parseInlineText(token, { ...opts, strong: true }));
        } else if (token.type === "em") {
          inlines.push(...parseInlineText(token, { ...opts, italic: true }));
        } else if (token.type === "del") {
          inlines.push(...parseInlineText(token, { ...opts, delete: true }));
        }
      }
      return inlines;
    }
    function parseInlineTokens(block: MarkedBlock): Inline[] {
      let inlineHtml = "";
      const inlines: Inline[] = [];
      const closeInlineHtml = (text?: string) => {
        if (inlineHtml) {
          inlines.push({
            type: "html",
            value: inlineHtml,
          });
          inlineHtml = "";
        } else if (text) {
          inlineHtml = text;
        }
      };
      for (let i = 0; i < block.tokens.length; ++i) {
        const token = block.tokens[i];
        if (token.type === "br") {
          // 提前结束行内html
          closeInlineHtml();
          inlines.push({
            type: "newline",
            value: null,
          });
          continue;
        }
        if (!("text" in token)) continue;
        if (inlineHtml) {
          inlineHtml += token.text;
          if (token.type !== "html") {
            continue;
          }
        }
        switch (token.type) {
          case "html":
            closeInlineHtml(token.text);
            break;
          case "image":
            inlines.push({
              type: "image",
              value: {
                src: token.href,
                alt: token.text,
              },
            });
            break;
          case "link":
            inlines.push({
              type: "link",
              value: {
                label: token.text,
                href: token.href,
              },
            });
            break;
          case "codespan":
            inlines.push({
              type: "text",
              value: {
                content: token.text,
                options: {
                  type: "default",
                  strong: false,
                  italic: false,
                  underline: false,
                  delete: false,
                  code: true,
                },
              },
            });
            break;
          case "strong":
          case "em":
          case "del":
          case "text":
          case "escape":
            inlines.push(
              ...parseInlineText(token as MarkedInline, {
                type: "default",
                code: false,
                delete: token.type === "del",
                italic: token.type === "em",
                strong: token.type === "strong",
                underline: false,
              }),
            );
            break;
          case "math":
            inlines.push({
              type: "math",
              value: token.text,
            });
        }
      }
      if (inlineHtml) {
        inlines.push({
          type: "html",
          value: inlineHtml,
        });
      }
      return inlines;
    }
    function parseListToken(block: Tokens.List): List {
      return {
        type: "list",
        value: {
          ordered: block.ordered,
          items: block.items.map((item) => ({
            task: item.task,
            checked: !!item.checked,
            children: parseBlockTokens(item.tokens!),
          })),
        },
      };
    }
    function parseBlockToken(block: Token): Block | undefined {
      switch (block.type) {
        case "code":
          return {
            type: "codeblock",
            value: {
              code: block.text,
              language: block.lang || "plaintext",
            },
          };
        case "heading":
          return {
            type: "heading",
            value: {
              level: block.depth,
              children: parseInlineTokens(block as Tokens.Heading),
            },
          };
        case "blockquote":
          return {
            type: "blockquote",
            value: parseBlockTokens(block.tokens!),
          };
        case "html":
          return {
            type: "htmlblock",
            value: block.text,
          };
        case "table":
          return {
            type: "table",
            value: {
              header: block.header.map((header) => parseInlineTokens(header)),
              align: block.align.map((align) =>
                align === null ? "left" : align,
              ),
              body: block.rows.map((row) =>
                row.map((cell) => parseInlineTokens(cell)),
              ),
            },
          };
        case "paragraph":
          return {
            type: "paragraph",
            value: {
              style: "",
              children: parseInlineTokens(block as Tokens.Paragraph),
            },
          };
        case "sample":
          return {
            type: "sample",
            value: {
              index: block.index,
              input: block.input,
              output: block.output,
              hint: [],
            },
          };
        case "mathblock":
          return {
            type: "mathblock",
            value: block.text,
          };
        case "hr":
          return {
            type: "hr",
            value: null,
          };
        case "text":
          return {
            type: "paragraph",
            value: {
              style: "",
              children: parseInlineText(block as Tokens.Text, {
                type: "default",
                code: false,
                delete: false,
                italic: false,
                strong: false,
                underline: false,
              }),
            },
          };
        case "list":
          return parseListToken(block as Tokens.List);
      }
      // console.warn(`Unsupported block type: ${block.type}`);
    }
    function parseSamples(tokens: Token[]): Token[] {
      const _tokens: Token[] = [];
      for (let i = 0; i < tokens.length; ++i) {
        _tokens.push(tokens[i]);
        const len = _tokens.length;
        if (len >= 2) {
          const token1 = _tokens[len - 2];
          const token2 = _tokens[len - 1];
          if (
            token1.type === "code" &&
            token1.lang === "in" &&
            token2.type === "code" &&
            token2.lang === "out"
          ) {
            _tokens.splice(len - 2, 2);
            const cnt = _tokens.filter((t) => t.type === "sample").length;
            _tokens.push({
              type: "sample",
              raw: "",
              index: cnt + 1,
              input: token1.text,
              output: token2.text,
            });
          }
        }
      }
      return _tokens;
    }
    function parseMixCodes(blocks: Block[]): Block[] {
      const _blocks: Block[] = [];
      let items: MixCodeItem[] = [];
      let group = "";
      const addMixCode = () => {
        if (items.length) {
          _blocks.push({
            type: "mixcode",
            value: {
              group,
              items: [...items],
            },
          });
          items = [];
          group = "";
        }
      };
      for (let i = 0; i < blocks.length; ++i) {
        const block = blocks[i];
        if (block.type === "codeblock") {
          const match = block.value.language.match(
            /^([^\s]+) \[([^-]+)-(.*)]$/,
          );
          if (match) {
            if (match[2] !== group) {
              addMixCode();
              group = match[2];
            }
            items.push({
              label: match[3],
              code: block.value.code,
              language: match[1],
            });
            continue;
          }
        }
        addMixCode();
        _blocks.push(block);
      }
      return _blocks;
    }
    function parseBlockTokens(tokens: Token[]): Block[] {
      const blocks: Block[] = [];
      const _tokens = parseSamples(tokens);
      for (const token of _tokens) {
        const block = parseBlockToken(token);
        if (block) blocks.push(block);
      }
      return parseMixCodes(blocks);
    }
    src = src.replace(/\r\n|\r/g, "\n").trim();
    return {
      name: "marked",
      version: "v1.0.5",
      blocks: parseBlockTokens(marked.lexer(src)),
    };
  },
  {
    timeout: 5000,
    dependencies: [
      "https://cdnjs.cloudflare.com/ajax/libs/marked/14.1.3/marked.min.js",
    ],
  },
);
