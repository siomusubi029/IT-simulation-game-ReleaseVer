// ===== ゲーム設定・難易度パラメータ =====
const GAME_DURATION = 180;
const STARTING_FUNDS = 100000;
const STARTING_TRUST = 100;

const UPGRADE_MAX_LEVEL = 3;
const UPGRADE_BASE_COST = 9000;
const UPGRADE_LEVEL_COST_STEP = 6500;
const UPGRADE_LEVEL_LABELS = [
  "未強化",
  "安定化",
  "効率化",
  "自動化"
];

const UPGRADE_LEVEL_DESCRIPTIONS = [
  "通常状態",
  "対応猶予が伸びる",
  "復旧費と影響を軽減",
  "収益と信頼を守る"
];

const UPGRADE_EFFECTS = {
  warningBonusPerLevel: 0.12,
  pressureReductionPerLevel: 0.08,
  repairDiscountPerLevel: 0.12,
  revenueBonusPerLevel: 0.04,
  trustProtectionPerLevel: 0.06
};

// 同一IDのインシデントが重複登録された場合に備え、先勝ちで重複を除去するユーティリティ
function dedupeIncidentsById(list) {
  const seen = new Set();
  return list.filter((incident) => {
    if (!incident || !incident.id) return true;
    if (seen.has(incident.id)) return false;
    seen.add(incident.id);
    return true;
  });
}

const difficultyConfig = {
  normal: {
    label: "ノーマル",
    companySize: "中小企業",
    equipmentCount: 6,
    firstIncident: 7,
    spawnBase: 9,
    minimumSpawn: 4,
    warningMultiplier: 1,
    pressureMultiplier: 1,
    rewardMultiplier: 1,
    revenueMultiplier: 1,
    employeeIncidentChance: 0.12,
    rampDelay: 25,
    pressureCap: 6
  },
  hard: {
    label: "ハード",
    companySize: "中堅企業",
    equipmentCount: 9,
    firstIncident: 5,
    spawnBase: 7,
    minimumSpawn: 3,
    warningMultiplier: 0.85,
    pressureMultiplier: 1.2,
    rewardMultiplier: 1.35,
    revenueMultiplier: 1.15,
    employeeIncidentChance: 0.15,
    rampDelay: 20,
    pressureCap: 7
  },
  veryhard: {
    label: "ベリーハード",
    companySize: "大企業",
    equipmentCount: 12,
    firstIncident: 4,
    spawnBase: 5,
    minimumSpawn: 3,
    warningMultiplier: 0.72,
    pressureMultiplier: 1.35,
    rewardMultiplier: 1.75,
    revenueMultiplier: 1.3,
    employeeIncidentChance: 0.18,
    rampDelay: 15,
    pressureCap: 8
  }
};



const NEWS_TICKER_INTERVAL = 14;
const NEWS_FORECAST_DURATION = 28;
const NEWS_FORECAST_BONUS = 3.2;
const NEWS_TICKER_ITEMS = [
  { modes: ["office"], tag: "LOCAL", text: "社内でMFA再設定依頼が増加、本人確認フローの徹底が求められる" },
  { modes: ["office"], tag: "NETWORK", text: "169.254.x.x の端末報告、DHCP設定確認の重要性が再注目" },
  { modes: ["office"], tag: "PRIVACY", text: "保存期限切れの個人情報ファイル、共有フォルダで発見相次ぐ" },
  { modes: ["office"], tag: "OFFICE", text: "複合機の置き忘れ印刷物、情報漏えい対策の盲点に" },
  { modes: ["security"], tag: "SOC", text: "SIEMの相関ルール未整備、攻撃兆候の見落としにつながる恐れ" },
  { modes: ["security"], tag: "MAIL", text: "表示名だけでは判別不能、SPF・DKIM・DMARC確認の需要高まる" },
  { modes: ["security"], tag: "EDR", text: "不審なPowerShell実行を検知、端末隔離と証拠保全が焦点に" },
  { modes: ["security"], tag: "FIREWALL", text: "any-any許可ルールの残存、最小権限ルール見直しへ" },
  { modes: ["infra"], tag: "POWER", text: "UPS稼働時間が想定未満、安全停止計画の再確認が必要に" },
  { modes: ["infra"], tag: "ALERT", text: "監視アラート過多で重要通知が埋没、しきい値見直し進む" },
  { modes: ["infra"], tag: "STORAGE", text: "RAIDはバックアップではない、復元テスト不足に注意喚起" },
  { modes: ["infra"], tag: "ROUTE", text: "経路誤広告の疑い、フィルタ設定と広告範囲の確認を急ぐ" },
  { modes: ["startup"], tag: "API", text: "外部APIで429応答、指数バックオフとキュー処理が対策候補に" },
  { modes: ["startup"], tag: "DB", text: "注文処理でデッドロック増加、トランザクション範囲見直しへ" },
  { modes: ["startup"], tag: "CI/CD", text: "デプロイログにシークレット表示、即時ローテーションを実施" },
  { modes: ["startup"], tag: "CONTAINER", text: "Critical脆弱性を含むイメージ検出、ベースイメージ更新を検討" },
  { modes: ["office", "security", "infra", "startup"], tag: "BASIC", text: "障害対応の基本は影響範囲確認から、原因切り分けは順番が重要" },
  { modes: ["office", "security", "infra", "startup"], tag: "CIA", text: "機密性・完全性・可用性、セキュリティ基本3要素として再確認" }
];
const NEWS_FORECAST_RULES = {
  LOCAL: { categories: ["ACCESS"], equipment: ["security"] },
  NETWORK: { categories: ["NETWORK", "CONNECTIVITY"], equipment: ["wifi", "network"] },
  PRIVACY: { categories: ["MANAGEMENT", "COMPLIANCE"], equipment: ["server", "security"] },
  OFFICE: { categories: ["SECURITY", "HARDWARE"], equipment: ["printer"] },
  SOC: { categories: ["LOGGING", "MONITORING", "DETECTION"], equipment: ["siem", "soc"] },
  MAIL: { categories: ["ANALYSIS", "SECURITY"], equipment: ["incident", "siem"] },
  EDR: { categories: ["DETECTION", "ISOLATION"], equipment: ["soc", "malware"] },
  FIREWALL: { categories: ["POLICY", "NETWORK", "SECURITY"], equipment: ["firewall", "ids"] },
  POWER: { categories: ["POWER", "AVAILABILITY"], equipment: ["ups"] },
  ALERT: { categories: ["MONITORING", "METRICS"], equipment: ["monitor"] },
  STORAGE: { categories: ["STORAGE", "BACKUP", "RECOVERY"], equipment: ["storage", "dr"] },
  ROUTE: { categories: ["ROUTING", "NETWORK"], equipment: ["network"] },
  API: { categories: ["INTEGRATION", "CONNECTIVITY"], equipment: ["cloud"] },
  DB: { categories: ["DATABASE", "PERFORMANCE"], equipment: ["db"] },
  "CI/CD": { categories: ["SECURITY", "DEPLOYMENT"], equipment: ["cicd"] },
  CONTAINER: { categories: ["VULNERABILITY", "IMAGE"], equipment: ["container"] },
  BASIC: { categories: ["NETWORK", "CONFIGURATION", "MANAGEMENT"] },
  CIA: { categories: ["SECURITY", "COMPLIANCE", "AVAILABILITY"] }
};
