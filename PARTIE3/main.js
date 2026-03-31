import { QUESTIONS, PART3_MS } from "./questions.js";
import { runSurvival } from "./platform.js";

const FIRST_LAUNCH_KEY = "erreur404.firstLaunchSeen";
let firstLaunchSeenFallback = false;

const INTEL_VIEWPORT = {
  lat: "2.0486",
  lon: "0.0000",
  zoom: "1.00",
  view: "global",
  timeRange: "7d",
  layers: [
    "conflicts",
    "bases",
    "hotspots",
    "nuclear",
    "sanctions",
    "weather",
    "economic",
    "waterways",
    "outages",
    "military",
    "natural",
  ],
};

const els = {
  app: document.getElementById("app"),
  brandTitle: document.getElementById("brand-title"),
  brandSub: document.getElementById("brand-sub"),
  clockBadge: document.getElementById("clock-badge"),
  terminalPath: document.getElementById("terminal-path"),
  hudDetections: document.getElementById("hud-detections"),
  btnReset: document.getElementById("btn-reset"),
  viewFirstLaunch: document.getElementById("view-first-launch"),
  btnFirstLaunchContinue: document.getElementById("btn-first-launch-continue"),
  viewIntro: document.getElementById("view-intro"),
  btnStart: document.getElementById("btn-start"),
  viewPart3: document.getElementById("view-part3"),
  countdownDisplay: document.getElementById("countdown-display"),
  timerFill: document.getElementById("timer-fill"),
  q3Text: document.getElementById("q3-text"),
  q3Options: document.getElementById("q3-options"),
  q3Feedback: document.getElementById("q3-feedback"),
  viewPlatformHard: document.getElementById("view-platform-hard"),
  platformCanvasHard: document.getElementById("platform-canvas-hard"),
  platformStatusHard: document.getElementById("platform-status-hard"),
  btnHardRetry: document.getElementById("btn-hard-retry"),
  btnHardBack: document.getElementById("btn-hard-back"),
  viewEnding: document.getElementById("view-ending"),
  endingText: document.getElementById("ending-text"),
  btnReplay: document.getElementById("btn-replay"),
  wmTbodyView: document.getElementById("wm-tbody-view"),
  wmTbodyLayers: document.getElementById("wm-tbody-layers"),
};

let state = {
  part3Index: 0,
  countdownSec: 8 * 60 + 30,
  questionTimer: null,
  questionDeadline: 0,
};

let countdownInterval = null;
let hudAmbientId = null;

function setTheme(name) {
  document.body.classList.toggle("is-first-launch", name === "first-launch");
  els.app.dataset.theme = name;
  if (name === "part3") {
    els.brandTitle.textContent = "root@epsILON-core";
    els.brandSub.textContent = "privilege escalation — active";
    if (els.terminalPath) els.terminalPath.textContent = "/var/epsilon/mainframe/exfil";
  } else if (name === "first-launch") {
    els.brandTitle.textContent = "XCOM // PRIME";
    els.brandSub.textContent = "operation boot — primary channel";
    if (els.terminalPath) els.terminalPath.textContent = "/bridge/init";
  } else if (name === "platform-hard") {
    els.brandTitle.textContent = "kernel: IDS_FLOOD";
    els.brandSub.textContent = "defense subroutine — locked";
    if (els.terminalPath) els.terminalPath.textContent = "/sys/net/parefeu/aggressive";
  } else if (name === "ending") {
    els.brandTitle.textContent = "[ session closed ]";
    els.brandSub.textContent = "clean disconnect — no trace";
    if (els.terminalPath) els.terminalPath.textContent = "~/outbox — done";
  } else {
    els.brandTitle.textContent = "entropyNet://client";
    els.brandSub.textContent = "handshake — awaiting payload";
    if (els.terminalPath) els.terminalPath.textContent = "~/epsilon/phase3";
  }
}

function formatUtcHms() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`;
}

function tickHudAmbient() {
  if (els.clockBadge) els.clockBadge.textContent = formatUtcHms();
  if (els.hudDetections) {
    const n = 1800 + Math.floor(Math.random() * 7200);
    els.hudDetections.textContent = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
  }
}

function startHudAmbient() {
  if (hudAmbientId) return;
  tickHudAmbient();
  hudAmbientId = setInterval(tickHudAmbient, 1000);
}

function appendRow2(tbody, a, b) {
  if (!tbody) return;
  const tr = document.createElement("tr");
  const td1 = document.createElement("td");
  td1.textContent = a;
  const td2 = document.createElement("td");
  td2.textContent = b;
  tr.appendChild(td1);
  tr.appendChild(td2);
  tbody.appendChild(tr);
}

function fillIntelHudTables() {
  const tbodyV = els.wmTbodyView;
  const tbodyL = els.wmTbodyLayers;
  if (tbodyV) tbodyV.replaceChildren();
  if (tbodyL) tbodyL.replaceChildren();

  const v = INTEL_VIEWPORT;
  appendRow2(tbodyV, "lat", v.lat);
  appendRow2(tbodyV, "lon", v.lon);
  appendRow2(tbodyV, "zoom", v.zoom);
  appendRow2(tbodyV, "view", v.view);
  appendRow2(tbodyV, "timeRange", v.timeRange);

  v.layers.forEach((layer, i) => {
    if (!tbodyL) return;
    const tr = document.createElement("tr");
    const n = document.createElement("td");
    n.textContent = String(i + 1);
    const name = document.createElement("td");
    name.textContent = layer;
    const st = document.createElement("td");
    const span = document.createElement("span");
    span.className = "hud-tag-on";
    span.textContent = "ON";
    st.appendChild(span);
    tr.appendChild(n);
    tr.appendChild(name);
    tr.appendChild(st);
    tbodyL.appendChild(tr);
  });
}

function showOnly(view) {
  const map = {
    firstLaunch: els.viewFirstLaunch,
    intro: els.viewIntro,
    part3: els.viewPart3,
    platformHard: els.viewPlatformHard,
    ending: els.viewEnding,
  };
  Object.values(map).forEach((el) => {
    if (el) el.hidden = true;
  });
  if (map[view]) map[view].hidden = false;
}

function formatClock(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function hasSeenFirstLaunch() {
  try {
    return localStorage.getItem(FIRST_LAUNCH_KEY) === "1";
  } catch {
    return firstLaunchSeenFallback;
  }
}

function markFirstLaunchSeen() {
  try {
    localStorage.setItem(FIRST_LAUNCH_KEY, "1");
  } catch {
    firstLaunchSeenFallback = true;
  }
}

function resetFirstLaunchFlag() {
  try {
    localStorage.removeItem(FIRST_LAUNCH_KEY);
  } catch {
    firstLaunchSeenFallback = false;
  }
}

function showFirstLaunch() {
  setTheme("first-launch");
  showOnly("firstLaunch");
}

function clearQuestionTimer() {
  if (state.questionTimer) {
    clearInterval(state.questionTimer);
    state.questionTimer = null;
  }
}

function goIntro() {
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = null;
  clearQuestionTimer();
  state = {
    part3Index: 0,
    countdownSec: 8 * 60 + 30,
    questionTimer: null,
    questionDeadline: 0,
  };
  setTheme("intro");
  showOnly("intro");
}

function goPart3() {
  if (countdownInterval) clearInterval(countdownInterval);
  setTheme("part3");
  showOnly("part3");
  state.part3Index = 0;
  state.countdownSec = 8 * 60 + 30;
  els.countdownDisplay.textContent = formatClock(state.countdownSec);
  countdownInterval = setInterval(() => {
    if (state.countdownSec <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      return;
    }
    state.countdownSec--;
    els.countdownDisplay.textContent = formatClock(state.countdownSec);
  }, 1000);
  renderPart3();
}

function renderPart3() {
  clearQuestionTimer();
  const q = QUESTIONS[state.part3Index];
  if (!q) {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = null;
    goEnding();
    return;
  }
  els.q3Feedback.hidden = true;
  els.q3Text.textContent = q.text;
  els.q3Options.innerHTML = "";
  q.options.forEach((opt, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "opt-btn";
    b.textContent = opt;
    b.addEventListener("click", () => answerPart3(i));
    els.q3Options.appendChild(b);
  });
  state.questionDeadline = Date.now() + PART3_MS;
  els.timerFill.style.transition = "none";
  els.timerFill.style.width = "100%";
  requestAnimationFrame(() => {
    els.timerFill.style.transition = `width ${PART3_MS}ms linear`;
    els.timerFill.style.width = "0%";
  });
  state.questionTimer = setInterval(() => {
    if (Date.now() >= state.questionDeadline) {
      clearQuestionTimer();
      failPart3Timeout();
    }
  }, 200);
}

function failPart3Timeout() {
  els.q3Options.querySelectorAll(".opt-btn").forEach((b) => {
    b.disabled = true;
  });
  els.q3Feedback.hidden = false;
  els.q3Feedback.className = "qcm-feedback bad";
  els.q3Feedback.textContent = "Temps écoulé — le pare-feu te repère.";
  setTimeout(() => startPlatformHard(), 900);
}

function answerPart3(choice) {
  clearQuestionTimer();
  const q = QUESTIONS[state.part3Index];
  const buttons = els.q3Options.querySelectorAll(".opt-btn");
  buttons.forEach((b, i) => {
    b.disabled = true;
    if (i === q.correct) b.classList.add("correct");
    else if (i === choice) b.classList.add("wrong");
  });
  const ok = choice === q.correct;
  if (!ok) {
    els.q3Feedback.hidden = false;
    els.q3Feedback.className = "qcm-feedback bad";
    els.q3Feedback.textContent = "Erreur — isolation pare-feu.";
    setTimeout(() => startPlatformHard(), 700);
    return;
  }
  state.part3Index++;
  setTimeout(() => renderPart3(), 400);
}

function goEnding() {
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = null;
  clearQuestionTimer();
  setTheme("ending");
  showOnly("ending");
}

function startPlatformHard() {
  setTheme("platform-hard");
  showOnly("platformHard");
  els.btnHardRetry.hidden = true;
  els.btnHardBack.hidden = true;
  runSurvival(els.platformCanvasHard, els.platformStatusHard, 10, true, (won) => {
    els.btnHardRetry.hidden = won;
    els.btnHardBack.hidden = !won;
    if (won) {
      els.btnHardBack.onclick = () => {
        showOnly("part3");
        setTheme("part3");
        renderPart3();
      };
    } else {
      els.btnHardRetry.onclick = () => startPlatformHard();
    }
  });
}

// Wiring
els.btnStart.addEventListener("click", goPart3);
els.btnReset.addEventListener("click", () => {
  resetFirstLaunchFlag();
  showFirstLaunch();
});
els.btnReplay.addEventListener("click", goIntro);
els.btnFirstLaunchContinue.addEventListener("click", () => {
  markFirstLaunchSeen();
  goIntro();
});

startHudAmbient();
fillIntelHudTables();
if (hasSeenFirstLaunch()) goIntro();
else showFirstLaunch();

