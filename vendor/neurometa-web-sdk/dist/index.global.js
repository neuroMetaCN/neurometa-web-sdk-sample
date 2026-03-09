"use strict";
var NeuroMetaSDKBundle = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/eventemitter3/index.js
  var require_eventemitter3 = __commonJS({
    "node_modules/eventemitter3/index.js"(exports, module) {
      "use strict";
      var has = Object.prototype.hasOwnProperty;
      var prefix = "~";
      function Events() {
      }
      if (Object.create) {
        Events.prototype = /* @__PURE__ */ Object.create(null);
        if (!new Events().__proto__) prefix = false;
      }
      function EE(fn, context, once) {
        this.fn = fn;
        this.context = context;
        this.once = once || false;
      }
      function addListener(emitter, event, fn, context, once) {
        if (typeof fn !== "function") {
          throw new TypeError("The listener must be a function");
        }
        var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
        if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
        else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
        else emitter._events[evt] = [emitter._events[evt], listener];
        return emitter;
      }
      function clearEvent(emitter, evt) {
        if (--emitter._eventsCount === 0) emitter._events = new Events();
        else delete emitter._events[evt];
      }
      function EventEmitter2() {
        this._events = new Events();
        this._eventsCount = 0;
      }
      EventEmitter2.prototype.eventNames = function eventNames() {
        var names = [], events, name;
        if (this._eventsCount === 0) return names;
        for (name in events = this._events) {
          if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
        }
        if (Object.getOwnPropertySymbols) {
          return names.concat(Object.getOwnPropertySymbols(events));
        }
        return names;
      };
      EventEmitter2.prototype.listeners = function listeners(event) {
        var evt = prefix ? prefix + event : event, handlers = this._events[evt];
        if (!handlers) return [];
        if (handlers.fn) return [handlers.fn];
        for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
          ee[i] = handlers[i].fn;
        }
        return ee;
      };
      EventEmitter2.prototype.listenerCount = function listenerCount(event) {
        var evt = prefix ? prefix + event : event, listeners = this._events[evt];
        if (!listeners) return 0;
        if (listeners.fn) return 1;
        return listeners.length;
      };
      EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
        var evt = prefix ? prefix + event : event;
        if (!this._events[evt]) return false;
        var listeners = this._events[evt], len = arguments.length, args, i;
        if (listeners.fn) {
          if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
          switch (len) {
            case 1:
              return listeners.fn.call(listeners.context), true;
            case 2:
              return listeners.fn.call(listeners.context, a1), true;
            case 3:
              return listeners.fn.call(listeners.context, a1, a2), true;
            case 4:
              return listeners.fn.call(listeners.context, a1, a2, a3), true;
            case 5:
              return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
            case 6:
              return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
          }
          for (i = 1, args = new Array(len - 1); i < len; i++) {
            args[i - 1] = arguments[i];
          }
          listeners.fn.apply(listeners.context, args);
        } else {
          var length = listeners.length, j;
          for (i = 0; i < length; i++) {
            if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
            switch (len) {
              case 1:
                listeners[i].fn.call(listeners[i].context);
                break;
              case 2:
                listeners[i].fn.call(listeners[i].context, a1);
                break;
              case 3:
                listeners[i].fn.call(listeners[i].context, a1, a2);
                break;
              case 4:
                listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                break;
              default:
                if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                  args[j - 1] = arguments[j];
                }
                listeners[i].fn.apply(listeners[i].context, args);
            }
          }
        }
        return true;
      };
      EventEmitter2.prototype.on = function on(event, fn, context) {
        return addListener(this, event, fn, context, false);
      };
      EventEmitter2.prototype.once = function once(event, fn, context) {
        return addListener(this, event, fn, context, true);
      };
      EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
        var evt = prefix ? prefix + event : event;
        if (!this._events[evt]) return this;
        if (!fn) {
          clearEvent(this, evt);
          return this;
        }
        var listeners = this._events[evt];
        if (listeners.fn) {
          if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
            clearEvent(this, evt);
          }
        } else {
          for (var i = 0, events = [], length = listeners.length; i < length; i++) {
            if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
              events.push(listeners[i]);
            }
          }
          if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
          else clearEvent(this, evt);
        }
        return this;
      };
      EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
        var evt;
        if (event) {
          evt = prefix ? prefix + event : event;
          if (this._events[evt]) clearEvent(this, evt);
        } else {
          this._events = new Events();
          this._eventsCount = 0;
        }
        return this;
      };
      EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
      EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
      EventEmitter2.prefixed = prefix;
      EventEmitter2.EventEmitter = EventEmitter2;
      if ("undefined" !== typeof module) {
        module.exports = EventEmitter2;
      }
    }
  });

  // core/pkg/neurometa_core.js
  var neurometa_core_exports = {};
  __export(neurometa_core_exports, {
    NeuroMetaCore: () => NeuroMetaCore,
    default: () => __wbg_init,
    initSync: () => initSync,
    version: () => version
  });
  function version() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.version(retptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export2(deferred1_0, deferred1_1, 1);
    }
  }
  function __wbg_get_imports() {
    const import0 = {
      __proto__: null,
      __wbg___wbindgen_throw_6ddd609b62940d55: function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
      },
      __wbg_getDate_fbf9a2247e954082: function(arg0) {
        const ret = getObject(arg0).getDate();
        return ret;
      },
      __wbg_getFullYear_f6d84c054eee1543: function(arg0) {
        const ret = getObject(arg0).getFullYear();
        return ret;
      },
      __wbg_getHours_391d39cf9970a985: function(arg0) {
        const ret = getObject(arg0).getHours();
        return ret;
      },
      __wbg_getMinutes_c6b51adde167b27d: function(arg0) {
        const ret = getObject(arg0).getMinutes();
        return ret;
      },
      __wbg_getMonth_884df91d4880455c: function(arg0) {
        const ret = getObject(arg0).getMonth();
        return ret;
      },
      __wbg_getSeconds_53838367bdfd2269: function(arg0) {
        const ret = getObject(arg0).getSeconds();
        return ret;
      },
      __wbg_new_0_1dcafdf5e786e876: function() {
        const ret = /* @__PURE__ */ new Date();
        return addHeapObject(ret);
      },
      __wbg_new_a70fbab9066b301f: function() {
        const ret = new Array();
        return addHeapObject(ret);
      },
      __wbg_new_ab79df5bd7c26067: function() {
        const ret = new Object();
        return addHeapObject(ret);
      },
      __wbg_random_5bb86cae65a45bf6: function() {
        const ret = Math.random();
        return ret;
      },
      __wbg_set_282384002438957f: function(arg0, arg1, arg2) {
        getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
      },
      __wbg_set_6be42768c690e380: function(arg0, arg1, arg2) {
        getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
      },
      __wbindgen_cast_0000000000000001: function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
      },
      __wbindgen_cast_0000000000000002: function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
      },
      __wbindgen_object_clone_ref: function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
      },
      __wbindgen_object_drop_ref: function(arg0) {
        takeObject(arg0);
      }
    };
    return {
      __proto__: null,
      "./neurometa_core_bg.js": import0
    };
  }
  function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];
    heap[idx] = obj;
    return idx;
  }
  function dropObject(idx) {
    if (idx < 1028) return;
    heap[idx] = heap_next;
    heap_next = idx;
  }
  function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
  }
  function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
  }
  function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
      cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
  }
  function getFloat64ArrayMemory0() {
    if (cachedFloat64ArrayMemory0 === null || cachedFloat64ArrayMemory0.byteLength === 0) {
      cachedFloat64ArrayMemory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64ArrayMemory0;
  }
  function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
  }
  function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
      cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
  }
  function getObject(idx) {
    return heap[idx];
  }
  function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
  }
  function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8, 8) >>> 0;
    getFloat64ArrayMemory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
  }
  function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === void 0) {
      const buf = cachedTextEncoder.encode(arg);
      const ptr2 = malloc(buf.length, 1) >>> 0;
      getUint8ArrayMemory0().subarray(ptr2, ptr2 + buf.length).set(buf);
      WASM_VECTOR_LEN = buf.length;
      return ptr2;
    }
    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;
    const mem = getUint8ArrayMemory0();
    let offset = 0;
    for (; offset < len; offset++) {
      const code = arg.charCodeAt(offset);
      if (code > 127) break;
      mem[ptr + offset] = code;
    }
    if (offset !== len) {
      if (offset !== 0) {
        arg = arg.slice(offset);
      }
      ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
      const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
      const ret = cachedTextEncoder.encodeInto(arg, view);
      offset += ret.written;
      ptr = realloc(ptr, len, offset, 1) >>> 0;
    }
    WASM_VECTOR_LEN = offset;
    return ptr;
  }
  function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
  }
  function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
      cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
      cachedTextDecoder.decode();
      numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
  }
  function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedFloat64ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    return wasm;
  }
  async function __wbg_load(module, imports) {
    if (typeof Response === "function" && module instanceof Response) {
      if (typeof WebAssembly.instantiateStreaming === "function") {
        try {
          return await WebAssembly.instantiateStreaming(module, imports);
        } catch (e) {
          const validResponse = module.ok && expectedResponseType(module.type);
          if (validResponse && module.headers.get("Content-Type") !== "application/wasm") {
            console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
          } else {
            throw e;
          }
        }
      }
      const bytes = await module.arrayBuffer();
      return await WebAssembly.instantiate(bytes, imports);
    } else {
      const instance = await WebAssembly.instantiate(module, imports);
      if (instance instanceof WebAssembly.Instance) {
        return { instance, module };
      } else {
        return instance;
      }
    }
    function expectedResponseType(type) {
      switch (type) {
        case "basic":
        case "cors":
        case "default":
          return true;
      }
      return false;
    }
  }
  function initSync(module) {
    if (wasm !== void 0) return wasm;
    if (module !== void 0) {
      if (Object.getPrototypeOf(module) === Object.prototype) {
        ({ module } = module);
      } else {
        console.warn("using deprecated parameters for `initSync()`; pass a single object instead");
      }
    }
    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
      module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
  }
  async function __wbg_init(module_or_path) {
    if (wasm !== void 0) return wasm;
    if (module_or_path !== void 0) {
      if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
        ({ module_or_path } = module_or_path);
      } else {
        console.warn("using deprecated parameters for the initialization function; pass a single object instead");
      }
    }
    if (module_or_path === void 0) {
      module_or_path = new URL("neurometa_core_bg.wasm", import_meta.url);
    }
    const imports = __wbg_get_imports();
    if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) {
      module_or_path = fetch(module_or_path);
    }
    const { instance, module } = await __wbg_load(await module_or_path, imports);
    return __wbg_finalize_init(instance, module);
  }
  var import_meta, NeuroMetaCore, NeuroMetaCoreFinalization, cachedDataViewMemory0, cachedFloat64ArrayMemory0, cachedUint8ArrayMemory0, heap, heap_next, cachedTextDecoder, MAX_SAFARI_DECODE_BYTES, numBytesDecoded, cachedTextEncoder, WASM_VECTOR_LEN, wasmModule, wasm;
  var init_neurometa_core = __esm({
    "core/pkg/neurometa_core.js"() {
      "use strict";
      import_meta = {};
      NeuroMetaCore = class {
        __destroy_into_raw() {
          const ptr = this.__wbg_ptr;
          this.__wbg_ptr = 0;
          NeuroMetaCoreFinalization.unregister(this);
          return ptr;
        }
        free() {
          const ptr = this.__destroy_into_raw();
          wasm.__wbg_neurometacore_free(ptr, 0);
        }
        /**
         * @param {Float64Array} samples
         * @returns {any}
         */
        add_filtered_samples(samples) {
          const ptr0 = passArrayF64ToWasm0(samples, wasm.__wbindgen_export);
          const len0 = WASM_VECTOR_LEN;
          const ret = wasm.neurometacore_add_filtered_samples(this.__wbg_ptr, ptr0, len0);
          return takeObject(ret);
        }
        /**
         * 应用全部滤波
         * @param {Float64Array} data
         * @returns {Float64Array}
         */
        apply_all_filters(data) {
          try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_export);
            const len0 = WASM_VECTOR_LEN;
            wasm.neurometacore_apply_all_filters(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v2 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 8, 8);
            return v2;
          } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
          }
        }
        /**
         * @param {Float64Array} data
         * @returns {Float64Array}
         */
        apply_bandpass(data) {
          try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_export);
            const len0 = WASM_VECTOR_LEN;
            wasm.neurometacore_apply_bandpass(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v2 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 8, 8);
            return v2;
          } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
          }
        }
        /**
         * @param {Float64Array} data
         * @returns {Float64Array}
         */
        apply_notch(data) {
          try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_export);
            const len0 = WASM_VECTOR_LEN;
            wasm.neurometacore_apply_notch(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v2 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 8, 8);
            return v2;
          } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
          }
        }
        /**
         * 创建开发 License JSON
         * @param {string} origin
         * @returns {string}
         */
        static create_dev_license(origin) {
          let deferred2_0;
          let deferred2_1;
          try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(origin, wasm.__wbindgen_export, wasm.__wbindgen_export3);
            const len0 = WASM_VECTOR_LEN;
            wasm.neurometacore_create_dev_license(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred2_0 = r0;
            deferred2_1 = r1;
            return getStringFromWasm0(r0, r1);
          } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export2(deferred2_0, deferred2_1, 1);
          }
        }
        /**
         * @param {Float64Array} samples
         */
        feed_edf(samples) {
          const ptr0 = passArrayF64ToWasm0(samples, wasm.__wbindgen_export);
          const len0 = WASM_VECTOR_LEN;
          wasm.neurometacore_feed_edf(this.__wbg_ptr, ptr0, len0);
        }
        /**
         * @returns {any}
         */
        flush_filtered() {
          const ret = wasm.neurometacore_flush_filtered(this.__wbg_ptr);
          return takeObject(ret);
        }
        /**
         * @param {Float64Array} data
         * @returns {number}
         */
        static get_amplitude(data) {
          const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_export);
          const len0 = WASM_VECTOR_LEN;
          const ret = wasm.neurometacore_get_amplitude(ptr0, len0);
          return ret;
        }
        /**
         * @returns {string}
         */
        get_data_char_uuid() {
          let deferred1_0;
          let deferred1_1;
          try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.neurometacore_get_data_char_uuid(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
          } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export2(deferred1_0, deferred1_1, 1);
          }
        }
        /**
         * @returns {string}
         */
        get_preset_char_uuid() {
          let deferred1_0;
          let deferred1_1;
          try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.neurometacore_get_preset_char_uuid(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
          } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export2(deferred1_0, deferred1_1, 1);
          }
        }
        /**
         * @param {Float64Array} data
         * @returns {number}
         */
        static get_rms(data) {
          const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_export);
          const len0 = WASM_VECTOR_LEN;
          const ret = wasm.neurometacore_get_rms(ptr0, len0);
          return ret;
        }
        /**
         * @returns {string}
         */
        get_service_uuid() {
          let deferred1_0;
          let deferred1_1;
          try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.neurometacore_get_service_uuid(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
          } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export2(deferred1_0, deferred1_1, 1);
          }
        }
        /**
         * @returns {Uint8Array}
         */
        get_start_command() {
          try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.neurometacore_get_start_command(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
          } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
          }
        }
        /**
         * @returns {boolean}
         */
        is_recording_edf() {
          const ret = wasm.neurometacore_is_recording_edf(this.__wbg_ptr);
          return ret !== 0;
        }
        constructor() {
          const ret = wasm.neurometacore_new();
          this.__wbg_ptr = ret >>> 0;
          NeuroMetaCoreFinalization.register(this, this.__wbg_ptr, this);
          return this;
        }
        /**
         * 解析原始 BLE 数据
         * 返回 JSON: { samples: number[], battery: number, wear: boolean, sequence: number }
         * @param {Uint8Array} data
         * @returns {any}
         */
        parse_raw_data(data) {
          const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_export);
          const len0 = WASM_VECTOR_LEN;
          const ret = wasm.neurometacore_parse_raw_data(this.__wbg_ptr, ptr0, len0);
          return takeObject(ret);
        }
        reset_filtered() {
          wasm.neurometacore_reset_filtered(this.__wbg_ptr);
        }
        /**
         * 重置解析器
         */
        reset_parser() {
          wasm.neurometacore_reset_parser(this.__wbg_ptr);
        }
        /**
         * 设置是否允许开发 License
         * @param {boolean} allow
         */
        set_allow_dev_license(allow) {
          wasm.neurometacore_set_allow_dev_license(this.__wbg_ptr, allow);
        }
        /**
         * 设置滤波配置 JSON
         * { enabled, lowpassFrequency, highpassFrequency, notchEnabled, notchFrequency, sampleRate }
         * @param {string} json
         */
        set_filter_config(json) {
          const ptr0 = passStringToWasm0(json, wasm.__wbindgen_export, wasm.__wbindgen_export3);
          const len0 = WASM_VECTOR_LEN;
          wasm.neurometacore_set_filter_config(this.__wbg_ptr, ptr0, len0);
        }
        /**
         * @param {number} channel_count
         * @param {number} sampling_rate
         * @param {string} patient_id
         */
        start_edf(channel_count, sampling_rate, patient_id) {
          const ptr0 = passStringToWasm0(patient_id, wasm.__wbindgen_export, wasm.__wbindgen_export3);
          const len0 = WASM_VECTOR_LEN;
          wasm.neurometacore_start_edf(this.__wbg_ptr, channel_count, sampling_rate, ptr0, len0);
        }
        /**
         * 停止 EDF 录制 → 返回完整 EDF 字节数组
         * @returns {Uint8Array}
         */
        stop_edf() {
          try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.neurometacore_stop_edf(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
          } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
          }
        }
        /**
         * 验证 License JSON
         * 返回: 0=成功, 1=签名无效, 2=域名不匹配, 3=过期
         * @param {string} json
         * @param {string} origin
         * @returns {number}
         */
        validate_license(json, origin) {
          const ptr0 = passStringToWasm0(json, wasm.__wbindgen_export, wasm.__wbindgen_export3);
          const len0 = WASM_VECTOR_LEN;
          const ptr1 = passStringToWasm0(origin, wasm.__wbindgen_export, wasm.__wbindgen_export3);
          const len1 = WASM_VECTOR_LEN;
          const ret = wasm.neurometacore_validate_license(this.__wbg_ptr, ptr0, len0, ptr1, len1);
          return ret;
        }
      };
      if (Symbol.dispose) NeuroMetaCore.prototype[Symbol.dispose] = NeuroMetaCore.prototype.free;
      NeuroMetaCoreFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
      }, unregister: () => {
      } } : new FinalizationRegistry((ptr) => wasm.__wbg_neurometacore_free(ptr >>> 0, 1));
      cachedDataViewMemory0 = null;
      cachedFloat64ArrayMemory0 = null;
      cachedUint8ArrayMemory0 = null;
      heap = new Array(1024).fill(void 0);
      heap.push(void 0, null, true, false);
      heap_next = heap.length;
      cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
      cachedTextDecoder.decode();
      MAX_SAFARI_DECODE_BYTES = 2146435072;
      numBytesDecoded = 0;
      cachedTextEncoder = new TextEncoder();
      if (!("encodeInto" in cachedTextEncoder)) {
        cachedTextEncoder.encodeInto = function(arg, view) {
          const buf = cachedTextEncoder.encode(arg);
          view.set(buf);
          return {
            read: arg.length,
            written: buf.length
          };
        };
      }
      WASM_VECTOR_LEN = 0;
    }
  });

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    BLEConnector: () => BLEConnector,
    BLEScanner: () => BLEScanner,
    DataBridge: () => DataBridge,
    DeviceManager: () => DeviceManager,
    FilterPresets: () => FilterPresets,
    NeuroMetaSDK: () => NeuroMetaSDK,
    SDKError: () => SDKError,
    SDKErrorCode: () => SDKErrorCode
  });

  // node_modules/eventemitter3/index.mjs
  var import_index = __toESM(require_eventemitter3(), 1);
  var eventemitter3_default = import_index.default;

  // src/data/DataBridge.ts
  var DataBridge = class extends eventemitter3_default {
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
      const filteredPacket = __spreadProps(__spreadValues({}, packet), {
        samples: Array.from(filteredSamples)
      });
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
      a.download = filename != null ? filename : `eeg_${Date.now()}.edf`;
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
      var _a;
      if (!navigator.bluetooth) {
        throw new SDKError(
          3e3 /* BLUETOOTH_NOT_SUPPORTED */,
          "Web Bluetooth API \u4E0D\u652F\u6301\uFF0C\u8BF7\u4F7F\u7528 Chrome/Edge \u6D4F\u89C8\u5668"
        );
      }
      const serviceUUID = this.core.get_service_uuid();
      const options = (nameFilters == null ? void 0 : nameFilters.length) ? {
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
          name: (_a = btDevice.name) != null ? _a : "Unknown",
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
      var _a;
      if (!device.gatt) {
        throw new SDKError(3005 /* CONNECTION_FAILED */, "GATT \u4E0D\u53EF\u7528");
      }
      device.addEventListener("gattserverdisconnected", () => {
        var _a2;
        this._connected = false;
        (_a2 = this.onDisconnected) == null ? void 0 : _a2.call(this);
      });
      this.server = await device.gatt.connect();
      const serviceUUID = this.core.get_service_uuid();
      const service = await this.server.getPrimaryService(serviceUUID);
      const dataCharUUID = this.core.get_data_char_uuid();
      const presetCharUUID = this.core.get_preset_char_uuid();
      this.dataChar = await service.getCharacteristic(dataCharUUID);
      try {
        this.presetChar = await service.getCharacteristic(presetCharUUID);
      } catch (e) {
        console.warn("[BLEConnector] Preset \u7279\u5F81\u672A\u627E\u5230");
      }
      this._connected = true;
      (_a = this.onConnected) == null ? void 0 : _a.call(this);
    }
    async disconnect() {
      var _a;
      (_a = this.server) == null ? void 0 : _a.disconnect();
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
          var _a;
          const char = event.target;
          if (char.value) {
            (_a = this.onDataReceived) == null ? void 0 : _a.call(this, char.value);
          }
        }
      );
      await this.dataChar.startNotifications();
    }
    async disableNotification() {
      var _a;
      await ((_a = this.dataChar) == null ? void 0 : _a.stopNotifications());
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
      const target = device != null ? device : this._device;
      if (!(target == null ? void 0 : target.bluetoothDevice)) {
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
      var _a;
      if (this._state !== state) {
        this._state = state;
        (_a = this.onStateChanged) == null ? void 0 : _a.call(this, state);
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
      var _a, _b;
      let wasmModule2;
      try {
        wasmModule2 = await Promise.resolve().then(() => (init_neurometa_core(), neurometa_core_exports));
        const initFn = typeof wasmModule2.default === "function" ? wasmModule2.default : typeof wasmModule2.init === "function" ? wasmModule2.init : null;
        if (initFn) {
          await initFn(config.wasmUrl ? config.wasmUrl : void 0);
        }
      } catch (err) {
        throw new SDKError(
          1e3 /* INIT_FAILED */,
          `WASM \u6A21\u5757\u52A0\u8F7D\u5931\u8D25: ${err.message}`
        );
      }
      const core = new wasmModule2.NeuroMetaCore();
      const sdk = new _NeuroMetaSDK(core);
      if (config.debug) {
        core.set_allow_dev_license(true);
      }
      const origin = (_b = (_a = globalThis.location) == null ? void 0 : _a.origin) != null ? _b : "";
      const licenseJson = wasmModule2.NeuroMetaCore.create_dev_license(origin);
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
      var _a, _b, _c;
      this.core.start_edf(
        (_a = config == null ? void 0 : config.channelCount) != null ? _a : 1,
        (_b = config == null ? void 0 : config.samplingRate) != null ? _b : 250,
        (_c = config == null ? void 0 : config.patientId) != null ? _c : ""
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
  return __toCommonJS(index_exports);
})();
