/**
 * NeuroMeta Web SDK Demo — ES5 兼容版
 *
 * 所有代码使用 ES5 语法:
 *   - var (无 let/const)
 *   - function (无箭头函数)
 *   - Promise.then (无 async/await)
 *   - 字符串拼接 (无模板字面量)
 *
 * 依赖全局变量 NeuroMetaSDKBundle (由 index.global.js 提供)
 */

/* ========== 全局引用 ========== */
var NM = NeuroMetaSDKBundle;
var NeuroMetaSDK = NM.NeuroMetaSDK;
var FilterPresets = NM.FilterPresets;

/* ========== 状态 ========== */
var sdk = null;
var connected = false;
var connecting = false;
var recording = false;
var recordFile = '';
var waveformData = [];
var MAX_POINTS = 250;
var animFrame = 0;

/* ========== DOM 引用 ========== */
var clockEl = document.getElementById('clock');
var batteryEl = document.getElementById('battery');
var wearEl = document.getElementById('wearStatus');
var deviceCountEl = document.getElementById('deviceCount');
var connectBtn = document.getElementById('connectBtn');
var sampleRateEl = document.getElementById('sampleRate');
var canvas = document.getElementById('waveform');
var consoleLogEl = document.getElementById('consoleLog');
var recordBtn = document.getElementById('recordBtn');
var recordInfoEl = document.getElementById('recordInfo');

/* ========== 时钟 ========== */
function updateClock() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    clockEl.textContent = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}
updateClock();
setInterval(updateClock, 1000);

/* ========== 浏览器检查 ========== */
if (!navigator.bluetooth) {
    document.getElementById('root').innerHTML =
        '<div class="browser-warning">' +
        '<h2>⚠️ Browser Not Supported</h2>' +
        '<p>Web Bluetooth API requires Chrome 56+ or Edge 79+</p>' +
        '</div>';
}

/* ========== 日志 ========== */
function addLog(msg, type) {
    type = type || 'normal';
    var d = new Date();
    var time = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' +
        (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ':' +
        (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
    var div = document.createElement('div');
    div.className = 'log-' + type;
    div.textContent = '[' + time + '] ' + msg;
    consoleLogEl.appendChild(div);
    consoleLogEl.scrollTop = consoleLogEl.scrollHeight;
}

function clearLogs() {
    consoleLogEl.innerHTML = '';
}

/* ========== 波形绘制 ========== */
function drawWaveform() {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var w = canvas.width;
    var h = canvas.height;
    var midY = h / 2;
    var data = waveformData;

    // 背景
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, w, h);

    // 网格
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    var yi, xi;
    for (yi = 0; yi <= h; yi += h / 8) {
        ctx.beginPath();
        ctx.moveTo(0, yi);
        ctx.lineTo(w, yi);
        ctx.stroke();
    }
    for (xi = 0; xi <= w; xi += w / 10) {
        ctx.beginPath();
        ctx.moveTo(xi, 0);
        ctx.lineTo(xi, h);
        ctx.stroke();
    }

    if (data.length < 2) {
        animFrame = requestAnimationFrame(drawWaveform);
        return;
    }

    // 绘制
    var step = w / MAX_POINTS;
    var pts = data.slice(-MAX_POINTS);
    var maxVal = 200;
    var i, absVal;
    for (i = 0; i < pts.length; i++) {
        absVal = Math.abs(pts[i]);
        if (absVal > maxVal) maxVal = absVal;
    }
    var scale = (h / 2) / maxVal;

    ctx.beginPath();
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 1;

    for (i = 0; i < pts.length; i++) {
        var x = i * step;
        var val = pts[i];
        if (val > maxVal) val = maxVal;
        if (val < -maxVal) val = -maxVal;
        var y = midY - (val * scale);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();

    animFrame = requestAnimationFrame(drawWaveform);
}

animFrame = requestAnimationFrame(drawWaveform);

/* ========== UI 更新 ========== */
function updateUI() {
    if (connected) {
        connectBtn.className = 'btn btn-outline';
        connectBtn.textContent = 'DISCONNECT';
        connectBtn.onclick = handleDisconnect;
        connectBtn.disabled = false;
        deviceCountEl.textContent = '1 FOUND';
        sampleRateEl.textContent = '250 Hz LIVE';
        recordBtn.disabled = false;
    } else {
        connectBtn.className = 'btn btn-primary';
        connectBtn.textContent = connecting ? 'SCANNING...' : 'SCAN DEVICES';
        connectBtn.onclick = handleConnect;
        connectBtn.disabled = connecting;
        deviceCountEl.textContent = '0 FOUND';
        sampleRateEl.textContent = '-- Hz LIVE';
        batteryEl.textContent = '--';
        batteryEl.className = 'status-value';
        wearEl.textContent = '--';
        wearEl.className = 'status-value small';
        recordBtn.disabled = true;
    }
}

function updateBattery(level) {
    batteryEl.textContent = level >= 0 ? level + '%' : '--';
    if (level > 50) {
        batteryEl.className = 'status-value text-green';
    } else if (level > 20) {
        batteryEl.className = 'status-value text-orange';
    } else {
        batteryEl.className = 'status-value text-red';
    }
}

function updateWear(isWearing) {
    if (connected) {
        wearEl.textContent = isWearing ? 'WEARING' : 'NOT WORN';
        wearEl.className = 'status-value small ' + (isWearing ? 'text-green' : 'text-red');
    }
}

/* ========== 连接 ========== */
function handleConnect() {
    connecting = true;
    updateUI();
    addLog('Scanning for devices...');

    NeuroMetaSDK.create({ appKey: 'demo', debug: true, wasmUrl: 'vendor/neurometa-web-sdk/dist/neurometa_core_bg.wasm' })
        .then(function (sdkInstance) {
            sdk = sdkInstance;

            // 连接状态回调
            sdk.deviceManager.onStateChanged = function (state) {
                if (state === 'disconnected') {
                    addLog('Disconnected');
                    connected = false;
                    connecting = false;
                    waveformData = [];
                    if (recording) {
                        recording = false;
                    }
                    updateUI();
                }
            };

            // 实时数据
            sdk.dataBridge.on('realtime', function (batch) {
                var samples = batch.samples;
                var j;
                for (j = 0; j < samples.length; j++) {
                    waveformData.push(samples[j]);
                }
                if (waveformData.length > MAX_POINTS * 2) {
                    waveformData = waveformData.slice(-MAX_POINTS);
                }
            });

            // 原始数据日志
            sdk.dataBridge.on('raw', function (batch) {
                var samples = batch.samples || [];
                if (samples.length > 0) {
                    var first5 = samples.slice(0, 5).map(function (x) {
                        return x.toFixed(1);
                    }).join(',');
                    addLog('[RAW] seq=' + (batch.sequence || 0) + ', ch=0, data=' + first5);
                }
            });

            // 设备状态
            sdk.dataBridge.on('status', function (status) {
                updateBattery(status.batteryLevel);
                updateWear(status.wear);
            });

            // 扫描设备
            return sdk.deviceManager.requestDevice();
        })
        .then(function (device) {
            addLog('Found: ' + device.name);
            addLog('Connecting to ' + device.id + '...');
            return sdk.deviceManager.connect(device)
                .then(function () { return device; });
        })
        .then(function () {
            return sdk.deviceManager.startListening();
        })
        .then(function () {
            sdk.setFilterConfig(FilterPresets.default());
            addLog('Connected! Starting data stream', 'success');
            connected = true;
            connecting = false;
            updateUI();
        })
        .catch(function (err) {
            addLog('Connection failed: ' + (err.message || 'Unknown'), 'error');
            connecting = false;
            updateUI();
        });
}

/* ========== 断开 ========== */
function handleDisconnect() {
    addLog('Disconnecting...');
    if (!sdk) return;
    sdk.deviceManager.disconnect()
        .then(function () {
            sdk.destroy();
            sdk = null;
            connected = false;
            updateUI();
        })
        .catch(function (err) {
            addLog('Disconnect failed: ' + err.message, 'error');
        });
}

/* ========== 录制 ========== */
function toggleRecording() {
    if (!sdk || !connected) return;

    if (recording) {
        addLog('Stopping recording...');
        sdk.stopRecordingAndDownload();
        addLog('Recording stopped');
        recording = false;
        recordBtn.textContent = 'Record EDF';
        recordBtn.classList.remove('recording');
        recordInfoEl.style.display = 'none';
    } else {
        var d = new Date();
        var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
        var ts = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) +
            '_' + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
        var fileName = 'eeg_' + ts + '.edf';
        sdk.startRecording({ channelCount: 1, samplingRate: 250, patientId: '' });
        addLog('Starting EDF recording: ' + fileName, 'success');
        recordFile = fileName;
        recording = true;
        recordBtn.textContent = 'Stop Recording';
        recordBtn.classList.add('recording');
        recordInfoEl.textContent = 'Recording: ' + fileName;
        recordInfoEl.style.display = 'block';
    }
}
