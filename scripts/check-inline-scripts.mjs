import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const ignored = new Set(['.git', 'node_modules', 'dist', '.output', '_podcast_pages', '.site']);
function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (ignored.has(entry.name)) return [];
    const path = join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.isFile() && path.endsWith('.html') ? [path] : [];
  });
}

let checked = 0;
let failed = 0;
for (const file of htmlFiles(root)) {
  const html = readFileSync(file, 'utf8');
  let index = 0;
  for (const [, attrs, source] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    index++;
    if (/\bsrc\s*=/i.test(attrs) || !source.trim()) continue;
    const type = attrs.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
    if (type && !['module', 'text/javascript', 'application/javascript'].includes(type)) continue;
    const args = type === 'module' ? ['--input-type=module', '--check'] : ['--check'];
    const result = spawnSync(process.execPath, args, { input: source, encoding: 'utf8' });
    checked++;
    if (result.status !== 0) {
      failed++;
      console.error(relative(root, file) + ': inline script ' + index + '\n' + (result.stderr || result.error));
    }
  }
}
console.log('Inline JavaScript: ' + checked + ' checked, ' + failed + ' failed');
if (failed) process.exitCode = 1;

