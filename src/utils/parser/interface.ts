export interface InlineLink {
  type: "link";
  value: {
    label: string;
    href: string;
  };
}

export interface Whitespace {
  type: "newline" | "space";
  value: null;
}

export type InlineTextType =
  | "default"
  | "success"
  | "info"
  | "warning"
  | "error";

export interface InlineTextOptions {
  type: InlineTextType;
  strong: boolean;
  italic: boolean;
  underline: boolean;
  delete: boolean;
  code: boolean;
}

export interface InlineText {
  type: "text";
  value:
    | string
    | {
        content: string;
        options: InlineTextOptions;
      };
}

export interface InlineMath {
  type: "math";
  value: string;
}

export interface InlineHtml {
  type: "html";
  value: string;
}

export interface Image {
  type: "image";
  value: {
    src: string;
    alt: string;
  };
}

export type Inline =
  | Image
  | Whitespace
  | InlineLink
  | InlineText
  | InlineMath
  | InlineHtml;

export interface Section {
  type: "section";
  value: string;
}

export interface Heading {
  type: "heading";
  value: {
    level: number;
    children: Inline[];
  };
}

export interface Paragraph {
  type: "paragraph";
  value: {
    style: string;
    children: Inline[];
  };
}

export interface Blockquote {
  type: "blockquote";
  value: Block[];
}

export interface CodeValue {
  code: string;
  language: string;
}

export interface CodeBlock {
  type: "codeblock";
  value: CodeValue;
}

export interface MathBlock {
  type: "mathblock";
  value: string;
}

export interface HtmlBlock {
  type: "htmlblock";
  value: string;
}

export type TableAlign = "left" | "center" | "right";

export interface Table {
  type: "table";
  value: {
    header: Inline[][];
    align: TableAlign[];
    body: Inline[][][];
  };
}

export interface Sample {
  type: "sample";
  value: {
    index: number;
    hint: Inline[];
    input: string;
    output: string;
  };
}

export interface MixCodeItem extends CodeValue {
  label: string;
}

export interface MixCode {
  type: "mixcode";
  value: {
    group: string;
    items: MixCodeItem[];
  };
}

export type AlertType = "default" | "success" | "info" | "warning" | "error";

export interface Alert {
  type: "alert";
  value: {
    type: AlertType;
    title: string;
    content: string;
  };
}

export interface Hr {
  type: "hr";
  value: null;
}

export interface ListItem {
  task: boolean;
  checked: boolean;
  children: Block[];
}

export interface List {
  type: "list";
  value: {
    ordered: boolean;
    items: ListItem[];
  };
}

export type Block =
  | Image
  | Whitespace
  | Section
  | Heading
  | Paragraph
  | Blockquote
  | CodeBlock
  | MathBlock
  | HtmlBlock
  | Table
  | Sample
  | MixCode
  | Alert
  | Hr
  | List;
