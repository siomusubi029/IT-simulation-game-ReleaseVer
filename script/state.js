// ===== ゲーム状態(state)・DOM要素参照(els) =====
const state = {
  started: false,
  ended: false,
  paused: false,
  elapsed: 0,
  timeRemaining: GAME_DURATION,
  funds: STARTING_FUNDS,
  trust: STARTING_TRUST,
  resolved: 0,
  mistakes: 0,
  streak: 0,
  bestStreak: 0,
  difficulty: "normal",
  gameMode: "office",
  nextIncidentIn: 6,
  nextNewsIn: 5,
  currentNewsIndex: -1,
  newsForecast: null,
  incidents: [],
  equipmentStatus: {},
  equipmentUpgrades: {},
  upgradeSpend: 0,
  cachedEquipment: null, // キャッシュされた設備リスト（難易度・モード変更時に再計算）
  review: [],
  learningTagCounts: {},
  minTrustSeen: STARTING_TRUST,
  timerId: null
};

const els = {};

function initializeElements() {
  els.homeScreen = document.querySelector("#home-screen");
  els.gameScreen = document.querySelector("#game-screen");
  els.map = document.querySelector("#office-map");
  els.equipmentLayer = document.querySelector("#equipment-layer");
  els.floorEyebrow = document.querySelector("#floor-eyebrow");
  els.floorTitle = document.querySelector("#floor-title");
  els.timer = document.querySelector("#timer");
  els.timerBar = document.querySelector("#timer-bar");
  els.funds = document.querySelector("#funds");
  els.fundsDetail = document.querySelector("#funds-detail");
  els.trust = document.querySelector("#trust");
  els.trustBar = document.querySelector("#trust-bar");
  els.trustDetail = document.querySelector("#trust-detail");
  els.incidentCount = document.querySelector("#incident-count");
  els.brokenCount = document.querySelector("#broken-count");
  els.resolvedCount = document.querySelector("#resolved-count");
  els.streakCount = document.querySelector("#streak-count");
  els.nextIncident = document.querySelector("#next-incident");
  els.newsTickerText = document.querySelector("#news-ticker-text");
  els.upgradeList = document.querySelector("#upgrade-list");
  els.upgradeTotal = document.querySelector("#upgrade-total");
  els.upgradeDetail = document.querySelector("#upgrade-detail");
  els.homeIncidentCount = document.querySelector("#home-incident-count");
  els.homeEquipmentCount = document.querySelector("#home-equipment-count");
  els.incidentList = document.querySelector("#incident-list");
  els.incidentListToggle = document.querySelector("#incident-list-toggle");
  els.incidentSidebar = document.querySelector("#incident-sidebar");
  els.incidentSidebarClose = document.querySelector("#incident-sidebar-close");
  els.modeFilter = document.querySelector("#mode-filter");
  els.equipmentFilter = document.querySelector("#equipment-filter");
  els.orientationWarning = document.querySelector("#orientation-warning");
  els.difficultyButtons = document.querySelectorAll(".difficulty-button");
  els.modeButtons = document.querySelectorAll(".mode-card-button");
  els.gameStatus = document.querySelector("#game-status");
  els.homeStartButton = document.querySelector("#home-start-button");
  els.homeButton = document.querySelector("#home-button");
  els.startButton = document.querySelector("#start-button");
  els.overlayStartButton = document.querySelector("#overlay-start-button");
  els.startOverlay = document.querySelector("#start-overlay");
  els.resumeChoice = document.querySelector("#resume-choice");
  els.resumeContinueButton = document.querySelector("#resume-continue-button");
  els.resumeRestartButton = document.querySelector("#resume-restart-button");
  els.eventLog = document.querySelector("#event-log");
  els.modal = document.querySelector("#modal");
  els.modalTitle = document.querySelector("#modal-title");
  els.modalCategory = document.querySelector("#modal-category");
  els.modalLocation = document.querySelector("#modal-location");
  els.modalDescription = document.querySelector("#modal-description");
  els.modalEffect = document.querySelector("#modal-effect");
  els.modalOptions = document.querySelector("#modal-options");
  els.modalFeedback = document.querySelector("#modal-feedback");
  els.modalActions = document.querySelector("#modal-actions");
  els.modalClose = document.querySelector("#modal-close");
  els.resultModal = document.querySelector("#result-modal");
  els.resultEyebrow = document.querySelector("#result-eyebrow");
  els.resultTitle = document.querySelector("#result-title");
  els.resultMessage = document.querySelector("#result-message");
  els.resultFunds = document.querySelector("#result-funds");
  els.resultTrust = document.querySelector("#result-trust");
  els.resultResolved = document.querySelector("#result-resolved");
  els.resultMistakes = document.querySelector("#result-mistakes");
  els.resultStreak = document.querySelector("#result-streak");
  els.resultUpgrades = document.querySelector("#result-upgrades");
  els.resultScorePanel = document.querySelector("#result-score-panel");
  els.resultLearning = document.querySelector("#result-learning");
  els.reviewList = document.querySelector("#review-list");
  els.restartButton = document.querySelector("#restart-button");
  els.eventLogPanel = document.querySelector(".event-log-panel");
  els.mobileTimer = document.querySelector("#mobile-timer");
  els.mobileFunds = document.querySelector("#mobile-funds");
  els.mobileTrust = document.querySelector("#mobile-trust");
  els.mobileDifficultySelection = document.querySelector("#mobile-difficulty-selection");
  els.mobileDifficultyButtons = document.querySelectorAll(".mobile-difficulty-button");
  els.mobileStartGame = document.querySelector("#mobile-start-game");
  els.viewLogButton = document.querySelector("#view-log-button");
  els.logModal = document.querySelector("#log-modal");
  els.logModalClose = document.querySelector("#log-modal-close");
  els.logModalContent = document.querySelector("#log-modal-content");
}
