// ===== 実績（アチーブメント）システム =====
const ACHIEVEMENTS_STORAGE_KEY = "itsim_achievements";

const achievementDefs = [
  {
    id: "first-resolve",
    icon: "🎯",
    name: "初動対応",
    description: "はじめてトラブルを解決する"
  },
  {
    id: "streak-5",
    icon: "🔥",
    name: "好調の波",
    description: "5連続でトラブルに正解する"
  },
  {
    id: "streak-10",
    icon: "⚡",
    name: "エキスパート対応",
    description: "10連続でトラブルに正解する"
  },
  {
    id: "no-mistake-clear",
    icon: "🏅",
    name: "ノーミス運営",
    description: "誤対応ゼロで営業を乗り切る"
  },
  {
    id: "comeback",
    icon: "🛟",
    name: "土壇場の逆転",
    description: "信頼度20以下から立て直して営業を乗り切る"
  },
  {
    id: "rich-finish",
    icon: "💰",
    name: "堅実経営",
    description: "資金15万円以上を残して営業を終える"
  },
  {
    id: "veryhard-clear",
    icon: "👑",
    name: "百戦錬磨",
    description: "ベリーハード難易度で営業を乗り切る"
  },
  {
    id: "all-modes-clear",
    icon: "🌐",
    name: "オールラウンダー",
    description: "4つすべての業種で営業を乗り切る"
  },
  {
    id: "resolved-20",
    icon: "🧰",
    name: "頼れる担当者",
    description: "累計20件のトラブルを解決する（複数プレイ合算）"
  },
  {
    id: "quick-response",
    icon: "🚀",
    name: "秒速対応",
    description: "発生から3秒以内にトラブルへ正解する"
  }
];

const achievementState = {
  unlocked: new Set(),
  clearedModes: new Set(),
  totalResolved: 0
};

function loadAchievements() {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    achievementState.unlocked = new Set(data.unlocked || []);
    achievementState.clearedModes = new Set(data.clearedModes || []);
    achievementState.totalResolved = data.totalResolved || 0;
  } catch (e) {
    /* 読み込み失敗時は初期状態のまま */
  }
}

function saveAchievements() {
  try {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify({
      unlocked: [...achievementState.unlocked],
      clearedModes: [...achievementState.clearedModes],
      totalResolved: achievementState.totalResolved
    }));
  } catch (e) {
    /* localStorageが使えない環境では何もしない */
  }
}

function unlockAchievement(id) {
  if (achievementState.unlocked.has(id)) return;
  const def = achievementDefs.find((a) => a.id === id);
  if (!def) return;
  achievementState.unlocked.add(id);
  saveAchievements();
  showAchievementToast(def);
  if (typeof sfx !== "undefined") sfx.achievement();
}

function showAchievementToast(def) {
  const container = document.getElementById("achievement-toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "achievement-toast";
  toast.innerHTML = `
    <span class="achievement-toast-icon">${def.icon}</span>
    <div class="achievement-toast-body">
      <span class="achievement-toast-label">実績を解除しました</span>
      <strong>${def.name}</strong>
      <span class="achievement-toast-desc">${def.description}</span>
    </div>
  `;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("visible"));
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 400);
  }, 4200);
}

// ===== ゲーム内イベントに応じた実績チェック =====
function checkAchievementOnCorrectAnswer(incident) {
  unlockAchievement("first-resolve");
  achievementState.totalResolved += 1;
  saveAchievements();
  if (achievementState.totalResolved >= 20) unlockAchievement("resolved-20");
  if (state.streak >= 5) unlockAchievement("streak-5");
  if (state.streak >= 10) unlockAchievement("streak-10");
  const respondedIn = state.elapsed - incident.startedAt;
  if (respondedIn <= 3) unlockAchievement("quick-response");
}

function checkAchievementsOnGameFinish(isWin) {
  if (!isWin) return;
  if (state.mistakes === 0) unlockAchievement("no-mistake-clear");
  if (state.funds >= 150000) unlockAchievement("rich-finish");
  if (state.difficulty === "veryhard") unlockAchievement("veryhard-clear");
  if (state.minTrustSeen !== undefined && state.minTrustSeen <= 20) unlockAchievement("comeback");

  achievementState.clearedModes.add(state.gameMode);
  saveAchievements();
  if (["office", "security", "infra", "startup"].every((m) => achievementState.clearedModes.has(m))) {
    unlockAchievement("all-modes-clear");
  }
}

// ===== 実績パネルの描画 =====
function renderAchievementsPanel() {
  const grid = document.getElementById("achievements-grid");
  if (!grid) return;
  const unlockedCount = achievementDefs.filter((a) => achievementState.unlocked.has(a.id)).length;
  const progressEl = document.getElementById("achievements-progress");
  if (progressEl) {
    progressEl.textContent = `${unlockedCount} / ${achievementDefs.length} 解除済み`;
  }
  grid.innerHTML = achievementDefs.map((def) => {
    const unlocked = achievementState.unlocked.has(def.id);
    return `
      <div class="achievement-badge ${unlocked ? "unlocked" : "locked"}">
        <span class="achievement-badge-icon">${unlocked ? def.icon : "🔒"}</span>
        <div class="achievement-badge-body">
          <strong>${unlocked ? def.name : "???"}</strong>
          <span>${unlocked ? def.description : "未解除の実績です"}</span>
        </div>
      </div>
    `;
  }).join("");
}

function openAchievementsModal() {
  renderAchievementsPanel();
  const modal = document.getElementById("achievements-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeAchievementsModal() {
  const modal = document.getElementById("achievements-modal");
  if (modal) modal.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  loadAchievements();
  const openBtn = document.getElementById("achievements-open-button");
  const closeBtn = document.getElementById("achievements-modal-close");
  if (openBtn) openBtn.addEventListener("click", openAchievementsModal);
  if (closeBtn) closeBtn.addEventListener("click", closeAchievementsModal);
});
