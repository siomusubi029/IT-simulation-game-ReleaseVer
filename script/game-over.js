// ===== 終了判定・結果画面表示 =====
function renderResultLearningSummary() {
  if (!els.resultLearning) return;
  const entries = Object.entries(state.learningTagCounts || {})
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja"))
    .slice(0, 5);

  if (entries.length === 0) {
    els.resultLearning.innerHTML = `
      <h3>今回よく出た分野</h3>
      <p class="result-learning-empty">まだ記録された分野はありません。トラブルに対応すると、ここに復習候補が表示されます。</p>
    `;
    return;
  }

  els.resultLearning.innerHTML = `
    <h3>今回よく出た分野</h3>
    <div class="result-learning-tags">
      ${entries.map(([tag, count], index) => `
        <div class="result-learning-tag">
          <span class="result-learning-rank">${index + 1}</span>
          <strong>${escapeHtml(tag)}</strong>
          <span>${count}回</span>
        </div>
      `).join("")}
    </div>
  `;
}
function checkEndConditions() {
  if (state.ended) return;
  if (state.trust <= 0) {
    finishGame(false, "信頼度が0になりました。取引先と社員からの信用を失い、事業継続が困難になりました。");
  } else if (state.funds <= 0) {
    finishGame(false, "資金が0になりました。復旧費用と運営損失を支えきれず、倒産しました。");
  } else if (state.timeRemaining <= 0) {
    finishGame(true, "営業終了まで会社を守り切りました。今日の対応を振り返り、次の危機に備えましょう。");
  }
}

function finishGame(isWin, message) {
  state.ended = true;
  state.paused = false;
  setDifficultyButtonsDisabled(false);
  clearInterval(state.timerId);
  hideModal();
  renderAll();

  if (typeof sfx !== "undefined") isWin ? sfx.win() : sfx.lose();
  if (typeof checkAchievementsOnGameFinish === "function") checkAchievementsOnGameFinish(isWin);
  const scoreResult = typeof recordScoreIfRelevant === "function" ? recordScoreIfRelevant(isWin) : { isNewRecord: false, score: 0 };

  els.resultEyebrow.textContent = isWin ? "SHIFT COMPLETE" : "BANKRUPTCY";
  els.resultEyebrow.style.color = isWin ? "var(--lime)" : "var(--red)";
  els.resultTitle.textContent = isWin ? "営業を乗り切りました" : "倒産しました";
  els.resultMessage.textContent = message;
  els.resultFunds.textContent = formatYen(state.funds);
  els.resultTrust.textContent = Math.max(0, Math.round(state.trust));
  els.resultResolved.textContent = state.resolved;
  els.resultMistakes.textContent = state.mistakes;
  els.resultStreak.textContent = state.bestStreak;
  if (els.resultUpgrades) els.resultUpgrades.textContent = getTotalUpgradeLevel();
  renderResultLearningSummary();

  if (els.resultScorePanel) {
    if (isWin) {
      els.resultScorePanel.classList.remove("hidden");
      els.resultScorePanel.innerHTML = `
        <span class="score-label">総合スコア</span>
        <strong class="score-value">${scoreResult.score.toLocaleString("ja-JP")} pt</strong>
        ${scoreResult.isNewRecord ? `<span class="score-record-badge">🏆 自己ベスト更新！</span>` : ""}
      `;
    } else {
      els.resultScorePanel.classList.add("hidden");
      els.resultScorePanel.innerHTML = "";
    }
  }

  const uniqueReviews = [...new Map(state.review.map((item) => [item.title, item])).values()];
  els.reviewList.innerHTML = uniqueReviews.length
    ? `<h3>復習ポイント</h3>${uniqueReviews.slice(0, 4).map((item) => `<div class="review-item"><strong>${item.title}</strong><br>${item.explanation}</div>`).join("")}`
    : `<div class="review-item">大きな誤対応はありませんでした。次はより高い難易度を想定した問題追加ができます。</div>`;
  els.resultModal.classList.remove("hidden");
  els.resultModal.classList.toggle("win", isWin);
  els.resultModal.classList.toggle("lose", !isWin);
}
