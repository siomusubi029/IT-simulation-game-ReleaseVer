// 各設備のインシデント数を揃えるための共通定義
const INCIDENTS_PER_EQUIPMENT = 10;

const EQUIPMENT_INCIDENT_FOCUS = {
  pc: "端末のイベントログ、OS設定、接続状態",
  printer: "印刷キュー、消耗品、ネットワーク設定",
  wifi: "電波状況、認証、アクセスポイント設定",
  network: "ポート、VLAN、経路、通信量",
  server: "サービス、共有設定、ディスク、アクセス権",
  meeting: "映像・音声機器、会議端末、接続ケーブル",
  security: "アカウント、権限、操作記録",
  backup: "バックアップジョブ、保存先、復元可能性",
  vpn: "トンネル、証明書、認証、経路",
  portal: "Webサービス、公開設定、利用者権限",
  mail: "メールキュー、DNS認証、容量、配送ログ",
  asset: "端末台帳、導入ソフト、利用者情報",

  soc: "監視ルール、アラート、担当者への通知",
  siem: "ログ収集、相関ルール、時刻同期",
  firewall: "通信ルール、セッション、負荷、変更履歴",
  ids: "検知シグネチャ、遮断動作、誤検知",
  intel: "脅威情報の鮮度、信頼性、適用範囲",
  malware: "検体、隔離環境、解析結果",
  incident: "対応記録、連絡体制、封じ込め状況",
  logstorage: "証跡の完全性、保存期間、検索性能",
  zerotrust: "端末状態、認証ポリシー、アクセス判定",
  edr: "端末センサー、検知、隔離、調査情報",
  vulnscan: "スキャン範囲、認証情報、検出結果",
  forensic: "証拠保全、ハッシュ値、解析用コピー",

  web: "Webプロセス、応答コード、アクセスログ",
  rack: "DBプロセス、接続数、クエリ、ディスクI/O",
  dns: "ゾーン情報、応答、委任、キャッシュ",
  storage: "RAID、容量、I/O、ディスク状態",
  dr: "レプリケーション、切替手順、復旧時点",
  router: "経路表、隣接状態、インターフェース",
  loadbalancer: "ヘルスチェック、振り分け、セッション",
  monitor: "監視対象、しきい値、通知経路",
  ups: "給電状態、バッテリー、負荷、稼働時間",
  virt: "仮想マシン、ホスト資源、ライブマイグレーション",
  cooling: "温度、風量、冷却水、冗長運転",

  wa: "アプリプロセス、HTTP応答、依存サービス",
  api: "API応答、認証、レート制限、処理時間",
  cloud: "オブジェクト、権限、同期、保存容量",
  cicd: "ビルド、テスト、デプロイ、シークレット",
  dashboard: "メトリクス、ダッシュボード、通知設定",
  container: "Pod、イメージ、リソース、ネットワーク",
  db: "接続、クエリ、ロック、レプリケーション",
  cdn: "キャッシュ、オリジン接続、証明書",
  queue: "滞留数、再試行、デッドレター、処理順序",
  auth: "ログイン、トークン、権限、MFA",
  devenv: "リポジトリ、開発端末、依存関係、認証情報",
  payment: "決済要求、署名、再送、外部API応答"
};

const INCIDENT_FILLER_SCENARIOS = [
  {
    category: "MONITORING",
    title: "監視アラートの見落とし",
    symptom: "警告が発生していますが、通知の確認が遅れて影響範囲が分からない状態です。",
    action: "監視値と関連ログを確認し、影響範囲と発生時刻を特定して担当者へ共有する",
    wrong1: "原因を確認せず、警告だけを無効にする",
    wrong2: "利用者への影響を調べず、そのまま次の勤務者へ引き継ぐ"
  },
  {
    category: "PERFORMANCE",
    title: "性能の急激な低下",
    symptom: "通常より処理が遅くなり、利用者から応答遅延の報告が増えています。",
    action: "負荷と処理時間を比較し、ボトルネックを特定して影響の小さい対策から実施する",
    wrong1: "記録を残さず、すぐに電源を切る",
    wrong2: "遅延中の処理をすべて同時に再実行する"
  },
  {
    category: "CONFIGURATION",
    title: "設定変更後の異常",
    symptom: "直近の設定変更後から、一部の機能が正常に動作しなくなりました。",
    action: "変更履歴と正常時の設定を比較し、影響を確認して承認済みの手順で戻す",
    wrong1: "現在の設定を保存せず、初期化する",
    wrong2: "原因が不明なまま別の設定も続けて変更する"
  },
  {
    category: "CONNECTIVITY",
    title: "接続エラーの増加",
    symptom: "接続の失敗が断続的に発生し、再試行しても安定しません。",
    action: "接続元と接続先を分けて確認し、認証・経路・待受状態を順番に切り分ける",
    wrong1: "全社のネットワーク機器を一斉に再起動する",
    wrong2: "利用者に何度も再試行させるだけで調査を終える"
  },
  {
    category: "CAPACITY",
    title: "リソース容量の逼迫",
    symptom: "使用率がしきい値を超え、このまま増えるとサービス停止につながる状態です。",
    action: "増加原因と残容量を確認し、不要データの整理または計画的な容量拡張を行う",
    wrong1: "容量アラートのしきい値を上げて表示されないようにする",
    wrong2: "確認せずに古いデータをすべて削除する"
  },
  {
    category: "LOGGING",
    title: "運用ログの欠損",
    symptom: "一部の時間帯で記録が途切れ、障害原因を追跡できない可能性があります。",
    action: "記録元・転送経路・保存先を確認し、時刻同期と欠損範囲を特定する",
    wrong1: "欠損部分を推測で書き足す",
    wrong2: "現在残っているログも削除して収集をやり直す"
  },
  {
    category: "MAINTENANCE",
    title: "更新作業の失敗",
    symptom: "更新処理が途中で停止し、新旧の状態が混在しています。",
    action: "更新ログと現在の状態を確認し、ロールバック条件に従って整合性を回復する",
    wrong1: "失敗した更新を確認せず何度も繰り返す",
    wrong2: "関連する保護機能をすべて解除して更新する"
  },
  {
    category: "AVAILABILITY",
    title: "冗長系への切替異常",
    symptom: "主系の異常時に待機系へ正常に切り替わらず、停止の危険が高まっています。",
    action: "主系と待機系の状態、同期状況、切替条件を確認して安全な手順で復旧する",
    wrong1: "両方を同時に停止してから考える",
    wrong2: "同期状態を確認せず強制的に役割を入れ替える"
  },
  {
    category: "SECURITY",
    title: "未承認の操作を検知",
    symptom: "通常と異なる操作が記録され、設定やデータが変更された可能性があります。",
    action: "操作記録と実施者を確認し、必要ならアクセスを制限して証拠を保全する",
    wrong1: "記録を削除して警告を消す",
    wrong2: "確認前に全利用者へ管理者権限を付与する"
  },
  {
    category: "RECOVERY",
    title: "復旧確認の未完了",
    symptom: "復旧作業は完了したと報告されていますが、正常性の確認記録がありません。",
    action: "監視値と利用者側の動作を確認し、復旧条件を満たしたことを記録する",
    wrong1: "担当者の口頭報告だけで完全復旧と判断する",
    wrong2: "確認のため本番データを無断で変更する"
  }
];

function createFillerIncident(modeId, equipment, scenario, index) {
  const focus = EQUIPMENT_INCIDENT_FOCUS[equipment.id] || "状態、設定、ログ";
  return {
    id: `${modeId}-${equipment.id}-balanced-${index + 1}`,
    equipmentId: equipment.id,
    category: scenario.category,
    title: `${equipment.name}：${scenario.title}`,
    description: `${equipment.name}で${scenario.symptom} 確認対象は${focus}です。`,
    warning: 24,
    severity: 1.5,
    penalty: 10,
    repairCost: 12000,
    options: [
      scenario.action + "。",
      scenario.wrong1 + "。",
      scenario.wrong2 + "。"
    ],
    correct: 0,
    explanation: `正解：${equipment.name}では、${focus}を確認しながら影響範囲を絞り、安全な手順で対応します。`,
    learningTags: [scenario.category, equipment.name, "原因切り分け"],
    examPoint: `${scenario.action}。障害対応では、影響範囲の確認、記録の保全、原因の切り分けを順番に行います。`
  };
}

function balanceIncidentsByEquipment(sourceIncidents, equipmentList, modeId) {
  const balanced = [];

  equipmentList.forEach((equipment) => {
    const equipmentIncidents = sourceIncidents
      .filter((incident) => incident && incident.equipmentId === equipment.id);
    const existing = [
      ...equipmentIncidents.filter((incident) => incident.examPoint),
      ...equipmentIncidents.filter((incident) => !incident.examPoint)
    ].slice(0, INCIDENTS_PER_EQUIPMENT);

    balanced.push(...existing);

    for (let i = existing.length; i < INCIDENTS_PER_EQUIPMENT; i++) {
      balanced.push(createFillerIncident(modeId, equipment, INCIDENT_FILLER_SCENARIOS[i], i));
    }
  });

  return balanced.map((incident) => ({ ...incident, modeId }));
}
