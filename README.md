# NeuroMeta Web SDK 集成测试 Demo

本项目是 `NeuroMeta Web SDK (WASM)` 的 Web 集成示例，演示如何在 React 页面中完成设备连接、实时数据接收、滤波和 EDF 录制。

## 功能清单

| 功能 | 状态 | 说明 |
| --- | --- | --- |
| Web Bluetooth 连接 | ✅ | 浏览器原生设备扫描与连接 |
| SDK 初始化 | ✅ | WASM 模块加载 + License 校验 |
| 实时数据流处理 | ✅ | 原始包解析 + 滤波 + 实时批次输出 |
| 波形绘制 | ✅ | Canvas 2D 实时绘图 |
| 滤波预设切换 | ✅ | 默认 / 中国 50Hz / 美国 60Hz / 关闭 |
| EDF 录制下载 | ✅ | 浏览器端导出 EDF 文件 |
| 设备状态监测 | ✅ | 电量、佩戴状态、包计数 |

## 快速开始

### 1) 环境要求

- Node.js `>= 18`
- npm `>= 9`
- Chrome / Edge（需支持 Web Bluetooth）
- 使用 `http://localhost` 或 `https` 访问页面

### 2) 安装依赖

```bash
npm install
```

### 3) 启动开发环境

```bash
npm run dev
```

启动后访问：`http://localhost:5173`

## 依赖说明（关键）

本仓库已经内置 SDK 运行产物，`@neurometa/web-sdk` 通过本地 `file:` 依赖安装：

```json
"@neurometa/web-sdk": "file:./vendor/neurometa-web-sdk"
```

这意味着：

- `git clone` 后不需要配置私有 npm registry。
- 不需要额外 token。
- 仓库内不包含 SDK 源码，仅包含运行所需编译产物（`dist`、`core/pkg`）。

## WASM 资源准备

- `npm run dev` / `npm run build` 前会自动执行 `npm run prepare:wasm`。
- 脚本会把 `neurometa_core_bg.wasm` 拷贝到 `public/assets/neurometa_core_bg.wasm`。
- `public/assets/neurometa_core_bg.wasm` 属于可再生文件，删除后再次运行 `npm run dev` 会自动生成。

## 核心接入流程

示例代码可参考 `src/App.tsx`。

```ts
import { NeuroMetaSDK, FilterPresets } from '@neurometa/web-sdk';

const sdk = await NeuroMetaSDK.create({ appKey: 'demo', debug: true });

sdk.dataBridge.on('realtime', (batch) => {
  // batch.samples: 滤波后的实时数据
});

sdk.dataBridge.on('status', (status) => {
  // status.batteryLevel / status.wear
});

const device = await sdk.deviceManager.requestDevice();
await sdk.deviceManager.connect(device);
await sdk.deviceManager.startListening();

sdk.setFilterConfig(FilterPresets.default());
```

## 项目结构

```text
neurometa-web-demo/
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── scripts/
│   └── prepare-wasm.mjs
├── vendor/
│   └── neurometa-web-sdk/
│       ├── package.json
│       ├── dist/
│       └── core/pkg/
├── public/
│   └── assets/
├── src/
│   ├── App.tsx
│   └── main.tsx
└── README.md
```

## 如何升级 SDK（不公开源码模式）

当你有新的 SDK 发布包时，只替换以下目录内容：

1. `vendor/neurometa-web-sdk/package.json`
2. `vendor/neurometa-web-sdk/dist/*`
3. `vendor/neurometa-web-sdk/core/pkg/*`

然后执行：

```bash
npm install
npm run dev
```

## 常见问题

### Q1: `npm install` 时报 `@neurometa/web-sdk` 相关错误

检查仓库是否完整包含 `vendor/neurometa-web-sdk`，尤其是：

- `vendor/neurometa-web-sdk/package.json`
- `vendor/neurometa-web-sdk/dist/index.js`
- `vendor/neurometa-web-sdk/dist/neurometa_core_bg.wasm`

### Q2: 启动时报找不到 `neurometa_core_bg.wasm`

执行：

```bash
npm run prepare:wasm
```

如果仍失败，确认 `vendor/neurometa-web-sdk/dist/neurometa_core_bg.wasm` 文件存在。

### Q3: 页面无法弹出蓝牙设备选择框

- 必须由用户点击触发连接动作。
- 仅在 `localhost` 或 `https` 下可用。
- 使用支持 Web Bluetooth 的浏览器（Chrome/Edge）。

## 技术支持

- SDK 版本：见 `vendor/neurometa-web-sdk/package.json`
- 联系方式：sdk-support@neurometa.com.cn

## License

Copyright © 2026 NeuroMeta. All rights reserved.
