// ===== サウンドエンジン（Web Audio APIによる効果音合成・外部音源ファイル不要） =====
const SOUND_STORAGE_KEY = "itsim_sound_enabled";

const soundState = {
  enabled: true,
  ctx: null
};

function loadSoundPreference() {
  try {
    const saved = localStorage.getItem(SOUND_STORAGE_KEY);
    soundState.enabled = saved === null ? true : saved === "1";
  } catch (e) {
    soundState.enabled = true;
  }
}

function saveSoundPreference() {
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, soundState.enabled ? "1" : "0");
  } catch (e) {
    /* localStorageが使えない環境では何もしない */
  }
}

function getAudioContext() {
  if (!soundState.ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    soundState.ctx = new AudioCtx();
  }
  if (soundState.ctx.state === "suspended") {
    soundState.ctx.resume().catch(() => {});
  }
  return soundState.ctx;
}

function toggleSound() {
  soundState.enabled = !soundState.enabled;
  saveSoundPreference();
  syncSoundToggleButton();
  if (soundState.enabled) playTone(660, 0.08, "sine", 0.12);
}

function syncSoundToggleButton() {
  document.querySelectorAll(".sound-toggle-button").forEach((btn) => {
    btn.textContent = soundState.enabled ? "🔊" : "🔇";
    btn.setAttribute("aria-label", soundState.enabled ? "サウンドをオフにする" : "サウンドをオンにする");
    btn.classList.toggle("muted", !soundState.enabled);
  });
}

// 単音を生成して再生する基本関数
function playTone(freq, duration = 0.15, type = "sine", gain = 0.15, delay = 0) {
  if (!soundState.enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const startTime = ctx.currentTime + delay;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.012);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

// 複数音を連ねたシーケンス再生
function playSequence(notes) {
  if (!soundState.enabled) return;
  notes.forEach(([freq, duration, type, gain, delay]) => {
    playTone(freq, duration, type || "sine", gain ?? 0.15, delay || 0);
  });
}

const sfx = {
  click() {
    playTone(520, 0.05, "square", 0.06);
  },
  incidentSpawn() {
    playSequence([
      [880, 0.09, "triangle", 0.13, 0],
      [660, 0.12, "triangle", 0.1, 0.09]
    ]);
  },
  correct() {
    playSequence([
      [523.25, 0.1, "sine", 0.15, 0],
      [659.25, 0.1, "sine", 0.15, 0.09],
      [783.99, 0.18, "sine", 0.16, 0.18]
    ]);
  },
  wrong() {
    playSequence([
      [220, 0.16, "sawtooth", 0.14, 0],
      [174.6, 0.22, "sawtooth", 0.14, 0.1]
    ]);
  },
  repair() {
    playSequence([
      [440, 0.09, "sine", 0.12, 0],
      [554.37, 0.09, "sine", 0.12, 0.08],
      [659.25, 0.14, "sine", 0.14, 0.16]
    ]);
  },
  achievement() {
    playSequence([
      [659.25, 0.09, "sine", 0.15, 0],
      [783.99, 0.09, "sine", 0.15, 0.08],
      [987.77, 0.09, "sine", 0.16, 0.16],
      [1174.66, 0.24, "sine", 0.18, 0.24]
    ]);
  },
  win() {
    playSequence([
      [523.25, 0.14, "triangle", 0.16, 0],
      [659.25, 0.14, "triangle", 0.16, 0.13],
      [783.99, 0.14, "triangle", 0.16, 0.26],
      [1046.5, 0.32, "triangle", 0.18, 0.39]
    ]);
  },
  lose() {
    playSequence([
      [392, 0.22, "sawtooth", 0.14, 0],
      [329.63, 0.22, "sawtooth", 0.14, 0.18],
      [261.63, 0.4, "sawtooth", 0.15, 0.36]
    ]);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  loadSoundPreference();
  syncSoundToggleButton();
  document.querySelectorAll(".sound-toggle-button").forEach((btn) => {
    btn.addEventListener("click", toggleSound);
  });
  // 最初のユーザー操作でAudioContextを起動（ブラウザの自動再生制限対策）
  const unlockAudio = () => {
    getAudioContext();
    document.removeEventListener("click", unlockAudio);
  };
  document.addEventListener("click", unlockAudio, { once: true });
});
