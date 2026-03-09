// src/data/DataBridge.ts
import EventEmitter from "eventemitter3";
var DataBridge = class extends EventEmitter {
  // ~25Hz
  constructor(core) {
    super();
    // NeuroMetaCore
    this.packetCount = 0;
    this.lostPackets = 0;
    this.lastSequence = -1;
    this.lastNotifyTime = 0;
    this.NOTIFY_INTERVAL = 40;
    this.core = core;
  }
  /** 处理 BLE 原始数据 (DataView) */
  handleRawData(dataView) {
    const rawBytes = new Uint8Array(
      dataView.buffer,
      dataView.byteOffset,
      dataView.byteLength
    );
    const parsed = this.core.parse_raw_data(rawBytes);
    if (!parsed) return;
    const now = Date.now();
    const packet = {
      samples: Array.from(parsed.samples),
      battery: parsed.battery,
      wear: parsed.wear,
      sequence: parsed.sequence,
      timestamp: now
    };
    this.packetCount++;
    if (this.lastSequence >= 0) {
      const expected = (this.lastSequence + 1) % 256;
      if (packet.sequence !== expected) {
        this.lostPackets++;
      }
    }
    this.lastSequence = packet.sequence;
    this.emit("raw", packet);
    this.emit("unfiltered", packet);
    const filteredSamples = this.core.apply_all_filters(
      new Float64Array(packet.samples)
    );
    const filteredPacket = {
      ...packet,
      samples: Array.from(filteredSamples)
    };
    this.emit("filtered", filteredPacket);
    const batch = this.core.add_filtered_samples(
      new Float64Array(packet.samples)
    );
    if (batch) {
      const fb = {
        samples: Array.from(batch.samples),
        timestamp_ms: now
      };
      this.emit("realtime", fb);
    }
    if (now - this.lastNotifyTime >= this.NOTIFY_INTERVAL) {
      this.lastNotifyTime = now;
      const status = {
        batteryLevel: packet.battery,
        wear: packet.wear,
        timestamp: now
      };
      this.emit("status", status);
    }
    if (this.core.is_recording_edf()) {
      this.core.feed_edf(new Float64Array(packet.samples));
    }
  }
  /** 设置滤波配置 */
  setFilterConfig(config) {
    this.core.set_filter_config(JSON.stringify(config));
  }
  /** 下载 EDF 文件 */
  downloadEdf(filename) {
    const bytes = this.core.stop_edf();
    if (!bytes || bytes.length === 0) return;
    const blob = new Blob([bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename ?? `eeg_${Date.now()}.edf`;
    a.click();
    URL.revokeObjectURL(url);
  }
  /** 获取 EDF Blob (用于上传服务器) */
  getEdfBlob() {
    const bytes = this.core.stop_edf();
    if (!bytes || bytes.length === 0) return null;
    return new Blob([bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)], { type: "application/octet-stream" });
  }
  /** 统计 */
  getStatistics() {
    return {
      totalPackets: this.packetCount,
      lostPackets: this.lostPackets,
      lossRate: this.packetCount > 0 ? this.lostPackets / this.packetCount * 100 : 0
    };
  }
  reset() {
    this.packetCount = 0;
    this.lostPackets = 0;
    this.lastSequence = -1;
    this.core.reset_parser();
    this.core.reset_filtered();
  }
};

// src/model/types.ts
var FilterPresets = {
  default: () => ({
    enabled: true,
    lowpassFrequency: 45,
    highpassFrequency: 0.5,
    notchEnabled: true,
    notchFrequency: 50,
    sampleRate: 250
  }),
  noFilter: () => ({
    enabled: false,
    lowpassFrequency: 45,
    highpassFrequency: 0.5,
    notchEnabled: false,
    notchFrequency: 50,
    sampleRate: 250
  }),
  china: () => ({
    enabled: true,
    lowpassFrequency: 45,
    highpassFrequency: 0.5,
    notchEnabled: true,
    notchFrequency: 50,
    sampleRate: 250
  }),
  usa: () => ({
    enabled: true,
    lowpassFrequency: 45,
    highpassFrequency: 0.5,
    notchEnabled: true,
    notchFrequency: 60,
    sampleRate: 250
  })
};
var SDKErrorCode = /* @__PURE__ */ ((SDKErrorCode2) => {
  SDKErrorCode2[SDKErrorCode2["INIT_FAILED"] = 1e3] = "INIT_FAILED";
  SDKErrorCode2[SDKErrorCode2["INVALID_CONFIG"] = 1001] = "INVALID_CONFIG";
  SDKErrorCode2[SDKErrorCode2["SDK_NOT_INITIALIZED"] = 1002] = "SDK_NOT_INITIALIZED";
  SDKErrorCode2[SDKErrorCode2["AUTH_FAILED"] = 2e3] = "AUTH_FAILED";
  SDKErrorCode2[SDKErrorCode2["LICENSE_INVALID"] = 2003] = "LICENSE_INVALID";
  SDKErrorCode2[SDKErrorCode2["BLUETOOTH_NOT_SUPPORTED"] = 3e3] = "BLUETOOTH_NOT_SUPPORTED";
  SDKErrorCode2[SDKErrorCode2["BLUETOOTH_NOT_ENABLED"] = 3001] = "BLUETOOTH_NOT_ENABLED";
  SDKErrorCode2[SDKErrorCode2["BLUETOOTH_PERMISSION_DENIED"] = 3002] = "BLUETOOTH_PERMISSION_DENIED";
  SDKErrorCode2[SDKErrorCode2["DEVICE_NOT_FOUND"] = 3003] = "DEVICE_NOT_FOUND";
  SDKErrorCode2[SDKErrorCode2["CONNECTION_FAILED"] = 3005] = "CONNECTION_FAILED";
  SDKErrorCode2[SDKErrorCode2["CONNECTION_TIMEOUT"] = 3006] = "CONNECTION_TIMEOUT";
  return SDKErrorCode2;
})(SDKErrorCode || {});
var SDKError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "SDKError";
  }
};

// src/ble/BLEScanner.ts
var BLEScanner = class {
  // NeuroMetaCore WASM instance
  constructor(core) {
    this.core = core;
  }
  /**
   * 请求用户选择 BLE 设备
   *
   * 注意: 必须由用户手势 (click/tap) 触发
   */
  async requestDevice(nameFilters) {
    if (!navigator.bluetooth) {
      throw new SDKError(
        3e3 /* BLUETOOTH_NOT_SUPPORTED */,
        "Web Bluetooth API \u4E0D\u652F\u6301\uFF0C\u8BF7\u4F7F\u7528 Chrome/Edge \u6D4F\u89C8\u5668"
      );
    }
    const serviceUUID = this.core.get_service_uuid();
    const options = nameFilters?.length ? {
      filters: nameFilters.map((name) => ({ namePrefix: name })),
      optionalServices: [serviceUUID]
    } : {
      acceptAllDevices: true,
      optionalServices: [serviceUUID]
    };
    try {
      const btDevice = await navigator.bluetooth.requestDevice(options);
      return {
        id: btDevice.id,
        name: btDevice.name ?? "Unknown",
        rssi: 0,
        bluetoothDevice: btDevice
      };
    } catch (err) {
      if (err.name === "NotFoundError") {
        throw new SDKError(3003 /* DEVICE_NOT_FOUND */, "\u7528\u6237\u53D6\u6D88\u6216\u672A\u627E\u5230\u8BBE\u5907");
      }
      throw new SDKError(3002 /* BLUETOOTH_PERMISSION_DENIED */, err.message);
    }
  }
};

// src/ble/BLEConnector.ts
var BLEConnector = class {
  constructor(core) {
    // NeuroMetaCore
    this.server = null;
    this.dataChar = null;
    this.presetChar = null;
    this._connected = false;
    this.core = core;
  }
  get isConnected() {
    return this._connected;
  }
  async connect(device) {
    if (!device.gatt) {
      throw new SDKError(3005 /* CONNECTION_FAILED */, "GATT \u4E0D\u53EF\u7528");
    }
    device.addEventListener("gattserverdisconnected", () => {
      this._connected = false;
      this.onDisconnected?.();
    });
    this.server = await device.gatt.connect();
    const serviceUUID = this.core.get_service_uuid();
    const service = await this.server.getPrimaryService(serviceUUID);
    const dataCharUUID = this.core.get_data_char_uuid();
    const presetCharUUID = this.core.get_preset_char_uuid();
    this.dataChar = await service.getCharacteristic(dataCharUUID);
    try {
      this.presetChar = await service.getCharacteristic(presetCharUUID);
    } catch {
      console.warn("[BLEConnector] Preset \u7279\u5F81\u672A\u627E\u5230");
    }
    this._connected = true;
    this.onConnected?.();
  }
  async disconnect() {
    this.server?.disconnect();
    this._connected = false;
    this.server = null;
    this.dataChar = null;
    this.presetChar = null;
  }
  async enableNotification() {
    if (!this.dataChar) {
      throw new SDKError(3005 /* CONNECTION_FAILED */, "\u6570\u636E\u7279\u5F81\u672A\u53D1\u73B0");
    }
    this.dataChar.addEventListener(
      "characteristicvaluechanged",
      (event) => {
        const char = event.target;
        if (char.value) {
          this.onDataReceived?.(char.value);
        }
      }
    );
    await this.dataChar.startNotifications();
  }
  async disableNotification() {
    await this.dataChar?.stopNotifications();
  }
  async sendStartCommand() {
    if (!this.presetChar) {
      console.warn("[BLEConnector] \u65E0 preset \u7279\u5F81\uFF0C\u8DF3\u8FC7\u542F\u52A8\u547D\u4EE4");
      return;
    }
    const cmd = this.core.get_start_command();
    await this.presetChar.writeValue(new Uint8Array(cmd));
  }
};

// src/device/DeviceManager.ts
var DeviceManager = class {
  constructor(core, dataBridge) {
    this._state = "disconnected";
    this._device = null;
    this.core = core;
    this.scanner = new BLEScanner(core);
    this.connector = new BLEConnector(core);
    this.dataBridge = dataBridge;
  }
  get connectionState() {
    return this._state;
  }
  get currentDevice() {
    return this._device;
  }
  /** 扫描/选择设备 (必须由用户手势触发) */
  async requestDevice(nameFilters) {
    this.updateState("scanning");
    try {
      const device = await this.scanner.requestDevice(nameFilters);
      this._device = device;
      this.updateState("disconnected");
      return device;
    } catch (err) {
      this.updateState("disconnected");
      throw err;
    }
  }
  /** 连接设备 */
  async connect(device) {
    const target = device ?? this._device;
    if (!target?.bluetoothDevice) {
      throw new Error("\u65E0\u53EF\u8FDE\u63A5\u7684\u8BBE\u5907");
    }
    this.updateState("connecting");
    this.connector.onConnected = () => {
      this._device = target;
      this.updateState("connected");
    };
    this.connector.onDisconnected = () => {
      this.updateState("disconnected");
    };
    this.connector.onDataReceived = (dataView) => {
      this.dataBridge.handleRawData(dataView);
    };
    await this.connector.connect(target.bluetoothDevice);
  }
  /** 断开 */
  async disconnect() {
    await this.connector.disconnect();
    this._device = null;
    this.updateState("disconnected");
  }
  /** 启动数据监听 */
  async startListening() {
    await this.connector.enableNotification();
    await this.connector.sendStartCommand();
  }
  /** 停止数据监听 */
  async stopListening() {
    await this.connector.disableNotification();
  }
  updateState(state) {
    if (this._state !== state) {
      this._state = state;
      this.onStateChanged?.(state);
    }
  }
};

// src/NeuroMetaSDK.ts
var _NeuroMetaSDK = class _NeuroMetaSDK {
  constructor(core) {
    // NeuroMetaCore WASM
    this._initialized = false;
    this.core = core;
    this.dataBridge = new DataBridge(core);
    this.deviceManager = new DeviceManager(core, this.dataBridge);
  }
  /**
   * 创建 SDK 实例 (异步 — 需要加载 WASM)
   */
  static async create(config) {
    let wasmModule;
    try {
      wasmModule = await import("./neurometa_core-CZ35GMZJ.js");
      const initFn = typeof wasmModule.default === "function" ? wasmModule.default : typeof wasmModule.init === "function" ? wasmModule.init : null;
      if (initFn) {
        await initFn();
      }
    } catch (err) {
      throw new SDKError(
        1e3 /* INIT_FAILED */,
        `WASM \u6A21\u5757\u52A0\u8F7D\u5931\u8D25: ${err.message}`
      );
    }
    const core = new wasmModule.NeuroMetaCore();
    const sdk = new _NeuroMetaSDK(core);
    if (config.debug) {
      core.set_allow_dev_license(true);
    }
    const origin = globalThis.location?.origin ?? "";
    const licenseJson = wasmModule.NeuroMetaCore.create_dev_license(origin);
    const result = core.validate_license(licenseJson, origin);
    if (result !== 0) {
      throw new SDKError(
        2003 /* LICENSE_INVALID */,
        `License \u9A8C\u8BC1\u5931\u8D25 (code=${result})`
      );
    }
    sdk._initialized = true;
    console.info(`[NeuroMetaSDK] v${_NeuroMetaSDK.VERSION} \u521D\u59CB\u5316\u5B8C\u6210`);
    return sdk;
  }
  get isInitialized() {
    return this._initialized;
  }
  /** 设置滤波配置 */
  setFilterConfig(config) {
    this.dataBridge.setFilterConfig(config);
  }
  /** 开始 EDF 录制 */
  startRecording(config) {
    this.core.start_edf(
      config?.channelCount ?? 1,
      config?.samplingRate ?? 250,
      config?.patientId ?? ""
    );
  }
  /** 停止 EDF 录制并下载 */
  stopRecordingAndDownload(filename) {
    this.dataBridge.downloadEdf(filename);
  }
  /** 停止 EDF 录制并获取 Blob (用于上传) */
  stopRecordingAndGetBlob() {
    return this.dataBridge.getEdfBlob();
  }
  get isRecording() {
    return this.core.is_recording_edf();
  }
  /** 销毁 SDK */
  destroy() {
    this.dataBridge.reset();
    this.dataBridge.removeAllListeners();
    this._initialized = false;
    console.info("[NeuroMetaSDK] \u5DF2\u9500\u6BC1");
  }
};
_NeuroMetaSDK.VERSION = "1.0.0";
var NeuroMetaSDK = _NeuroMetaSDK;
export {
  BLEConnector,
  BLEScanner,
  DataBridge,
  DeviceManager,
  FilterPresets,
  NeuroMetaSDK,
  SDKError,
  SDKErrorCode
};
