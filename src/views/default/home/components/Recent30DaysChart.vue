<script setup lang="ts">
import { computed, ref } from "vue";
import { DataArea24Regular } from "@vicons/fluent";
import type { LineChartOption } from "@/components/chart/LineChart.vue";
import request from "@/utils/request.ts";
import { tooltipFormatter } from "@/utils/echarts.ts";

interface ChartData {
  x: string[];
  y1: number[];
  y2: number[];
}

const x = ref<string[]>([]);
const y1 = ref<number[]>([]);
const y2 = ref<number[]>([]);

const option = computed<LineChartOption>(() => ({
  textStyle: {
    fontSize: 14,
  },
  tooltip: {
    trigger: "axis",
    formatter: tooltipFormatter,
    className: "echarts-tooltip-diy",
  },
  legend: {
    data: ["提交数", "通过数"],
  },
  grid: {
    top: 30,
    right: 0,
    bottom: 10,
    left: 0,
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: x.value,
    axisLabel: {
      fontSize: 14,
    },
  },
  yAxis: {
    type: "value",
    axisLabel: {
      fontSize: 14,
    },
  },
  series: [
    {
      name: "提交数",
      type: "line",
      data: y1.value,
    },
    {
      name: "通过数",
      type: "line",
      data: y2.value,
    },
  ],
}));

const data = await request.get<ChartData>("/home/submissions");
x.value = data.x;
y1.value = data.y1;
y2.value = data.y2;
</script>

<template>
  <n-card segmented size="small">
    <template #header>
      <text-with-icon>
        <template #icon>
          <n-icon :size="22">
            <DataArea24Regular />
          </n-icon>
        </template>
        最近30天提交统计
      </text-with-icon>
    </template>
    <line-chart :option="option" w-full class="aspect-[5/2]" />
  </n-card>
</template>
