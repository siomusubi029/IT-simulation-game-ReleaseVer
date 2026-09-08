// ===== インフラ会社（データセンター）：部屋定義 =====
const infraRooms = [
  { id: "server", name: "サーバールーム", x: "6%", y: "6%", width: "42%", height: "42%" },
  { id: "network", name: "ネットワークルーム", x: "52%", y: "6%", width: "42%", height: "42%" },
  { id: "power", name: "電源室", x: "6%", y: "52%", width: "42%", height: "42%" },
  { id: "cooling", name: "冷却機械室", x: "52%", y: "52%", width: "42%", height: "42%" }
];

// ===== インフラ会社（データセンター）：設備定義 =====
const infraEquipment = [
  { id: "web",      name: "Webサーバー",             subtitle: "公開サービス",           icon: "🌐", x: "20%", y: "35%", room: "server" },
  { id: "rack",     name: "DBサーバー",              subtitle: "業務データ",             icon: "🗄", x: "35%", y: "35%", room: "server" },
  { id: "dns",      name: "DNSサーバー",             subtitle: "名前解決",               icon: "📘", x: "50%", y: "35%", room: "server" },
  { id: "storage",  name: "ストレージアレイ",        subtitle: "SAN / NAS / RAID",        icon: "💾", x: "65%", y: "35%", room: "server" },
  { id: "dr",       name: "DRシステム",              subtitle: "災害対策 / バックアップ", icon: "🔄", x: "80%", y: "35%", room: "server" },
  { id: "router",   name: "ルーター",                subtitle: "経路制御",               icon: "🔀", x: "25%", y: "35%", room: "network" },
  { id: "network",  name: "スイッチ",                subtitle: "ネットワーク集約",       icon: "🔗", x: "50%", y: "35%", room: "network" },
  { id: "loadbalancer", name: "ロードバランサー",     subtitle: "負荷分散",               icon: "⚖", x: "75%", y: "35%", room: "network" },
  { id: "monitor",  name: "監視コンソール",          subtitle: "死活監視 / メトリクス",   icon: "📡", x: "75%", y: "75%", room: "network" },
  { id: "ups",      name: "UPS電源システム",         subtitle: "無停電電源装置",          icon: "⚡", x: "50%", y: "50%", room: "power" },
  { id: "virt",     name: "仮想化基盤",              subtitle: "VM / ハイパーバイザー",   icon: "🧩", x: "75%", y: "50%", room: "power" },
  { id: "cooling",  name: "冷却システム",            subtitle: "精密空調 / 冷水循環",     icon: "❄", x: "50%", y: "50%", room: "cooling" }
];
