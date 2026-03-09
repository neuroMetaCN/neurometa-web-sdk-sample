import { mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const sdkRoots = [
  path.join(projectRoot, 'node_modules', '@neurometa', 'web-sdk'),
  path.join(projectRoot, 'vendor', 'neurometa-web-sdk'),
];

function firstExisting(paths) {
  for (const filePath of paths) {
    if (existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}

const wasmCandidates = sdkRoots.flatMap((sdkRoot) => [
  path.join(sdkRoot, 'dist', 'neurometa_core_bg.wasm'),
  path.join(sdkRoot, 'core', 'pkg', 'neurometa_core_bg.wasm'),
]);

const sourceWasm = firstExisting(wasmCandidates);
if (!sourceWasm) {
  const checked = wasmCandidates.map((p) => `  - ${p}`).join('\n');
  throw new Error(
    `Cannot find neurometa_core_bg.wasm. Checked:\n${checked}\n` +
      'Run npm install first and ensure vendor/neurometa-web-sdk is complete.'
  );
}

const publicAssetsDir = path.join(projectRoot, 'public', 'assets');
const publicWasm = path.join(publicAssetsDir, 'neurometa_core_bg.wasm');
await mkdir(publicAssetsDir, { recursive: true });
await copyFile(sourceWasm, publicWasm);

const nodeDistWasm = path.join(projectRoot, 'node_modules', '@neurometa', 'web-sdk', 'dist', 'neurometa_core_bg.wasm');
const nodeCorePkgWasm = path.join(projectRoot, 'node_modules', '@neurometa', 'web-sdk', 'core', 'pkg', 'neurometa_core_bg.wasm');

if (!existsSync(nodeDistWasm) && existsSync(nodeCorePkgWasm)) {
  await mkdir(path.dirname(nodeDistWasm), { recursive: true });
  await copyFile(nodeCorePkgWasm, nodeDistWasm);
}

console.log(`[prepare:wasm] copied ${path.relative(projectRoot, sourceWasm)} -> ${path.relative(projectRoot, publicWasm)}`);
