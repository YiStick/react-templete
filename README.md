# React Template

基于 React + TypeScript + Rsbuild + Less + Ant Design 6 的项目框架，包含配置化路由、多标签布局、KeepAlive 缓存与统一请求封装。

## 环境要求
- Node.js >= 22
- pnpm

## 启动
```bash
pnpm install
pnpm dev
```

## 脚本
- `pnpm dev` 开发
- `pnpm build` 打包
- `pnpm preview` 预览
- `pnpm test` 测试
- `pnpm lint` ESLint 检查
- `pnpm format` Prettier 格式化

## 代码规范
- ESLint 配置：`.eslintrc.cjs`
- Prettier 配置：`.prettierrc.json`

## 目录结构
- `src/layouts` 主布局（Header + Tabs + Content）
- `src/router` 路由配置与生成
- `src/stores` Zustand 状态
- `src/utils/request` Axios 统一封装

## 布局配置
布局配置集中在 `src/layouts/layoutConfig.ts`，可按需调整：
- `layout`: `side` / `top` / `mix`（兼容 `sidemenu` / `topmenu`）
- `navTheme`: `light` / `realDark`
- `colorPrimary`: 主题色（用于 Logo / 重点色）
- `siderMenuType`: 侧边菜单类型（`sub` / `group`）
- `contentWidth`: `Fluid` / `Fixed`（`top`/`mix` 生效）
- `fixedHeader`: 是否固定头部
- `fixSiderbar`: 是否固定侧边栏
- `splitMenus`: 自动分割菜单（仅 `mix` 生效）
- `headerRender` / `footerRender` / `menuRender` / `menuHeaderRender`: 控制区域渲染
- `menu.defaultOpenAll`: 默认展开所有子菜单
- `siderWidth` / `collapsedWidth`: 侧边栏宽度
- `multiTab`: 是否显示多标签栏

## 布局设置抽屉（仅本地开发显示）
- 入口：右侧悬浮设置手柄
- 仅 `development` 环境渲染，生产构建不展示
- 同步 Ant Design Pro 布局联动配置，已移除色弱模式并新增多标签开关

## 菜单隐藏与权限控制
- 使用 `meta.hidden` 或 `meta.hideInMenu` 隐藏菜单项（例如详情页）：
  ```ts
  {
    path: '/list/detail/:id',
    component: lazy(() => import('@/pages/List/Detail')),
    meta: {
      title: '列表详情',
      hidden: true,
      keepAlive: false,
      tabClosable: true,
    },
  }
  ```
- 权限控制：使用 `meta.access` 配合 `src/stores/authStore.ts` 的 `permissions`
  - `meta.access` 支持 `string | string[]`
  - 当 `permissions` 为空时默认放行，接入真实权限后按需过滤菜单
