# React 项目模板方案（基于参考布局）

> 目标：在本目录创建一个基于 **React + TypeScript + Vite + Less** 的企业级模板，布局方向参考 Ant Design Pro 的 Workplace 页面（仅布局方向），并满足多标签 + 缓存 + 一屏布局等要求。

## 1. 参考布局与页面结构
- 参考页面：Ant Design Pro / Dashboard / Workplace（仅布局方向）
- 关键布局层次（从上到下）：
  1) **Header**（固定，包含 Logo / 项目名 / 全局操作区）
  2) **Tabs Bar**（固定，紧贴 Header，下方为路由内容）
  3) **Content**（唯一可上下滚动区域）

> 整个页面保持一屏（100vh），Header 与 Tabs Bar 固定不滚动，只有 Content 区域滚动。

## 2. 技术栈与约束
- React + TypeScript
- Vite
- Less
- Zustand
- Axios
- Ahooks
- Ant Design 6（antd@6）
- react-activation（KeepAlive）
- Vitest
- **Node.js >= 22**
- **pnpm** 作为包管理器
- 依赖统一使用 **latest** 版本

### 2.1 依赖建议（使用 latest）
- runtime: `react`, `react-dom`, `react-router-dom`, `antd`, `zustand`, `axios`, `ahooks`, `react-activation`
- build: `vite`, `@vitejs/plugin-react`, `less`
- test: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`

> 具体版本不写死，统一使用 `@latest`。

## 3. 目录结构建议
```
.
├─ src/
│  ├─ app/                    # 应用入口与初始化
│  │  ├─ App.tsx
│  │  └─ bootstrap.tsx
│  ├─ layouts/                # 主布局
│  │  ├─ MainLayout.tsx
│  │  └─ components/
│  │     ├─ HeaderBar.tsx
│  │     └─ TabsBar.tsx
│  ├─ router/                 # 路由配置 + 生成
│  │  ├─ routes.ts
│  │  ├─ generator.tsx
│  │  └─ types.ts
│  ├─ pages/                  # 页面
│  │  ├─ Dashboard/
│  │  └─ ...
│  ├─ stores/                 # Zustand store
│  │  ├─ appStore.ts
│  │  └─ tabsStore.ts
│  ├─ services/               # 业务服务
│  │  └─ api/
│  ├─ utils/
│  │  ├─ request/
│  │  │  ├─ index.ts           # axios 实例
│  │  │  ├─ interceptor.ts     # 统一拦截器
│  │  │  ├─ upload.ts          # 上传封装
│  │  │  └─ download.ts        # 下载封装
│  │  └─ storage.ts
│  ├─ styles/
│  │  ├─ variables.less
│  │  └─ global.less
│  └─ main.tsx
├─ vite.config.ts
├─ tsconfig.json
├─ package.json
└─ vitest.config.ts
```

## 4. 路由设计（配置化路由）
### 4.1 路由配置结构
- 配置文件：`src/router/routes.ts`
- 路由项包含：
  - `path` / `element`
  - `title` / `icon`
  - `keepAlive` / `tabClosable` / `affix`
  - `children`

### 4.2 统一生成
- `generator.tsx` 将配置生成 React Router 路由树
- 同时生成菜单与 Tab（由配置驱动）

### 4.3 路由 meta 示例
```
{
  path: '/dashboard',
  title: '工作台',
  icon: 'DashboardOutlined',
  keepAlive: true,
  tabClosable: true,
  element: <Dashboard />,
}
```

## 5. 多标签 + 缓存（react-activation）
### 5.1 设计目标
- Tabs Bar 固定在 Header 下方
- **最多缓存 20 个标签**，超出按时间倒排释放（LRU）
- 支持：
  - 单标签关闭
  - 多标签批量关闭（比如关闭左侧/右侧/其他）
  - 当只剩 1 个标签时禁止关闭

### 5.2 状态管理（Zustand）
- `tabsStore` 维护：
  - `tabs[]`（包含 `key`, `path`, `title`, `lastActive`）
  - `activeKey`
  - 操作：`addTab`, `closeTab`, `closeTabs`, `setActive`, `syncWithRoute`

### 5.3 释放策略（LRU）
- `addTab` 时如果 `tabs.length > 20`：
  - 按 `lastActive` 升序排序
  - 释放最久未活跃标签

### 5.4 KeepAlive 结合路由
- 路由 element 外部包 `KeepAlive`
- 通过 `keepAlive` 控制是否缓存

### 5.5 ConfigProvider 与 KeepAlive 放置（为国际化预留）
- `ConfigProvider` 放在应用最外层，统一注入 `locale` / `theme` / `direction` 等国际化相关配置
- `AliveScope` 放在 `ConfigProvider` 内部，保证被缓存页面仍能获取到国际化上下文
- `KeepAlive` 只包裹路由页面，不包裹 `ConfigProvider`
- 当切换语言时：
  - 通过更新 `ConfigProvider` 的 `locale` 实时生效
  - 如需强制刷新缓存页面，可在切换语言时调用 `drop` 或为 `cacheKey` 增加语言维度

## 6. Axios 封装方案
### 6.1 目标
- 单一 axios 实例
- 全局拦截器
- 统一数据结构处理
- **避免并发重复请求**（同一 key 取消前一个/或忽略后一个）
- 上传 / 下载封装

### 6.2 结构设计
- `utils/request/index.ts`
  - 创建 `axios.create()`
  - 统一 headers / baseURL / timeout
- `utils/request/interceptor.ts`
  - 请求拦截：注入 token、生成 `requestKey`
  - 响应拦截：统一解析、错误处理
- `utils/request/upload.ts`
  - 使用 `multipart/form-data`
- `utils/request/download.ts`
  - `responseType: 'blob'`
  - 统一文件名解析与保存

### 6.3 并发控制策略
- Map 记录 `requestKey` -> `AbortController`
- 新请求进来：
  - 如存在同 key 正在请求：取消旧请求或直接复用
- 请求完成：移除记录

> 建议 requestKey = `${method}:${url}:${paramsHash}:${dataHash}`

## 7. 样式与主题
- 使用 Less 统一主题变量（`src/styles/variables.less`）
- `global.less` 处理全局布局：
  - `html, body, #root { height: 100%; }`
  - `MainLayout` 使用 `height: 100vh; display: flex; flex-direction: column;`
  - `Content` 区域 `flex: 1; overflow: auto;`

## 8. Vite 与工程配置
- Vite 插件：`@vitejs/plugin-react`
- Less 支持：配置 `css.preprocessorOptions.less`
- Vitest 配置：`jsdom` 环境
- 拆包处理（build splitting）：
  - 路由页面使用 `lazy` 动态加载，形成按路由分包
  - 将 `react` / `react-dom`、`antd`、`vendors` 分离成独立 chunk
  - 公共依赖（如 `lodash` / `dayjs`）聚合成 commons chunk
  - 视情况启用 `runtime` 单独分包，降低首屏变化对缓存的影响

## 9. 最小可运行路径
1) `pnpm create` 初始化
2) 安装依赖（全部 latest）
3) 实现基础布局 + 路由 + Tabs Bar
4) 接入 KeepAlive 与 Tabs store
5) 接入 Axios 封装
6) 添加 1-2 个示例页面验证

---

如果需要，我可以在此方案基础上直接生成完整项目骨架（含配置文件、路由、布局、axios 封装、tabs store）。
