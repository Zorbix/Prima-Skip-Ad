const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const code = fs.readFileSync(path.join(__dirname, '../ad-skip.js'), 'utf8');

function fixture(options = {}) {
  const origin = Date.parse('2026-09-24T21:55:00Z');
  const stamp = seconds => new Date(origin + seconds * 1000).toISOString();
  let time = 1200;
  let interval;
  const waits = [];
  const writes = [];
  const video = {
    currentSrc: 'blob:test', paused: false, seeking: false, readyState: 4, duration: 4502.4,
    seekable: { length: 1, start: () => 0, end: () => 4502.4 },
    get currentTime() { return time; },
    set currentTime(value) { writes.push(value); time = options.reject ? time : value; }
  };
  const slider = { max: '4500', get value() { return String(time); } };
  const forward = { disabled: true };
  const raw = { playerControl: {
    liveControl: { startFrom: stamp(0) }, contentOverlay: { length: 4500 },
    adsControl: { schema: 'TvAdsControl', blocks: [
      { startFrom: stamp(1188), endAt: stamp(1208) },
      { startFrom: stamp(1208), endAt: stamp(1718) },
      { startFrom: stamp(3006), endAt: stamp(3551) }
    ] }
  } };
  const root = { __vue_app__: { config: { globalProperties: { $pinia: {
    _s: new Map([['player', { rawData: raw }]])
  } } } } };
  const window = {};
  const context = vm.createContext({ window,
    location: { hostname: options.host || 'www.oneplay.cz' },
    document: {
      querySelectorAll: () => [video],
      querySelector: selector => selector === '#__nuxt' ? root :
        selector === '.ef-seekbar-slider' ? slider : forward
    }, getComputedStyle: () => ({ display: 'block' }),
    setInterval: fn => { interval = fn; return 1; },
    clearInterval: () => { interval = null; },
    setTimeout: resolve => { waits.push(resolve); }
  });
  vm.runInContext(code, context);
  return { video, slider, forward, raw, writes, window,
    call: action => context.manageAdSkipping(action),
    tick: () => interval?.(),
    settle: async () => { waits.splice(0).forEach(resolve => resolve()); await Promise.resolve(); },
    get interval() { return interval; }
  };
}

test('jumps to end of all contiguous adverts while forward button is disabled', async () => {
  const f = fixture();
  f.call('start');
  assert.deepEqual(f.writes, [1718]);
  await f.settle();
  assert.match(f.call('status').message, /přeskočen o 518 s/);
});
test('rejected seek is reported and never retried for this break', async () => {
  const f = fixture({ reject: true });
  f.call('start'); await f.settle(); await f.tick();
  assert.deepEqual(f.writes, [1718]);
  assert.match(f.call('status').message, /nepotvrdil/);
});
test('ordinary programme and disabled live-edge button do not trigger a jump', async () => {
  const f = fixture(); f.video.currentTime = 2000; f.writes.length = 0;
  f.call('start'); await f.tick(); assert.deepEqual(f.writes, []);
});
test('does not jump if seeking is already enabled', () => {
  const f = fixture(); f.forward.disabled = false;
  f.call('start'); assert.deepEqual(f.writes, []);
});
test('waits when the endpoint is not yet seekable', async () => {
  const f = fixture(); f.video.seekable.end = () => 1400;
  f.call('start'); assert.deepEqual(f.writes, []);
  f.video.seekable.end = () => 4500; f.tick();
  assert.deepEqual(f.writes, [1718]); await f.settle();
});
test('rejects missing metadata, replacement-video and mismatched timeline', () => {
  for (const mutate of [
    f => { delete f.raw.playerControl.liveControl; },
    f => { f.video.duration = 30; },
    f => { f.slider.max = '6000'; },
    f => { f.raw.playerControl.adsControl.blocks = [{ startFrom: 'bad', endAt: 'bad' }]; }
  ]) {
    const f = fixture(); mutate(f); f.call('start'); assert.deepEqual(f.writes, []);
  }
});
test('does not skip a paused video', () => {
  const f = fixture(); f.video.paused = true;
  f.call('start'); assert.deepEqual(f.writes, []);
});
test('duplicate start does not add a second controller, stop removes it', async () => {
  const f = fixture(); f.call('start'); const timer = f.interval;
  f.call('start'); assert.equal(f.interval, timer);
  assert.equal(f.call('stop').enabled, false); assert.equal(f.interval, null);
  await f.settle(); assert.equal(f.call('status').enabled, false);
});
test('does not activate on other websites', () => {
  const f = fixture({ host: 'example.com' });
  assert.equal(f.call('start').enabled, false); assert.deepEqual(f.writes, []);
});
