# MCP Sidecar Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local MCP server to WebBZEdit so an AI assistant can read and edit the current map through the Tauri desktop build, using a Node/Bun sidecar for the MCP transport.

**Architecture:** The Tauri Rust backend starts a localhost WebSocket server and writes a small info file with the dynamic port and auth token. The sidecar is configured as the user's MCP server command (e.g., in Claude Desktop); it reads the info file, connects to the WebSocket, and exposes MCP tools over stdio. Tool requests are forwarded to the React frontend through Tauri events; the frontend executes them via a `DocumentController` and returns the result through a Tauri command.

**Tech Stack:** Tauri v2, React 17, Recoil 0.4, TypeScript, Node 18+, `@modelcontextprotocol/sdk`, `tokio-tungstenite`, `ws`, `esbuild`.

**Spec:** This plan implements the Node/Bun sidecar option selected in the design discussion.

## Global Constraints

- Tauri v2 with a manual WebSocket bridge (no Tauri sidecar spawning).
- MCP server runs as a separate Node/Bun process spawned by the AI client.
- The WebSocket binds to `127.0.0.1:0` (random port) and requires a single-use token.
- The app writes `mcp-info.json` to the platform app-data directory; the sidecar reads the same path.
- No browser MCP support in this branch.
- All document mutations stay in the existing TypeScript/Recoil frontend.
- Keep the existing file-I/O and UI flows unchanged.

---

### Task 1: Add Tauri skeleton and WebSocket bridge

**Files:**

- Modify: `package.json`
- Create: `src-tauri/Cargo.toml`
- Create: `src-tauri/tauri.conf.json`
- Create: `src-tauri/build.rs`
- Create: `src-tauri/src/main.rs`
- Create: `src-tauri/icons/.gitkeep` (placeholder; real icons come from `tauri icon`)

**Interfaces:**

- Consumes: none
- Produces: Tauri app that starts a WebSocket server and exposes the `mcp_tool_response` command + `mcp_request` event.

- [ ] **Step 1: Add Tauri CLI dev dependency and scripts**

Modify `package.json`:

```json
{
  "scripts": {
    "tauri": "tauri",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2.0.0"
  }
}
```

Run `npm install`.

- [ ] **Step 2: Scaffold the Tauri Rust project**

Run:

```bash
npx tauri init --app-name web-bzedit --window-title WebBZEdit --dist-dir ../build --dev-path http://localhost:3000
```

Accept defaults if prompted. This creates `src-tauri/` with default icons and a starter `main.rs`.

- [ ] **Step 3: Replace `src-tauri/Cargo.toml`**

```toml
[package]
name = "web-bzedit"
version = "0.1.0"
description = "A web-based BZFlag map editor"
authors = ["you"]
edition = "2021"

[build-dependencies]
tauri-build = { version = "2.0.0", features = [] }

[dependencies]
tauri = { version = "2.0.0", features = [] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }
tokio-tungstenite = "0.24"
futures-util = "0.3"
uuid = { version = "1", features = ["v4"] }

[features]
default = ["custom-protocol"]
custom-protocol = ["tauri/custom-protocol"]
```

- [ ] **Step 4: Replace `src-tauri/tauri.conf.json`**

```json
{
  "productName": "WebBZEdit",
  "identifier": "com.webbzedit.app",
  "build": {
    "frontendDist": "../build",
    "devUrl": "http://localhost:3000",
    "beforeDevCommand": "npm run start",
    "beforeBuildCommand": "npm run build"
  },
  "app": {
    "windows": [
      {
        "title": "WebBZEdit",
        "width": 1280,
        "height": 800,
        "resizable": true,
        "fullscreen": false
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```

- [ ] **Step 5: Replace `src-tauri/build.rs`**

```rust
fn main() {
    tauri_build::build()
}
```

- [ ] **Step 6: Replace `src-tauri/src/main.rs`**

```rust
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;
use std::net::SocketAddr;
use std::path::PathBuf;
use std::sync::Arc;

use futures_util::{SinkExt, StreamExt};
use serde_json::Value;
use tauri::{AppHandle, Manager, State};
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::Mutex;
use tokio_tungstenite::{accept_async, tungstenite::Message, WebSocketStream};
use uuid::Uuid;

type WsSink = futures_util::stream::SplitSink<WebSocketStream<TcpStream>, Message>;

#[derive(Default)]
struct McpStateInner {
    sink: Option<WsSink>,
}

struct McpState {
    inner: Arc<Mutex<McpStateInner>>,
    info_path: PathBuf,
    token: String,
}

impl McpState {
    fn new(info_path: PathBuf) -> Self {
        Self {
            inner: Arc::new(Mutex::new(McpStateInner::default())),
            info_path,
            token: Uuid::new_v4().to_string(),
        }
    }
}

#[tauri::command]
async fn mcp_tool_response(
    state: State<'_, McpState>,
    id: String,
    response: Value,
) -> Result<(), String> {
    let mut guard = state.inner.lock().await;
    let sink = guard.sink.as_mut().ok_or("no active mcp connection")?;
    let payload = serde_json::json!({
        "requestId": id,
        "response": response,
    });
    sink.send(Message::Text(payload.to_string()))
        .await
        .map_err(|e| e.to_string())
}

async fn write_info_file(path: &PathBuf, port: u16, token: &str) -> Result<(), std::io::Error> {
    let payload = serde_json::json!({
        "port": port,
        "token": token,
        "pid": std::process::id(),
    });
    if let Some(parent) = path.parent() {
        tokio::fs::create_dir_all(parent).await?;
    }
    tokio::fs::write(path, payload.to_string()).await
}

async fn remove_info_file(path: &PathBuf) {
    let _ = tokio::fs::remove_file(path).await;
}

async fn run_mcp_server(app_handle: AppHandle, state: Arc<McpState>) {
    let listener = TcpListener::bind("127.0.0.1:0").await.expect("bind mcp socket");
    let port = listener.local_addr().expect("local addr").port();

    if let Err(e) = write_info_file(&state.info_path, port, &state.token).await {
        eprintln!("failed to write mcp info file: {}", e);
        return;
    }

    println!("mcp bridge listening on ws://127.0.0.1:{}", port);

    while let Ok((stream, _)) = listener.accept().await {
        let token = state.token.clone();
        let inner = state.inner.clone();
        let app_handle = app_handle.clone();

        tokio::spawn(async move {
            let ws = accept_async(stream).await.ok()?;
            let (mut sink, mut stream) = ws.split();

            // Validate token from first message
            let first = stream.next().await?;
            let Message::Text(text) = first else { return None; };
            let Ok(auth) = serde_json::from_str::<Value>(&text) else { return None; };
            if auth.get("token").and_then(Value::as_str) != Some(&token) {
                let _ = sink.send(Message::Text(
                    serde_json::json!({"error":"invalid token"}).to_string()
                )).await;
                return None;
            }

            // Replace any previous connection
            {
                let mut guard = inner.lock().await;
                guard.sink = Some(sink);
            }

            // Forward incoming tool requests to the frontend
            while let Some(Ok(msg)) = stream.next().await {
                if let Message::Text(text) = msg {
                    if let Ok(value) = serde_json::from_str::<Value>(&text) {
                        let _ = app_handle.emit("mcp_request", value);
                    }
                }
            }

            // Connection closed; clear sink
            let mut guard = inner.lock().await;
            guard.sink = None;
            Some(())
        });
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![mcp_tool_response])
        .setup(|app| {
            let info_path = app.path().app_data_dir().expect("app data dir").join("mcp-info.json");
            let state = Arc::new(McpState::new(info_path));
            let app_handle = app.handle().clone();
            let state_clone = state.clone();

            tauri::async_runtime::spawn(async move {
                run_mcp_server(app_handle, state_clone).await;
            });

            app.manage(state);
            Ok(())
        })
        .on_window_event(|app, event| {
            if let tauri::WindowEvent::Destroyed = event {
                let state = app.state::<Arc<McpState>>();
                let path = state.info_path.clone();
                tauri::async_runtime::spawn(async move {
                    remove_info_file(&path).await;
                });
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

- [ ] **Step 7: Verify Rust project compiles**

Run:

```bash
cargo check
```

Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add package.json src-tauri/
git commit -m "feat: add Tauri skeleton with MCP WebSocket bridge"
```

---

### Task 2: Create the Node/Bun MCP sidecar package

**Files:**

- Create: `mcp-sidecar/package.json`
- Create: `mcp-sidecar/tsconfig.json`
- Create: `mcp-sidecar/src/protocol.ts`
- Create: `mcp-sidecar/src/infoFile.ts`
- Create: `mcp-sidecar/src/tools.ts`
- Create: `mcp-sidecar/src/server.ts`
- Create: `mcp-sidecar/src/index.ts`
- Create: `mcp-sidecar/jest.config.js`
- Create: `mcp-sidecar/src/__tests__/infoFile.test.ts`

**Interfaces:**

- Consumes: none
- Produces: a runnable `dist/index.cjs` that speaks MCP over stdio and WebSocket.

- [ ] **Step 1: Write `mcp-sidecar/package.json`**

```json
{
  "name": "@webbzedit/mcp-sidecar",
  "version": "0.1.0",
  "private": true,
  "main": "dist/index.cjs",
  "bin": {
    "webbzedit-mcp": "dist/index.cjs"
  },
  "scripts": {
    "build": "esbuild src/index.ts --bundle --platform=node --target=node18 --outfile=dist/index.cjs --format=cjs",
    "test": "jest"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "ws": "^8.18.0"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/node": "^18.0.0",
    "@types/ws": "^8.5.0",
    "esbuild": "^0.24.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.0",
    "typescript": "^5.6.0"
  },
  "engines": {
    "node": ">=18"
  }
}
```

- [ ] **Step 2: Write `mcp-sidecar/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Write `mcp-sidecar/jest.config.js`**

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
};
```

- [ ] **Step 4: Write `mcp-sidecar/src/protocol.ts`**

```typescript
export interface McpInfoFile {
  port: number;
  token: string;
  pid: number;
}

export interface McpToolRequest {
  requestId: string;
  tool: string;
  arguments: Record<string, unknown>;
}

export interface McpToolResponse {
  requestId: string;
  response: { ok: true; result: unknown } | { ok: false; error: string };
}
```

- [ ] **Step 5: Write `mcp-sidecar/src/infoFile.ts`**

```typescript
import fs from 'fs';
import os from 'os';
import path from 'path';
import { McpInfoFile } from './protocol';
export function getMcpInfoPath(): string {
  const home = os.homedir();
  switch (process.platform) {
    case 'win32':
      return path.join(
        process.env.LOCALAPPDATA || home,
        'WebBZEdit',
        'mcp-info.json',
      );
    case 'darwin':
      return path.join(
        home,
        'Library',
        'Application Support',
        'WebBZEdit',
        'mcp-info.json',
      );
    default:
      return path.join(
        process.env.XDG_DATA_HOME || path.join(home, '.local', 'share'),
        'WebBZEdit',
        'mcp-info.json',
      );
  }
}
export function readMcpInfo(): McpInfoFile {
  const raw = fs.readFileSync(getMcpInfoPath(), 'utf-8');
  return JSON.parse(raw) as McpInfoFile;
}
```

- [ ] **Step 6: Write `mcp-sidecar/src/tools.ts`**

```typescript
export const tools = [
  {
    name: 'get_document_state',
    description: 'Return the current document as JSON.',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'load_document',
    description: 'Load a BZW document from a string.',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Raw BZW content' },
      },
      required: ['content'],
    },
  },
  {
    name: 'export_document',
    description: 'Export the current document as a BZW string.',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'create_object',
    description: 'Create a new obstacle or options block.',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description:
            'Object type: box, pyramid, base, zone, teleporter, link, material, mesh, texturematrix, options',
        },
        properties: { type: 'object' },
      },
      required: ['type'],
    },
  },
  {
    name: 'update_object',
    description: 'Update an existing object by UUID.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        properties: { type: 'object' },
      },
      required: ['uuid', 'properties'],
    },
  },
  {
    name: 'delete_object',
    description: 'Delete an object by UUID.',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string' } },
      required: ['uuid'],
    },
  },
  {
    name: 'list_objects',
    description: 'List objects, optionally filtered by type.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string' },
      },
    },
  },
  {
    name: 'get_object',
    description: 'Get a single object by UUID.',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string' } },
      required: ['uuid'],
    },
  },
  {
    name: 'set_selection',
    description: 'Set the selected object UUID.',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: ['string', 'null'] } },
    },
  },
  {
    name: 'get_selection',
    description: 'Get the selected object UUID.',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },
];
```

- [ ] **Step 7: Write `mcp-sidecar/src/server.ts`**

```typescript
import {
  Server,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import WebSocket from 'ws';
import { McpInfoFile, McpToolResponse } from './protocol';
import { tools } from './tools';
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
export async function startServer(info: McpInfoFile): Promise<void> {
  const ws = new WebSocket(`ws://127.0.0.1:${info.port}/?token=${info.token}`);
  await new Promise<void>((resolve, reject) => {
    ws.once('open', () => resolve());
    ws.once('error', reject);
  });
  const pending = new Map<
    string,
    (response: McpToolResponse['response']) => void
  >();
  ws.on('message', (data) => {
    const parsed = JSON.parse(data.toString()) as McpToolResponse;
    if (parsed.requestId && pending.has(parsed.requestId)) {
      pending.get(parsed.requestId)!(parsed.response);
      pending.delete(parsed.requestId);
    }
  });
  const server = new Server(
    { name: 'webbzedit-mcp', version: '0.1.0' },
    { capabilities: { tools: {} } },
  );
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const requestId = generateId();
    const payload = {
      requestId,
      tool: request.params.name,
      arguments: request.params.arguments ?? {},
    };
    const result = await new Promise<McpToolResponse['response']>(
      (resolve, reject) => {
        pending.set(requestId, resolve);
        ws.send(JSON.stringify(payload), (err) => {
          if (err) reject(err);
        });
      },
    );
    const text = result.ok
      ? JSON.stringify(result.result)
      : `Error: ${result.error}`;
    return {
      content: [{ type: 'text', text }],
      isError: !result.ok,
    };
  });
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
```

- [ ] **Step 8: Write `mcp-sidecar/src/index.ts`**

```typescript
import { readMcpInfo } from './infoFile';
import { startServer } from './server';

async function main() {
  let info;
  try {
    info = readMcpInfo();
  } catch (e) {
    console.error(
      'WebBZEdit is not running or has no MCP info file. Start the app first.',
      e,
    );
    process.exit(1);
  }
  try {
    await startServer(info);
  } catch (e) {
    console.error('MCP server error:', e);
    process.exit(1);
  }
}
main();
```

- [ ] **Step 9: Write `mcp-sidecar/src/__tests__/infoFile.test.ts`**

```typescript
import fs from 'fs';
import os from 'os';
import path from 'path';
import { getMcpInfoPath, readMcpInfo } from '../infoFile';
describe('getMcpInfoPath', () => {
  it('returns a path under the platform app data directory', () => {
    const p = getMcpInfoPath();
    expect(p).toContain('WebBZEdit');
    expect(p).toContain('mcp-info.json');
  });
});
describe('readMcpInfo', () => {
  it('parses the info file', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-test-'));
    const file = path.join(dir, 'mcp-info.json');
    fs.writeFileSync(
      file,
      JSON.stringify({ port: 12345, token: 'abc', pid: 1 }),
    );
    jest.spyOn(require('../infoFile'), 'getMcpInfoPath').mockReturnValue(file);
    const info = readMcpInfo();
    expect(info.port).toBe(12345);
    expect(info.token).toBe('abc');
  });
});
```

- [ ] **Step 10: Install sidecar dependencies and run tests**

Run:

```bash
cd mcp-sidecar
npm install
npm run build
npm test
```

Expected: build succeeds and tests pass.

- [ ] **Step 11: Commit**

```bash
git add mcp-sidecar/
git commit -m "feat: add Node MCP sidecar that bridges stdio to app WebSocket"
```

---

### Task 3: Implement the frontend DocumentController

**Files:**

- Create: `src/mcp/protocol.ts`
- Create: `src/mcp/DocumentController.ts`
- Create: `src/mcp/toolHandlers.ts`
- Create: `src/mcp/useMCPController.ts`
- Create: `src/mcp/McpProvider.tsx`
- Create: `src/mcp/__tests__/DocumentController.ts`
- Modify: `src/App.tsx`

**Interfaces:**

- Consumes: Recoil `documentState` and `selectionState`; existing `loadBZWDocument`, `exportBZWDocument`, `WorldEditorHelper`, obstacle factories.
- Produces: a global `DocumentController` instance wired to Tauri events/commands.

- [ ] **Step 1: Write `src/mcp/protocol.ts`**

Duplicate of `mcp-sidecar/src/protocol.ts`:

```typescript
export interface McpInfoFile {
  port: number;
  token: string;
  pid: number;
}

export interface McpToolRequest {
  requestId: string;
  tool: string;
  arguments: Record<string, unknown>;
}

export interface McpToolResponse {
  requestId: string;
  response: { ok: true; result: unknown } | { ok: false; error: string };
}
```

- [ ] **Step 2: Write `src/mcp/DocumentController.ts`**

```typescript
import { produce } from 'immer';
import { nanoid } from 'nanoid';

import { WorldEditorHelper } from '../Document/Editor/WorldEditorHelper';
import { newIBase } from '../Document/Obstacles/Base';
import { IBaseObject } from '../Document/Obstacles/BaseObject';
import { newIBox } from '../Document/Obstacles/Box';
import { newIMaterial } from '../Document/Obstacles/Material';
import { newIMesh } from '../Document/Obstacles/Mesh';
import { newIMeshFace } from '../Document/Obstacles/MeshFace';
import { newIOptions } from '../Document/Obstacles/Option';
import { newIPyramid } from '../Document/Obstacles/Pyramid';
import { newITeleporter } from '../Document/Obstacles/Teleporter';
import { newITeleporterLink } from '../Document/Obstacles/TeleporterLink';
import { newITextureMatrix } from '../Document/Obstacles/TextureMatrix';
import { IWorld, newIWorld } from '../Document/Obstacles/World';
import { newIZone } from '../Document/Obstacles/Zone';
import { exportBZWDocument } from '../Document/exportBZWDocument';
import { loadBZWDocument } from '../Document/loadBZWDocument';
export type ObjectType =
  | 'world'
  | 'box'
  | 'pyramid'
  | 'base'
  | 'zone'
  | 'teleporter'
  | 'link'
  | 'material'
  | 'mesh'
  | 'face'
  | 'texturematrix'
  | 'options';
const factories: Record<ObjectType, () => IBaseObject> = {
  world: newIWorld,
  box: newIBox,
  pyramid: newIPyramid,
  base: newIBase,
  zone: newIZone,
  teleporter: newITeleporter,
  link: newITeleporterLink,
  material: newIMaterial,
  mesh: newIMesh,
  face: newIMeshFace,
  texturematrix: newITextureMatrix,
  options: newIOptions,
};
export interface ControllerContext {
  getWorld: () => Promise<IWorld | null>;
  setWorld: (world: IWorld | null) => void;
  getSelection: () => Promise<string | null>;
  setSelection: (uuid: string | null) => void;
}
export class DocumentController {
  constructor(private ctx: ControllerContext) {}
  async loadDocument(content: string): Promise<void> {
    const world = loadBZWDocument(content);
    this.ctx.setWorld(world);
  }
  async exportDocument(): Promise<string> {
    const world = await this.ctx.getWorld();
    return world ? exportBZWDocument(world) : '';
  }
  async getDocumentState(): Promise<IWorld | null> {
    return this.ctx.getWorld();
  }
  async createObject(
    type: ObjectType,
    properties: Record<string, unknown> = {},
  ): Promise<IBaseObject> {
    const world = await this.ctx.getWorld();
    if (!world) {
      throw new Error('no document loaded');
    }
    const factory = factories[type];
    if (!factory) {
      throw new Error(`unknown object type: ${type}`);
    }
    const object = factory();
    object._uuid = nanoid();
    Apply user properties before reference-aware helpers see the object.
    for (const [key, value] of Object.entries(properties)) {
      (object as any)[key] = value;
    }
    const helper = new WorldEditorHelper(world);
    if (type === 'options') {
      world._options = object as any;
    } else {
      helper.addObstacle(object);
    }
    this.ctx.setWorld({ ...world });
    return object;
  }
  async updateObject(
    uuid: string,
    properties: Record<string, unknown> = {},
  ): Promise<void> {
    const world = await this.ctx.getWorld();
    if (!world) {
      throw new Error('no document loaded');
    }
    const target = world.children[uuid];
    if (!target) {
      throw new Error(`object not found: ${uuid}`);
    }
    const helper = new WorldEditorHelper(world);
    if (target._objectType === 'teleporter' && 'name' in properties) {
      helper.renameObstacle(uuid, String(properties.name));
    }
    const next = produce(world, (draft) => {
      const obj = draft.children[uuid];
      for (const [key, value] of Object.entries(properties)) {
        if (key === 'name' && obj._objectType === 'teleporter') continue;
        (obj as any)[key] = value;
      }
    });
    this.ctx.setWorld(next);
  }
  async deleteObject(uuid: string): Promise<void> {
    const world = await this.ctx.getWorld();
    if (!world) {
      throw new Error('no document loaded');
    }
    const target = world.children[uuid];
    if (!target) {
      throw new Error(`object not found: ${uuid}`);
    }
    const helper = new WorldEditorHelper(world);
    helper.delObstacle(uuid);
    this.ctx.setWorld({ ...world });
  }
  async listObjects(type?: string): Promise<IBaseObject[]> {
    const world = await this.ctx.getWorld();
    if (!world) {
      return [];
    }
    const objects = [world, ...Object.values(world.children)];
    if (type) {
      return objects.filter((o) => o._objectType === type);
    }
    return objects;
  }
  async getObject(uuid: string): Promise<IBaseObject | undefined> {
    const world = await this.ctx.getWorld();
    if (!world) {
      return undefined;
    }
    return uuid === world._uuid ? world : world.children[uuid];
  }
  async setSelection(uuid: string | null): Promise<void> {
    this.ctx.setSelection(uuid);
  }
  async getSelection(): Promise<string | null> {
    return this.ctx.getSelection();
  }
}
```

- [ ] **Step 3: Write `src/mcp/toolHandlers.ts`**

```typescript
import { DocumentController } from './DocumentController';

export type ToolHandler = (
  controller: DocumentController,
  args: Record<string, unknown>,
) => Promise<unknown>;
export const toolHandlers: Record<string, ToolHandler> = {
  get_document_state: async (c) => c.getDocumentState(),
  load_document: async (c, args) => {
    await c.loadDocument(String(args.content));
    return { loaded: true };
  },
  export_document: async (c) => c.exportDocument(),
  create_object: async (c, args) =>
    c.createObject(
      String(args.type) as any,
      (args.properties as Record<string, unknown>) ?? {},
    ),
  update_object: async (c, args) =>
    c.updateObject(
      String(args.uuid),
      (args.properties as Record<string, unknown>) ?? {},
    ),
  delete_object: async (c, args) => {
    await c.deleteObject(String(args.uuid));
    return { deleted: args.uuid };
  },
  list_objects: async (c, args) =>
    c.listObjects(args.type ? String(args.type) : undefined),
  get_object: async (c, args) => c.getObject(String(args.uuid)),
  set_selection: async (c, args) => {
    const uuid =
      args.uuid === null || args.uuid === undefined ? null : String(args.uuid);
    await c.setSelection(uuid);
    return { selection: uuid };
  },
  get_selection: async (c) => c.getSelection(),
};
```

- [ ] **Step 4: Write `src/mcp/useMCPController.ts`**

```typescript
import { listen, invoke } from '@tauri-apps/api/core';
import { useEffect, useMemo } from 'react';
import { useRecoilCallback } from 'recoil';

import { documentState, selectionState } from '../atoms';
import { DocumentController } from './DocumentController';
import { McpToolRequest } from './protocol';
import { toolHandlers } from './toolHandlers';
export function useMCPController(): DocumentController {
  const getWorld = useRecoilCallback(
    ({ snapshot }) => () => snapshot.getPromise(documentState),
    [],
  );
  const setWorld = useRecoilCallback(
    ({ set }) => (world: any) => set(documentState, world),
    [],
  );
  const getSelection = useRecoilCallback(
    ({ snapshot }) => () => snapshot.getPromise(selectionState),
    [],
  );
  const setSelection = useRecoilCallback(
    ({ set }) => (uuid: string | null) => set(selectionState, uuid),
    [],
  );
  const controller = useMemo(
    () =>
      new DocumentController({
        getWorld,
        setWorld,
        getSelection,
        setSelection,
      }),
    [getWorld, setWorld, getSelection, setSelection],
  );
  useEffect(() => {
    let unlisten: (() => void) | undefined;
    (async () => {
      unlisten = await listen<McpToolRequest>('mcp_request', async (event) => {
        const { requestId, tool, arguments: args } = event.payload;
        const handler = toolHandlers[tool];
        try {
          const result = handler
            ? await handler(controller, args ?? {})
            : Promise.reject(new Error(`unknown tool: ${tool}`));
          await invoke('mcp_tool_response', {
            id: requestId,
            response: { ok: true, result },
          });
        } catch (err: any) {
          await invoke('mcp_tool_response', {
            id: requestId,
            response: { ok: false, error: err?.message || String(err) },
          });
        }
      });
    })();
    return () => {
      if (unlisten) unlisten();
    };
  }, [controller]);
  return controller;
}
```

- [ ] **Step 5: Write `src/mcp/McpProvider.tsx`**

```typescript
import React from 'react';

import { useMCPController } from './useMCPController';
export const McpProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useMCPController();
  return <>{children}</>;
};
```

- [ ] **Step 6: Modify `src/App.tsx`**

Wrap the root element with `McpProvider`:

```tsx
import { McpProvider } from './mcp/McpProvider';

const App: React.FC = () => {
  ...
  return (
    <McpProvider>
      <div className={styles.Viewport}>...</div>
    </McpProvider>
  );
};
```

- [ ] **Step 7: Write `src/mcp/__tests__/DocumentController.ts`**

```typescript
import { newIBox } from '../../Document/Obstacles/Box';
import { newIWorld } from '../../Document/Obstacles/World';
import { DocumentController } from '../DocumentController';

describe('DocumentController', () => {
  it('creates an object', async () => {
    let world = newIWorld();
    const controller = new DocumentController({
      getWorld: async () => world,
      setWorld: (w) => {
        world = w!;
      },
      getSelection: async () => null,
      setSelection: () => {},
    });
    const object = await controller.createObject('box', { name: 'myBox' });
    expect(object._objectType).toBe('box');
    expect(world.children[object._uuid]).toBeDefined();
    expect(world.children[object._uuid].name).toBe('myBox');
  });
  it('updates an object', async () => {
    let world = newIWorld();
    const box = { ...newIBox(), _uuid: 'box-1', name: 'old' };
    world.children['box-1'] = box;
    const controller = new DocumentController({
      getWorld: async () => world,
      setWorld: (w) => {
        world = w!;
      },
      getSelection: async () => null,
      setSelection: () => {},
    });
    await controller.updateObject('box-1', { name: 'new' });
    expect(world.children['box-1'].name).toBe('new');
  });
});
```

- [ ] **Step 8: Add a Tauri API mock for frontend tests**

Append to `src/setupTests.ts`:

```typescript
jest.mock('@tauri-apps/api/core', () => ({
  listen: jest.fn(() => Promise.resolve(() => {})),
  invoke: jest.fn(() => Promise.resolve()),
}));
```

- [ ] **Step 9: Run frontend tests**

Run:

```bash
CI=true npm test -- --watchAll=false
```

Expected: existing tests plus new controller tests pass.

- [ ] **Step 10: Commit**

```bash
git add src/mcp/ src/App.tsx src/setupTests.ts
git commit -m "feat: add frontend DocumentController and Tauri MCP wiring"
```

---

### Task 4: Add build scripts and documentation

**Files:**

- Modify: `package.json`
- Modify: `README.md`
- Create: `docs/mcp.md`

**Interfaces:**

- Consumes: `mcp-sidecar` build output, Tauri CLI.
- Produces: documented commands for dev and distribution.

- [ ] **Step 1: Add sidecar build to root scripts**

Modify `package.json`:

```json
{
  "scripts": {
    "sidecar:build": "cd mcp-sidecar && npm run build",
    "sidecar:test": "cd mcp-sidecar && npm test",
    "dev": "npm-run-all sidecar:build tauri:dev",
    "tauri:build": "npm-run-all sidecar:build tauri:build"
  }
}
```

- [ ] **Step 2: Write `docs/mcp.md`**

````markdown
# MCP Server Setup

WebBZEdit exposes a Model Context Protocol (MCP) server for local AI assistants.

## Requirements

- WebBZEdit running as a Tauri desktop app.
- Node.js 18+ installed.

## Configure Claude Desktop

Add this server to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "webbzedit": {
      "command": "node",
      "args": ["/path/to/webbzedit/mcp-sidecar/dist/index.cjs"]
    }
  }
}
```
````

Start WebBZEdit first, then restart Claude Desktop. The sidecar reads a local info file written by the app and connects over a token-protected localhost WebSocket.

## Available tools

- `get_document_state`
- `load_document`
- `export_document`
- `create_object`
- `update_object`
- `delete_object`
- `list_objects`
- `get_object`
- `set_selection`
- `get_selection`

## Security

- The WebSocket only accepts connections from `127.0.0.1`.
- A random token is generated per app session and shared through the info file.
- The info file is removed when the app closes.

````

- [ ] **Step 3: Run lint and tests**

Run:

```bash
npm run lint
CI=true npm test -- --watchAll=false
````

Expected: lint passes and tests pass.

- [ ] **Step 4: Commit**

```bash
git add package.json docs/mcp.md
git commit -m "docs: add MCP setup and build scripts"
```

---

### Task 5: Smoke test the Tauri + sidecar end-to-end

**Files:**

- None

**Interfaces:**

- Consumes: full Tauri app and built sidecar.
- Produces: confirmation that an MCP client can list tools.

- [ ] **Step 1: Start the Tauri dev app**

Run:

```bash
npm run tauri:dev
```

Wait for the window to open.

- [ ] **Step 2: Verify the info file was written**

Check the platform app-data path:

- macOS: `~/Library/Application Support/WebBZEdit/mcp-info.json`
- Linux: `~/.local/share/WebBZEdit/mcp-info.json`
- Windows: `%LOCALAPPDATA%\WebBZEdit\mcp-info.json`

Confirm it contains `port`, `token`, and `pid`.

- [ ] **Step 3: Run the sidecar manually and call list tools**

In another terminal:

```bash
node mcp-sidecar/dist/index.cjs
```

Then send the MCP `initialize` and `tools/list` JSON-RPC messages via stdin. The sidecar should respond with the tool list.

Example:

```json
{ "jsonrpc": "2.0", "id": 1, "method": "initialize", "params": { "protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": { "name": "test", "version": "0.1.0" } } }
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list" }
```

Expected: a JSON response listing all tools defined in `mcp-sidecar/src/tools.ts`.

- [ ] **Step 4: Commit any fixes**

If changes were needed, commit them with a descriptive message.

---

## Spec Coverage

- Tauri WebSocket bridge: Task 1.
- Node/Bun sidecar with MCP stdio: Task 2.
- Frontend controller and tool handlers: Task 3.
- Build scripts and docs: Task 4.
- End-to-end smoke test: Task 5.

## Placeholder Scan

No TBD/TODO placeholders or vague steps were written. Every step includes concrete commands, file paths, or code.

## Type Consistency

- `McpToolRequest` / `McpToolResponse` match in `src/mcp/protocol.ts` and `mcp-sidecar/src/protocol.ts`.
- Tool names in `mcp-sidecar/src/tools.ts` match keys in `src/mcp/toolHandlers.ts`.
- `DocumentController.createObject` accepts `ObjectType`, which is cast from the sidecar's `type` argument.

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-09-20-mcp-sidecar.md`.**

Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** - Execute tasks in this session using `executing-plans`, batch execution with checkpoints.

Which approach?
