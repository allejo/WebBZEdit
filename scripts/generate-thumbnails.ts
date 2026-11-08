// Renders the obstacle models in src/3DModels to src/assets/thumb_*.png by
// loading the app's hidden `?thumbnails` page in headless Chrome.
import { ChildProcess, spawn } from 'child_process';
import path from 'path';
import puppeteer from 'puppeteer';

const PORT = 3999;
const URL = `http://localhost:${PORT}/?thumbnails`;
const OUT_DIR = path.resolve(__dirname, '../src/assets');

async function waitForServer(server: ChildProcess) {
  for (let i = 0; i < 120; i++) {
    if (server.exitCode !== null) throw new Error('dev server exited');
    try {
      if ((await fetch(URL)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error('dev server did not start');
}

async function main() {
  const server = spawn('npx', ['react-scripts', 'start'], {
    env: { ...process.env, BROWSER: 'none', PORT: String(PORT) },
    stdio: 'ignore',
  });
  const browser = await puppeteer.launch({
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });

  try {
    await waitForServer(server);
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 1200 });
    await page.goto(URL);
    await page.addStyleTag({
      content: 'html, body { background: transparent !important; }',
    });
    await page.waitForSelector('[data-thumbnail]', { timeout: 120000 });
    await page.waitForSelector('[data-thumbnail][data-ready=false]', {
      hidden: true,
      timeout: 120000,
    });

    for (const el of await page.$$('[data-thumbnail]')) {
      const name = await el.evaluate((e) => e.getAttribute('data-thumbnail'));
      await el.screenshot({
        path: path.join(OUT_DIR, `${name}.png`),
        omitBackground: true,
      });
      console.log(`wrote ${name}.png`);
    }
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
