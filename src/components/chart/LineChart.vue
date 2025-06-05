<script setup lang="ts">
import { ref, nextTick, computed } from "vue";
import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import VCharts from "vue-echarts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { ComposeOption } from "echarts/core";
import type { LineSeriesOption } from "echarts/charts";
import type {
  TitleComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
  GridComponentOption,
} from "echarts/components";

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
]);

export type LineChartOption = ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | GridComponentOption
  | LineSeriesOption
>;

const props = withDefaults(
  defineProps<{
    option: LineChartOption;
    autoResize?: boolean;
  }>(),
  {
    autoResize: true,
  },
);

const renderChart = ref(false);
const _option = computed(() => ({
  ...props.option,
  backgroundColor: "rgba(0, 0, 0, 0)",
}));

nextTick(() => {
  renderChart.value = true;
});
</script>

<template>
  <v-charts v-if="renderChart" :autoresize="autoResize" :option="_option" />
</template>
