// ===== 一般企業オフィス：部屋定義 =====
const officeRooms = [
  { id: "workspace", name: "ワークスペース", x: "6%", y: "6%", width: "42%", height: "42%" },
  { id: "meeting", name: "会議室", x: "52%", y: "6%", width: "42%", height: "42%" },
  { id: "server", name: "サーバールーム", x: "6%", y: "52%", width: "42%", height: "42%" },
  { id: "admin", name: "管理エリア", x: "52%", y: "52%", width: "42%", height: "42%" }
];

// ===== 一般企業オフィス：設備定義 =====
const officeEquipment = [
  { id: "pc",       name: "社員PCエリア",       subtitle: "業務用端末 24台",      icon: "🖥",  x: "20%",  y: "25%", room: "workspace" },
  { id: "printer",  name: "複合機",             subtitle: "印刷・スキャン",       icon: "🖨",  x: "80%",  y: "25%", room: "workspace" },
  { id: "wifi",     name: "Wi-Fi AP",           subtitle: "無線アクセスポイント", icon: "📶",  x: "50%",  y: "75%", room: "workspace" },
  { id: "network",  name: "ネットワークラック", subtitle: "ルーター / スイッチ",  icon: "🗄",  x: "25%",  y: "35%", room: "server" },
  { id: "server",   name: "ファイルサーバー",   subtitle: "共有フォルダ",         icon: "🗃",  x: "75%",  y: "35%", room: "server" },
  { id: "meeting",  name: "会議室システム",      subtitle: "モニター / 会議PC",   icon: "📺",  x: "50%",  y: "50%", room: "meeting" },
  { id: "security", name: "情報システム管理席",  subtitle: "アカウント管理",       icon: "🛡", x: "50%",  y: "50%", room: "admin" },
  { id: "backup",   name: "バックアップ装置",    subtitle: "世代管理 / 復元",      icon: "💾", x: "50%",  y: "75%", room: "server" },
  { id: "vpn",      name: "VPNゲートウェイ",     subtitle: "リモート接続",         icon: "🔐", x: "25%",  y: "75%", room: "server" },
  { id: "portal",   name: "社内ポータル端末",    subtitle: "申請 / お知らせ",      icon: "🌐", x: "25%",  y: "75%", room: "admin" },
  { id: "mail",     name: "メールサーバー",      subtitle: "社内メール配送",       icon: "✉",  x: "75%",  y: "75%", room: "server" },
  { id: "asset",    name: "資産管理端末",        subtitle: "端末台帳 / 棚卸",      icon: "📋", x: "75%",  y: "75%", room: "admin" }
];
