import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
const read = path => readFileSync(path, 'utf8');
const portal = read('command-center/index.html');
assert.ok(existsSync('the-launch-era-favicon.png'));
for (const file of ['command-center/index.html', 'command-center/access.html']) {
  assert.ok(!read(file).includes('./app-icons/'), file + ': retired missing icon directory');
  assert.ok(read(file).includes('../the-launch-era-favicon.png'), file + ': existing TLE mark');
}
for (const [file, brand, id] of [['manifest-tle.webmanifest', 'The Launch Era', 'tle'], ['manifest-cb-depot.webmanifest', 'CB Depot', 'cb-depot']]) {
  const manifest = JSON.parse(read('command-center/' + file));
  assert.ok(manifest.name.includes(brand));
  assert.equal(manifest.start_url, './?app=' + id);
  assert.equal(manifest.scope, './');
  assert.ok(manifest.icons.length > 0);
  for (const icon of manifest.icons) {
    if (id === 'tle') assert.equal(icon.src, '../the-launch-era-favicon.png');
    else assert.match(icon.src, /^https:\/\/thelaunchera\.com\/assets\/clients\/cb-depot\/approved-favicon-(192|512)\.png$/);
  }
}
assert.ok(portal.includes('verifiedCB') && portal.includes('cb-depot-buyer'), 'Preserve tenant brand selection');
console.log('PASS legacy portal: existing TLE mark, approved CB Depot icons and separate local manifests');
