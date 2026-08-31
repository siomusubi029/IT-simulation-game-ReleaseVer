// ===== ゲーム開始/リセット・メインループ・インシデント発生処理 =====
function enterGameScreen() {
  resetState();
  state.paused = false;
  showGameScreen();
  els.startOverlay.classList.remove("hidden");
  els.startButton.textContent = "リスタート";
  initEmployees();
  renderAll();
}

function beginBusiness() {
  if (state.started || state.ended) return;
  state.started = true;
  state.paused = false;
  els.startOverlay.classList.add("hidden");
  setDifficultyButtonsDisabled(true);
  setModeButtonsDisabled(true);
  addLog(`${getDifficulty().label}モードで営業開始（${getCurrentMode().logLabel}）。ITトラブルに備えてください。`, "success");
  renderAll();
  clearInterval(state.timerId);
  state.timerId = setInterval(gameTick, 1000);
}

function restartFromGame() {
  if (state.started && !state.ended) {
    const confirmed = window.confirm("進行中のデータは失われます。リスタートしますか？");
    if (!confirmed) return;
  }
  enterGameScreen();
}

function returnToHome() {
  if (state.started && !state.ended) {
    showHomeOptionScreen();
    return;
  }
  goHome();
}

function resetState() {
  clearInterval(state.timerId);
  state.started = false;
  state.ended = false;
  state.paused = false;
  state.elapsed = 0;
  state.timeRemaining = GAME_DURATION;
  state.funds = STARTING_FUNDS;
  state.trust = STARTING_TRUST;
  state.resolved = 0;
  state.mistakes = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.nextIncidentIn = getDifficulty().firstIncident;
  state.nextNewsIn = 5;
  state.currentNewsIndex = -1;
  state.newsForecast = null;
  state.incidents = [];
  state.review = [];
  state.learningTagCounts = {};
  state.minTrustSeen = STARTING_TRUST;
  state.cachedEquipment = null; // キャッシュをクリア
  state.equipmentStatus = Object.fromEntries(getActiveEquipment().map((item) => [item.id, "normal"]));
  state.equipmentUpgrades = Object.fromEntries(getActiveEquipment().map((item) => [item.id, 0]));
  state.upgradeSpend = 0;
  setDifficultyButtonsDisabled(false);
  setModeButtonsDisabled(false);
  clearLog();
  hideModal();
  renderFloorLabel();
  els.startOverlay.classList.add("hidden");
  els.resultModal.classList.add("hidden");
  clearEmployees();
}

function restartGame() {
  goHome();
}

function showHomeOptionScreen() {
  state.paused = true;
  showHomeScreen();
  els.resumeChoice.classList.remove("hidden");
  els.resumeContinueButton.focus();
  syncDifficultyButtons();
  renderAll();
}

function hideHomeOptionScreen() {
  els.resumeChoice.classList.add("hidden");
}

function continueFromHome() {
  hideHomeOptionScreen();
  showGameScreen();
  state.paused = false;
  renderAll();
}

function restartFromHome() {
  resetState();
  hideHomeOptionScreen();
}

function goHome() {
  resetState();
  els.resultModal.classList.add("hidden");
  els.resumeChoice.classList.add("hidden");
  showHomeScreen();
  syncDifficultyButtons();
  renderAll();
}

function gameTick() {
  if (!state.started || state.ended || state.paused) return;

  state.elapsed += 1;
  state.timeRemaining -= 1;
  state.nextIncidentIn -= 1;

  processIncidents();
  processOperations();
  processNewsTicker();
  state.minTrustSeen = Math.min(state.minTrustSeen ?? STARTING_TRUST, state.trust);

  if (state.nextIncidentIn <= 0) {
    spawnIncident();
    const difficulty = getDifficulty();
    const rampDelay = difficulty.rampDelay || 0;
    const rampedElapsed = Math.max(0, state.elapsed - rampDelay);
    const base = Math.max(difficulty.minimumSpawn, difficulty.spawnBase - Math.floor(rampedElapsed / 45));
    state.nextIncidentIn = base + Math.floor(Math.random() * 4);
  }

  renderAll();
  checkEndConditions();
}

function processOperations() {
  const difficulty = getDifficulty();
  const brokenCount = Object.values(state.equipmentStatus).filter((status) => status === "broken").length;
  const rawPressure = Math.min(difficulty.pressureCap || 999, state.incidents.reduce((sum, incident) => sum + incident.severity * getIncidentPressureMultiplier(incident.equipmentId), 0));
  const activePressure = rawPressure * difficulty.pressureMultiplier;

  if (state.elapsed % 5 === 0) {
    const revenue = Math.round(Math.max(700, 3000 - brokenCount * 800) * (difficulty.revenueMultiplier || 1) * getRevenueMultiplier());
    state.funds += revenue;
    addLog(`通常業務の収益 ${formatYen(revenue)} を計上しました。`, "success");
  }

  if (brokenCount > 0) {
    state.funds -= Math.round(brokenCount * 350 * getBrokenCostMultiplier());
    state.trust -= brokenCount * 0.7 * getBrokenTrustMultiplier();
  }
  if (activePressure > 0) {
    state.trust -= activePressure * 0.23;
  }
}

function processIncidents() {
  const expired = state.incidents.filter((incident) => state.elapsed >= incident.deadline);
  expired.forEach((incident) => {
    convertToBroken(incident, "放置");
  });
}

function spawnIncident(targetEquipmentId = null) {
  const available = getActiveIncidents().filter((candidate) => {
    const noActive = !state.incidents.some((incident) => incident.equipmentId === candidate.equipmentId);
    const notBroken = state.equipmentStatus[candidate.equipmentId] !== "broken";
    const matchesTarget = !targetEquipmentId || candidate.equipmentId === targetEquipmentId;
    return noActive && notBroken && matchesTarget;
  });

  if (available.length === 0) return;

  const pick = pickIncidentByNewsForecast(available, targetEquipmentId);
  const incident = {
    ...pick,
    instanceId: `${pick.id}-${Date.now()}-${Math.random()}`,
    startedAt: state.elapsed,
    deadline: state.elapsed + Math.ceil(pick.warning * getDifficulty().warningMultiplier * getWarningMultiplier(pick.equipmentId))
  };
  state.incidents.push(incident);
  addLog(`トラブル発生：${getEquipment(pick.equipmentId).name}で「${pick.title}」`, "warning");
  renderEquipment();
  if (typeof sfx !== "undefined") sfx.incidentSpawn();
}


function isNewsForecastActive() {
  return !!state.newsForecast && state.elapsed <= state.newsForecast.expiresAt;
}

function getNewsForecastWeight(candidate) {
  if (!isNewsForecastActive()) return 1;
  const forecast = state.newsForecast;
  let weight = 1;
  if (forecast.categories?.includes(candidate.category)) weight *= NEWS_FORECAST_BONUS;
  if (forecast.equipment?.includes(candidate.equipmentId)) weight *= NEWS_FORECAST_BONUS;
  return weight;
}

function pickIncidentByNewsForecast(available, targetEquipmentId = null) {
  if (targetEquipmentId || !isNewsForecastActive()) {
    return available[Math.floor(Math.random() * available.length)];
  }

  const weighted = available.map((candidate) => ({ candidate, weight: getNewsForecastWeight(candidate) }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) return item.candidate;
  }
  return weighted[weighted.length - 1].candidate;
}
function getActiveNewsItems() {
  return NEWS_TICKER_ITEMS.filter((item) => !item.modes || item.modes.includes(state.gameMode));
}

function processNewsTicker() {
  if (!els.newsTickerText) return;
  state.nextNewsIn -= 1;
  if (state.nextNewsIn > 0) return;
  showNextNewsItem();
  state.nextNewsIn = NEWS_TICKER_INTERVAL;
}

function showNextNewsItem() {
  const items = getActiveNewsItems();
  if (!items.length || !els.newsTickerText) return;
  state.currentNewsIndex = (state.currentNewsIndex + 1) % items.length;
  const item = items[state.currentNewsIndex];
  const rule = NEWS_FORECAST_RULES[item.tag];
  state.newsForecast = rule ? {
    tag: item.tag,
    categories: rule.categories || [],
    equipment: rule.equipment || [],
    expiresAt: state.elapsed + NEWS_FORECAST_DURATION
  } : null;
  const hint = rule ? `<span class="news-hint">予兆</span>` : "";
  els.newsTickerText.innerHTML = `<strong>${item.tag}</strong>${hint}${item.text}`;
  els.newsTickerText.classList.remove("news-pulse");
  void els.newsTickerText.offsetWidth;
  els.newsTickerText.classList.add("news-pulse");
}
