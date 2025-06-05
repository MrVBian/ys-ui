<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { until } from "@vueuse/core";
import { isDark } from "@/composables/theme";
import { useThemeVars } from "naive-ui";
import { initWrapper, MarkdownToolBar, Emphasis } from "./monaco";
import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import { updateUserConfiguration } from "@codingame/monaco-vscode-configuration-service-override";
import "@codingame/monaco-vscode-markdown-basics-default-extension";
import "@codingame/monaco-vscode-markdown-math-default-extension";
import "@codingame/monaco-vscode-cpp-default-extension";
import {
  Heading,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Blockquote,
  Link,
  List,
  ListNumbers,
  ListCheck,
  Photo,
  Table,
  Video,
  Music,
  At,
} from "@vicons/tabler";
import { renderIcon } from "@/utils/render";
import TokensRender from "../TokensRender";
import { type Block, marked } from "@/utils/parser";

export interface MarkdownEditorProps {
  name: string;
  raw: string;
  version: string;
  blocks: Block[];
}

const editorRef = ref<HTMLDivElement>();
const userConfigJson = computed(() =>
  JSON.stringify({
    "workbench.colorCustomizations": {
      "[Visual Studio Dark]": {
        "editor.background": "#fff0",
      },
      "[Default Dark Modern]": {
        "editor.background": "#fff0",
      },
      "[Default Dark+]": {
        "editor.background": "#fff0",
      },
    },
    "workbench.colorTheme": isDark.value
      ? "Default Dark Modern"
      : "Default Light Modern",
    "editor.experimental.asyncTokenization": false,
  }),
);

const wrapper = new MonacoEditorLanguageClientWrapper();
const toolBarHelper = new MarkdownToolBar(wrapper);

const props = defineProps<{
  value: MarkdownEditorProps;
  height: string;
  mode?: "edit" | "preview";
}>();
const emits = defineEmits(["update:value"]);

const themeVars = useThemeVars();
const innerMode = ref<"edit" | "preview">(props.mode ?? "preview");

function lexer(text: string) {
  if (marked.workerStatus.value === "RUNNING") {
    marked.workerTerminate("PENDING");
  }
  marked
    .workerFn(text)
    .then((res) => {
      emits("update:value", { ...props.value, ...res, raw: text });
    })
    .catch(() => {
      emits("update:value", { ...props.value, raw: text });
    });
}
lexer(props.value.raw);

until(editorRef)
  .not.toBeUndefined()
  .then(async () => {
    await initWrapper(wrapper, {
      $type: "extended",
      htmlContainer: editorRef.value,
      vscodeApiConfig: {
        serviceOverrides: {
          ...getThemeServiceOverride(),
        },
        userConfiguration: {
          json: userConfigJson.value,
        },
      },
      editorAppConfig: {
        codeResources: {
          modified: {
            text: props.value.raw,
            uri: "/workspace/a.md",
          },
        },
        useDiffEditor: false,
        editorOptions: {
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordBasedSuggestions: "off",
          glyphMargin: false,
          insertSpaces: true,
          detectIndentation: false,
          acceptSuggestionOnCommitCharacter: false,
          quickSuggestionsDelay: 200,
          lineNumbers: "off",
          minimap: {
            enabled: false,
          },
          folding: false,
          lineDecorationsWidth: 0,
          overviewRulerBorder: false,
          formatOnPaste: true,
        },
      },
    });
    const textModels = wrapper.getTextModels();
    textModels?.modified?.onDidChangeContent(() => {
      lexer(textModels?.modified?.getValue() ?? "");
    });
    watch(
      () => props.value.raw,
      (value) => {
        if (wrapper && value !== textModels?.modified?.getValue()) {
          wrapper.updateCodeResources({
            modified: {
              text: value,
              uri: "/workspace/a.md",
            },
          });
        }
      },
    );
    watch(userConfigJson, () => {
      updateUserConfiguration(userConfigJson.value);
    });
    toolBarHelper.registerListMonitor(true); // ordered list
    toolBarHelper.registerListMonitor(false); // unordered list
  });
</script>

<template>
  <n-tabs v-model:value="innerMode" type="card" size="small">
    <n-tab-pane
      display-directive="show"
      name="edit"
      tab="编辑"
      class="important-p-0"
    >
      <div
        ref="editorRef"
        class="rounded-b-3px"
        :style="{
          height,
          border: `solid 1px ${themeVars.dividerColor}`,
          borderTop: 'none',
          overflow: 'hidden',
        }"
      />
    </n-tab-pane>
    <n-tab-pane
      display-directive="show"
      name="preview"
      tab="预览"
      class="important-p-0"
    >
      <n-scrollbar
        content-style="overflow: hidden; padding: 5px"
        class="rounded-b-3px"
        :style="{
          maxHeight: height,
          border: `solid 1px ${themeVars.dividerColor}`,
          borderTop: 'none',
        }"
      >
        <TokensRender :blocks="value.blocks" />
      </n-scrollbar>
    </n-tab-pane>
    <template #suffix>
      <div
        v-if="innerMode === 'edit'"
        class="h-28px gap-8px"
        flex="~ items-center shrink-0"
      >
        <n-button
          :render-icon="renderIcon(Heading, { size: 22 })"
          text
          title="标题"
          @click="toolBarHelper.togglePrefix('#', 6)"
        />
        <n-button
          :render-icon="renderIcon(Bold, { size: 22 })"
          text
          title="粗体"
          @click="toolBarHelper.toggleEmphasis(Emphasis.Bold)"
        />
        <n-button
          :render-icon="renderIcon(Italic, { size: 22 })"
          text
          title="斜体"
          @click="toolBarHelper.toggleEmphasis(Emphasis.Italic)"
        />
        <n-button
          :render-icon="renderIcon(Strikethrough, { size: 22 })"
          text
          title="删除线"
          @click="toolBarHelper.toggleEmphasis(Emphasis.StrikeThrough)"
        />
        <n-button
          :render-icon="renderIcon(Code, { size: 22 })"
          text
          title="行内代码"
          @click="toolBarHelper.toggleEmphasis(Emphasis.Code)"
        />
        <n-button
          :render-icon="renderIcon(Blockquote, { size: 22 })"
          text
          title="引用"
          @click="toolBarHelper.togglePrefix('>')"
        />
        <n-button
          :render-icon="renderIcon(Link, { size: 22 })"
          text
          title="链接"
          @click="toolBarHelper.addLink('', 'https://')"
        />
        <n-divider vertical />
        <n-button
          :render-icon="renderIcon(List, { size: 22 })"
          text
          title="无序列表"
          @click="toolBarHelper.togglePrefix('*')"
        />
        <n-button
          :render-icon="renderIcon(ListNumbers, { size: 22 })"
          text
          title="有序列表"
          @click="toolBarHelper.togglePrefix('1.')"
        />
        <n-button
          :render-icon="renderIcon(ListCheck, { size: 22 })"
          text
          title="任务列表"
          @click="toolBarHelper.togglePrefix('1.')"
        />
        <n-divider vertical />
        <n-button
          :render-icon="renderIcon(Table, { size: 22 })"
          text
          title="表格"
          @click="toolBarHelper.togglePrefix('1.')"
        />
        <n-button
          :render-icon="renderIcon(Photo, { size: 22 })"
          text
          title="图片"
          @click="toolBarHelper.togglePrefix('1.')"
        />
        <n-button
          :render-icon="renderIcon(Video, { size: 22 })"
          text
          title="视频"
          @click="toolBarHelper.togglePrefix('1.')"
        />
        <n-button
          :render-icon="renderIcon(Music, { size: 22 })"
          text
          title="音频"
          @click="toolBarHelper.togglePrefix('1.')"
        />
        <n-divider vertical />
        <n-button
          :render-icon="renderIcon(At, { size: 22 })"
          text
          title="@"
          @click="toolBarHelper.togglePrefix('@')"
        />
      </div>
    </template>
  </n-tabs>
</template>
