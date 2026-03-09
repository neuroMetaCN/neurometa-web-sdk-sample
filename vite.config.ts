import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve(__dirname);
const sdkRoot = realpathSync(resolve(__dirname, 'node_modules/@neurometa/web-sdk'));

export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  server: {
    port: 5173,
    fs: {
      allow: [projectRoot, sdkRoot],
    },
    // Web Bluetooth requires HTTPS in production, localhost is fine for dev
  },
  optimizeDeps: {
    exclude: ['@neurometa/web-sdk'],
  },
});
