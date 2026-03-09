import EventEmitter from 'eventemitter3';

/** 连接状态 */
type ConnectionState = 'disconnected' | 'scanning' | 'connecting' | 'connected' | 'reconnecting';
/** 设备模型 */
interface Device {
    id: string;
    name: string;
    rssi: number;
    bluetoothDevice?: BluetoothDevice;
}
/** 设备状态 */
interface DeviceStatus {
    batteryLevel: number;
    wear: boolean;
    timestamp: number;
}
/** EEG 数据包 (从 WASM 解析后) */
interface EEGDataPacket {
    samples: number[];
    battery: number;
    wear: boolean;
    sequence: number;
    timestamp: number;
}
/** 滤波后的批次 */
interface FilteredBatch {
    samples: number[];
    timestamp_ms: number;
}
/** 滤波配置 */
interface FilterConfig {
    enabled: boolean;
    lowpassFrequency: number;
    highpassFrequency: number;
    notchEnabled: boolean;
    notchFrequency: number;
    sampleRate: number;
}
/** SDK 配置 */
interface SDKConfig {
    appKey: string;
    debug: boolean;
}
/** 录制配置 */
interface RecordingConfig {
    channelCount: number;
    samplingRate: number;
    patientId: string;
}
/** 录制统计 */
interface RecordingStatistics {
    startTime: number;
    duration: number;
    totalPackets: number;
    lostPackets: number;
}
declare const FilterPresets: {
    default: () => FilterConfig;
    noFilter: () => FilterConfig;
    china: () => FilterConfig;
    usa: () => FilterConfig;
};
declare enum SDKErrorCode {
    INIT_FAILED = 1000,
    INVALID_CONFIG = 1001,
    SDK_NOT_INITIALIZED = 1002,
    AUTH_FAILED = 2000,
    LICENSE_INVALID = 2003,
    BLUETOOTH_NOT_SUPPORTED = 3000,
    BLUETOOTH_NOT_ENABLED = 3001,
    BLUETOOTH_PERMISSION_DENIED = 3002,
    DEVICE_NOT_FOUND = 3003,
    CONNECTION_FAILED = 3005,
    CONNECTION_TIMEOUT = 3006
}
declare class SDKError extends Error {
    readonly code: SDKErrorCode;
    constructor(code: SDKErrorCode, message: string);
}

/**
 * WASM ↔ TypeScript 数据桥接
 *
 * 接收 BLE 原始字节 → WASM 解析 → 事件分发
 */
interface DataBridgeEvents {
    raw: (packet: EEGDataPacket) => void;
    unfiltered: (packet: EEGDataPacket) => void;
    filtered: (packet: EEGDataPacket) => void;
    realtime: (batch: FilteredBatch) => void;
    status: (status: DeviceStatus) => void;
}
declare class DataBridge extends EventEmitter<DataBridgeEvents> {
    private core;
    private packetCount;
    private lostPackets;
    private lastSequence;
    private lastNotifyTime;
    private readonly NOTIFY_INTERVAL;
    constructor(core: any);
    /** 处理 BLE 原始数据 (DataView) */
    handleRawData(dataView: DataView): void;
    /** 设置滤波配置 */
    setFilterConfig(config: FilterConfig): void;
    /** 下载 EDF 文件 */
    downloadEdf(filename?: string): void;
    /** 获取 EDF Blob (用于上传服务器) */
    getEdfBlob(): Blob | null;
    /** 统计 */
    getStatistics(): {
        totalPackets: number;
        lostPackets: number;
        lossRate: number;
    };
    reset(): void;
}

/**
 * 设备管理器
 *
 * 统一管理扫描、连接、断开和数据监听。
 */
declare class DeviceManager {
    private core;
    private scanner;
    private connector;
    private dataBridge;
    private _state;
    private _device;
    onStateChanged?: (state: ConnectionState) => void;
    constructor(core: any, dataBridge: DataBridge);
    get connectionState(): ConnectionState;
    get currentDevice(): Device | null;
    /** 扫描/选择设备 (必须由用户手势触发) */
    requestDevice(nameFilters?: string[]): Promise<Device>;
    /** 连接设备 */
    connect(device?: Device): Promise<void>;
    /** 断开 */
    disconnect(): Promise<void>;
    /** 启动数据监听 */
    startListening(): Promise<void>;
    /** 停止数据监听 */
    stopListening(): Promise<void>;
    private updateState;
}

/**
 * NeuroMeta Web SDK 主入口
 *
 * 用法:
 * ```ts
 * import { NeuroMetaSDK } from '@neurometa/web-sdk';
 *
 * const sdk = await NeuroMetaSDK.create({ appKey: 'your_key', debug: true });
 *
 * // 用户手势触发
 * const device = await sdk.deviceManager.requestDevice();
 * await sdk.deviceManager.connect(device);
 * await sdk.deviceManager.startListening();
 *
 * sdk.dataBridge.on('realtime', (batch) => {
 *   drawWaveform(batch.samples);
 * });
 * ```
 */
declare class NeuroMetaSDK {
    static readonly VERSION = "1.0.0";
    readonly deviceManager: DeviceManager;
    readonly dataBridge: DataBridge;
    private core;
    private _initialized;
    private constructor();
    /**
     * 创建 SDK 实例 (异步 — 需要加载 WASM)
     */
    static create(config: SDKConfig): Promise<NeuroMetaSDK>;
    get isInitialized(): boolean;
    /** 设置滤波配置 */
    setFilterConfig(config: FilterConfig): void;
    /** 开始 EDF 录制 */
    startRecording(config?: Partial<RecordingConfig>): void;
    /** 停止 EDF 录制并下载 */
    stopRecordingAndDownload(filename?: string): void;
    /** 停止 EDF 录制并获取 Blob (用于上传) */
    stopRecordingAndGetBlob(): Blob | null;
    get isRecording(): boolean;
    /** 销毁 SDK */
    destroy(): void;
}

/**
 * BLE 扫描器 — Web Bluetooth API
 *
 * 所有 UUID 从 WASM 核心获取，前端代码中无明文 UUID。
 */
declare class BLEScanner {
    private core;
    constructor(core: any);
    /**
     * 请求用户选择 BLE 设备
     *
     * 注意: 必须由用户手势 (click/tap) 触发
     */
    requestDevice(nameFilters?: string[]): Promise<Device>;
}

/**
 * BLE 连接器 — Web Bluetooth GATT
 *
 * UUID 和启动命令从 WASM 获取。
 */
declare class BLEConnector {
    private core;
    private server;
    private dataChar;
    private presetChar;
    private _connected;
    onDataReceived?: (data: DataView) => void;
    onConnected?: () => void;
    onDisconnected?: () => void;
    constructor(core: any);
    get isConnected(): boolean;
    connect(device: BluetoothDevice): Promise<void>;
    disconnect(): Promise<void>;
    enableNotification(): Promise<void>;
    disableNotification(): Promise<void>;
    sendStartCommand(): Promise<void>;
}

export { BLEConnector, BLEScanner, type ConnectionState, DataBridge, type Device, DeviceManager, type DeviceStatus, type EEGDataPacket, type FilterConfig, FilterPresets, type FilteredBatch, NeuroMetaSDK, type RecordingConfig, type RecordingStatistics, type SDKConfig, SDKError, SDKErrorCode };
