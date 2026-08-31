// ===== ローカルランキングシステム（モード・難易度ごとのハイスコア） =====
const LEADERBOARD_STORAGE_KEY = "itsim_leaderboard";
const LEADERBOARD_MAX_ENTRIES = 5;

function computeScore() {
  return Math.max(0, Math.round(
    state.funds + state.trust * 1000 + state.resolved * 500 - state.mistakes * 300
  ));
}

function loadLeaderboardData() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveLeaderboardData(data) {
  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    /* localStorageが使えない環境では何もしない */
  }
}

function leaderboardKey(mode, difficulty) {
  return `${mode}-${difficulty}`;
}

// 現在の結果をハイスコアとして記録し、新記録かどうかを返す
function recordScoreIfRelevant(isWin) {
  if (!isWin) return { isNewRecord: false, rank: null, score: 0 };
  const score = computeScore();
  const data = loadLeaderboardData();
  const key = leaderboardKey(state.gameMode, state.difficulty);
  const list = data[key] || [];
  list.push({ score, date: new Date().toISOString(), resolved: state.resolved, mistakes: state.mistakes });
  list.sort((a, b) => b.score - a.score);
  const trimmed = list.slice(0, LEADERBOARD_MAX_ENTRIES);
  data[key] = trimmed;
  saveLeaderboardData(data);
  const rank = trimmed.findIndex((entry) => entry.date && list[0] && entry.score === score && entry.resolved === state.resolved && entry.mistakes === state.mistakes);
  return { isNewRecord: rank === 0, rank: rank >= 0 ? rank + 1 : null, score };
}

function formatLeaderboardDate(isoString) {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function renderLeaderboardList(mode, difficulty, container) {
  if (!container) return;
  const data = loadLeaderboardData();
  const list = data[leaderboardKey(mode, difficulty)] || [];
  if (list.length === 0) {
    container.innerHTML = `<p class="no-incidents">まだ記録がありません。営業を乗り切ってランキング入りを目指しましょう。</p>`;
    return;
  }
  container.innerHTML = `
    <ol class="leaderboard-list">
      ${list.map((entry, index) => `
        <li class="leaderboard-item">
          <span class="leaderboard-rank">${index + 1}</span>
          <span class="leaderboard-score">${entry.score.toLocaleString("ja-JP")} pt</span>
          <span class="leaderboard-meta">解決 ${entry.resolved} ・ 誤対応 ${entry.mistakes}</span>
          <span class="leaderboard-date">${formatLeaderboardDate(entry.date)}</span>
        </li>
      `).join("")}
    </ol>
  `;
}

function getModeLabel(modeId) {
  const mode = gameModes.find((m) => m.id === modeId);
  return mode ? mode.name : modeId;
}

function renderLeaderboardPanel() {
  const select = document.getElementById("leaderboard-mode-select");
  const diffSelect = document.getElementById("leaderboard-difficulty-select");
  const container = document.getElementById("leaderboard-content");
  if (!select || !diffSelect || !container) return;
  renderLeaderboardList(select.value, diffSelect.value, container);
}

function openLeaderboardModal() {
  const select = document.getElementById("leaderboard-mode-select");
  const diffSelect = document.getElementById("leaderboard-difficulty-select");
  if (select) select.value = state.gameMode;
  if (diffSelect) diffSelect.value = state.difficulty;
  renderLeaderboardPanel();
  const modal = document.getElementById("leaderboard-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeLeaderboardModal() {
  const modal = document.getElementById("leaderboard-modal");
  if (modal) modal.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("leaderboard-open-button");
  const closeBtn = document.getElementById("leaderboard-modal-close");
  const select = document.getElementById("leaderboard-mode-select");
  const diffSelect = document.getElementById("leaderboard-difficulty-select");
  if (openBtn) openBtn.addEventListener("click", openLeaderboardModal);
  if (closeBtn) closeBtn.addEventListener("click", closeLeaderboardModal);
  if (select) select.addEventListener("change", renderLeaderboardPanel);
  if (diffSelect) diffSelect.addEventListener("change", renderLeaderboardPanel);
});
