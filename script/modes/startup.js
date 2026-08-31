// ===== Webスタートアップ：部屋定義 =====
const startupRooms = [
  { id: "cloud", name: "クラウド基盤ルーム", x: "6%", y: "6%", width: "42%", height: "42%" },
  { id: "devops", name: "DevOpsルーム", x: "52%", y: "6%", width: "42%", height: "42%" },
  { id: "database", name: "データベース / 配信ルーム", x: "6%", y: "52%", width: "42%", height: "42%" },
  { id: "dev", name: "開発・外部連携ルーム", x: "52%", y: "52%", width: "42%", height: "42%" }
];

// ===== Webスタートアップ：設備定義 =====
const startupEquipment = [
  { id: "wa",        name: "Webアプリサーバー",    subtitle: "フロントエンド / アプリ", icon: "🌐", x: "25%", y: "35%", room: "cloud" },
  { id: "api",       name: "APIサーバー",           subtitle: "API / 業務ロジック",       icon: "🔌", x: "50%", y: "35%", room: "cloud" },
  { id: "cloud",     name: "クラウドストレージ",    subtitle: "オブジェクトストレージ",   icon: "☁", x: "75%", y: "35%", room: "cloud" },
  { id: "cicd",      name: "CI/CDパイプライン",      subtitle: "GitHub Actions / Jenkins", icon: "⚙", x: "25%", y: "35%", room: "devops" },
  { id: "dashboard", name: "監視ダッシュボード",     subtitle: "Datadog / Prometheus",      icon: "📈", x: "75%", y: "75%", room: "devops" },
  { id: "container", name: "コンテナ基盤",           subtitle: "Kubernetes / Docker",       icon: "📦", x: "50%", y: "75%", room: "devops" },
  { id: "db",        name: "データベースクラスター", subtitle: "RDS / PostgreSQL / Redis",  icon: "🗃", x: "25%", y: "35%", room: "database" },
  { id: "cdn",       name: "CDNエッジサーバー",      subtitle: "Cloudflare / CloudFront",   icon: "🌍", x: "75%", y: "75%", room: "database" },
  { id: "queue",     name: "メッセージキュー",       subtitle: "非同期処理 / ジョブ",       icon: "📬", x: "50%", y: "75%", room: "database" },
  { id: "auth",      name: "認証基盤",               subtitle: "ログイン / 権限管理",       icon: "🔐", x: "25%", y: "50%", room: "dev" },
  { id: "devenv",    name: "開発環境",               subtitle: "GitHub / IDE / 開発PC",     icon: "💻", x: "50%", y: "50%", room: "dev" },
  { id: "payment",   name: "決済 / 外部API",         subtitle: "外部連携",                 icon: "💳", x: "75%", y: "50%", room: "dev" }
];
