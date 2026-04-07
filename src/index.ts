import type MarkdownIt from 'markdown-it'
import { load } from 'js-yaml'

/**
 * markdown-it-macau 插件选项接口
 */
export interface MacauOptions {
  /**
   * 是否启用调试日志
   * @default false
   */
  debug?: boolean
}

/**
 * markdown-it-macau 插件
 * 
 * 将 ```<ComponentName> YAML内容 格式的代码块转换为 Vue 组件标签
 * 
 * @example
 * ```html
 * ```<MyComponent>
 * title: Hello World
 * count: 42
 * ```
 * 
 * 将被转换为:
 * <MyComponent title="Hello World" :count="42" />
 * ```
 * 
 * @param md - markdown-it 实例
 * @param options - 插件配置选项
 */
export default function markdownItMacau(md: MarkdownIt, options: MacauOptions = {}) {
  const { debug = false } = options
  
  // 保存原始的 fence 渲染器
  const originalFence = md.renderer.rules.fence || function (tokens: any[], idx: number, options: any, env: any, self: any) {
    return self.renderToken(tokens, idx, options);
  }
  
  // 自定义 fence 规则来处理 ```<componentName> 代码块
  md.renderer.rules.fence = function (tokens: any[], idx: number, options: any, env: any, self: any) {
    const token = tokens[idx]
    const info = token.info ? token.info.trim() : ''
    const content = token.content.trim()
    
    // 检查是否是以 <componentName> 开头的代码块（支持大小写和连字符）
    const componentMatch = info.match(/^<([a-zA-Z][a-zA-Z0-9-]*)>/)
    
    if (componentMatch) {
      const componentName = componentMatch[1]
      // 转换为大写字母开头的组件名（Vue 组件命名规范）
      const pascalCaseName = componentName.charAt(0).toUpperCase() + componentName.slice(1)
      
      if (debug) {
        console.log(`[Macau] Processing component: ${pascalCaseName}`)
      }
      
      try {
        // 使用官方的 js-yaml 解析 YAML 内容
        const parsed = load(content)
        
        // 确保解析结果是对象
        const attrs = (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) 
          ? parsed as Record<string, any> 
          : {}
        
        // 构建 Vue 组件标签属性
        const attrString = Object.entries(attrs)
          .map(([key, value]) => {
            // 根据值类型决定是否需要引号
            if (typeof value === 'boolean' || typeof value === 'number' || value === null) {
              return `:${key}="${value}"`
            } else if (typeof value === 'string') {
              // 转义字符串中的特殊字符（注意顺序：& 必须最先转义）
              const escapedValue = value
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
              return `${key}="${escapedValue}"`
            } else if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
              // JSON 字符串化后也需要转义
              const jsonString = JSON.stringify(value)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
              return `:${key}="${jsonString}"`
            } else {
              return `:${key}="${JSON.stringify(value)}"`
            }
          })
          .join(' ')
        
        // 返回自闭合标签
        const result = `<${pascalCaseName}${attrString ? ' ' + attrString : ''} />`
        
        if (debug) {
          console.log(`[Macau] Generated tag: ${result}`)
        }
        
        return result
        
      } catch (e) {
        // YAML 解析失败时，返回错误信息
        const errorMessage = `[Macau] Failed to parse YAML for component ${pascalCaseName}: ${e instanceof Error ? e.message : String(e)}`
        console.error(errorMessage)
        return `<div style="color: red; padding: 1rem; border: 1px solid red; border-radius: 4px;">Invalid YAML format: ${e instanceof Error ? e.message : String(e)}</div>`
      }
    }
    
    // 其他情况使用默认的 fence 渲染
    return originalFence(tokens, idx, options, env, self);
  }
}