const DEFAULT_SECONDS = 60;
const STEP_SECONDS = 60;
const input = document.querySelector("#seconds");
const minus = document.querySelector("#minus");
const plus = document.querySelector("#plus");
const skip = document.querySelector("#skip");
const status = document.querySelector("#status");
let seconds = DEFAULT_SECONDS;
let busy = false;
let saves = Promise.resolve();

function normalize(value) {
  const number = Number(value);
  return Number.isFinite(number)
    ? Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, Math.floor(number)))
    : DEFAULT_SECONDS;
}

function render() {
  input.value = seconds;
  minus.disabled = seconds === 0;
  plus.disabled = seconds === Number.MAX_SAFE_INTEGER;
  skip.disabled = busy || seconds === 0;
  skip.textContent = `Posunout o ${seconds} s`;
}

function update(value) {
  seconds = normalize(value);
  render();
  const savedSeconds = seconds;
  saves = saves.then(() => chrome.storage.local.set({ seconds: savedSeconds }))
    .catch(() => { status.textContent = "Nastavení se nepodařilo uložit."; });
}

async function initialize() {
  try {
    const saved = await chrome.storage.local.get({ seconds: DEFAULT_SECONDS });
    seconds = normalize(saved.seconds);
  } catch {
    status.textContent = "Nastavení se nepodařilo načíst. Používám 60 sekund.";
  }
  input.disabled = false;
  render();
}

input.addEventListener("input", () => {
  if (input.value !== "") update(input.value);
});
input.addEventListener("change", () => update(input.value));
minus.addEventListener("click", () => update(seconds - STEP_SECONDS));
plus.addEventListener("click", () => update(seconds + STEP_SECONDS));

skip.addEventListener("click", async () => {
  const amount = seconds;
  if (busy || amount === 0) return;
  busy = true;
  render();
  status.textContent = "Posouvám video…";
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("Missing active tab");
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [amount],
      func: (amount) => {
        const video = [...document.querySelectorAll("video")]
          .find(v => v.currentSrc && getComputedStyle(v).display !== "none");
        if (!video) return "Video nebylo nalezeno. Spusť přehrávání.";
        try {
          const before = video.currentTime;
          video.currentTime = Number.isFinite(video.duration)
            ? Math.min(before + amount, video.duration)
            : before + amount;
          const moved = Math.round(video.currentTime - before);
          return moved > 0 ? `Video posunuto o ${moved} s.` : "Video nelze posunout dál.";
        } catch {
          return "Přehrávač nyní neumožňuje posun videa.";
        }
      }
    });
    status.textContent = results[0]?.result ?? "Video se nepodařilo posunout.";
  } catch {
    status.textContent = "Na této stránce nelze rozšíření spustit. Otevři stránku s videem.";
  } finally {
    busy = false;
    render();
  }
});

initialize();
