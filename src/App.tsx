import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  NeuroMetaSDK,
  FilterPresets,
  type Device,
  type FilteredBatch,
  type DeviceStatus,
  type FilterConfig,
  type ConnectionState,
} from '@neurometa/web-sdk';

export default function App() {
  const sdkRef = useRef<NeuroMetaSDK | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [battery, setBattery] = useState(-1);
  const [wear, setWear] = useState(false);
  const [packetCount, setPacketCount] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recordFile, setRecordFile] = useState('');
  const [filterPreset, setFilterPreset] = useState('default');
  const [browserOk, setBrowserOk] = useState(true);

  const [logs, setLogs] = useState<{ time: string, msg: string, type: 'normal' | 'success' | 'error' }[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveformData = useRef<number[]>([]);
  const animFrame = useRef<number>(0);
  const [timeStr, setTimeStr] = useState('');

  const MAX_POINTS = 250; // Match Android default maxDataPoints

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  // Browser check
  useEffect(() => {
    if (!navigator.bluetooth) {
      setBrowserOk(false);
    }
  }, []);

  const addLog = useCallback((msg: string, type: 'normal' | 'success' | 'error' = 'normal') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [...prev, { time, msg, type }]);
  }, []);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Waveform
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const midY = h / 2;
    const data = waveformData.current;

    // Solid black background (from Android: Color.parseColor("#0A0A0A"))
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, w, h);

    // Grid lines (from Android: setDrawGridLines(true), gridColor=#1A1A1A)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;

    // Horizontal grids
    for (let y = 0; y <= h; y += h / 8) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    // Vertical grids
    for (let x = 0; x <= w; x += w / 10) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    if (data.length < 2) {
      animFrame.current = requestAnimationFrame(drawWaveform);
      return;
    }

    // Line drawing
    const step = w / MAX_POINTS; // Fixed window width
    const pointsToDraw = data.slice(-MAX_POINTS);

    // Scale: Y axis dynamically scales, at least -200 to 200
    const maxVal = Math.max(200, ...pointsToDraw.map(Math.abs));
    const scale = (h / 2) / maxVal;

    ctx.beginPath();
    ctx.strokeStyle = '#00ff00'; // Pure green from Android
    ctx.lineWidth = 1;

    for (let i = 0; i < pointsToDraw.length; i++) {
      const x = i * step;
      // Clamp values visually (though dynamic scaling prevents major overhangs)
      let val = pointsToDraw[i];
      if (val > maxVal) val = maxVal;
      if (val < -maxVal) val = -maxVal;
      const y = midY - (val * scale);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    animFrame.current = requestAnimationFrame(drawWaveform);
  }, []);

  useEffect(() => {
    animFrame.current = requestAnimationFrame(drawWaveform);
    return () => cancelAnimationFrame(animFrame.current);
  }, [drawWaveform]);

  // Connect
  const handleConnect = async () => {
    setConnecting(true);
    addLog('Scanning for devices...');
    try {
      const sdkInstance = await NeuroMetaSDK.create({ appKey: 'demo', debug: true });
      sdkRef.current = sdkInstance;

      sdkInstance.deviceManager.onStateChanged = (state: ConnectionState) => {
        if (state === 'disconnected') {
          addLog('Disconnected', 'normal');
          setConnected(false);
          setDeviceName('');
          setBattery(-1);
          setPacketCount(0);
          waveformData.current = [];
          setConnecting(false);
          if (recording) setRecording(false);
        }
      };

      sdkInstance.dataBridge.on('realtime', (batch: FilteredBatch) => {
        const samples = batch.samples;
        for (const val of samples) {
          waveformData.current.push(val);
        }
        if (waveformData.current.length > MAX_POINTS * 2) {
          waveformData.current = waveformData.current.slice(-MAX_POINTS);
        }
        setPacketCount((c) => c + 1);
      });

      // Raw un-filtered data listener
      sdkInstance.dataBridge.on('raw', (batch: any) => {
        const samples = batch.samples || [];
        if (samples.length > 0) {
          const first5 = samples.slice(0, 5).map((x: number) => x.toFixed(1)).join(',');
          addLog(`[RAW] seq=${batch.sequence || 0}, ch=0, data=${first5}`);
        }
      });

      sdkInstance.dataBridge.on('status', (status: DeviceStatus) => {
        setBattery(status.batteryLevel);
        setWear(status.wear);
      });

      const device: Device = await sdkInstance.deviceManager.requestDevice();
      setDeviceName(device.name);
      addLog(`Found: ${device.name}`);

      addLog(`Connecting to ${device.id}...`);
      await sdkInstance.deviceManager.connect(device);

      await sdkInstance.deviceManager.startListening();
      sdkInstance.setFilterConfig(FilterPresets.default());

      addLog('Connected! Starting data stream', 'success');
      setConnected(true);
      setConnecting(false);
    } catch (err: any) {
      addLog(`Connection failed: ${err.message ?? 'Unknown'}`, 'error');
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    addLog('Disconnecting...');
    try {
      const sdk = sdkRef.current;
      if (sdk) {
        await sdk.deviceManager.disconnect();
        sdk.destroy();
        sdkRef.current = null;
      }
    } catch (err: any) {
      addLog(`Disconnect failed: ${err.message}`, 'error');
    }
  };

  const toggleRecording = () => {
    const sdk = sdkRef.current;
    if (!sdk || !connected) return;

    if (recording) {
      addLog('Stopping recording...');
      sdk.stopRecordingAndDownload();
      addLog('Recording stopped');
      setRecording(false);
      setRecordFile('');
    } else {
      const d = new Date();
      const ts = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}${String(d.getSeconds()).padStart(2, '0')}`;
      const fileName = `eeg_${ts}.edf`;
      sdk.startRecording({ channelCount: 1, samplingRate: 250, patientId: '' });
      addLog(`Starting EDF recording: ${fileName}`, 'success');
      setRecordFile(fileName);
      setRecording(true);
    }
  };

  const handleFilterChange = (preset: string) => {
    setFilterPreset(preset);
    const sdk = sdkRef.current;
    if (!sdk) return;

    const presetMap: Record<string, () => FilterConfig> = {
      default: FilterPresets.default,
      china: FilterPresets.china,
      usa: FilterPresets.usa,
      none: FilterPresets.noFilter,
    };

    const factory = presetMap[preset];
    if (factory) {
      sdk.setFilterConfig(factory());
      addLog(`Filter changed to ${preset}`);
    }
  };

  if (!browserOk) {
    return (
      <div className="app">
        <div className="browser-warning">
          <h2>⚠️ Browser Not Supported</h2>
          <p>Web Bluetooth API requires Chrome 56+ or Edge 79+</p>
        </div>
      </div>
    );
  }

  const getBatteryColorClass = () => {
    if (battery > 50) return 'text-green';
    if (battery > 20) return 'text-orange';
    return 'text-red';
  };

  return (
    <div className="app">
      {/* 顶部标题区域 */}
      <div className="header">
        <div className="clock">{timeStr}</div>
        <h1>NEUROMETA</h1>
        <h2>EEG DATA ACQUISITION SDK</h2>
      </div>

      {/* 状态卡片区域 */}
      <div className="status-cards">
        <div className="status-card">
          <div className="status-label">BATTERY</div>
          <div className={`status-value ${getBatteryColorClass()}`}>
            {battery >= 0 ? `${battery}%` : '--'}
          </div>
        </div>
        <div className="status-card">
          <div className="status-label">STATUS</div>
          <div className={`status-value small ${wear ? 'text-green' : 'text-red'}`}>
            {connected ? (wear ? 'WEARING' : 'NOT WORN') : '--'}
          </div>
        </div>
      </div>

      {/* 设备列表区域 */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">DEVICES</div>
          <div className="section-badge">{connected ? '1 FOUND' : '0 FOUND'}</div>
        </div>

        {!connected ? (
          <button
            className="btn btn-primary"
            onClick={handleConnect}
            disabled={connecting}
          >
            {connecting ? 'SCANNING...' : 'SCAN DEVICES'}
          </button>
        ) : (
          <button
            className="btn btn-outline"
            onClick={handleDisconnect}
          >
            DISCONNECT
          </button>
        )}
      </div>

      {/* 实时 EEG 区域 */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">REALTIME EEG</div>
          <div className="text-green" style={{ fontSize: '12px', letterSpacing: '0.05em' }}>
            {connected ? '250 Hz LIVE' : '-- Hz LIVE'}
          </div>
        </div>
        <div className="channel-info">CH1 · FP1</div>
        <canvas ref={canvasRef} width={600} height={200} className="waveform-canvas" />
      </div>



      {/* 控制台日志区域 */}
      <div className="section" style={{ marginBottom: '16px' }}>
        <div className="section-header">
          <div className="section-title">CONSOLE LOG</div>
          <button className="clear-btn" onClick={() => setLogs([])}>CLEAR</button>
        </div>
        <div className="console-log">
          {logs.map((log, i) => (
            <div key={i} className={`log-${log.type}`}>
              [{log.time}] {log.msg}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* Record EDF */}
      <button
        className={`btn btn-record ${recording ? 'recording' : ''}`}
        onClick={toggleRecording}
        disabled={!connected}
      >
        {recording ? 'Stop Recording' : 'Record EDF'}
      </button>
      {recording && (
        <div className="text-green" style={{ fontSize: '12px', textAlign: 'center' }}>
          Recording: {recordFile}
        </div>
      )}

    </div>
  );
}
