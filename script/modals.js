// ===== 設備クリック処理・インシデント/復旧モーダル制御 =====
function handleEquipmentClick(equipmentId) {
  if (!state.started || state.ended) return;
  if (typeof sfx !== "undefined") sfx.click();
  const active = state.incidents.find((incident) => incident.equipmentId === equipmentId);
  if (active) {
    openIncidentModal(active);
    return;
  }
  if (state.equipmentStatus[equipmentId] === "broken") {
    openRepairModal(equipmentId);
  }
}

function getShuffledOptionOrder(length) {
  const order = Array.from({ length }, (_, index) => index);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}


const CATEGORY_LEARNING_LABELS = {
  SECURITY: "セキュリティ",
  NETWORK: "ネットワーク",
  ACCESS: "認証・権限",
  SERVER: "サーバー",
  STORAGE: "ストレージ",
  POWER: "電源・可用性",
  ENVIRONMENT: "運用環境",
  PHYSICAL: "物理管理",
  MANAGEMENT: "運用管理",
  DATABASE: "データベース",
  WEB: "Web",
  CLOUD: "クラウド",
  SOFTWARE: "ソフトウェア",
  HARDWARE: "ハードウェア",
  CONFIGURATION: "設定",
  CONNECTIVITY: "接続",
  BACKUP: "バックアップ",
  RECOVERY: "復旧",
  MONITORING: "監視",
  LOGGING: "ログ",
  PERFORMANCE: "性能",
  CAPACITY: "容量管理",
  AVAILABILITY: "可用性",
  RELIABILITY: "信頼性",
  VULNERABILITY: "脆弱性",
  POLICY: "ポリシー",
  COMPLIANCE: "コンプライアンス",
  DEPLOYMENT: "デプロイ",
  INTEGRATION: "外部連携",
  AUTOMATION: "自動化",
  COST: "コスト管理"
};

const CATEGORY_EXAM_POINTS = {
  SECURITY: "機密性・完全性・可用性を意識し、怪しい操作は実行前に確認と報告を行います。",
  NETWORK: "障害対応では、影響範囲を確認し、物理接続・IP設定・名前解決・経路を順番に切り分けます。",
  ACCESS: "権限は最小権限の原則で付与し、本人確認と業務上必要な範囲を確認します。",
  SERVER: "サーバー障害はサービス影響、ログ、リソース、バックアップ状況を確認して復旧手順を選びます。",
  STORAGE: "ストレージでは容量、冗長化、バックアップ、復旧可能性を確認します。",
  POWER: "電源や冗長化は可用性に直結します。アラートを無効化せず、原因を取り除きます。",
  ENVIRONMENT: "温度や冷却などの環境管理は、機器故障やサービス停止を防ぐ基本です。",
  PHYSICAL: "物理管理では、ラベル、配線、施錠、作業導線を整えて誤操作と事故を防ぎます。",
  MANAGEMENT: "運用管理では、記録、手順、変更管理、影響範囲の確認が重要です。",
  DATABASE: "データベース障害では、接続、性能、ロック、バックアップ、整合性を確認します。",
  WEB: "Web障害では、アプリ、API、認証、キャッシュ、外部サービスのどこで失敗しているか切り分けます。",
  CLOUD: "クラウド運用では、設定変更、権限、監視、スケール、リージョンや外部連携を確認します。",
  SOFTWARE: "ソフトウェア障害では、設定、更新、起動項目、ログ、再現条件を確認して原因を切り分けます。",
  HARDWARE: "ハードウェア障害では、接続、電源、交換可否、影響範囲を確認して安全に復旧します。",
  CONFIGURATION: "設定変更は影響範囲を確認し、記録と切り戻し手順を用意してから実施します。",
  MONITORING: "監視では、アラートの意味、しきい値、影響範囲、対応優先度を判断します。",
  PERFORMANCE: "性能問題では、CPU、メモリ、ディスク、ネットワーク、アプリ処理のどこが詰まっているか確認します。",
  BACKUP: "バックアップは取得だけでなく、復元できることを確認して初めて有効です。",
  RECOVERY: "復旧では、業務影響を抑えながら原因を確認し、再発防止も残します。"
};

const LEARNING_KEYWORDS = [
  ["DNS", /DNS|名前解決|ドメイン/i],
  ["DHCP", /DHCP|IPアドレス|IP設定/i],
  ["VPN", /VPN/i],
  ["VLAN", /VLAN/i],
  ["Wi-Fi", /Wi-Fi|無線|アクセスポイント/i],
  ["バックアップ", /バックアップ|復旧|リストア/i],
  ["認証", /認証|ログイン|パスワード|アカウント/i],
  ["権限", /権限|アクセス拒否|共有フォルダ/i],
  ["マルウェア", /マルウェア|ウイルス|感染/i],
  ["フィッシング", /フィッシング|不審なメール|URL/i],
  ["ログ", /ログ|監視|アラート/i],
  ["可用性", /冗長|可用性|停止|UPS|RAID/i],
  ["DB", /DB|データベース|SQL/i],
  ["API", /API|外部サービス/i],
  ["クラウド", /クラウド|コンテナ|CI\/CD|CDN/i]
];

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getLearningTags(incident) {
  const tags = new Set(incident.learningTags || []);
  const categoryLabel = CATEGORY_LEARNING_LABELS[incident.category] || incident.category;
  if (categoryLabel) tags.add(categoryLabel);
  const equipment = getEquipment(incident.equipmentId);
  if (equipment?.name) tags.add(equipment.name);
  const text = `${incident.title || ""} ${incident.description || ""} ${incident.explanation || ""}`;
  LEARNING_KEYWORDS.forEach(([label, pattern]) => {
    if (pattern.test(text)) tags.add(label);
  });
  return Array.from(tags).filter(Boolean).slice(0, 5);
}

function getExamPoint(incident) {
  if (incident.examPoint) return incident.examPoint;
  return CATEGORY_EXAM_POINTS[incident.category]
    || (incident.explanation || "正しい対応を選ぶために、影響範囲と原因を順番に切り分けます。").replace(/^正解：/, "");
}

function renderLearningBlock(incident) {
  const tags = getLearningTags(incident);
  const tagHtml = tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  return `<div class="learning-block">
    <div class="learning-tags"><strong>学習タグ</strong><div>${tagHtml}</div></div>
    <div class="exam-point"><strong>試験ポイント</strong><p>${escapeHtml(getExamPoint(incident))}</p></div>
  </div>`;
}

function recordLearningTags(incident) {
  if (!state.learningTagCounts) state.learningTagCounts = {};
  getLearningTags(incident).forEach((tag) => {
    state.learningTagCounts[tag] = (state.learningTagCounts[tag] || 0) + 1;
  });
}
function openIncidentModal(incident) {
  state.paused = true;
  const item = getEquipment(incident.equipmentId);
  els.modalCategory.textContent = incident.category;
  els.modalTitle.textContent = incident.title;
  els.modalLocation.textContent = `発生場所：${item.icon} ${item.name}`;
  els.modalDescription.textContent = incident.description;
  const remaining = Math.max(0, incident.deadline - state.elapsed);
  els.modalEffect.textContent = `放置すると約 ${remaining} 秒で故障し、信頼度の低下が加速します。`;
  els.modalOptions.innerHTML = "";
  els.modalFeedback.className = "modal-feedback hidden";
  els.modalFeedback.innerHTML = "";
  els.modalActions.innerHTML = "";

  incident.shuffledOrder = getShuffledOptionOrder(incident.options.length);
  incident.shuffledOrder.forEach((optionIndex, buttonIndex) => {
    const button = document.createElement("button");
    button.className = "option-button";
    button.innerHTML = `<strong>${String.fromCharCode(65 + buttonIndex)}</strong>${incident.options[optionIndex]}`;
    button.addEventListener("click", () => answerIncident(incident.instanceId, buttonIndex));
    els.modalOptions.appendChild(button);
  });

  els.modalClose.disabled = false;
  els.modal.classList.remove("hidden");
  renderStats();
}

function answerIncident(instanceId, selectedIndex) {
  const incident = state.incidents.find((item) => item.instanceId === instanceId);
  if (!incident) return;

  els.modalOptions.innerHTML = "";
  els.modalEffect.textContent = "";

  const chosenOptionIndex = incident.shuffledOrder ? incident.shuffledOrder[selectedIndex] : selectedIndex;
  recordLearningTags(incident);
  if (chosenOptionIndex === incident.correct) {
    const remaining = Math.max(0, incident.deadline - state.elapsed);
    const speedRate = remaining / Math.max(1, incident.deadline - incident.startedAt);
    const speedBonus = Math.round((500 + speedRate * 1200) * getDifficulty().rewardMultiplier);
    const streakBonus = Math.min(3000, state.streak * 250);
    const trustBonus = 2.5 + Math.min(2, state.streak * 0.25);
    state.incidents = state.incidents.filter((item) => item.instanceId !== instanceId);
    state.resolved += 1;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    state.trust = Math.min(100, state.trust + trustBonus);
    state.funds += speedBonus + streakBonus;
    addLog(`解決：${incident.title}。被害を防止し、信頼度が少し回復しました。`, "success");
    showModalFeedback("correct", `対応成功。<br>${incident.explanation}${renderLearningBlock(incident)}<br>早期対応 ${formatYen(speedBonus)}、連続正解 ${formatYen(streakBonus)} を獲得しました。`);
    if (typeof sfx !== "undefined") sfx.correct();
    if (typeof checkAchievementOnCorrectAnswer === "function") checkAchievementOnCorrectAnswer(incident);
  } else {
    state.mistakes += 1;
    state.streak = 0;
    convertToBroken(incident, "誤対応", true);
    showModalFeedback("wrong", `対応失敗。設備が故障し、信頼度が ${incident.penalty} 低下しました。<br><br>${incident.explanation}${renderLearningBlock(incident)}`);
    if (typeof sfx !== "undefined") sfx.wrong();
    if (els.map) {
      els.map.classList.add("shake");
      setTimeout(() => els.map.classList.remove("shake"), 420);
    }
  }

  els.modalActions.innerHTML = `<button id="continue-button" class="primary-button">オフィスに戻る</button>`;
  document.querySelector("#continue-button").addEventListener("click", hideModal);
  els.modalClose.disabled = true;
  renderAll();
  checkEndConditions();
}

function convertToBroken(incident, reason, modalOpen = false) {
  state.incidents = state.incidents.filter((item) => item.instanceId !== incident.instanceId);
  state.equipmentStatus[incident.equipmentId] = "broken";
  state.trust -= getAdjustedPenalty(incident);
  state.streak = 0;
  state.review.push({ title: incident.title, explanation: incident.explanation });

  const item = getEquipment(incident.equipmentId);
  addLog(`${reason}：${item.name}が故障。信頼度 -${incident.penalty}。緊急復旧が必要です。`, "danger");
  renderEquipment();

  if (!modalOpen && !state.ended) {
    openRepairAlertModal(incident);
  }
}

function openRepairAlertModal(incident) {
  state.paused = true;
  const item = getEquipment(incident.equipmentId);
  els.modalCategory.textContent = "SYSTEM DOWN";
  els.modalTitle.textContent = `${item.name} が故障しました`;
  els.modalLocation.textContent = `原因：${incident.title}`;
  els.modalDescription.textContent = "未対応または誤対応により、設備が故障状態になりました。放置すると資金と信頼度が継続的に減少します。";
  const adjustedRepairCost = getAdjustedRepairCost(incident.equipmentId, incident.repairCost);
  els.modalEffect.textContent = `緊急復旧には ${formatYen(adjustedRepairCost)} が必要です。`;
  els.modalOptions.innerHTML = "";
  els.modalFeedback.className = "modal-feedback hidden";
  els.modalActions.innerHTML = `
    <button class="secondary-button" id="repair-alert-later">後で復旧する</button>
    <button class="primary-button" id="repair-alert-now">緊急復旧する</button>
  `;
  document.querySelector("#repair-alert-later").addEventListener("click", hideModal);
  document.querySelector("#repair-alert-now").addEventListener("click", () => repairEquipment(incident.equipmentId, adjustedRepairCost));
  els.modalClose.disabled = false;
  els.modal.classList.remove("hidden");
  renderStats();
}

function openRepairModal(equipmentId) {
  state.paused = true;
  const item = getEquipment(equipmentId);
  const related = getActiveIncidents().filter((incident) => incident.equipmentId === equipmentId);
  const baseRepairCost = related.length ? Math.max(...related.map((item) => item.repairCost)) : 10000;
  const repairCost = getAdjustedRepairCost(equipmentId, baseRepairCost);
  els.modalCategory.textContent = "RECOVERY";
  els.modalTitle.textContent = `${item.name} は故障中です`;
  els.modalLocation.textContent = `${item.icon} ${item.subtitle}`;
  els.modalDescription.textContent = "この設備は故障状態です。復旧するまで、業務への影響により資金と信頼度が下がり続けます。";
  els.modalEffect.textContent = `緊急復旧費用：${formatYen(repairCost)}`;
  els.modalOptions.innerHTML = "";
  els.modalFeedback.className = "modal-feedback hidden";
  els.modalActions.innerHTML = `
    <button class="secondary-button" id="repair-later">後で復旧する</button>
    <button class="primary-button" id="repair-now">緊急復旧する</button>
  `;
  document.querySelector("#repair-later").addEventListener("click", hideModal);
  document.querySelector("#repair-now").addEventListener("click", () => repairEquipment(equipmentId, repairCost));
  els.modalClose.disabled = false;
  els.modal.classList.remove("hidden");
  renderStats();
}

function repairEquipment(equipmentId, cost) {
  if (state.funds < cost) {
    showModalFeedback("wrong", `資金不足です。復旧には ${formatYen(cost)} が必要です。`);
    if (typeof sfx !== "undefined") sfx.wrong();
    return;
  }
  state.funds -= cost;
  state.equipmentStatus[equipmentId] = "normal";
  state.trust = Math.min(100, state.trust + 1);
  const item = getEquipment(equipmentId);
  addLog(`復旧完了：${item.name}を ${formatYen(cost)} で緊急復旧しました。`, "success");
  if (typeof sfx !== "undefined") sfx.repair();

  els.modalOptions.innerHTML = "";
  els.modalEffect.textContent = "";
  showModalFeedback("repair", `緊急復旧が完了しました。<br>資金 ${formatYen(cost)} を消費し、設備は正常稼働に戻りました。`);
  els.modalActions.innerHTML = `<button id="continue-button" class="primary-button">オフィスに戻る</button>`;
  document.querySelector("#continue-button").addEventListener("click", hideModal);
  els.modalClose.disabled = true;
  renderAll();
}

function showModalFeedback(type, html) {
  els.modalFeedback.className = `modal-feedback ${type}`;
  els.modalFeedback.innerHTML = html;
}

function hideModal() {
  els.modal.classList.add("hidden");
  state.paused = false;
  renderStats();
}

