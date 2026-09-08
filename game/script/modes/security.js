// ===== セキュリティ会社：部屋定義 =====
const securityRooms = [
  { id: "monitoring", name: "SOC監視ルーム", x: "6%", y: "6%", width: "42%", height: "42%" },
  { id: "analysis", name: "境界防御エリア", x: "52%", y: "6%", width: "42%", height: "42%" },
  { id: "intel", name: "脅威インテリジェンス室", x: "6%", y: "52%", width: "42%", height: "42%" },
  { id: "response", name: "解析・インシデント対応室", x: "52%", y: "52%", width: "42%", height: "42%" }
];

// ===== セキュリティ会社：設備定義 =====
const securityEquipment = [
  { id: "soc",      name: "SOC監視端末",           subtitle: "24時間セキュリティ監視", icon: "🖥", x: "75%", y: "35%", room: "monitoring" },
  { id: "siem",     name: "SIEMコンソール",       subtitle: "ログ収集・相関分析",     icon: "📊", x: "25%", y: "35%", room: "monitoring" },
  { id: "firewall", name: "ファイアウォール",      subtitle: "境界防御 / UTM",         icon: "🔥", x: "25%", y: "35%", room: "analysis" },
  { id: "ids",      name: "IDS/IPSシステム",       subtitle: "侵入検知・防止",         icon: "🔍", x: "75%", y: "75%", room: "analysis" },
  { id: "intel",    name: "脅威インテリジェンス",  subtitle: "CTI / 脅威情報収集",    icon: "🌐", x: "50%", y: "50%", room: "intel" },
  { id: "malware",  name: "マルウェア解析端末",    subtitle: "サンドボックス解析",     icon: "🦠", x: "50%", y: "75%", room: "response" },
  { id: "incident", name: "インシデント対応PC",    subtitle: "CSIRT / 対応端末",       icon: "🛡", x: "50%", y: "50%", room: "response" },
  { id: "logstorage", name: "ログ保管サーバー",    subtitle: "証跡 / 長期保管",        icon: "🗄", x: "25%", y: "75%", room: "intel" },
  { id: "zerotrust",  name: "ゼロトラストゲートウェイ", subtitle: "認証 / アクセス制御", icon: "🔐", x: "75%", y: "75%", room: "intel" },
  { id: "edr",        name: "EDRコンソール",       subtitle: "端末検知 / 隔離",        icon: "🧭", x: "25%", y: "75%", room: "response" },
  { id: "vulnscan",   name: "脆弱性診断サーバー",  subtitle: "スキャン / 優先度管理",  icon: "🔎", x: "50%", y: "75%", room: "response" },
  { id: "forensic",   name: "フォレンジック端末",  subtitle: "証拠保全 / 解析",        icon: "🧪", x: "75%", y: "75%", room: "response" }
];
