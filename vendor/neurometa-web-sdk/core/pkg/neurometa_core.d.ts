/* tslint:disable */
/* eslint-disable */

/**
 * WASM 核心入口
 */
export class NeuroMetaCore {
    free(): void;
    [Symbol.dispose](): void;
    add_filtered_samples(samples: Float64Array): any;
    /**
     * 应用全部滤波
     */
    apply_all_filters(data: Float64Array): Float64Array;
    apply_bandpass(data: Float64Array): Float64Array;
    apply_notch(data: Float64Array): Float64Array;
    /**
     * 创建开发 License JSON
     */
    static create_dev_license(origin: string): string;
    feed_edf(samples: Float64Array): void;
    flush_filtered(): any;
    static get_amplitude(data: Float64Array): number;
    get_data_char_uuid(): string;
    get_preset_char_uuid(): string;
    static get_rms(data: Float64Array): number;
    get_service_uuid(): string;
    get_start_command(): Uint8Array;
    is_recording_edf(): boolean;
    constructor();
    /**
     * 解析原始 BLE 数据
     * 返回 JSON: { samples: number[], battery: number, wear: boolean, sequence: number }
     */
    parse_raw_data(data: Uint8Array): any;
    reset_filtered(): void;
    /**
     * 重置解析器
     */
    reset_parser(): void;
    /**
     * 设置是否允许开发 License
     */
    set_allow_dev_license(allow: boolean): void;
    /**
     * 设置滤波配置 JSON
     * { enabled, lowpassFrequency, highpassFrequency, notchEnabled, notchFrequency, sampleRate }
     */
    set_filter_config(json: string): void;
    start_edf(channel_count: number, sampling_rate: number, patient_id: string): void;
    /**
     * 停止 EDF 录制 → 返回完整 EDF 字节数组
     */
    stop_edf(): Uint8Array;
    /**
     * 验证 License JSON
     * 返回: 0=成功, 1=签名无效, 2=域名不匹配, 3=过期
     */
    validate_license(json: string, origin: string): number;
}

/**
 * SDK 版本
 */
export function version(): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_neurometacore_free: (a: number, b: number) => void;
    readonly neurometacore_add_filtered_samples: (a: number, b: number, c: number) => number;
    readonly neurometacore_apply_all_filters: (a: number, b: number, c: number, d: number) => void;
    readonly neurometacore_apply_bandpass: (a: number, b: number, c: number, d: number) => void;
    readonly neurometacore_apply_notch: (a: number, b: number, c: number, d: number) => void;
    readonly neurometacore_create_dev_license: (a: number, b: number, c: number) => void;
    readonly neurometacore_feed_edf: (a: number, b: number, c: number) => void;
    readonly neurometacore_flush_filtered: (a: number) => number;
    readonly neurometacore_get_amplitude: (a: number, b: number) => number;
    readonly neurometacore_get_data_char_uuid: (a: number, b: number) => void;
    readonly neurometacore_get_preset_char_uuid: (a: number, b: number) => void;
    readonly neurometacore_get_rms: (a: number, b: number) => number;
    readonly neurometacore_get_service_uuid: (a: number, b: number) => void;
    readonly neurometacore_get_start_command: (a: number, b: number) => void;
    readonly neurometacore_is_recording_edf: (a: number) => number;
    readonly neurometacore_new: () => number;
    readonly neurometacore_parse_raw_data: (a: number, b: number, c: number) => number;
    readonly neurometacore_reset_filtered: (a: number) => void;
    readonly neurometacore_reset_parser: (a: number) => void;
    readonly neurometacore_set_allow_dev_license: (a: number, b: number) => void;
    readonly neurometacore_set_filter_config: (a: number, b: number, c: number) => void;
    readonly neurometacore_start_edf: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly neurometacore_stop_edf: (a: number, b: number) => void;
    readonly neurometacore_validate_license: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly version: (a: number) => void;
    readonly __wbindgen_export: (a: number, b: number) => number;
    readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
    readonly __wbindgen_export2: (a: number, b: number, c: number) => void;
    readonly __wbindgen_export3: (a: number, b: number, c: number, d: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
