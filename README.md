# HTS UI

> 黑白灰极简扁平 UI 组件库 · 零依赖 · 约 20 KB · 内置浅色 / 深色 / 跟随系统三态主题

**版本**：v1.0 · **作者**：HTStudiocent · **许可证**：MIT

展示与交互文档：**https://www.haotis.top/ui/**

HTS UI 是 HTS工作室全站统一使用的界面规范实现。设计原则只有一条：**只用黑白灰，拒绝一切渐变与花哨特效**——纯色、细边框、15px 圆角、0.25s 缓动，所有颜色通过 CSS 变量定义，深色模式只需覆盖变量，组件样式永远只写一份。

## ✨ 特性

- 🎨 **零依赖**：单 CSS + 单 JS，直接 `<link>` / `<script>` 使用，无构建要求
- 🌗 **三态主题**：浅色 / 深色 / 跟随系统，localStorage 持久化，防闪烁方案见下方文档
- ♿ **无障碍**：尊重 `prefers-reduced-motion`，自动关闭全部动效
- 📱 **响应式**：900 / 800 / 640 / 400 / 360px 断点，侧边导航窄屏自动变抽屉
- 🧩 **14 类组件**：见下方清单

## 📦 目录结构

```
hts-ui/
├── dist/
│   ├── hts-ui.css    # 组件库样式（主题变量 + 全部组件）
│   └── hts-ui.js     # 行为层（主题 / 开关 / 代码框 / 弹窗 / 侧边导航）
├── example.html      # 最小可用示例
├── package.json
├── CHANGELOG.md
├── LICENSE           # MIT
└── README.md
```

## 🚀 快速开始

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
    <link rel="stylesheet" href="dist/hts-ui.css">
    <!-- 防闪烁：渲染前应用已保存的主题 -->
    <script>
    (function(){try{var m=localStorage.getItem('hts-theme')||'system';var h=document.documentElement;if(m==='light'||m==='dark')h.setAttribute('data-theme',m);}catch(e){}})();
    </script>
</head>
<body>
    <button class="btn">主要按钮</button>
    <button class="btn btn-plain">次要按钮</button>
    <input class="input" placeholder="输入框">
    <button class="switch" type="button"></button>

    <select class="theme-select">
        <option value="system">系统默认</option>
        <option value="light">浅色模式</option>
        <option value="dark">深色模式</option>
    </select>

    <script src="dist/hts-ui.js"></script>
</body>
</html>
```

`hts-ui.js` 加载后自动执行 `HTSUI.init()`，绑定页面全部组件；动态插入内容后可再次调用 `HTSUI.init()`（已绑定元素自动跳过）。

## 🧩 组件清单

| 组件 | 类名 | 说明 |
|------|------|------|
| 按钮 | `.btn` `.btn-plain` `.btn-sm` `:disabled` | 悬停反色、按压缩小 |
| 输入框 | `.input` `.select` `.textarea` | 聚焦边框变主色，自绘下拉箭头 |
| 开关 | `.switch` | 点击自动切换 `.on` |
| 复选框 | `input[type=checkbox]` | `accent-color` 主色 |
| 卡片 | `.site-card` + `.site-icon/.site-letter` | 悬停上浮，图标失败回退首字母 |
| 标签 | `.tag` `.tag-dark` | 状态与分类 |
| 表格 | `.table-wrap` > `.table` | 窄屏容器内横滑，不撑破页面 |
| 进度条 | `.progress` > `.progress-bar`，可拖动加 `.progress-drag` | 0.6s 平滑过渡 |
| 弹窗 | `.modal-mask` > `.modal-box` | 触发按钮加 `data-hts-modal="遮罩id"`，ESC/遮罩/× 关闭 |
| Toast | `HTSUI.toast('消息')` | 1.8s 自动消失 |
| 代码框 | `.code-box` > `.code-box-head` + `pre>code` | 自动行号、默认折叠、一键复制 |
| 顶部导航 | `.header` `.nav` `.theme-select` | 吸顶、下划线展开动效 |
| 侧边导航 | `.ui-side-wrap` `.ui-side` `.ui-side-toggle` `.ui-side-mask` | 桌面缩回 / ≤800px 抽屉 |
| 页脚 | `.footer` `.footer-link` | — |

## 🌗 主题 API

```js
HTSTheme.getMode();          // 'system' | 'light' | 'dark'
HTSTheme.setMode('dark');    // 切换并持久化到 localStorage
// 切换后派发 document 事件 'hts-theme-change'，可用于同步自定义内容
```

`.theme-select` 下拉框会被自动绑定与回显，无需手写逻辑。

## 🎨 主题变量

全部颜色以 CSS 变量提供，覆盖即可定制：

```css
--bg --surface --block --border
--text --text-soft --text-muted --text-faint
--primary --on-primary
--footer-bg --footer-text --footer-muted
--shadow --modal-overlay --switch-knob
--code-bg --code-text --code-max-height
```

## 🌐 浏览器支持

Chrome / Edge / Firefox / Safari 现代版本。使用了 CSS 变量、`IntersectionObserver`、Pointer Events（均有功能检测或优雅降级）。

## 📄 许可证

[MIT](LICENSE) © 2026 HTStudiocent
