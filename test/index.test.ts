import { describe, it, expect } from 'vitest'
import MarkdownIt from 'markdown-it'
import markdownItMacau from '../src/index'

describe('markdown-it-macau', () => {
  it('should convert YAML code block to Vue component', () => {
    const md = new MarkdownIt()
    md.use(markdownItMacau)

    const input = `\`\`\`<MyComponent>
title: Hello World
count: 42
active: true
\`\`\``

    const result = md.render(input)
    expect(result).toContain('<MyComponent')
    expect(result).toContain('title="Hello World"')
    expect(result).toContain(':count="42"')
    expect(result).toContain(':active="true"')
  })

  it('should handle nested objects and arrays', () => {
    const md = new MarkdownIt()
    md.use(markdownItMacau)

    const input = `\`\`\`<ConfigPanel>
settings:
  theme: dark
  language: zh-CN
items:
  - item1
  - item2
\`\`\``

    const result = md.render(input)
    expect(result).toContain('<ConfigPanel')
    expect(result).toContain(':settings=')
    expect(result).toContain(':items=')
  })

  it('should handle invalid YAML gracefully', () => {
    const md = new MarkdownIt()
    md.use(markdownItMacau)

    const input = `\`\`\`<InvalidComponent>
invalid: yaml: content: [
\`\`\``

    const result = md.render(input)
    expect(result).toContain('Invalid YAML format')
  })

  it('should preserve regular code blocks', () => {
    const md = new MarkdownIt()
    md.use(markdownItMacau)

    const input = `\`\`\`javascript
console.log('Hello World')
\`\`\``

    const result = md.render(input)
    expect(result).toContain('<code class="language-javascript">')
  })

  it('should convert component names to PascalCase', () => {
    const md = new MarkdownIt()
    md.use(markdownItMacau)

    const input = `\`\`\`<my-component>
title: Test
\`\`\``

    const result = md.render(input)
    expect(result).toContain('<My-component')
  })
})
