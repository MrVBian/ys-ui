import type { ToolTipFormatterParams } from "@/types/echarts.ts";

export function tooltipItemsHtmlString(
  items: ToolTipFormatterParams[],
  reverse: boolean = false,
) {
  const res = items.map(
    (el) =>
      `<div class="content-panel"><p><span style="background-color: ${el.color}" class="tooltip-item-icon"></span><span class="tooltip-name">${el.seriesName}</span></p><span class="tooltip-value">${el.value}</span></div>`,
  );
  if (reverse) {
    return res.reverse().join("");
  }
  return res.join("");
}

export function tooltipFormatter(params: unknown) {
  const [firstElement] = params as ToolTipFormatterParams[];
  return `<div>
            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
            ${tooltipItemsHtmlString(params as ToolTipFormatterParams[])}
          </div>`;
}
