import { defineComponent, h, type PropType } from "vue";
import {
  NA,
  NAlert,
  NBlockquote,
  NDivider,
  NEquation,
  NFlex,
  NH1,
  NH2,
  NH3,
  NH4,
  NH5,
  NH6,
  NImage,
  NLi,
  NOl,
  NScrollbar,
  NTable,
  NTabPane,
  NTabs,
  NText,
  NUl,
} from "naive-ui";
import type {
  Inline,
  Block,
  Heading,
  Table,
  List,
  Sample,
  MixCode,
} from "@/utils/parser";
import MyCode from "./code";

function escape2Html(str: string) {
  const arrEntities = {
    lt: "<",
    gt: ">",
    nbsp: " ",
    amp: "&",
    quot: '"',
    "#39": "'",
  };
  return str.replace(
    /&(lt|gt|nbsp|amp|quot|#39);/gi,
    (_all, t) => arrEntities[t],
  );
}

export default defineComponent({
  name: "TokensRender",
  props: {
    blocks: {
      type: Array as PropType<Block[]>,
      default: () => [],
    },
  },
  setup(props) {
    function renderInline(inline: Inline, i: number, j: number) {
      switch (inline.type) {
        case "link":
          return (
            <NA key={`a-${i}-${j}`} href={inline.value.href} target="_blank">
              {inline.value.label}
            </NA>
          );
        case "newline":
          return <br key={`br-${i}-${j}`} />;
        case "space":
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return <>&nsbp;</>;
        case "image":
          return (
            <NImage lazy show-toolbar-tooltip width="100%" {...inline.value} />
          );
        case "text":
          if (typeof inline.value === "string") {
            return escape2Html(inline.value);
          } else {
            return (
              <NText key={`text-${i}-${j}`} {...inline.value.options}>
                {escape2Html(inline.value.content)}
              </NText>
            );
          }
        case "math":
          return <NEquation key={`math-${i}-${j}`} value={inline.value} />;
        case "html":
          return (
            <div
              style="display: inline-block"
              key={`html-${i}-${j}`}
              innerHTML={inline.value}
            />
          );
      }
    }
    function renderTable(table: Table, i: number) {
      return (
        <NScrollbar key={`table-${i}`} xScrollable={true}>
          <NTable singleLine={false} size="small">
            <thead>
              <tr>
                {table.value.header.map((header, i) => (
                  <th style={{ textAlign: table.value.align[i] }}>
                    {header.map((inline, j) => renderInline(inline, i, j))}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.value.body.map((row, i) => (
                <tr key={`tr-${i}`}>
                  {row.map((col, j) => (
                    <td style={{ textAlign: table.value.align[j] }}>
                      {col.map((cell, k) => renderInline(cell, j, k))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </NTable>
        </NScrollbar>
      );
    }
    function renderList(list: List, i: number) {
      const inner = list.value.items.map((item) => (
        <NLi>{renderBlocks(item.children)}</NLi>
      ));
      if (list.value.ordered) {
        return <NOl key={`list-${i}`}>{inner}</NOl>;
      } else {
        return <NUl key={`list-${i}`}>{inner}</NUl>;
      }
    }
    function renderHeading(block: Heading, i: number) {
      let comp = NH4;
      if (block.value.level === 1) {
        comp = NH1;
      } else if (block.value.level === 2) {
        comp = NH2;
      } else if (block.value.level === 3) {
        comp = NH3;
      } else if (block.value.level === 5) {
        comp = NH5;
      } else if (block.value.level === 6) {
        comp = NH6;
      }
      return h(
        comp,
        { style: "margin: 0", key: `heading-${i}` },
        {
          default: () =>
            block.value.children.map((inline, j) => renderInline(inline, i, j)),
        },
      );
    }
    function renderSample(sample: Sample, i: number, single: boolean = false) {
      return (
        <div
          key={`sample-${i}`}
          grid="~ cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5px"
        >
          <div flex="~ col">
            <NH4 class="shrink-0" style="margin: 0">
              样例输入{single ? "" : ` #${sample.value.index}`}
            </NH4>
            <MyCode
              class="flex-auto"
              code={sample.value.input}
              maxHeight="200px"
            />
          </div>
          <div flex="~ col">
            <NH4 class="shrink-0" style="margin: 0">
              样例输出{single ? "" : ` #${sample.value.index}`}
            </NH4>
            <MyCode
              class="flex-auto"
              code={sample.value.output}
              maxHeight="200px"
            />
          </div>
        </div>
      );
    }
    function renderMixCode(mixcode: MixCode, i: number) {
      if (mixcode.value.items.length === 0) return null;
      const group = mixcode.value.group;
      return (
        <NTabs
          key={`mixcode-${group}-${i}`}
          type="segment"
          size="small"
          defaultValue={`${group}-${mixcode.value.items[0].label}`}
        >
          {mixcode.value.items.map((item, index) => (
            <NTabPane
              key={`tab-pane-${index}`}
              name={`${group}-${item.label}`}
              tab={item.label}
            >
              <MyCode {...item} />
            </NTabPane>
          ))}
        </NTabs>
      );
    }
    function renderBlocks(blocks: Block[]) {
      const sampleSingle =
        blocks.filter((b) => b.type === "sample").length === 1;
      return blocks.map((block, i) => {
        switch (block.type) {
          case "section":
            return (
              <NH4 key={`section-${i}`} style="margin: 0">
                {block.value}
              </NH4>
            );
          case "heading":
            return renderHeading(block, i);
          case "mathblock":
            return (
              <NEquation
                key={`mathblock-${i}`}
                value={block.value}
                katexOptions={{ displayMode: true }}
              />
            );
          case "htmlblock":
            return <div key={`htmlblock-${i}`} innerHTML={block.value} />;
          case "paragraph":
            return (
              <div key={`paragraph-${i}`} style={block.value.style}>
                {block.value.children.map((inline, j) =>
                  renderInline(inline, i, j),
                )}
              </div>
            );
          case "blockquote":
            return (
              <NBlockquote key={`blockquote-${i}`} style="margin: 0">
                <NFlex vertical size="small">
                  {renderBlocks(block.value)}
                </NFlex>
              </NBlockquote>
            );
          case "codeblock":
            return <MyCode key={`codeblock-${i}`} {...block.value} />;
          case "table":
            return renderTable(block, i);
          case "alert":
            return (
              <NAlert
                key={`alert-${i}`}
                type={block.value.type}
                title={block.value.title}
              >
                {block.value.content}
              </NAlert>
            );
          case "hr":
            return <NDivider key={`hr-${i}`} style="margin: 5px 0" />;
          case "list":
            return renderList(block, i);
          case "mixcode":
            return renderMixCode(block, i);
          case "sample":
            return renderSample(block, i, sampleSingle);
        }
      });
    }
    return () => <NFlex vertical>{renderBlocks(props.blocks)}</NFlex>;
  },
});
