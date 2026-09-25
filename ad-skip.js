// Self-contained: Chrome serializes this function into the page's MAIN world.
function manageAdSkipping(action = "status") {
  if (!["oneplay.cz", "www.oneplay.cz"].includes(location.hostname)) {
    return { enabled: false, message: "Automatické přeskakování je dostupné na Oneplay." };
  }
  const key = "__primaSkipAdControllerV1";
  const existing = window[key];
  if (action === "stop") {
    existing?.stop();
    return { enabled: false, message: "Automatické přeskakování je vypnuté." };
  }
  if (existing) return existing.status();
  if (action !== "start") return { enabled: false, message: "" };

  let enabled = true;
  let checking = false;
  let message = "Čekám na reklamní blok…";
  let source = null;
  let attempts = new Set();
  const controller = {
    status: () => ({ enabled, message }),
    stop() {
      enabled = false;
      clearInterval(timer);
      delete window[key];
    }
  };
  window[key] = controller;

  async function tick() {
    if (!enabled || checking) return;
    try {
      const videos = [...document.querySelectorAll("video")]
        .filter(v => v.currentSrc && getComputedStyle(v).display !== "none");
      if (videos.length !== 1) return;
      const video = videos[0];
      if (video.paused || video.seeking || video.readyState < 2) return;
      const raw = document.querySelector("#__nuxt")?.__vue_app__
        ?.config.globalProperties.$pinia?._s.get("player")?.rawData;
      const control = raw?.playerControl;
      const origin = Date.parse(control?.liveControl?.startFrom) / 1000;
      const duration = control?.contentOverlay?.length;
      const blocks = control?.adsControl?.blocks;
      if (!Number.isFinite(origin) || !Number.isFinite(duration) || duration <= 0 ||
          !Array.isArray(blocks) || control.adsControl.schema !== "TvAdsControl") {
        message = "Čekám na časové údaje reklam z přehrávače.";
        return;
      }
      // Verified for recordings with a programme-relative media timeline.
      // Live/DVR and replacement-ad media can use a different time origin.
      const slider = document.querySelector(".ef-seekbar-slider");
      if (!slider || !Number.isFinite(video.duration) ||
          Math.abs(video.duration - duration) > 5 ||
          Math.abs(Number(slider.max) - duration) > 1 ||
          Math.abs(Number(slider.value) - video.currentTime) > 3) {
        message = "Časová osa videa neodpovídá údajům reklam. Automatický skok čeká.";
        return;
      }
      const sourceId = `${video.currentSrc}|${origin}|${duration}`;
      if (source !== sourceId) {
        source = sourceId;
        attempts = new Set();
        message = "Čekám na reklamní blok…";
      }
      const ranges = blocks.map(b => ({
        start: Date.parse(b.startFrom) / 1000 - origin,
        end: Date.parse(b.endAt) / 1000 - origin
      })).filter(b => Number.isFinite(b.start) && Number.isFinite(b.end) &&
        b.end > b.start && b.end > 0 && b.start < duration)
        .sort((a, b) => a.start - b.start);
      const breaks = [];
      for (const range of ranges) {
        const last = breaks[breaks.length - 1];
        if (last && range.start <= last.end) last.end = Math.max(last.end, range.end);
        else breaks.push({ ...range });
      }
      const current = breaks.find(b => video.currentTime >= b.start && video.currentTime < b.end);
      const forward = document.querySelector('button[aria-label="Skok o 10 s vpřed"]');
      if (!current || !forward?.disabled) return;
      const attemptKey = `${current.start}:${current.end}`;
      if (attempts.has(attemptKey)) return;
      const target = current.end;
      // Never guess the endpoint or seek beyond available recorded content.
      if (target >= duration || !Array.from({ length: video.seekable.length }, (_, i) => i)
        .some(i => video.seekable.start(i) <= target && target < video.seekable.end(i))) {
        message = "Konec reklamního bloku zatím není dostupný pro posun.";
        return;
      }
      attempts.add(attemptKey);
      checking = true;
      const before = video.currentTime;
      message = "Přeskakuji na konec reklamního bloku…";
      video.currentTime = target;
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (!enabled || source !== sourceId || video.currentSrc !== sourceId.split("|")[0]) return;
      const accepted = !video.seeking && video.currentTime >= target - 0.5 && video.currentTime <= target + 5;
      message = accepted
        ? `Reklamní blok přeskočen o ${Math.round(target - before)} s.`
        : "Přehrávač skok nepotvrdil. Tento blok už automaticky nezkouším.";
    } catch {
      message = "Automatický skok se nepodařil. Zkontroluj přehrávač.";
    } finally {
      checking = false;
    }
  }
  const timer = setInterval(tick, 500);
  tick();
  return controller.status();
}
