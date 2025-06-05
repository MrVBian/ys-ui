<template>
  <n-layout has-sider>
    <!-- 编辑区 -->
    <n-layout-content>
      <!-- 工具栏 -->
      <div class="toolbar">
        <n-button-group>
          <n-tooltip trigger="hover" v-for="btn in toolbarItems" :key="btn.name">
            <template #trigger>
              <n-button :type="btn.type" @click="handleToolbarClick(btn.action)">
                {{ btn.label }}
              </n-button>
            </template>
            {{ btn.tooltip }}
          </n-tooltip>
        </n-button-group>
      </div>

      <n-input
        ref="editorRef"
        v-model:value="markdownText"
        type="textarea"
        placeholder="输入 Markdown..."
        :resizable="false"
        style="height: calc(100vh - 52px); padding: 20px; font-family: monospace;"
      />
    </n-layout-content>

    <!-- 预览区 -->
    <n-layout-sider
      content-style="padding: 20px; height: 100vh; overflow: auto;"
      :native-scrollbar="false"
    >
      <div v-html="compiledMarkdown" class="preview-content"></div>
    </n-layout-sider>
  </n-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  NLayout, 
  NLayoutContent, 
  NLayoutSider, 
  NInput, 
  NButton,
  NButtonGroup,
  NTooltip
} from 'naive-ui'

const editorRef = ref(null)
const markdownText = ref(`# 欢迎使用 Markdown 编辑器

## 基本语法
**加粗文字**、*斜体文字*、[链接](https://example.com)

## 列表
- 项目1
- 项目2
- 项目3

## 代码示例
\`\`\`javascript
function hello() {
  console.log('Hello World!')
}
\`\`\`
`)

// 工具栏配置
const toolbarItems = [
  { 
    label: 'H1', 
    action: 'h1', 
    tooltip: '一级标题',
    type: 'tertiary'
  },
  { 
    label: 'H2', 
    action: 'h2', 
    tooltip: '二级标题',
    type: 'tertiary'
  },
  { 
    label: 'B', 
    action: 'bold', 
    tooltip: '加粗',
    type: 'tertiary'
  },
  { 
    label: 'I', 
    action: 'italic', 
    tooltip: '斜体',
    type: 'tertiary'
  },
  { 
    label: '链接', 
    action: 'link', 
    tooltip: '插入链接',
    type: 'tertiary'
  },
  { 
    label: '代码', 
    action: 'code', 
    tooltip: '插入代码块',
    type: 'tertiary'
  },
  { 
    label: '列表', 
    action: 'list', 
    tooltip: '无序列表',
    type: 'tertiary'
  },
]

// 处理工具栏点击
const handleToolbarClick = (action) => {
  const textarea = editorRef.value?.textareaElRef
  if (!textarea) return

  const startPos = textarea.selectionStart
  const endPos = textarea.selectionEnd
  const selectedText = markdownText.value.substring(startPos, endPos)

  const insertMap = {
    h1: `# ${selectedText}`,
    h2: `## ${selectedText}`,
    bold: `**${selectedText}**`,
    italic: `*${selectedText}*`,
    link: `[${selectedText}](url)`,
    code: '```\n' + selectedText + '\n```',
    list: `\n- ${selectedText}`
  }

  const newText = insertMap[action]
  if (!newText) return

  // 更新内容
  markdownText.value = 
    markdownText.value.substring(0, startPos) +
    newText +
    markdownText.value.substring(endPos)

  // 设置光标位置
  const newCursorPos = {
    h1: startPos + 2,
    h2: startPos + 3,
    bold: startPos + 2,
    italic: startPos + 1,
    link: startPos + 1,
    code: startPos + 4,
    list: startPos + 3
  }[action] || startPos + newText.length

  // 更新后异步设置光标位置
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  }, 0)
}

// 保持原有 Markdown 解析逻辑...
</script>

<style>
.toolbar {
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f8f8;
}

.toolbar .n-button {
  margin-right: 8px;
}

/* 保持原有预览样式... */
</style>