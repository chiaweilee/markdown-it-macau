# markdown-it-macau

> 一个将 YAML 代码块转换为 Vue 组件标签的 markdown-it 插件

[![npm version](https://img.shields.io/npm/v/markdown-it-macau.svg)](https://www.npmjs.com/package/markdown-it-macau)
[![License](https://img.shields.io/npm/l/markdown-it-macau.svg)](LICENSE)

## ✨ 特性

- 🚀 将 Markdown 代码块无缝转换为 Vue 组件
- 📝 使用 YAML 语法定义组件属性，简洁易读
- 🔧 支持所有数据类型（字符串、数字、布尔值、对象、数组）
- 🛡️ 完善的错误处理和友好的错误提示
- 📦 同时支持 CommonJS 和 ESM 模块
- 💪 完整的 TypeScript 类型支持
- 🔍 可选的调试模式

## 📦 安装

```bash
npm install markdown-it-macau
```

或者使用 yarn：

```bash
yarn add markdown-it-macau
```

或者使用 pnpm：

```bash
pnpm add markdown-it-macau
```

## 🚀 快速开始

### 基本用法

```javascript
import MarkdownIt from 'markdown-it'
import markdownItMacau from 'markdown-it-macau'

const md = new MarkdownIt()
md.use(markdownItMacau)

const result = md.render(`
\`\`\`<Button>
text: 点击我
type: primary
\`\`\`
`)

console.log(result)
// 输出: <Button text="点击我" type="primary" />
```

### 在 Vue 项目中使用

```vue
<template>
  <div v-html="renderedContent"></div>
</template>

<script setup>
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import markdownItMacau from 'markdown-it-macau'
import Button from './components/Button.vue'
import DataTable from './components/DataTable.vue'

const props = defineProps({
  content: String
})

const md = new MarkdownIt()
md.use(markdownItMacau)

const renderedContent = computed(() => {
  return md.render(props.content)
})
</script>
```

## 📖 使用示例

### 示例 1: 简单组件

**输入 Markdown:**

````markdown
```<Button>
text: 点击我
type: primary
disabled: false
```
````

**输出 HTML:**

```html
<Button text="点击我" type="primary" :disabled="false" />
```

### 示例 2: 复杂数据结构

**输入 Markdown:**

````markdown
```<DataTable>
columns:
  - name: 姓名
    key: name
  - name: 年龄
    key: age
data:
  - name: 张三
    age: 25
  - name: 李四
    age: 30
pageSize: 10
```
````

**输出 HTML:**

```html
<DataTable 
  :columns='[{"name":"姓名","key":"name"},{"name":"年龄","key":"age"}]' 
  :data='[{"name":"张三","age":25},{"name":"李四","age":30}]' 
  :pageSize="10" 
/>
```

### 示例 3: 混合内容

你可以在同一个文档中混合使用普通代码块和组件代码块：

````markdown
# 我的文档

这是一个普通的代码块：

```javascript
console.log('Hello World')
```

这是一个组件：

```<Alert>
type: warning
message: 注意！这是一个警告信息
```

继续普通文本...
````

## ⚙️ API

### 初始化插件

```typescript
md.use(markdownItMacau, options?)
```

### 选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| debug | boolean | false | 是否启用调试日志 |

### 使用调试模式

```javascript
md.use(markdownItMacau, { debug: true })
```

控制台输出：

```
[Macau] Processing component: MyComponent
[Macau] Generated tag: <MyComponent title="Hello" :count="42" />
```

## 📋 组件命名规则

- ✅ 组件名必须以字母开头
- ✅ 支持字母、数字和连字符（-）
- ✅ 会自动转换为首字母大写

**示例：**

| 输入 | 输出 |
|------|------|
| `<my-component>` | `<My-component>` |
| `<UserProfile>` | `<UserProfile>` |
| `<card-1>` | `<Card-1>` |
| `<Button>` | `<Button>` |

## 🔄 属性类型映射

插件会根据 YAML 值的类型自动选择合适的属性绑定方式：

| YAML 类型 | HTML 属性格式 | 示例 | 说明 |
|----------|--------------|------|------|
| 字符串 | `key="value"` | `title="Hello"` | 普通字符串属性 |
| 数字 | `:key="42"` | `:count="42"` | 使用 v-bind 绑定 |
| 布尔值 | `:key="true"` | `:active="true"` | 使用 v-bind 绑定 |
| null | `:key="null"` | `:value="null"` | 使用 v-bind 绑定 |
| 数组 | `:key="[...]"` | `:items="[1,2,3]"` | JSON 序列化后绑定 |
| 对象 | `:key="{...}"` | `:config="{...}"` | JSON 序列化后绑定 |

### 详细说明

**字符串属性：**
```yaml
```<Input>
placeholder: 请输入内容
```
```
输出：`<Input placeholder="请输入内容" />`

**数字属性：**
```yaml
```<Counter>
initialValue: 0
max: 100
```
```
输出：`<Counter :initialValue="0" :max="100" />`

**布尔属性：**
```yaml
```<Toggle>
enabled: true
disabled: false
```
```
输出：`<Toggle :enabled="true" :disabled="false" />`

**对象属性：**
```yaml
```<Chart>
config:
  width: 800
  height: 600
  theme: dark
```
```
输出：`<Chart :config='{"width":800,"height":600,"theme":"dark"}' />`

**数组属性：**
```yaml
```<List>
items:
  - Apple
  - Banana
  - Orange
```
```
输出：`<List :items='["Apple","Banana","Orange"]' />`

## ⚠️ 错误处理

当 YAML 格式无效时，插件会显示友好的错误提示：

**输入：**
````markdown
```<InvalidComponent>
invalid: yaml: content: [
```
````

**输出：**
```html
<div style="color: red; padding: 1rem; border: 1px solid red; border-radius: 4px;">
  Invalid YAML format: bad indentation of a mapping entry (1:14)
</div>
```

同时会在控制台输出详细错误信息：
```
[Macau] Failed to parse YAML for component InvalidComponent: bad indentation...
```

## 🎯 实际应用场景

### 1. 文档中的交互式组件

在技术文档中嵌入可交互的组件：

````markdown
# API 文档

## Button 组件

```<ApiDemo>
component: Button
props:
  type: primary
  size: large
code: |
  <Button type="primary" size="large">主要按钮</Button>
```
````

### 2. 配置面板

````markdown
# 系统配置

```<ConfigPanel>
title: 数据库配置
fields:
  - name: host
    type: input
    label: 主机地址
  - name: port
    type: number
    label: 端口号
  - name: ssl
    type: boolean
    label: 启用 SSL
```
````

### 3. 数据展示

````markdown
# 用户列表

```<UserTable>
data:
  - id: 1
    name: 张三
    email: zhangsan@example.com
  - id: 2
    name: 李四
    email: lisi@example.com
columns:
  - key: id
    label: ID
  - key: name
    label: 姓名
  - key: email
    label: 邮箱
```
````

## 🔧 开发

### 环境要求

- Node.js >= 16
- pnpm >= 8（推荐使用）

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

这会启动监听模式，文件变化时自动重新构建。

### 构建

```bash
pnpm build
```

构建产物会输出到 `dist/` 目录：
- `dist/index.js` - CommonJS 格式
- `dist/index.mjs` - ESM 格式
- `dist/index.d.ts` - TypeScript 类型定义
- `dist/index.d.mts` - ESM 类型定义

### 运行测试

```bash
pnpm test
```

### 代码检查

```bash
pnpm lint
```

## 📁 项目结构

```
markdown-it-macau/
├── src/
│   └── index.ts              # 源代码
├── dist/                     # 构建产物（发布时包含）
│   ├── index.js             # CommonJS
│   ├── index.mjs            # ESM
│   ├── index.d.ts           # 类型定义
│   └── index.d.mts          # ESM 类型定义
├── test/
│   └── index.test.ts        # 测试文件
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .gitignore
└── README.md
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

ISC License

## 🔗 相关链接

- [markdown-it](https://github.com/markdown-it/markdown-it) - Markdown 解析器
- [js-yaml](https://github.com/nodeca/js-yaml) - YAML 解析器
- [Vue.js](https://vuejs.org/) - Vue 框架

## 💡 提示

### 最佳实践

1. **组件注册**：确保在 Vue 应用中正确注册了所有使用的组件
2. **属性转义**：插件会自动转义特殊字符，无需手动处理
3. **复杂数据**：对于复杂的对象或数组，建议在组件内部进行解析和处理
4. **性能优化**：如果渲染大量组件，考虑使用虚拟滚动等技术

### 常见问题

**Q: 为什么组件没有渲染？**

A: 确保你已经在 Vue 应用中注册了对应的组件。插件只是生成 HTML 标签，实际的组件渲染由 Vue 负责。

**Q: 可以使用插槽吗？**

A: 当前版本只支持自闭合标签。如果需要支持插槽，可以在 YAML 中添加 `slot` 或 `content` 属性，然后在组件中处理。

**Q: 如何自定义错误样式？**

A: 你可以捕获错误并返回自定义的 HTML，或者通过 CSS 覆盖默认的错误提示样式。

## 📮 联系方式

如有问题或建议，欢迎提交 [Issue](https://github.com/yourusername/markdown-it-macau/issues)。

---

Made with ❤️ by Your Name
