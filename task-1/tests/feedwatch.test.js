import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { parseXML } from '../lib/parser.js'; // updated path

// ---------- Helper: create a temp store dir ----------
function tempDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'feedwatch-'));
  return dir;
}

// ---------- Parser Unit Tests ----------
describe('Parser Unit Tests', () => {
  it('Valid RSS fixture → returns normalized items', () => {
    const rss = `
      <rss version="2.0">
        <channel>
          <item>
            <title>Test RSS</title>
            <link>http://example.com/rss</link>
            <pubDate>Tue, 17 Mar 2026 14:00:00 GMT</pubDate>
            <description>Description</description>
            <guid>123</guid>
          </item>
        </channel>
      </rss>
    `;
    const items = parseXML(rss);
    expect(items.length).toBe(1);
    expect(items[0].title).toBe('Test RSS');
    expect(items[0].link).toBe('http://example.com/rss');
  });

  it('Valid Atom fixture → returns normalized items', () => {
    const atom = `
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <title>Test Atom</title>
          <link href="http://example.com/atom"/>
          <updated>2026-03-17T14:00:00Z</updated>
          <summary>Description</summary>
          <id>abc</id>
        </entry>
      </feed>
    `;
    const items = parseXML(atom);
    expect(items.length).toBe(1);
    expect(items[0].title).toBe('Test Atom');
    expect(items[0].link).toBe('http://example.com/atom');
  });

  it('Malformed XML → returns empty array without throwing', () => {
    const items = parseXML('<rss><channel><item></channel></rss>');
    expect(items).toEqual([]);
  });

  it('Item missing <title> → title is empty string', () => {
    const rss = `
      <rss><channel><item><link>http://x.com</link></item></channel></rss>
    `;
    const items = parseXML(rss);
    expect(items[0].title).toBe('');
    expect(items[0].link).toBe('http://x.com');
  });
});

// ---------- Integration Helper ----------
const PROJECT_ROOT = path.resolve('.');
function run(args, opts = {}) {
  return spawnSync('bun', ['feedwatch.js', ...args], {
    cwd: PROJECT_ROOT,
    encoding: 'utf8',
    timeout: 10000,
    env: {
      ...process.env,
      FEEDWATCH_STORE_DIR: opts.storeDir || tmpDir,
      ...(opts.env || {}),   // ✅ merge custom env properly
    },
  });
}

// ---------- Integration Tests ----------
describe('Integration Tests', () => {
  let store;

  beforeAll(() => {
    store = tempDir();
  });

  afterAll(() => {
    fs.rmSync(store, { recursive: true, force: true });
  });

  it('Add a feed', () => {
    const r = run(['add', 'test', 'http://example.com/rss'], { storeDir: store });
    expect(r.status).toBe(0);
  });

  it('List after add', () => {
    const r = run(['list'], { storeDir: store });
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/test/);
  });

  it('Duplicate add fails', () => {
    const r = run(['add', 'test', 'http://other.com'], { storeDir: store });
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(/already exists/i);
  });

  it('List empty store shows empty state', () => {
    const emptyStore = tempDir();
    const r = run(['list'], { storeDir: emptyStore });
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/no feeds/i);
  });

  it('Remove unknown feed fails', () => {
    const r = run(['remove', 'nope'], { storeDir: store });
    expect(r.status).not.toBe(0);
  });

  it('Read unknown feed fails', () => {
    const r = run(['read', 'nope'], { storeDir: store });
    expect(r.status).not.toBe(0);
  });

  it('Config show works', () => {
    const r = run(['config', 'show'], { storeDir: store });
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/retries/i);
  });

  it('Config show with env overrides timeout', () => {
    const r = run(['config', 'show'], { storeDir: store, env: { FEEDWATCH_TIMEOUT: '1234' } });
    expect(r.stdout).toMatch(/1234/);
  });

  it('Network error → reports FAILED without crashing', () => {
    run(['add', 'dead', 'http://127.0.0.1:19999/rss'], { storeDir: store });
    const r = run(['run'], { storeDir: store });
    expect(r.status).toBe(1); // at least one failure
    expect(r.stdout).toMatch(/FAILED|failed/i);
    expect(r.stderr).not.toMatch(/unhandledRejection/i);
  });
});