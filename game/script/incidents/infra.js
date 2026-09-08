// ===== インフラ会社（データセンター）：インシデントデータ =====

// officeIncidents からマッピングして構築する
const infraMappedIncidents = [
  { ...officeIncidents.find(i => i.id === "network-wide"), equipmentId: "network" },
  { ...officeIncidents.find(i => i.id === "dns-failure"), equipmentId: "network" },
  { ...officeIncidents.find(i => i.id === "switch-failure"), equipmentId: "network" },
  { ...officeIncidents.find(i => i.id === "bandwidth-spike"), equipmentId: "network" },
  { ...officeIncidents.find(i => i.id === "external-connection"), equipmentId: "network" },
  { ...officeIncidents.find(i => i.id === "deleted-file"), equipmentId: "dr" },
  { ...officeIncidents.find(i => i.id === "backup-failure"), equipmentId: "dr" },
  { ...officeIncidents.find(i => i.id === "storage-full"), equipmentId: "storage" },
  { ...officeIncidents.find(i => i.id === "shared-drive-unreachable"), equipmentId: "storage" },
  { ...officeIncidents.find(i => i.id === "service-down"), equipmentId: "rack" },
  { ...officeIncidents.find(i => i.id === "patch-failure"), equipmentId: "monitor" },
  { ...officeIncidents.find(i => i.id === "ap-overheating"), equipmentId: "cooling", title: "冷却ファン過熱警告", description: "冷却システムのファンユニットから異音が発生し、一時的に冷却能力が低下しています。" }
].filter(i => i.id);

// インフラ固有の障害（電源・冷却・RAID等）
const infraCustomIncidents = [
  {
    id: "infra-raid-degrade",
    equipmentId: "storage",
    category: "STORAGE",
    title: "RAIDアレイの劣化検知",
    description: "ストレージアレイのRAID-5が劣化状態になりました。ドライブ1台が故障しており、もう1台が故障するとデータが失われます。",
    warning: 20,
    severity: 2.0,
    penalty: 13,
    repairCost: 18000,
    options: [
      "障害ドライブを特定してホットスペアへのリビルドを開始し、リビルド中の追加ドライブ故障に備える。",
      "リビルドには時間がかかるので、そのまま使い続ける。",
      "アレイ全体を再フォーマットしてゼロから構築する。"
    ],
    correct: 0,
    explanation: "正解：RAID劣化時は速やかにホットスペアへのリビルドを開始します。リビルド中はI/O負荷を下げるのが望ましく、追加障害への警戒も必要です。"
  },
  {
    id: "infra-ups-alarm",
    equipmentId: "ups",
    category: "POWER",
    title: "UPS電源異常警告",
    description: "UPSのバッテリー残量が低下しており、充電異常のアラートが発生しています。停電時にサーバーが保護できない可能性があります。",
    warning: 22,
    severity: 1.8,
    penalty: 12,
    repairCost: 16000,
    options: [
      "UPSのバッテリー状態と充電回路を確認し、バッテリー交換または修理を手配する。",
      "UPSのアラートを無効化して業務を続ける。",
      "UPSを取り外してサーバーを直結する。"
    ],
    correct: 0,
    explanation: "正解：UPS異常はバッテリー状態の確認と交換・修理が必要です。アラート無効化は根本解決にならず、停電時に致命的な障害を招きます。"
  },
  {
    id: "infra-cooling-high",
    equipmentId: "cooling",
    category: "ENVIRONMENT",
    title: "データセンター温度上昇警告",
    description: "ラック内の温度が許容値を超え始めました。冷却システムの一部が停止しており、このまま放置するとサーバーが自動停止します。",
    warning: 16,
    severity: 2.3,
    penalty: 15,
    repairCost: 22000,
    options: [
      "冷却ユニットの状態を確認し、フィルター詰まりや冷媒漏れを点検して緊急冷却措置をとる。",
      "サーバーの設定温度上限を引き上げて警告を止める。",
      "ラックの扉を開放して自然冷却を試みる。"
    ],
    correct: 0,
    explanation: "正解：温度超過の原因を特定して冷却を回復します。設定値の変更は問題を隠すだけで危険であり、自然冷却は効果が不十分です。"
  },
  {
    id: "infra-rack-power",
    equipmentId: "rack",
    category: "POWER",
    title: "サーバーラックの電源異常",
    description: "サーバーラックのPDUで過電流警告が発生し、一部サーバーが自動停止しました。",
    warning: 18,
    severity: 1.9,
    penalty: 12,
    repairCost: 17000,
    options: [
      "電源容量を無視してサーバーを再起動する。",
      "負荷分散を実施し、PDUの容量と配線を確認して必要なら増設する。",
      "ラック全体の電源を落とす。"
    ],
    correct: 1,
    explanation: "正解：電源異常は負荷分散と容量確認で対応します。無視は再発を招き、全停止は業務影響が大きいです。"
  },
  {
    id: "infra-rack-space",
    equipmentId: "rack",
    category: "PHYSICAL",
    title: "ラックの空き容量不足",
    description: "新規サーバーの設置場所がなく、ラックの空き容量が枯渇しています。",
    warning: 26,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "サーバーを床に置く。",
      "ラック配置を見直し、不要機器の撤去と効率的な配置を検討する。",
      "新規サーバーの導入を延期する。"
    ],
    correct: 1,
    explanation: "正解：容量不足は配置見直しと効率化で対応します。床置きは規制違反で、延期は業務阻害です。"
  },
  {
    id: "infra-rack-cable",
    equipmentId: "rack",
    category: "PHYSICAL",
    title: "ラック内の配線混乱",
    description: "ラック内のケーブルが絡まり合い、メンテナンスが困難な状態です。",
    warning: 25,
    severity: 1.0,
    penalty: 5,
    repairCost: 8000,
    options: [
      "そのまま使い続ける。",
      "ケーブル管理を実施し、ラベル付けと整理を行う。",
      "ケーブルをすべて切断する。"
    ],
    correct: 1,
    explanation: "正解：配線混乱は管理と整理で改善します。無為は事故リスクを残し、切断は業務停止です。"
  },
  {
    id: "infra-rack-vibration",
    equipmentId: "rack",
    category: "PHYSICAL",
    title: "サーバーラックの振動",
    description: "サーバーラックから異常な振動が発生しており、HDD故障のリスクがあります。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "振動を無視する。",
      "振動源を特定し、ラックの固定と設置場所の見直しを行う。",
      "サーバーをすべて取り外す。"
    ],
    correct: 1,
    explanation: "正解：振動は原因特定と固定で対応します。無視は故障を招き、取り外しは過剰です。"
  },
  {
    id: "infra-rack-access",
    equipmentId: "rack",
    category: "PHYSICAL",
    title: "ラックへのアクセス困難",
    description: "周囲に障害物があり、サーバーラックへのアクセスが困難です。",
    warning: 24,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "障害物を乗り越えてアクセスする。",
      "レイアウトを見直し、安全なアクセス経路を確保する。",
      "ラックを移動する。"
    ],
    correct: 1,
    explanation: "正解：アクセス困難はレイアウト見直しで対応します。無理なアクセスは危険で、移動は過剰です。"
  },
  {
    id: "infra-rack-temperature",
    equipmentId: "rack",
    category: "ENVIRONMENT",
    title: "ラック内の温度ムラ",
    description: "ラック内で温度分布が不均一で、一部サーバーが高温になっています。",
    warning: 21,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "高温のサーバーを無視する。",
      "サーバー配置と通風を見直し、温度ムラを解消する。",
      "ラック全体の冷却を強化する。"
    ],
    correct: 1,
    explanation: "正解：温度ムラは配置と通風見直しで解消します。無視は故障を招き、全体強化は非効率です。"
  },
  {
    id: "infra-rack-dust",
    equipmentId: "rack",
    category: "ENVIRONMENT",
    title: "ラック内の埃の堆積",
    description: "サーバーラック内に埃が堆積し、冷却効率が低下しています。",
    warning: 27,
    severity: 1.0,
    penalty: 5,
    repairCost: 7000,
    options: [
      "埃を放置する。",
      "清掃を実施し、防塵対策を講じる。",
      "エアダスターで吹き飛ばすだけ。"
    ],
    correct: 1,
    explanation: "正解：埃堆積は清掃と防塵で対応します。放置は効率低下を招き、吹き飛ばしは不十分です。"
  },
  {
    id: "infra-rack-label",
    equipmentId: "rack",
    category: "MANAGEMENT",
    title: "サーバーラベルの欠落",
    description: "サーバーのラベルが剥がれ、機器識別が困難になっています。",
    warning: 28,
    severity: 0.8,
    penalty: 4,
    repairCost: 6000,
    options: [
      "ラベルを貼らない。",
      "ラベルを貼り直し、資産管理を更新する。",
      "メモで代用する。"
    ],
    correct: 1,
    explanation: "正解：ラベル欠落は貼り直しと管理更新で対応します。無為は管理不全を招き、メモは不十分です。"
  },
  {
    id: "infra-rack-security",
    equipmentId: "rack",
    category: "SECURITY",
    title: "ラックのセキュリティ不備",
    description: "サーバーラックのロックが破損し、不正アクセスのリスクがあります。",
    warning: 23,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "ロックを修理しない。",
      "ロックを修理し、アクセス管理を強化する。",
      "ラック前に監視カメラを設置するだけ。"
    ],
    correct: 1,
    explanation: "正解：セキュリティ不備は修理と管理強化で対応します。無為はリスクを残し、カメラだけは不十分です。"
  },
  {
    id: "infra-network-latency",
    equipmentId: "network",
    category: "NETWORK",
    title: "ネットワーク遅延の増加",
    description: "データセンター内ネットワークで遅延が増加し、アプリ応答が悪化しています。",
    warning: 19,
    severity: 1.6,
    penalty: 11,
    repairCost: 14000,
    options: [
      "遅延を無視する。",
      "遅延原因を特定し、スイッチ設定と経路を最適化する。",
      "ネットワーク機器をすべて再起動する。"
    ],
    correct: 1,
    explanation: "正解：遅延増加は原因特定と最適化で対応します。無視は業務悪化を招き、再起動は一時的です。"
  },
  {
    id: "infra-network-jitter",
    equipmentId: "network",
    category: "NETWORK",
    title: "ネットワークジッターの発生",
    description: "通信品質が不安定で、ジッターが発生しています。",
    warning: 20,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "ジッターを放置する。",
      "QoS設定を見直し、優先制御を実施する。",
      "帯域を増やすだけ。"
    ],
    correct: 1,
    explanation: "正解：ジッターはQoS設定で改善します。放置は品質低下を招き、帯域増加だけは不十分です。"
  },
  {
    id: "infra-network-loop",
    equipmentId: "network",
    category: "NETWORK",
    title: "ネットワークループの検知",
    description: "スパニングツリープロトコルでループが検知され、一部ポートがブロックされました。",
    warning: 16,
    severity: 2.0,
    penalty: 13,
    repairCost: 16000,
    options: [
      "ブロックを解除する。",
      "ループ原因を特定し、配線と設定を修正する。",
      "スイッチを交換する。"
    ],
    correct: 1,
    explanation: "正解：ループは原因特定と修正で対応します。解除はブロードキャストストームを招き、交換は過剰です。"
  },
  {
    id: "infra-network-mtu",
    equipmentId: "network",
    category: "NETWORK",
    title: "MTU設定の不整合",
    description: "ネットワーク機器間でMTU設定が不整合で、パケット断片化が発生しています。",
    warning: 22,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "設定をそのままにする。",
      "MTU設定を統一し、パスMTUを確認する。",
      "全機器のMTUを最小にする。"
    ],
    correct: 1,
    explanation: "正解：MTU不整合は統一と確認で対応します。無為は効率低下を招き、最小設定は非効率です。"
  },
  {
    id: "infra-network-vlan",
    equipmentId: "network",
    category: "NETWORK",
    title: "VLAN設定の誤り",
    description: "VLAN設定ミスにより、異なるセグメント間で通信ができています。",
    warning: 18,
    severity: 1.8,
    penalty: 12,
    repairCost: 15000,
    options: [
      "通信を許可する。",
      "VLAN設定を修正し、セグメンテーションを強化する。",
      "ファイアウォールで制限する。"
    ],
    correct: 1,
    explanation: "正解：VLAN誤りは設定修正で対応します。許可はセキュリティリスクで、FWのみは不十分です。"
  },
  {
    id: "infra-network-bgp",
    equipmentId: "network",
    category: "NETWORK",
    title: "BGPルートの不安定",
    description: "BGPピアとの接続が不安定で、ルートフラップが発生しています。",
    warning: 17,
    severity: 1.9,
    penalty: 12,
    repairCost: 16000,
    options: [
      "ルートフラップを無視する。",
      "ピア設定とタイマーを見直し、ルートマップを適用する。",
      "BGPを無効化する。"
    ],
    correct: 1,
    explanation: "正解：BGP不安定は設定見直しで対応します。無視は接続不安定を招き、無効化は致命的です。"
  },
  {
    id: "infra-ups-battery",
    equipmentId: "ups",
    category: "POWER",
    title: "UPSバッテリーの劣化",
    description: "UPSバッテリーの劣化が進み、バックアップ時間が短縮しています。",
    warning: 24,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "バッテリーを交換しない。",
      "バッテリーを交換し、定期点検を開始する。",
      "UPSをバイパスモードで使う。"
    ],
    correct: 1,
    explanation: "正解：バッテリー劣化は交換と点検で対応します。無為はリスクを残し、バイパスは保護なしです。"
  },
  {
    id: "infra-ups-load",
    equipmentId: "ups",
    category: "POWER",
    title: "UPS負荷率の上昇",
    description: "UPS負荷率が80%を超え、余裕がなくなっています。",
    warning: 21,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "負荷をそのままにする。",
      "負荷分散を実施し、UPS容量を確認して必要なら増設する。",
      "負荷制限を無効にする。"
    ],
    correct: 1,
    explanation: "正解：負荷上昇は分散と容量確認で対応します。無為は過負荷リスクを招き、無効化は危険です。"
  },
  {
    id: "infra-ups-transfer",
    equipmentId: "ups",
    category: "POWER",
    title: "UPS転換スイッチの不具合",
    description: "UPSの商用転換スイッチの動作確認で異常が検出されました。",
    warning: 20,
    severity: 1.7,
    penalty: 11,
    repairCost: 14000,
    options: [
      "スイッチを修理しない。",
      "スイッチを修理し、定期テストを実施する。",
      "UPSをバイパス固定にする。"
    ],
    correct: 1,
    explanation: "正解：スイッチ不具合は修理とテストで対応します。無為はリスクを残し、バイパス固定は保護なしです。"
  },
  {
    id: "infra-ups-maintenance",
    equipmentId: "ups",
    category: "MAINTENANCE",
    title: "UPSメンテナンスの遅延",
    description: "UPSの定期メンテナンスが延期されており、信頼性が低下しています。",
    warning: 26,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "メンテナンスをさらに延期する。",
      "メンテナンス窓を設けて実施する。",
      "メンテナンスを廃止する。"
    ],
    correct: 1,
    explanation: "正解：メンテナンス遅延は計画的実施で解消します。延期はリスクを残し、廃止は危険です。"
  },
  {
    id: "infra-ups-environment",
    equipmentId: "ups",
    category: "ENVIRONMENT",
    title: "UPS設置環境の問題",
    description: "UPS周辺の温度と湿度が基準外で、機器寿命に影響しています。",
    warning: 23,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "環境を放置する。",
      "空調を見直し、温湿度管理を強化する。",
      "UPSを移動する。"
    ],
    correct: 1,
    explanation: "正解：環境問題は空調見直しで対応します。放置は寿命短縮を招き、移動は過剰です。"
  },
  {
    id: "infra-ups-monitoring",
    equipmentId: "ups",
    category: "MONITORING",
    title: "UPS監視の不備",
    description: "UPSの状態監視が不十分で、異常検知が遅れています。",
    warning: 25,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "監視を強化しない。",
      "監視システムを導入し、アラート設定を行う。",
      "手動で定時点検する。"
    ],
    correct: 1,
    explanation: "正解：監視不備はシステム導入で改善します。無為は検知遅延を招き、手動は不十分です。"
  },
  {
    id: "infra-cooling-humidity",
    equipmentId: "cooling",
    category: "ENVIRONMENT",
    title: "湿度管理の不備",
    description: "データセンターの湿度が基準外で、静電気と結露のリスクがあります。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "湿度を放置する。",
      "加湿・除湿設定を見直し、適正範囲に調整する。",
      "換気を強化するだけ。"
    ],
    correct: 1,
    explanation: "正解：湿度不備は設定調整で対応します。放置はリスクを招き、換気のみは不十分です。"
  },
  {
    id: "infra-cooling-airflow",
    equipmentId: "cooling",
    category: "ENVIRONMENT",
    title: "気流の偏り",
    description: "冷房の気流が偏り、ホットスポットが発生しています。",
    warning: 20,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "気流を放置する。",
      "気流解析を実施し、穿孔タイルと吹き出し口を調整する。",
      "冷房能力を増やすだけ。"
    ],
    correct: 1,
    explanation: "正解：気流偏りは解析と調整で解消します。放置はホットスポットを招き、能力増加のみは非効率です。"
  },
  {
    id: "infra-cooling-maintenance",
    equipmentId: "cooling",
    category: "MAINTENANCE",
    title: "冷却ユニットのメンテナンス",
    description: "冷却ユニットのフィルターが詰まり、冷房効率が低下しています。",
    warning: 21,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "フィルターを交換しない。",
      "フィルターを交換し、定期メンテナンスを開始する。",
      "冷却ユニットを交換する。"
    ],
    correct: 1,
    explanation: "正解：フィルター詰まりは交換とメンテナンスで対応します。無為は効率低下を招き、交換は過剰です。"
  },
  {
    id: "infra-cooling-redundancy",
    equipmentId: "cooling",
    category: "REDUNDANCY",
    title: "冷却冗長性の低下",
    description: "冷却ユニットの1台が故障し、冗長性が低下しています。",
    warning: 19,
    severity: 1.6,
    penalty: 11,
    repairCost: 14000,
    options: [
      "故障を放置する。",
      "故障ユニットを修理し、予備ユニットを確保する。",
      "残りユニットで無理に運用する。"
    ],
    correct: 1,
    explanation: "正解：冗長性低下は修理と予備確保で対応します。放置はリスクを残し、無理運用は故障を招きます。"
  },
  {
    id: "infra-cooling-water",
    equipmentId: "cooling",
    category: "ENVIRONMENT",
    title: "冷却水の問題",
    description: "冷却水系統で異常が検出され、漏水の可能性があります。",
    warning: 17,
    severity: 1.8,
    penalty: 12,
    repairCost: 15000,
    options: [
      "異常を無視する。",
      "系統を点検し、漏水箇所を特定して修理する。",
      "冷却水を止める。"
    ],
    correct: 1,
    explanation: "正解：冷却水異常は点検と修理で対応します。無視は水損リスクを招き、停止は致命的です。"
  },
  {
    id: "infra-cooling-control",
    equipmentId: "cooling",
    category: "CONTROL",
    title: "冷却制御の不具合",
    description: "冷却制御システムが不安定で、温度変動が大きくなっています。",
    warning: 23,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "制御を放置する。",
      "制御システムを修理し、手動モードへの切り替え手順を準備する。",
      "手動運用に切り替える。"
    ],
    correct: 1,
    explanation: "正解：制御不具合は修理と手動準備で対応します。放置は変動を招き、手動のみはリスクです。"
  },
  {
    id: "infra-storage-performance",
    equipmentId: "storage",
    category: "PERFORMANCE",
    title: "ストレージ性能低下",
    description: "ストレージアレイのI/O性能が低下し、アプリ応答が遅延しています。",
    warning: 18,
    severity: 1.7,
    penalty: 11,
    repairCost: 14000,
    options: [
      "性能低下を放置する。",
      "ボトルネックを特定し、RAID構成とキャッシュ設定を見直す。",
      "ディスクをすべて交換する。"
    ],
    correct: 1,
    explanation: "正解：性能低下は特定と設定見直しで対応します。放置は業務悪化を招き、交換は過剰です。"
  },
  {
    id: "infra-storage-capacity",
    equipmentId: "storage",
    category: "CAPACITY",
    title: "ストレージ容量不足",
    description: "ストレージ容量が90%を超え、拡張が必要です。",
    warning: 25,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "容量を放置する。",
      "データ整理と容量拡張を実施する。",
      "古いデータを削除するだけ。"
    ],
    correct: 1,
    explanation: "正解：容量不足は整理と拡張で対応します。放置は満杯リスクを招き、削除のみは一時的です。"
  },
  {
    id: "infra-storage-snapshot",
    equipmentId: "storage",
    category: "MANAGEMENT",
    title: "スナップショットの肥大化",
    description: "スナップショット容量が肥大化し、ストレージ効率が低下しています。",
    warning: 24,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "スナップショットを放置する。",
      "古いスナップショットを削除し、ポリシーを見直す。",
      "容量を増やすだけ。"
    ],
    correct: 1,
    explanation: "正解：スナップショット肥大化は削除とポリシー見直しで対応します。放置は効率低下を招き、増加のみは不十分です。"
  },
  {
    id: "infra-storage-replication",
    equipmentId: "storage",
    category: "REPLICATION",
    title: "レプリケーションの遅延",
    description: "ストレージレプリケーションで遅延が発生し、データ同期が遅れています。",
    warning: 20,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "遅延を放置する。",
      "帯域とレプリケーション設定を見直し、最適化する。",
      "レプリケーションを停止する。"
    ],
    correct: 1,
    explanation: "正解：レプリケーション遅延は設定見直しで対応します。放置は同期遅延を招き、停止は保護なしです。"
  },
  {
    id: "infra-storage-lun",
    equipmentId: "storage",
    category: "CONFIGURATION",
    title: "LUN設定の不備",
    description: "LUN設定ミスにより、サーバーからストレージが認識できません。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "設定を放置する。",
      "LUN設定とマスキングを確認し、修正する。",
      "サーバーを再起動する。"
    ],
    correct: 1,
    explanation: "正解：LUN不備は設定確認と修正で対応します。放置はアクセス不可を招き、再起動は不十分です。"
  },
  {
    id: "infra-storage-firmware",
    equipmentId: "storage",
    category: "MAINTENANCE",
    title: "ストレージファームウェアの更新",
    description: "ストレージコントローラーのファームウェア更新が必要です。",
    warning: 26,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "更新を延期する。",
      "メンテナンス窓を設けて更新を実施する。",
      "更新せずに使い続ける。"
    ],
    correct: 1,
    explanation: "正解：ファームウェア更新は計画的実施が重要です。延期はリスクを残し、無更新は不具合リスクです。"
  },
  {
    id: "infra-storage-cache",
    equipmentId: "storage",
    category: "PERFORMANCE",
    title: "キャッシュメモリの故障",
    description: "ストレージキャッシュメモリでエラーが検出されました。",
    warning: 19,
    severity: 1.6,
    penalty: 11,
    repairCost: 14000,
    options: [
      "エラーを放置する。",
      "キャッシュモジュールを交換し、データ整合性を確認する。",
      "キャッシュを無効化する。"
    ],
    correct: 1,
    explanation: "正解：キャッシュ故障は交換と確認で対応します。放置はデータ損失リスクを招き、無効化は性能低下です。"
  },
  {
    id: "infra-monitor-alert",
    equipmentId: "monitor",
    category: "MONITORING",
    title: "監視アラートの設定不備",
    description: "重要な監視項目のアラートが設定されていません。",
    warning: 27,
    severity: 1.0,
    penalty: 5,
    repairCost: 8000,
    options: [
      "アラートを設定しない。",
      "監視項目を見直し、適切なアラートを設定する。",
      "手動で監視する。"
    ],
    correct: 1,
    explanation: "正解：アラート不備は設定で対応します。無為は検知遅延を招き、手動は不十分です。"
  },
  {
    id: "infra-monitor-threshold",
    equipmentId: "monitor",
    category: "MONITORING",
    title: "閾値設定の不適切",
    description: "監視閾値が適切でなく、誤検知や検洩が発生しています。",
    warning: 25,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "閾値を放置する。",
      "閾値を見直し、適切な値に調整する。",
      "アラートを無効にする。"
    ],
    correct: 1,
    explanation: "正解：閾値不備は調整で対応します。放置は信頼性低下を招き、無効化は危険です。"
  },
  {
    id: "infra-monitor-dashboard",
    equipmentId: "monitor",
    category: "MONITORING",
    title: "ダッシュボードの不具合",
    description: "監視ダッシュボードが正常に表示されません。",
    warning: 23,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "ダッシュボードを放置する。",
      "ダッシュボードシステムを再起動し、設定を確認する。",
      "別のツールに移行する。"
    ],
    correct: 1,
    explanation: "正解：ダッシュボード不具合は再起動と確認で対応します。放置は監視不全を招き、移行は過剰です。"
  },
  {
    id: "infra-monitor-log",
    equipmentId: "monitor",
    category: "MONITORING",
    title: "ログ収集の不備",
    description: "重要なログが収集されておらず、問題分析が困難です。",
    warning: 24,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "ログ収集を強化しない。",
      "ログ収集設定を見直し、必要なログを追加する。",
      "ログを手動で収集する。"
    ],
    correct: 1,
    explanation: "正解：ログ収集不備は設定見直しで対応します。無為は分析困難を招き、手動は不十分です。"
  },
  {
    id: "infra-monitor-notification",
    equipmentId: "monitor",
    category: "MONITORING",
    title: "通知設定の不備",
    description: "監視通知が適切に届いていません。",
    warning: 26,
    severity: 1.0,
    penalty: 5,
    repairCost: 8000,
    options: [
      "通知を放置する。",
      "通知設定を確認し、連絡先とチャンネルを更新する。",
      "手動で確認する。"
    ],
    correct: 1,
    explanation: "正解：通知不備は設定更新で対応します。放置は対応遅延を招き、手動は不十分です。"
  },
  {
    id: "infra-monitor-maintenance",
    equipmentId: "monitor",
    category: "MAINTENANCE",
    title: "監視システムのメンテナンス",
    description: "監視システムの更新が必要ですが、メンテナンスが遅れています。",
    warning: 28,
    severity: 0.9,
    penalty: 4,
    repairCost: 7000,
    options: [
      "更新を延期する。",
      "メンテナンス窓を設けて更新を実施する。",
      "システムを交換する。"
    ],
    correct: 1,
    explanation: "正解：監視システム更新は計画的実施が重要です。延期はリスクを残し、交換は過剰です。"
  },
  {
    id: "infra-dr-test",
    equipmentId: "dr",
    category: "TESTING",
    title: "DRテストの失敗",
    description: "DRシステムのテストで復旧手順に問題が発覚しました。",
    warning: 21,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "手順を放置する。",
      "手順を見直し、修正して再テストを実施する。",
      "テストを中止する。"
    ],
    correct: 1,
    explanation: "正解：DRテスト失敗は手順見直しと再テストで対応します。放置はリスクを残し、中止は不十分です。"
  },
  {
    id: "infra-dr-sync",
    equipmentId: "dr",
    category: "REPLICATION",
    title: "DR同期の遅延",
    description: "DRサイトへのデータ同期が遅延し、RPOが悪化しています。",
    warning: 19,
    severity: 1.6,
    penalty: 11,
    repairCost: 14000,
    options: [
      "遅延を放置する。",
      "帯域と同期設定を見直し、最適化する。",
      "同期を停止する。"
    ],
    correct: 1,
    explanation: "正解：DR同期遅延は設定見直しで対応します。放置はRPO悪化を招き、停止は保護なしです。"
  },
  {
    id: "infra-dr-failover",
    equipmentId: "dr",
    category: "RECOVERY",
    title: "フェイルオーバー手順の不備",
    description: "フェイルオーバー手順が不十分で、切り替え時間が長くなっています。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "手順を放置する。",
      "手順を簡素化し、自動化を検討する。",
      "手動で対応する。"
    ],
    correct: 1,
    explanation: "正解：フェイルオーバー不備は簡素化と自動化で対応します。放置は復旧遅延を招き、手動はリスクです。"
  },
  {
    id: "infra-dr-capacity",
    equipmentId: "dr",
    category: "CAPACITY",
    title: "DRサイトの容量不足",
    description: "DRサイトの容量が不足し、本番サイトの全データを保持できません。",
    warning: 25,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "容量を放置する。",
      "容量拡張とデータ保持ポリシーを見直す。",
      "重要データのみ保持する。"
    ],
    correct: 1,
    explanation: "正解：DR容量不足は拡張とポリシー見直しで対応します。放置は保護不全を招き、重要のみはリスクです。"
  },
  {
    id: "infra-dr-network",
    equipmentId: "dr",
    category: "NETWORK",
    title: "DRサイトのネットワーク不備",
    description: "DRサイトへのネットワーク接続が不安定です。",
    warning: 20,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "ネットワークを放置する。",
      "回線冗長化と経路最適化を実施する。",
      "DRサイトを移動する。"
    ],
    correct: 1,
    explanation: "正解：DRネットワーク不備は冗長化と最適化で対応します。放置は接続不安定を招き、移動は過剰です。"
  },
  {
    id: "infra-dr-documentation",
    equipmentId: "dr",
    category: "MANAGEMENT",
    title: "DRドキュメントの不備",
    description: "DR計画書が更新されておらず、現状と合致していません。",
    warning: 27,
    severity: 1.0,
    penalty: 5,
    repairCost: 8000,
    options: [
      "ドキュメントを放置する。",
      "ドキュメントを更新し、定期的レビューを開始する。",
      "口頭で伝えるだけ。"
    ],
    correct: 1,
    explanation: "正解：DRドキュメント不備は更新とレビューで対応します。放置は計画不全を招き、口頭は不十分です。"
  },
  {
    id: "infra-dr-drill",
    equipmentId: "dr",
    category: "TRAINING",
    title: "DR訓練の不足",
    description: "スタッフのDR対応訓練が不足しており、実際の対応に不安があります。",
    warning: 28,
    severity: 0.9,
    penalty: 4,
    repairCost: 7000,
    options: [
      "訓練を実施しない。",
      "定期的なDR訓練を実施し、手順を習熟させる。",
      "マニュアルを読むだけ。"
    ],
    correct: 1,
    explanation: "正解：DR訓練不足は実施と習熟で対応します。無為は対応不安を招き、読書のみは不十分です。"
  },
  {
    id: "infra-dr-compliance",
    equipmentId: "dr",
    category: "COMPLIANCE",
    title: "DRコンプライアンスの不備",
    description: "監査でDR計画が規制要件を満たしていないと指摘されました。",
    warning: 24,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "指摘を無視する。",
      "要件を確認し、DR計画を是正する。",
      "監査を拒否する。"
    ],
    correct: 1,
    explanation: "正解：DRコンプライアンス不備是正は確認と是正で対応します。無視是罰則を招き、拒否は違法です。"
  },
  {
    id: "infra-storage-compression",
    equipmentId: "storage",
    category: "PERFORMANCE",
    title: "ストレージ圧縮の性能低下",
    description: "ストレージ圧縮機能が有効になっていますが、CPU使用率が高くなり性能が低下しています。",
    warning: 20,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "圧縮を無効化する。",
      "圧縮設定を見直し、必要なデータのみ圧縮する。",
      "サーバーを追加する。"
    ],
    correct: 1,
    explanation: "正解：圧縮設定の見直しが適切です。無効化は容量効率を低下させ、サーバー追加はコストが高いです。"
  },
  {
    id: "infra-monitor-alert",
    equipmentId: "monitor",
    category: "MONITORING",
    title: "監視アラートの誤検知",
    description: "監視システムで誤検知が頻発し、運用負荷が高まっています。",
    warning: 18,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "アラートを無視する。",
      "アラート閾値を調整し、誤検知を減らす。",
      "監視を停止する。"
    ],
    correct: 1,
    explanation: "正解：アラート閾値の調整が適切です。無視はリスクを残し、停止は監視を不可能にします。"
  },
  {
    id: "infra-monitor-dashboard",
    equipmentId: "monitor",
    category: "MONITORING",
    title: "監視ダッシュボードの不備",
    description: "監視ダッシュボードが正しく表示されておらず、状況把握が困難です。",
    warning: 20,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "ダッシュボードを放置する。",
      "ダッシュボード設定を確認し、修正する。",
      "手動で監視する。"
    ],
    correct: 1,
    explanation: "正解：ダッシュボード設定の確認と修正が重要です。放置は状況把握を困難にし、手動監視は効率が低いです。"
  },
  {
    id: "infra-monitor-retention",
    equipmentId: "monitor",
    category: "STORAGE",
    title: "監視データの保持期間不備",
    description: "監視データの保持期間が短すぎ、過去の傾向分析が困難です。",
    warning: 16,
    severity: 1.0,
    penalty: 5,
    repairCost: 8000,
    options: [
      "保持期間を変更しない。",
      "保持期間を延長し、傾向分析を可能にする。",
      "データを削除する。"
    ],
    correct: 1,
    explanation: "正解：保持期間の延長が重要です。無変更は分析を困難にし、削除はデータを失います。"
  },
  {
    id: "infra-monitor-integration",
    equipmentId: "monitor",
    category: "INTEGRATION",
    title: "監視システムの連携不備",
    description: "監視システムと他システムの連携が不十分で、自動対応ができていません。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "連携しない。",
      "連携設定を確認し、自動対応を有効にする。",
      "手動で対応する。"
    ],
    correct: 1,
    explanation: "正解：連携設定の確認と自動対応の有効化が重要です。無連携は効率を低下させ、手動対応は負荷が高いです。"
  },
  {
    id: "infra-dr-test",
    equipmentId: "dr",
    category: "TESTING",
    title: "DR訓練の不備",
    description: "DR訓練が実施されておらず、実災害時の対応が不確実です。",
    warning: 24,
    severity: 1.6,
    penalty: 11,
    repairCost: 14000,
    options: [
      "訓練しない。",
      "定期的にDR訓練を実施し、対応手順を確認する。",
      "実災害で学ぶ。"
    ],
    correct: 1,
    explanation: "正解：定期的なDR訓練が重要です。無訓練は実災害で混乱を招き、実災害学習はリスクが高いです。"
  },
  {
    id: "infra-dr-rto",
    equipmentId: "dr",
    category: "METRICS",
    title: "RTO目標未達",
    description: "DRシステムのRTO（復旧目標時間）が目標を達成できていません。",
    warning: 22,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "目標を下げる。",
      "復旧手順を見直し、RTOを改善する。",
      "現状維持する。"
    ],
    correct: 1,
    explanation: "正解：復旧手順の見直しが重要です。目標低下はサービス品質を低下させ、現状維持は改善なしです。"
  },
  {
    id: "infra-dr-rpo",
    equipmentId: "dr",
    category: "METRICS",
    title: "RPO目標未達",
    description: "DRシステムのRPO（復旧目標時点）が目標を達成できていません。",
    warning: 20,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "目標を下げる。",
      "バックアップ頻度を見直し、RPOを改善する。",
      "現状維持する。"
    ],
    correct: 1,
    explanation: "正解：バックアップ頻度の見直しが重要です。目標低下はデータ損失リスクを高め、現状維持は改善なしです。"
  },
  {
    id: "infra-dr-site",
    equipmentId: "dr",
    category: "INFRASTRUCTURE",
    title: "DRサイトの不備",
    description: "DRサイトのインフラが不十分で、本番環境と同等の復旧ができません。",
    warning: 26,
    severity: 1.8,
    penalty: 13,
    repairCost: 17000,
    options: [
      "DRサイトを放置する。",
      "DRサイトのインフラを強化し、本番環境と同等にする。",
      "DRサイトを廃止する。"
    ],
    correct: 1,
    explanation: "正解：DRサイトのインフラ強化が重要です。放置は復旧能力を低下させ、廃止はリスクを残します。"
  },
  {
    id: "infra-ups-capacity",
    equipmentId: "ups",
    category: "CAPACITY",
    title: "UPS容量の不足",
    description: "UPS容量が不足しており、負荷増加時に対応できません。",
    warning: 22,
    severity: 1.6,
    penalty: 11,
    repairCost: 14000,
    options: [
      "容量を増やさない。",
      "UPS容量を増強し、負荷増加に対応する。",
      "負荷を減らす。"
    ],
    correct: 1,
    explanation: "正解：UPS容量の増強が重要です。無増強は対応能力を低下させ、負荷減少は業務制限を招きます。"
  },
  {
    id: "infra-ups-redundancy",
    equipmentId: "ups",
    category: "RELIABILITY",
    title: "UPS冗長化の不備",
    description: "UPSが冗長化されておらず、単一障害で停止するリスクがあります。",
    warning: 24,
    severity: 1.7,
    penalty: 12,
    repairCost: 15000,
    options: [
      "冗長化しない。",
      "UPSを冗長化し、単一障害に対応する。",
      "リスクを受け入れる。"
    ],
    correct: 1,
    explanation: "正解：UPS冗長化が重要です。無冗長化はリスクを残し、リスク受容は停止リスクを高めます。"
  },
  {
    id: "infra-ups-bypass",
    equipmentId: "ups",
    category: "MAINTENANCE",
    title: "UPSバイパスモードの不備",
    description: "UPSバイパスモードへの切り替え手順が不明確で、メンテナンスが困難です。",
    warning: 18,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "手順を策定しない。",
      "バイパス手順を策定し、メンテナンスを容易にする。",
      "メンテナンスしない。"
    ],
    correct: 1,
    explanation: "正解：バイパス手順の策定が重要です。無策定はメンテナンスを困難にし、無メンテナンスは信頼性を低下させます。"
  },
  {
    id: "infra-cooling-humidity",
    equipmentId: "cooling",
    category: "ENVIRONMENT",
    title: "データセンター湿度の異常",
    description: "データセンターの湿度が許容範囲外で、静電気や結露のリスクがあります。",
    warning: 20,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "湿度を放置する。",
      "湿度制御設定を確認し、適正範囲に調整する。",
      "換気を強化する。"
    ],
    correct: 1,
    explanation: "正解：湿度制御設定の確認と調整が重要です。放置は機器故障を招き、換気強化は不十分な場合があります。"
  },
  {
    id: "infra-cooling-airflow",
    equipmentId: "cooling",
    category: "ENVIRONMENT",
    title: "冷却空気流の不備",
    description: "冷却空気流が不適切で、ホットスポットが発生しています。",
    warning: 22,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "空気流を放置する。",
      "空気流設計を見直し、ホットスポットを解消する。",
      "サーバーを移動する。"
    ],
    correct: 1,
    explanation: "正解：空気流設計の見直しが重要です。放置は過熱を招き、サーバー移動は一時的な解決に過ぎません。"
  },
  {
    id: "infra-cooling-redundancy",
    equipmentId: "cooling",
    category: "RELIABILITY",
    title: "冷却システムの冗長化不備",
    description: "冷却システムが冗長化されておらず、単一障害で停止するリスクがあります。",
    warning: 24,
    severity: 1.7,
    penalty: 12,
    repairCost: 15000,
    options: [
      "冗長化しない。",
      "冷却システムを冗長化し、単一障害に対応する。",
      "リスクを受け入れる。"
    ],
    correct: 1,
    explanation: "正解：冷却システムの冗長化が重要です。無冗長化はリスクを残し、リスク受容は停止リスクを高めます。"
  },
  {
    id: "infra-raid-write-cache",
    equipmentId: "storage",
    category: "STORAGE",
    title: "RAIDコントローラーのライトキャッシュ警告",
    description: "ストレージアレイでライトキャッシュ保護バッテリーの劣化警告が出ています。",
    warning: 24,
    severity: 1.7,
    penalty: 12,
    repairCost: 16000,
    learningTags: ["RAID", "キャッシュ", "ストレージ"],
    examPoint: "ストレージのキャッシュは性能に効きますが、電源断時の保護も必要です。警告を放置しないことが重要です。",
    options: ["警告を無視して高負荷処理を続ける。", "保護バッテリー状態を確認し、交換計画と負荷調整を行う。", "全データを削除して初期化する。"],
    correct: 1,
    explanation: "正解：キャッシュ保護の劣化は性能とデータ保護に関わります。状態確認と交換、負荷調整を行います。"
  },
  {
    id: "infra-bgp-route-leak",
    equipmentId: "network",
    category: "ROUTING",
    title: "外部経路の誤広告が疑われる",
    description: "ネットワークバックボーンで、本来広告しない経路が外部へ流れている可能性があります。",
    warning: 18,
    severity: 2.0,
    penalty: 15,
    repairCost: 19000,
    learningTags: ["ルーティング", "BGP", "経路制御"],
    examPoint: "経路制御では、経路フィルタや広告範囲を適切に設定し、誤広告による通信障害を防ぎます。",
    options: ["経路広告設定とフィルタを確認し、誤った広告を止める。", "全ルーターを初期化する。", "利用者にブラウザ再起動を依頼する。"],
    correct: 0,
    explanation: "正解：外部経路の誤広告は大きな障害につながります。経路広告とフィルタ設定を確認します。"
  },
  {
    id: "infra-ups-runtime-test",
    equipmentId: "ups",
    category: "AVAILABILITY",
    title: "UPSのバックアップ時間が不足している",
    description: "定期試験でUPSの稼働時間が想定より短く、停電時に安全停止まで持たない可能性があります。",
    warning: 26,
    severity: 1.8,
    penalty: 13,
    repairCost: 17000,
    learningTags: ["UPS", "可用性", "BCP"],
    examPoint: "UPSは停電時に安全停止や発電機切替までの時間を確保する設備です。定期試験と容量確認が必要です。",
    options: ["バッテリー状態と負荷容量を確認し、交換や容量増強を計画する。", "試験結果を削除して正常扱いにする。", "停電時は運に任せる。"],
    correct: 0,
    explanation: "正解：UPSの稼働時間不足は可用性リスクです。バッテリー状態と負荷を確認し、対策します。"
  },
  {
    id: "infra-monitor-alert-fatigue",
    equipmentId: "monitor",
    category: "MONITORING",
    title: "監視アラートが多すぎて重要通知を見落とす",
    description: "軽微な通知が大量に出ており、本当に重要な障害アラートが埋もれています。",
    warning: 22,
    severity: 1.5,
    penalty: 10,
    repairCost: 12500,
    learningTags: ["監視", "しきい値", "アラート疲れ"],
    examPoint: "監視では、重要度としきい値を調整し、対応すべき通知が埋もれないようにします。",
    options: ["すべてのアラートを無効化する。", "重要度、しきい値、通知ルールを見直して優先度を整理する。", "担当者を増やしてすべて手作業で確認する。"],
    correct: 1,
    explanation: "正解：アラート過多は見落としにつながります。重要度としきい値、通知ルールを見直します。"
  },];

const infraIncidents = dedupeIncidentsById([...infraMappedIncidents, ...infraCustomIncidents]);
