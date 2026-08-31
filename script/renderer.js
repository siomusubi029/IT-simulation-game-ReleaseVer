// ===== フォーマット関数・描画(render)・ログ関数 =====
function formatYen(value) {
  return `¥${Math.max(0, Math.round(value)).toLocaleString("ja-JP")}`;
}

function formatTime(seconds) {
  const min = Math.max(0, Math.floor(seconds / 60));
  const sec = Math.max(0, seconds % 60);
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function getEquipment(itemId) {
  return getActiveEquipment().find((item) => item.id === itemId);
}

function getDifficulty() {
  return difficultyConfig[state.difficulty];
}

function showHomeScreen() {
  if (!els.homeScreen || !els.gameScreen) return;
  els.homeScreen.classList.remove("hidden");
  els.gameScreen.classList.add("hidden");
  document.body.classList.add("home-screen-active");
  updateEquipmentFilterOptions();
  updateHomeEquipmentCount();
}

function updateHomeEquipmentCount() {
  if (!els.homeEquipmentCount) return;
  const equipment = getActiveEquipment();
  const equipmentTypes = new Set(equipment.map(eq => eq.baseId || eq.id)).size;
  const equipmentCount = equipment.length;
  els.homeEquipmentCount.textContent = `${equipmentTypes}種類（${equipmentCount}台）`;
}

function checkOrientation() {
  if (!els.orientationWarning) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // 縦向きの場合は警告を表示
  if (height > width) {
    els.orientationWarning.classList.remove("hidden");
  } else {
    els.orientationWarning.classList.add("hidden");
  }
}

function showDifficultySelection() {
  if (!els.mobileDifficultySelection) return;
  els.mobileDifficultySelection.classList.remove("hidden");
  
  // Sync active state with current difficulty
  if (els.mobileDifficultyButtons) {
    els.mobileDifficultyButtons.forEach((button) => {
      button.classList.remove("active");
      if (button.dataset.difficulty === state.difficulty) {
        button.classList.add("active");
      }
    });
  }
}

function handleResize() {
  const isMobile = window.innerWidth <= 768;
  
  // Hide mobile difficulty selection if not in mobile mode
  if (!isMobile && els.mobileDifficultySelection) {
    els.mobileDifficultySelection.classList.add("hidden");
  }
  
  // Re-render if needed
  if (els.homeScreen && !els.homeScreen.classList.contains('hidden')) {
    updateEquipmentFilterOptions();
  }

  // ゲーム画面表示中はウィンドウサイズ変更に応じて設備の重なり補正を再計算する
  if (els.gameScreen && !els.gameScreen.classList.contains('hidden') && typeof renderEquipment === "function") {
    renderEquipment();
  }
}

function toggleIncidentSidebar() {
  if (!els.incidentSidebar) return;
  els.incidentSidebar.classList.toggle("hidden");
  if (!els.incidentSidebar.classList.contains("hidden")) {
    renderIncidentList();
  }
}

function updateEquipmentFilterOptions() {
  if (!els.equipmentFilter) return;
  const equipment = getActiveEquipment();
  const currentValue = els.equipmentFilter.value;
  
  els.equipmentFilter.innerHTML = '<option value="all">すべて</option>';
  equipment.forEach(eq => {
    const option = document.createElement("option");
    option.value = eq.id;
    option.textContent = eq.name;
    els.equipmentFilter.appendChild(option);
  });
  
  // 値を保持
  if (currentValue && Array.from(els.equipmentFilter.options).some(opt => opt.value === currentValue)) {
    els.equipmentFilter.value = currentValue;
  }
}

function renderIncidentList() {
  if (!els.incidentList) return;
  
  const modeFilter = els.modeFilter ? els.modeFilter.value : "all";
  const equipmentFilter = els.equipmentFilter ? els.equipmentFilter.value : "all";
  
  // 全モードのインシデントを取得
  const allIncidents = [];
  gameModes.forEach(mode => {
    allIncidents.push(...mode.incidents);
  });
  
  // モードフィルター
  let filteredIncidents = allIncidents;
  if (modeFilter !== "all") {
    filteredIncidents = allIncidents.filter(incident => {
      const mode = gameModes.find(m => m.id === modeFilter);
      return mode && mode.incidents.includes(incident);
    });
  }
  
  // 設備フィルター
  if (equipmentFilter !== "all") {
    filteredIncidents = filteredIncidents.filter(incident => incident.equipmentId === equipmentFilter);
  }
  
  // 設備ごとにグループ化
  const incidentsByEquipment = {};
  filteredIncidents.forEach(incident => {
    const equipmentId = incident.equipmentId;
    if (!incidentsByEquipment[equipmentId]) {
      incidentsByEquipment[equipmentId] = [];
    }
    incidentsByEquipment[equipmentId].push(incident);
  });
  
  // 設備名を取得（全モードの設備）
  const equipmentMap = {};
  gameModes.forEach(mode => {
    mode.equipment.forEach(eq => {
      equipmentMap[eq.id] = eq.name;
    });
  });
  
  // HTMLを生成
  let html = '';
  if (Object.keys(incidentsByEquipment).length === 0) {
    html = '<p class="no-incidents">該当するインシデントがありません</p>';
  } else {
    Object.keys(incidentsByEquipment).sort().forEach(equipmentId => {
      const equipmentName = equipmentMap[equipmentId] || equipmentId;
      const equipmentIncidents = incidentsByEquipment[equipmentId];
      
      html += `<div class="incident-group">
        <h3 class="incident-group-title">${equipmentName} (${equipmentIncidents.length}件)</h3>
        <ul class="incident-items">`;
      
      equipmentIncidents.forEach(incident => {
        const correctOption = incident.options[incident.correct];
        html += `<li class="incident-item">
          <div class="incident-content">
            <span class="incident-title">${incident.title}</span>
            <span class="incident-category">${incident.category}</span>
          </div>
          <div class="incident-solution">
            <span class="solution-label">対策:</span>
            <span class="solution-text">${correctOption}</span>
          </div>
        </li>`;
      });
      
      html += `</ul></div>`;
    });
  }
  
  els.incidentList.innerHTML = html;
}

function showGameScreen() {
  if (!els.homeScreen || !els.gameScreen) return;
  els.homeScreen.classList.add("hidden");
  els.gameScreen.classList.remove("hidden");
  document.body.classList.remove("home-screen-active");
}

function renderFloorLabel() {
  // ゲーム画面が非表示の場合はスキップ
  if (!els.gameScreen || els.gameScreen.classList.contains('hidden')) return;
  
  const mode = getCurrentMode();
  if (els.floorEyebrow) els.floorEyebrow.textContent = mode.floorEyebrow;
  if (els.floorTitle) els.floorTitle.textContent = mode.floorTitle;
}

function renderRooms() {
  const rooms = getAdjustedRooms();
  
  // マップ要素が存在しない、またはゲーム画面が非表示の場合はスキップ
  if (!els.map || els.gameScreen.classList.contains('hidden')) return;

  // 3Dフロアモデルを使う場合は、Blender側で作った部屋・壁をそのまま表示する
  // ため、古いDOMの部屋枠は描画しない。
  const existingContainer = els.map.querySelector('.rooms-container');
  if (existingContainer) existingContainer.remove();
  if (typeof renderCompanyScene === "function") {
    renderCompanyScene(els.map, getActiveEquipment());
    return;
  }
  
  // 既存の部屋コンテナを削除
  
  // 部屋コンテナを作成
  const roomsContainer = document.createElement('div');
  roomsContainer.className = 'rooms-container';
  
  // 部屋の壁を描画
  rooms.forEach(room => {
    const wall = document.createElement('div');
    wall.className = 'room-wall';
    wall.style.left = room.x;
    wall.style.top = room.y;
    wall.style.width = room.width;
    wall.style.height = room.height;
    
    // 部屋名を追加
    const name = document.createElement('div');
    name.className = 'room-name';
    name.textContent = room.name;
    wall.appendChild(name);
    
    roomsContainer.appendChild(wall);
  });
  
  els.map.appendChild(roomsContainer);
}

function renderEquipment() {
  if (typeof resetEquipmentModelViews === "function") resetEquipmentModelViews();
  els.equipmentLayer.innerHTML = "";
  const usingCompanyScene = typeof renderCompanyScene === "function";
  if (usingCompanyScene) {
    renderCompanyScene(els.map, getActiveEquipment());
    return;
  }
  
  getActiveEquipment().forEach((item) => {
    const status = state.equipmentStatus[item.id];
    const active = state.incidents.find((incident) => incident.equipmentId === item.id);
    const remaining = active ? Math.max(0, active.deadline - state.elapsed) : 0;
    
    // getActiveEquipment はすでに絶対座標を返すため、そのまま使用する
    let absoluteX = item.x;
    let absoluteY = item.y;
    
    const button = document.createElement("button");
    button.className = `equipment ${usingCompanyScene ? "equipment-scene-label" : ""} ${status}${active ? " incident" : ""}`;
    button.style.left = absoluteX;
    button.style.top = absoluteY;
    button.dataset.equipmentId = item.id;
    button.setAttribute("aria-label", `${item.name} ${status === "broken" ? "故障中" : active ? "トラブル発生中" : "正常"}`);

    // インシデント時は state 行に残り時間バッジをインライン表示（重なり防止）
    const stateText = status === "broken" ? "故障中：復旧" : "正常稼働";
    const stateContent = active
      ? `要対応 <span class="countdown-badge">${remaining}s</span>`
      : stateText;
    button.title = `${item.name}\n${item.subtitle}`;
    const modelHtml = usingCompanyScene
      ? ""
      : `<span class="equipment-model" data-equipment-model="${item.id}" aria-hidden="true"><span class="equipment-model-fallback">${item.icon}</span></span>`;
    button.innerHTML = `
      <div class="equipment-content">
        ${modelHtml}
        <span class="equipment-name">${item.name}</span>
        <span class="equipment-subtitle">${item.subtitle}</span>
        <span class="equipment-state">${stateContent}</span>
        <span class="equipment-upgrade-level">Lv ${getUpgradeLevel(item.id)} ${getUpgradeLabel(getUpgradeLevel(item.id))}</span>
      </div>
      ${active ? `<span class="incident-marker">!<span class="marker-timer"></span></span>` : ""}
    `;
    button.addEventListener("click", () => handleEquipmentClick(item.id));
    els.equipmentLayer.appendChild(button);
    const modelSlot = button.querySelector(".equipment-model");
    if (modelSlot && typeof renderEquipmentModel === "function") {
      renderEquipmentModel(modelSlot, item, { status, hasIncident: !!active });
    }
  });

  // 事前計算した%座標だけでは、実際に描画されたカードサイズ（文字量やフォントの折返しで
  // 微妙に変わる）とズレて重なりが残ることがあるため、実際のDOM上のサイズを測定して
  // 重なっているカード同士を押し離す補正を行う。
  resolveEquipmentOverlaps();
}

// 描画済みの設備カード同士の重なりを実測して解消する
function resolveEquipmentOverlaps() {
  if (!els.equipmentLayer) return;
  const layerRect = els.equipmentLayer.getBoundingClientRect();
  // ゲーム画面が非表示（幅・高さが取得できない）場合は何もしない
  if (layerRect.width < 10 || layerRect.height < 10) return;

  const nodes = Array.from(els.equipmentLayer.querySelectorAll(".equipment"));
  if (nodes.length < 2) return;

  const items = nodes.map((el) => {
    const rect = el.getBoundingClientRect();
    return {
      el,
      cx: rect.left + rect.width / 2 - layerRect.left,
      cy: rect.top + rect.height / 2 - layerRect.top,
      hw: rect.width / 2,
      hh: rect.height / 2
    };
  });

  const padding = 8; // カード間に確保する最低余白(px)
  const maxIterations = 30;

  for (let pass = 0; pass < maxIterations; pass++) {
    let moved = false;
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i];
        const b = items[j];
        const dx = b.cx - a.cx;
        const dy = b.cy - a.cy;
        const minDistX = a.hw + b.hw + padding;
        const minDistY = a.hh + b.hh + padding;
        const overlapX = minDistX - Math.abs(dx);
        const overlapY = minDistY - Math.abs(dy);
        if (overlapX > 0 && overlapY > 0) {
          // 重なりが小さい軸方向にだけ押し出す
          if (overlapX < overlapY) {
            const push = overlapX / 2 + 0.5;
            const dir = dx === 0 ? (Math.random() < 0.5 ? 1 : -1) : Math.sign(dx);
            a.cx -= dir * push;
            b.cx += dir * push;
          } else {
            const push = overlapY / 2 + 0.5;
            const dir = dy === 0 ? (Math.random() < 0.5 ? 1 : -1) : Math.sign(dy);
            a.cy -= dir * push;
            b.cy += dir * push;
          }
          moved = true;
        }
      }
    }
    if (!moved) break;
  }

  // マップ内に収まるようクランプしてDOMへ反映
  items.forEach((item) => {
    const minX = item.hw + 4;
    const maxX = layerRect.width - item.hw - 4;
    const minY = item.hh + 4;
    const maxY = layerRect.height - item.hh - 4;
    const clampedX = Math.max(minX, Math.min(maxX, item.cx));
    const clampedY = Math.max(minY, Math.min(maxY, item.cy));
    item.el.style.left = `${clampedX}px`;
    item.el.style.top = `${clampedY}px`;
  });
}

function renderStats() {
  renderUpgradeList();
  renderNewsTicker();
  if (!els.timer) return;
  const brokenCount = Object.values(state.equipmentStatus).filter((status) => status === "broken").length;
  
  els.timer.textContent = formatTime(state.timeRemaining);
  if (els.timerBar) els.timerBar.style.width = `${(state.timeRemaining / GAME_DURATION) * 100}%`;
  if (els.funds) els.funds.textContent = formatYen(state.funds);
  if (els.homeIncidentCount) {
    // ホーム画面では総インシデント数を表示
    els.homeIncidentCount.textContent = `${getActiveIncidents().length}種類`;
  }
  if (els.trust) els.trust.textContent = Math.max(0, Math.round(state.trust));
  if (els.trustBar) els.trustBar.style.width = `${Math.max(0, Math.min(100, state.trust))}%`;
  if (els.incidentCount) els.incidentCount.textContent = state.incidents.length;
  if (els.brokenCount) els.brokenCount.textContent = brokenCount;
  if (els.resolvedCount) els.resolvedCount.textContent = state.resolved;
  if (els.streakCount) els.streakCount.textContent = state.streak;
  if (els.nextIncident) els.nextIncident.textContent = "--";

  if (els.trustDetail) {
    if (state.trust >= 75) {
      els.trustDetail.textContent = "社内外から信頼されています";
    } else if (state.trust >= 45) {
      els.trustDetail.textContent = "対応品質に不安の声が出ています";
    } else {
      els.trustDetail.textContent = "信用が急速に失われています";
    }
  }

  if (els.fundsDetail) {
    if (brokenCount === 0) {
      els.fundsDetail.textContent = getTotalUpgradeLevel() > 0
        ? `設備投資 Lv ${getTotalUpgradeLevel()} が収益を底上げ中`
        : "運営は安定しています";
    } else {
      els.fundsDetail.textContent = `故障設備 ${brokenCount} 台が収益を圧迫中`;
    }
  }

  if (els.trustBar) {
    if (state.trust >= 70) {
      els.trustBar.style.background = "linear-gradient(90deg, #8ee87a, #42d7ef)";
    } else if (state.trust >= 35) {
      els.trustBar.style.background = "linear-gradient(90deg, #ffd35a, #ff9c59)";
    } else {
      els.trustBar.style.background = "linear-gradient(90deg, #ff9c59, #ff5e6c)";
    }
  }

  // Update mobile overlay stats
  if (els.mobileTimer) els.mobileTimer.textContent = formatTime(state.timeRemaining);
  if (els.mobileFunds) els.mobileFunds.textContent = `¥${(state.funds / 1000).toFixed(0)}k`;
  if (els.mobileTrust) els.mobileTrust.textContent = `${Math.max(0, Math.round(state.trust))}%`;

  if (!state.started) {
    setGameStatus("待機中", "standby");
  } else if (state.ended) {
    setGameStatus("終了", "danger");
  } else if (state.paused) {
    setGameStatus("判断中", "paused");
  } else if (state.trust <= 30 || state.funds <= 15000) {
    setGameStatus("危機", "danger");
  } else {
    setGameStatus("営業中", "running");
  }
}

function setGameStatus(text, className) {
  if (!els.gameStatus) return;
  els.gameStatus.textContent = text;
  els.gameStatus.className = `game-status ${className}`;
}

function renderNewsTicker() {
  if (!els.newsTickerText) return;
  if (!state.started) {
    els.newsTickerText.textContent = "営業開始後、IT運用ニュース速報が流れます。";
  }
}

function addLog(message, type = "neutral") {
  if (!els.eventLog) return;
  const li = document.createElement("li");
  li.className = `log-entry ${type}`;
  li.innerHTML = `<span>${formatTime(state.timeRemaining)}</span>${message}`;
  els.eventLog.prepend(li);
}

function showLogModal() {
  if (!els.logModal || !els.logModalContent || !els.eventLog) return;
  
  // Copy all log entries to modal
  const logEntries = els.eventLog.querySelectorAll('.log-entry');
  let html = '';
  logEntries.forEach(entry => {
    html += entry.outerHTML;
  });
  
  if (logEntries.length === 0) {
    html = '<li class="log-entry neutral"><span>--:--</span>履歴がありません。</li>';
  }
  
  els.logModalContent.innerHTML = html;
  els.logModal.classList.remove('hidden');
}

function hideLogModal() {
  if (!els.logModal) return;
  els.logModal.classList.add('hidden');
}

function clearLog() {
  if (!els.eventLog) return;
  els.eventLog.innerHTML = "";
}


function getUpgradeLevel(equipmentId) {
  return Math.max(0, Math.min(UPGRADE_MAX_LEVEL, state.equipmentUpgrades?.[equipmentId] || 0));
}

function getUpgradeLabel(level) {
  return UPGRADE_LEVEL_LABELS[level] || UPGRADE_LEVEL_LABELS[0];
}

function getUpgradeDescription(level) {
  return UPGRADE_LEVEL_DESCRIPTIONS[level] || UPGRADE_LEVEL_DESCRIPTIONS[0];
}

function getUpgradeCost(equipmentId) {
  const level = getUpgradeLevel(equipmentId);
  if (level >= UPGRADE_MAX_LEVEL) return null;
  const equipment = getEquipment(equipmentId);
  const activeIncidents = getActiveIncidents().filter((incident) => incident.equipmentId === equipmentId);
  const averageRepair = activeIncidents.length
    ? activeIncidents.reduce((sum, incident) => sum + incident.repairCost, 0) / activeIncidents.length
    : 10000;
  const modeMultiplier = getDifficulty().rewardMultiplier || 1;
  const cost = UPGRADE_BASE_COST + level * UPGRADE_LEVEL_COST_STEP + Math.round(averageRepair * 0.22);
  return Math.round(cost * (0.92 + modeMultiplier * 0.08) * (equipment?.baseId ? 0.92 : 1));
}

function getTotalUpgradeLevel() {
  return Object.values(state.equipmentUpgrades || {}).reduce((sum, level) => sum + level, 0);
}

function getWarningMultiplier(equipmentId) {
  return 1 + getUpgradeLevel(equipmentId) * UPGRADE_EFFECTS.warningBonusPerLevel;
}

function getIncidentPressureMultiplier(equipmentId) {
  return Math.max(0.62, 1 - getUpgradeLevel(equipmentId) * UPGRADE_EFFECTS.pressureReductionPerLevel);
}

function getAdjustedPenalty(incident) {
  return Math.max(1, Math.round(incident.penalty * (1 - getUpgradeLevel(incident.equipmentId) * UPGRADE_EFFECTS.trustProtectionPerLevel)));
}

function getAdjustedRepairCost(equipmentId, baseCost) {
  return Math.max(1000, Math.round(baseCost * (1 - getUpgradeLevel(equipmentId) * UPGRADE_EFFECTS.repairDiscountPerLevel)));
}

function getRevenueMultiplier() {
  return 1 + getTotalUpgradeLevel() * UPGRADE_EFFECTS.revenueBonusPerLevel;
}

function getBrokenCostMultiplier() {
  return Math.max(0.68, 1 - getTotalUpgradeLevel() * 0.015);
}

function getBrokenTrustMultiplier() {
  return Math.max(0.72, 1 - getTotalUpgradeLevel() * 0.012);
}

function investInEquipment(equipmentId) {
  if (!state.started || state.ended || state.paused) return;
  const level = getUpgradeLevel(equipmentId);
  const cost = getUpgradeCost(equipmentId);
  const equipment = getEquipment(equipmentId);
  if (!equipment || cost === null) return;
  if (state.funds < cost) {
    addLog(`投資見送り：${equipment.name} の強化には ${formatYen(cost)} が必要です。`, "warning");
    if (typeof sfx !== "undefined") sfx.wrong();
    renderUpgradeList();
    return;
  }
  state.funds -= cost;
  state.equipmentUpgrades[equipmentId] = level + 1;
  state.upgradeSpend += cost;
  const nextLevel = level + 1;
  addLog(`設備投資：${equipment.name} を Lv ${nextLevel} ${getUpgradeLabel(nextLevel)} に強化しました（${formatYen(cost)}）。`, "success");
  if (typeof sfx !== "undefined") sfx.repair();
  renderAll();
}

function renderUpgradeList() {
  if (!els.upgradeList) return;
  const equipment = getActiveEquipment();
  if (!state.equipmentUpgrades) {
    state.equipmentUpgrades = Object.fromEntries(equipment.map((item) => [item.id, 0]));
  }
  const totalLevel = getTotalUpgradeLevel();
  if (els.upgradeTotal) els.upgradeTotal.textContent = `Lv ${totalLevel}`;
  if (els.upgradeDetail) {
    els.upgradeDetail.textContent = totalLevel === 0
      ? "投資すると猶予時間・復旧費・収益が改善します。"
      : `収益 +${Math.round((getRevenueMultiplier() - 1) * 100)}%、復旧費を投資Lvに応じて軽減中。`;
  }
  els.upgradeList.innerHTML = equipment.map((item) => {
    const level = getUpgradeLevel(item.id);
    const cost = getUpgradeCost(item.id);
    const disabled = !state.started || state.ended || state.paused || cost === null || state.funds < cost;
    const status = level >= UPGRADE_MAX_LEVEL ? "最大" : formatYen(cost);
    const nextLevel = Math.min(UPGRADE_MAX_LEVEL, level + 1);
    const levelText = level >= UPGRADE_MAX_LEVEL
      ? `Lv ${level} ${getUpgradeLabel(level)}`
      : `次: Lv ${nextLevel} ${getUpgradeLabel(nextLevel)}`;
    return `<button class="upgrade-button" data-equipment-id="${item.id}" title="${getUpgradeDescription(nextLevel)}" ${disabled ? "disabled" : ""}>
      <span class="upgrade-name"><span>${item.icon}</span>${item.name}</span>
      <span class="upgrade-meta">${levelText}</span>
      <span class="upgrade-effect">${getUpgradeDescription(nextLevel)}</span>
      <span class="upgrade-cost">${status}</span>
    </button>`;
  }).join("");
  els.upgradeList.querySelectorAll(".upgrade-button").forEach((button) => {
    button.addEventListener("click", () => investInEquipment(button.dataset.equipmentId));
  });
}
