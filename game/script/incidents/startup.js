// ===== Webスタートアップ：インシデントデータ =====
// startupEquipment は modes/startup.js で定義されています

// officeIncidents からマッピングして構築する
const startupMappedIncidents = [
  { ...officeIncidents.find(i => i.id === "server-permission"), equipmentId: "devenv" },
  { ...officeIncidents.find(i => i.id === "password-expire"), equipmentId: "devenv" },
  { ...officeIncidents.find(i => i.id === "vpn-issue"), equipmentId: "devenv" },
  { ...officeIncidents.find(i => i.id === "account-expire"), equipmentId: "devenv" },
  { ...officeIncidents.find(i => i.id === "file-lock"), equipmentId: "devenv" },
  { ...officeIncidents.find(i => i.id === "software-update"), equipmentId: "cicd" },
  { ...officeIncidents.find(i => i.id === "scan-failure"), equipmentId: "cicd" },
  { ...officeIncidents.find(i => i.id === "driver-update"), equipmentId: "cicd" },
  { ...officeIncidents.find(i => i.id === "firewall-block"), equipmentId: "cdn" },
  { ...officeIncidents.find(i => i.id === "proxy-error"), equipmentId: "cdn" },
  { ...officeIncidents.find(i => i.id === "ip-conflict"), equipmentId: "container" },
  { ...officeIncidents.find(i => i.id === "dhcp-failure"), equipmentId: "container" },
  { ...officeIncidents.find(i => i.id === "qos-issue"), equipmentId: "dashboard" },
  { ...officeIncidents.find(i => i.id === "database-error"), equipmentId: "db" }
].filter(i => i.id);

// スタートアップ固有のインシデント（OOMや本番停止等）
const startupCustomIncidents = [
  {
    id: "startup-prod-down",
    equipmentId: "cloud",
    category: "OUTAGE",
    title: "本番サーバーの突然のダウン",
    description: "本番環境のサービスが突然ダウンし、全ユーザーがアクセスできない状態です。SNSでの問い合わせが急増しています。",
    warning: 15,
    severity: 2.5,
    penalty: 16,
    repairCost: 24000,
    options: [
      "監視ダッシュボードとログでエラーを特定し、前回の正常デプロイへのロールバックを実施する。",
      "とにかくサーバーを再起動して様子を見る。",
      "SNSでメンテナンス中と告知してから翌日に対応する。"
    ],
    correct: 0,
    explanation: "正解：本番ダウンは素早い原因特定とロールバックが基本です。ただの再起動では根本原因が残り、翌日対応ではユーザー離脱を招きます。"
  },
  {
    id: "startup-db-pool",
    equipmentId: "db",
    category: "DATABASE",
    title: "DBコネクションプールの枯渇",
    description: "データベースへの接続数が上限に達し、新しいリクエストが「Too many connections」エラーで拒否されています。",
    warning: 18,
    severity: 2.0,
    penalty: 13,
    repairCost: 17000,
    options: [
      "アプリ側でコネクションプーリングの設定を見直し、不要なコネクションをクローズして上限を適切に調整する。",
      "データベースサーバーを再起動して全接続をリセットする。",
      "接続上限を無制限に設定する。"
    ],
    correct: 0,
    explanation: "正解：コネクション枯渇はプールの設定見直しと不要接続の解放で解決します。DB再起動は全ユーザーへの影響が大きく、無制限設定はDBリソースを使い果たす危険があります。"
  },
  {
    id: "startup-deploy-fail",
    equipmentId: "cicd",
    category: "DEPLOYMENT",
    title: "デプロイパイプラインの失敗",
    description: "CI/CDパイプラインが新機能リリースでエラーになり、本番環境へのデプロイが止まっています。開発チームが待機中です。",
    warning: 25,
    severity: 1.5,
    penalty: 10,
    repairCost: 12000,
    options: [
      "パイプラインのビルドログを確認してエラーを特定し、修正後に再デプロイする。",
      "テストをスキップしてそのまま本番へ強制デプロイする。",
      "パイプラインを廃止して手動デプロイに切り替える。"
    ],
    correct: 0,
    explanation: "正解：パイプラインのエラーはログで原因を特定して修正します。テストスキップは不具合を本番に流すリスクがあり、手動デプロイは属人化と人的ミスを招きます。"
  },
  {
    id: "startup-secret-leak",
    equipmentId: "cicd",
    category: "SECURITY",
    title: "CI/CDへのシークレット漏洩疑い",
    description: "GitHubのパブリックリポジトリにAPIキーが誤ってコミットされた可能性があります。ボットによる自動検知アラートが届いています。",
    warning: 17,
    severity: 2.2,
    penalty: 14,
    repairCost: 19000,
    options: [
      "漏洩したAPIキーを直ちに無効化・再発行し、Gitの履歴からシークレットを削除してシークレット管理ツールを導入する。",
      "コミットを削除すれば問題ないので、ファイルだけ削除してプッシュする。",
      "パブリックリポジトリなので誰でも見られるのは仕方ないと判断する。"
    ],
    correct: 0,
    explanation: "正解：シークレット漏洩では漏洩したキーの即時無効化が最優先です。Gitのファイル削除のみではコミット履歴にシークレットが残ります。シークレット管理ツールの導入が再発防止になります。"
  },
  {
    id: "startup-cloud-scaling",
    equipmentId: "cloud",
    category: "SCALING",
    title: "自動スケーリングの不具合",
    description: "負荷増加時に自動スケーリングが動作せず、サービスが遅延しています。",
    warning: 20,
    severity: 1.8,
    penalty: 12,
    repairCost: 16000,
    options: [
      "手動でインスタンスを追加する。",
      "自動スケーリング設定を確認し、ポリシーとメトリクスを修正する。",
      "スケーリングを無効化する。"
    ],
    correct: 1,
    explanation: "正解：自動スケーリング不具合は設定確認と修正で対応します。手動追加は一時的で、無効化は柔軟性を失います。"
  },
  {
    id: "startup-cloud-cost",
    equipmentId: "cloud",
    category: "COST",
    title: "クラウドコストの急増",
    description: "クラウド利用料が急増しており、コスト管理が必要です。",
    warning: 26,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "コストを放置する。",
      "コスト分析を実施し、不要リソースを削除して最適化する。",
      "全インスタンスを停止する。"
    ],
    correct: 1,
    explanation: "正解：コスト急増は分析と最適化で対応します。放置は財務リスクを招き、全停止は業務停止です。"
  },
  {
    id: "startup-cloud-security",
    equipmentId: "cloud",
    category: "SECURITY",
    title: "クラウドセキュリティグループの不備",
    description: "セキュリティグループの設定が緩く、不要なポートが開放されています。",
    warning: 22,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "設定を放置する。",
      "セキュリティグループを見直し、最小限のポートのみ開放する。",
      "全ポートを閉じる。"
    ],
    correct: 1,
    explanation: "正解：セキュリティグループ不備は見直しと最小開放で対応します。放置はリスクを招き、全閉鎖は業務影響です。"
  },
  {
    id: "startup-cloud-backup",
    equipmentId: "cloud",
    category: "BACKUP",
    title: "クラウドバックアップの不備",
    description: "重要なインスタンスのバックアップが設定されていません。",
    warning: 24,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "バックアップを設定しない。",
      "バックアップポリシーを設定し、定期的な復旧テストを実施する。",
      "手動でバックアップする。"
    ],
    correct: 1,
    explanation: "正解：バックアップ不備はポリシー設定とテストで対応します。無為はリスクを残し、手動は不十分です。"
  },
  {
    id: "startup-cloud-region",
    equipmentId: "cloud",
    category: "AVAILABILITY",
    title: "リージョン障害への備え不足",
    description: "単一リージョンで運用しており、リージョン障害時に復旧できません。",
    warning: 25,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "単一リージョンで続ける。",
      "マルチリージョン構成を検討し、災害対策を強化する。",
      "データをローカルに保存する。"
    ],
    correct: 1,
    explanation: "正解：リージョン障害備えはマルチリージョンで対応します。単一はリスクを残し、ローカルは非効率です。"
  },
  {
    id: "startup-cloud-monitoring",
    equipmentId: "cloud",
    category: "MONITORING",
    title: "クラウド監視の不備",
    description: "クラウドリソースの監視が不十分で、異常検知が遅れています。",
    warning: 27,
    severity: 1.0,
    penalty: 5,
    repairCost: 8000,
    options: [
      "監視を強化しない。",
      "CloudWatch等の監視サービスを導入し、アラートを設定する。",
      "手動で確認する。"
    ],
    correct: 1,
    explanation: "正解：監視不備はサービス導入で対応します。無為は検知遅延を招き、手動は不十分です。"
  },
  {
    id: "startup-cloud-vpc",
    equipmentId: "cloud",
    category: "NETWORK",
    title: "VPC設定の不備",
    description: "VPCのサブネット設計が不適切で、通信に問題があります。",
    warning: 23,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "設定を放置する。",
      "VPC設計を見直し、サブネットとルートテーブルを修正する。",
      "VPCを再作成する。"
    ],
    correct: 1,
    explanation: "正解：VPC不備は設計見直しと修正で対応します。放置は通信問題を招き、再作成は過剰です。"
  },
  {
    id: "startup-cloud-iam",
    equipmentId: "cloud",
    category: "SECURITY",
    title: "IAM権限の不備",
    description: "IAM権限が過剰に付与されており、最小権限の原則に違反しています。",
    warning: 24,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "権限を放置する。",
      "IAMポリシーを見直し、最小権限に修正する。",
      "全権限を削除する。"
    ],
    correct: 1,
    explanation: "正解：IAM不備はポリシー見直しと修正で対応します。放置はリスクを招き、全削除は業務停止です。"
  },
  {
    id: "startup-cloud-logging",
    equipmentId: "cloud",
    category: "MONITORING",
    title: "クラウドログの不備",
    description: "重要なログが収集されておらず、問題分析が困難です。",
    warning: 26,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "ログ収集を強化しない。",
      "CloudTrail等のログ収集を設定し、保存期間を確保する。",
      "ログを手動で確認する。"
    ],
    correct: 1,
    explanation: "正解：ログ不備は収集設定で対応します。無為は分析困難を招き、手動は不十分です。"
  },
  {
    id: "startup-cloud-compliance",
    equipmentId: "cloud",
    category: "COMPLIANCE",
    title: "クラウドコンプライアンスの不備",
    description: "監査でクラウド設定が規制要件を満たしていないと指摘されました。",
    warning: 28,
    severity: 0.9,
    penalty: 4,
    repairCost: 7000,
    options: [
      "指摘を無視する。",
      "要件を確認し、設定を是正する。",
      "監査を拒否する。"
    ],
    correct: 1,
    explanation: "正解：コンプライアンス不備是正は確認と是正で対応します。無視は罰則を招き、拒否は違法です。"
  },
  {
    id: "startup-cicd-cache",
    equipmentId: "cicd",
    category: "PERFORMANCE",
    title: "ビルドキャッシュの不具合",
    description: "ビルドキャッシュが効いておらず、ビルド時間が長くなっています。",
    warning: 25,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "キャッシュを放置する。",
      "キャッシュ設定を見直し、依存関係キャッシュを最適化する。",
      "キャッシュを無効化する。"
    ],
    correct: 1,
    explanation: "正解：キャッシュ不具合は設定見直しと最適化で対応します。放置は効率低下を招き、無効化は遅延です。"
  },
  {
    id: "startup-cicd-parallel",
    equipmentId: "cicd",
    category: "PERFORMANCE",
    title: "並列ビルドの不備",
    description: "ビルドが逐次実行されており、並列化の機会を損失しています。",
    warning: 23,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "逐次実行を続ける。",
      "ジョブ依存関係を見直し、並列実行を可能にする。",
      "全ジョブを並列化する。"
    ],
    correct: 1,
    explanation: "正解：並列化不備は依存見直しで対応します。逐次は遅延を招き、全並列は競合リスクです。"
  },
  {
    id: "startup-cicd-artifact",
    equipmentId: "cicd",
    category: "STORAGE",
    title: "アーティファクトの肥大化",
    description: "ビルドアーティファクトが肥大化し、ストレージを圧迫しています。",
    warning: 24,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "アーティファクトを放置する。",
      "古いアーティファクトを削除し、保持ポリシーを設定する。",
      "ストレージを増やすだけ。"
    ],
    correct: 1,
    explanation: "正解：アーティファクト肥大化は削除とポリシーで対応します。放置は圧迫を招き、増加のみは不十分です。"
  },
  {
    id: "startup-cicd-test",
    equipmentId: "cicd",
    category: "QUALITY",
    title: "テストカバレッジの低下",
    description: "テストカバレッジが低下しており、品質リスクがあります。",
    warning: 26,
    severity: 1.0,
    penalty: 5,
    repairCost: 8000,
    options: [
      "カバレッジを放置する。",
      "テストを追加し、カバレッジ目標を設定する。",
      "テストを削除する。"
    ],
    correct: 1,
    explanation: "正解：カバレッジ低下はテスト追加と目標設定で対応します。放置はリスクを招き、削除は危険です。"
  },
  {
    id: "startup-cicd-rollback",
    equipmentId: "cicd",
    category: "DEPLOYMENT",
    title: "ロールバック手順の不備",
    description: "デプロイ失敗時のロールバック手順が不十分です。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "手順を放置する。",
      "ロールバック手順を策定し、定期的にテストする。",
      "手動で対応する。"
    ],
    correct: 1,
    explanation: "正解：ロールバック不備は策定とテストで対応します。放置は復旧遅延を招き、手動はリスクです。"
  },
  {
    id: "startup-cicd-env",
    equipmentId: "cicd",
    category: "CONFIGURATION",
    title: "環境設定の不整合",
    description: "開発・本番環境で設定が異なり、環境依存の不具合があります。",
    warning: 21,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "設定を放置する。",
      "設定を共通化し、環境変数で差分を管理する。",
      "本番設定を開発に適用する。"
    ],
    correct: 1,
    explanation: "正解：設定不整合は共通化と変数管理で対応します。放置は不具合を招き、本番適用は危険です。"
  },
  {
    id: "startup-cicd-dependency",
    equipmentId: "cicd",
    category: "SECURITY",
    title: "依存ライブラリの脆弱性",
    description: "依存ライブラリに脆弱性が検出されました。",
    warning: 20,
    severity: 1.6,
    penalty: 11,
    repairCost: 14000,
    options: [
      "脆弱性を放置する。",
      "ライブラリを更新し、定期的なスキャンを導入する。",
      "ライブラリを削除する。"
    ],
    correct: 1,
    explanation: "正解：依存脆弱性は更新とスキャンで対応します。放置はリスクを招き、削除は機能不全です。"
  },
  {
    id: "startup-cicd-notification",
    equipmentId: "cicd",
    category: "MONITORING",
    title: "ビルド通知の不備",
    description: "ビルド失敗の通知が適切に届いていません。",
    warning: 27,
    severity: 0.9,
    penalty: 4,
    repairCost: 7000,
    options: [
      "通知を放置する。",
      "通知設定を確認し、チャンネルと連絡先を更新する。",
      "手動で確認する。"
    ],
    correct: 1,
    explanation: "正解：通知不備は設定更新で対応します。放置は対応遅延を招き、手動は不十分です。"
  },
  {
    id: "startup-cicd-resource",
    equipmentId: "cicd",
    category: "RESOURCE",
    title: "ビルドリソースの不足",
    description: "ビルド実行環境のリソースが不足し、ビルドが遅延しています。",
    warning: 23,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "リソースを放置する。",
      "ビルド環境をスケールアップし、リソースを最適化する。",
      "ビルドを減らす。"
    ],
    correct: 1,
    explanation: "正解：リソース不足はスケールアップと最適化で対応します。放置は遅延を招き、削減は業務阻害です。"
  },
  {
    id: "startup-cicd-approval",
    equipmentId: "cicd",
    category: "GOVERNANCE",
    title: "デプロイ承認プロセスの不備",
    description: "本番デプロイの承認プロセスが不十分で、不正デプロイのリスクがあります。",
    warning: 24,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "承認を廃止する。",
      "承認プロセスを強化し、履歴を記録する。",
      "全デプロイを禁止する。"
    ],
    correct: 1,
    explanation: "正解：承認不備はプロセス強化と記録で対応します。廃止はリスクを招き、禁止は業務停止です。"
  },
  {
    id: "startup-db-connection",
    equipmentId: "db",
    category: "CONNECTIVITY",
    title: "DB接続プールの枯渇",
    description: "アプリケーションからのDB接続が枯渇し、エラーが発生しています。",
    warning: 18,
    severity: 1.9,
    penalty: 12,
    repairCost: 16000,
    options: [
      "接続を放置する。",
      "接続プール設定を見直し、最大接続数とタイムアウトを調整する。",
      "DBを再起動する。"
    ],
    correct: 1,
    explanation: "正解：接続枯渇は設定見直しで対応します。放置はエラーを招き、再起動は一時的です。"
  },
  {
    id: "startup-db-index",
    equipmentId: "db",
    category: "PERFORMANCE",
    title: "インデックスの不備",
    description: "クエリが遅く、インデックスの追加が必要です。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "クエリを放置する。",
      "スロークエリを分析し、適切なインデックスを追加する。",
      "全テーブルにインデックスを追加する。"
    ],
    correct: 1,
    explanation: "正解：インデックス不備は分析と追加で対応します。放置は遅延を招き、全追加は更新コストです。"
  },
  {
    id: "startup-db-lock",
    equipmentId: "db",
    category: "CONCURRENCY",
    title: "デッドロックの発生",
    description: "データベースでデッドロックが発生し、トランザクションが失敗しています。",
    warning: 19,
    severity: 1.7,
    penalty: 11,
    repairCost: 15000,
    options: [
      "デッドロックを放置する。",
      "トランザクション順序を見直し、ロック範囲を最小化する。",
      "トランザクションを廃止する。"
    ],
    correct: 1,
    explanation: "正解：デッドロックは順序見直しと最小化で対応します。放置は失敗を招き、廃止は機能不全です。"
  },
  {
    id: "startup-db-replication",
    equipmentId: "db",
    category: "REPLICATION",
    title: "レプリケーション遅延",
    description: "DBレプリケーションで遅延が発生し、データ整合性に問題があります。",
    warning: 20,
    severity: 1.6,
    penalty: 10,
    repairCost: 14000,
    options: [
      "遅延を放置する。",
      "レプリケーション設定を見直し、帯域とパラメータを最適化する。",
      "レプリケーションを停止する。"
    ],
    correct: 1,
    explanation: "正解：レプリケーション遅延は設定最適化で対応します。放置は整合性リスクを招き、停止は保護なしです。"
  },
  {
    id: "startup-db-backup",
    equipmentId: "db",
    category: "BACKUP",
    title: "DBバックアップの不備",
    description: "DBバックアップが不十分で、復旧が困難な状態です。",
    warning: 25,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "バックアップを放置する。",
      "バックアップ戦略を見直し、定期的な復旧テストを実施する。",
      "データをダンプするだけ。"
    ],
    correct: 1,
    explanation: "正解：バックアップ不備は戦略見直しとテストで対応します。放置はリスクを残し、ダンプのみは不十分です。"
  },
  {
    id: "startup-db-migration",
    equipmentId: "db",
    category: "MIGRATION",
    title: "スキーママイグレーションの失敗",
    description: "DBスキーママイグレーションが失敗し、デプロイが止まっています。",
    warning: 21,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "失敗を放置する。",
      "マイグレーションスクリプトを修正し、ロールバック手順を準備する。",
      "手動でスキーマを変更する。"
    ],
    correct: 1,
    explanation: "正解：マイグレーション失敗は修正と準備で対応します。放置はデプロイ停止を招き、手動はリスクです。"
  },
  {
    id: "startup-db-sharding",
    equipmentId: "db",
    category: "SCALABILITY",
    title: "シャーディングの不備",
    description: "データ量増加で単一DBでは対応できず、シャーディングが必要です。",
    warning: 26,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "単一DBを続ける。",
      "シャーディング戦略を検討し、段階的に実装する。",
      "データを削除する。"
    ],
    correct: 1,
    explanation: "正解：シャーディング不備は戦略検討と実装で対応します。単一は限界を招き、削除は業務影響です。"
  },
  {
    id: "startup-db-query",
    equipmentId: "db",
    category: "PERFORMANCE",
    title: "N+1クエリ問題",
    description: "アプリケーションでN+1クエリが発生し、性能が低下しています。",
    warning: 23,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "クエリを放置する。",
      "クエリを最適化し、Eager Loading等を導入する。",
      "キャッシュで隠蔽する。"
    ],
    correct: 1,
    explanation: "正解：N+1問題はクエリ最適化で対応します。放置は性能低下を招き、キャッシュは一時的です。"
  },
  {
    id: "startup-db-charset",
    equipmentId: "db",
    category: "CONFIGURATION",
    title: "文字コードの不整合",
    description: "DB文字コード設定が不整合で、文字化けが発生しています。",
    warning: 24,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "文字化けを放置する。",
      "文字コード設定を統一し、データを修正する。",
      "アプリ側で対応する。"
    ],
    correct: 1,
    explanation: "正解：文字コード不整合は統一と修正で対応します。放置は表示不良を招き、アプリ対応は不十分です。"
  },
  {
    id: "startup-db-privilege",
    equipmentId: "db",
    category: "SECURITY",
    title: "DB権限の不備",
    description: "アプリケーションDBユーザーに過剰な権限が付与されています。",
    warning: 25,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "権限を放置する。",
      "最小権限原則に従い、権限を制限する。",
      "全権限を削除する。"
    ],
    correct: 1,
    explanation: "正解：権限不備は最小権限で対応します。放置はリスクを招き、全削除は機能不全です。"
  },
  {
    id: "startup-dashboard-alert",
    equipmentId: "dashboard",
    category: "MONITORING",
    title: "ダッシュボードアラートの不備",
    description: "重要なメトリクスのアラートが設定されていません。",
    warning: 27,
    severity: 1.0,
    penalty: 5,
    repairCost: 8000,
    options: [
      "アラートを設定しない。",
      "重要メトリクスを特定し、適切なアラートを設定する。",
      "手動で監視する。"
    ],
    correct: 1,
    explanation: "正解：アラート不備は設定で対応します。無為は検知遅延を招き、手動は不十分です。"
  },
  {
    id: "startup-dashboard-metric",
    equipmentId: "dashboard",
    category: "MONITORING",
    title: "メトリクスの不足",
    description: "重要なメトリクスが収集されておらず、可視化が不十分です。",
    warning: 26,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "メトリクスを放置する。",
      "必要なメトリクスを特定し、収集と可視化を追加する。",
      "既存メトリクスで代用する。"
    ],
    correct: 1,
    explanation: "正解：メトリクス不足は特定と追加で対応します。放置は可視化不全を招き、代用は不十分です。"
  },
  {
    id: "startup-dashboard-retention",
    equipmentId: "dashboard",
    category: "STORAGE",
    title: "メトリクス保持期間の不備",
    description: "メトリクス保持期間が短く、傾向分析が困難です。",
    warning: 28,
    severity: 0.9,
    penalty: 4,
    repairCost: 7000,
    options: [
      "保持期間を放置する。",
      "保持期間を延長し、ストレージコストを評価する。",
      "データを集約するだけ。"
    ],
    correct: 1,
    explanation: "正解：保持期間不備は延長とコスト評価で対応します。放置は分析困難を招き、集約のみは不十分です。"
  },
  {
    id: "startup-dashboard-slo",
    equipmentId: "dashboard",
    category: "SLO",
    title: "SLO違反の検知",
    description: "サービスレベル目標(SLO)を違反しており、改善が必要です。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "SLOを放置する。",
      "SLO違反原因を分析し、改善アクションを実施する。",
      "SLOを下げる。"
    ],
    correct: 1,
    explanation: "正解：SLO違反は分析と改善で対応します。放置は信頼低下を招き、引き下げは妥協です。"
  },
  {
    id: "startup-dashboard-integration",
    equipmentId: "dashboard",
    category: "INTEGRATION",
    title: "ダッシュボード連携の不備",
    description: "複数の監視ツールが連携しておらず、一元管理できていません。",
    warning: 24,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "連携を放置する。",
      "監視ツールを統合し、一元ダッシュボードを構築する。",
      "ツールを1つに絞る。"
    ],
    correct: 1,
    explanation: "正解：連携不備は統合と一元化で対応します。放置は管理不全を招き、絞り込みは機能制限です。"
  },
  {
    id: "startup-dashboard-access",
    equipmentId: "dashboard",
    category: "SECURITY",
    title: "ダッシュボードアクセス制御の不備",
    description: "ダッシュボードへのアクセス制御が不十分で、情報漏洩リスクがあります。",
    warning: 25,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "アクセスを放置する。",
      "認証と認可を強化し、アクセスログを記録する。",
      "ダッシュボードを非公開にする。"
    ],
    correct: 1,
    explanation: "正解：アクセス不備は認証強化と記録で対応します。放置はリスクを招き、非公開は業務影響です。"
  },
  {
    id: "startup-dashboard-mobile",
    equipmentId: "dashboard",
    category: "USABILITY",
    title: "モバイル閲覧の不備",
    description: "ダッシュボードがモバイルで閲覧できず、外出時の対応が困難です。",
    warning: 26,
    severity: 1.0,
    penalty: 5,
    repairCost: 8000,
    options: [
      "モバイル対応しない。",
      "レスポンシブデザインを導入し、モバイル対応を強化する。",
      "別のモバイルアプリを作る。"
    ],
    correct: 1,
    explanation: "正解：モバイル不備はレスポンシブで対応します。無為は対応困難を招き、別アプリは過剰です。"
  },
  {
    id: "startup-dashboard-custom",
    equipmentId: "dashboard",
    category: "CUSTOMIZATION",
    title: "カスタムダッシュボードの不備",
    description: "チームごとのカスタムダッシュボードが不足しています。",
    warning: 27,
    severity: 0.9,
    penalty: 4,
    repairCost: 7000,
    options: [
      "カスタムを提供しない。",
      "ダッシュボードテンプレートを提供し、カスタマイズを可能にする。",
      "全員同じダッシュボードを使う。"
    ],
    correct: 1,
    explanation: "正解：カスタム不備はテンプレートとカスタマイズで対応します。無為は効率低下を招き、統一は不満です。"
  },
  {
    id: "startup-container-image",
    equipmentId: "container",
    category: "IMAGE",
    title: "コンテナイメージの肥大化",
    description: "コンテナイメージが肥大化し、デプロイ時間が長くなっています。",
    warning: 23,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "イメージを放置する。",
      "マルチステージビルドを導入し、イメージを最適化する。",
      "イメージを圧縮するだけ。"
    ],
    correct: 1,
    explanation: "正解：イメージ肥大化は最適化で対応します。放置は遅延を招き、圧縮のみは不十分です。"
  },
  {
    id: "startup-container-resource",
    equipmentId: "container",
    category: "RESOURCE",
    title: "コンテナリソースの不備",
    description: "コンテナのCPU/メモリ制限が適切でなく、リソース競合が発生しています。",
    warning: 21,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "制限を放置する。",
      "リソース使用量を分析し、制限を適切に設定する。",
      "制限を無限にする。"
    ],
    correct: 1,
    explanation: "正解：リソース不備は分析と設定で対応します。放置は競合を招き、無限はリスクです。"
  },
  {
    id: "startup-container-network",
    equipmentId: "container",
    category: "NETWORK",
    title: "コンテナネットワークの不備",
    description: "コンテナ間通信が不安定で、ネットワーク設定の見直しが必要です。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "ネットワークを放置する。",
      "ネットワークポリシーを見直し、サービスディスカバリを強化する。",
      "全コンテナを同じネットワークにする。"
    ],
    correct: 1,
    explanation: "正解：ネットワーク不備はポリシー見直しで対応します。放置は不安定を招き、同一はセキュリティリスクです。"
  },
  {
    id: "startup-container-security",
    equipmentId: "container",
    category: "SECURITY",
    title: "コンテナセキュリティの不備",
    description: "コンテナイメージに脆弱性があり、セキュリティスキャンが必要です。",
    warning: 20,
    severity: 1.6,
    penalty: 11,
    repairCost: 14000,
    options: [
      "脆弱性を放置する。",
      "セキュリティスキャンを導入し、ベースイメージを更新する。",
      "イメージを自作する。"
    ],
    correct: 1,
    explanation: "正解：セキュリティ不備はスキャンと更新で対応します。放置はリスクを招き、自作はメンテナンス負担です。"
  },
  {
    id: "startup-container-orchestration",
    equipmentId: "container",
    category: "ORCHESTRATION",
    title: "オーケストレーションの不備",
    description: "コンテナオーケストレーションが不十分で、手動運用に依存しています。",
    warning: 24,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "手動運用を続ける。",
      "Kubernetes等のオーケストレーションを導入し、自動化を強化する。",
      "コンテナを廃止する。"
    ],
    correct: 1,
    explanation: "正解：オーケストレーション不備は導入と自動化で対応します。手動はスケール限界で、廃止は過剰です。"
  },
  {
    id: "startup-container-logging",
    equipmentId: "container",
    category: "LOGGING",
    title: "コンテナログの不備",
    description: "コンテナログが集中管理されておらず、問題分析が困難です。",
    warning: 25,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "ログを放置する。",
      "ログ集約システムを導入し、集中管理を実現する。",
      "各コンテナのログを手動で確認する。"
    ],
    correct: 1,
    explanation: "正解：ログ不備は集約システムで対応します。放置は分析困難を招き、手動は非効率です。"
  },
  {
    id: "startup-container-health",
    equipmentId: "container",
    category: "HEALTH",
    title: "ヘルスチェックの不備",
    description: "コンテナのヘルスチェックが不十分で、異常検知が遅れています。",
    warning: 26,
    severity: 1.0,
    penalty: 5,
    repairCost: 8000,
    options: [
      "ヘルスチェックを放置する。",
      "適切なヘルスチェックを実装し、プローブを設定する。",
      "手動で確認する。"
    ],
    correct: 1,
    explanation: "正解：ヘルスチェック不備は実装と設定で対応します。放置は検知遅延を招き、手動は不十分です。"
  },
  {
    id: "startup-container-rolling",
    equipmentId: "container",
    category: "DEPLOYMENT",
    title: "ローリングアップデートの不備",
    description: "ローリングアップデート設定が不適切で、デプロイ時にダウンタイムが発生しています。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "設定を放置する。",
      "ローリング戦略を見直し、ヘルスチェックと猶予期間を設定する。",
      "一括デプロイに戻す。"
    ],
    correct: 1,
    explanation: "正解：ローリング不備は戦略見直しで対応します。放置はダウンタイムを招き、一括はリスクです。"
  },
  {
    id: "startup-cdn-cache",
    equipmentId: "cdn",
    category: "CACHE",
    title: "CDNキャッシュの不備",
    description: "CDNキャッシュ設定が不適切で、配信効率が低下しています。",
    warning: 23,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "キャッシュを放置する。",
      "キャッシュポリシーを見直し、TTLとルールを最適化する。",
      "キャッシュを無効化する。"
    ],
    correct: 1,
    explanation: "正解：キャッシュ不備はポリシー最適化で対応します。放置は効率低下を招き、無効化は負荷増です。"
  },
  {
    id: "startup-cdn-origin",
    equipmentId: "cdn",
    category: "CONNECTIVITY",
    title: "オリジン接続の不備",
    description: "CDNからオリジンサーバーへの接続が不安定です。",
    warning: 21,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "接続を放置する。",
      "オリジン設定とネットワークを見直し、冗長化を強化する。",
      "CDNを無効化する。"
    ],
    correct: 1,
    explanation: "正解：オリジン接続不備は設定見直しと冗長化で対応します。放置は不安定を招き、無効化は負荷増です。"
  },
  {
    id: "startup-cdn-security",
    equipmentId: "cdn",
    category: "SECURITY",
    title: "CDNセキュリティの不備",
    description: "CDNでDDoS攻撃や悪意あるアクセスの防御が不十分です。",
    warning: 19,
    severity: 1.7,
    penalty: 11,
    repairCost: 15000,
    options: [
      "防御を放置する。",
      "WAFとレート制限を有効化し、セキュリティ設定を強化する。",
      "CDNを停止する。"
    ],
    correct: 1,
    explanation: "正解：CDNセキュリティ不備はWAFと制限で対応します。放置はリスクを招き、停止は防御なしです。"
  },
  {
    id: "startup-cdn-compression",
    equipmentId: "cdn",
    category: "PERFORMANCE",
    title: "圧縮設定の不備",
    description: "CDNで圧縮が有効になっておらず、転送量が多くなっています。",
    warning: 25,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "圧縮を放置する。",
      "圧縮設定を有効化し、フォーマットを最適化する。",
      "オリジンで圧縮する。"
    ],
    correct: 1,
    explanation: "正解：圧縮不備は有効化と最適化で対応します。放置は転送量増を招き、オリジンのみは負荷です。"
  },
  {
    id: "startup-cdn-https",
    equipmentId: "cdn",
    category: "SECURITY",
    title: "HTTPS設定の不備",
    description: "CDNでHTTPSが適切に設定されていません。",
    warning: 24,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "HTTPで続ける。",
      "HTTPSを有効化し、証明書とリダイレクトを設定する。",
      "オリジンのみHTTPSにする。"
    ],
    correct: 1,
    explanation: "正解：HTTPS不備は有効化と設定で対応します。HTTPはリスクで、オリジンのみは不十分です。"
  },
  {
    id: "startup-cdn-geo",
    equipmentId: "cdn",
    category: "ROUTING",
    title: "地理的ルーティングの不備",
    description: "地理的ルーティングが設定されておらず、最適なエッジが選択されていません。",
    warning: 26,
    severity: 1.0,
    penalty: 5,
    repairCost: 8000,
    options: [
      "ルーティングを放置する。",
      "地理的ルーティングを有効化し、エッジ選択を最適化する。",
      "単一エッジを使用する。"
    ],
    correct: 1,
    explanation: "正解：地理的ルーティング不備は有効化と最適化で対応します。放置は遅延を招き、単一は非効率です。"
  },
  {
    id: "startup-cdn-purge",
    equipmentId: "cdn",
    category: "CACHE",
    title: "キャッシュパージの不備",
    description: "コンテンツ更新時のキャッシュパージが不十分で、古いコンテンツが配信されています。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "パージを放置する。",
      "自動パージを設定し、手動パージ手順を整備する。",
      "キャッシュTTLを短くする。"
    ],
    correct: 1,
    explanation: "正解：キャッシュパージ不備は自動設定と手順整備で対応します。放置は古い配信を招き、TTL短縮は非効率です。"
  },
  {
    id: "startup-cdn-analytics",
    equipmentId: "cdn",
    category: "ANALYTICS",
    title: "CDN分析の不備",
    description: "CDNアクセス分析が不十分で、配信最適化が困難です。",
    warning: 27,
    severity: 0.9,
    penalty: 4,
    repairCost: 7000,
    options: [
      "分析を放置する。",
      "CDN分析機能を有効化し、定期的なレビューを実施する。",
      "別の分析ツールを導入する。"
    ],
    correct: 1,
    explanation: "正解：分析不備は有効化とレビューで対応します。放置は最適化困難を招き、別ツールは過剰です。"
  },
  {
    id: "startup-cdn-cost",
    equipmentId: "cdn",
    category: "COST",
    title: "CDNコストの急増",
    description: "CDN利用料が急増しており、コスト最適化が必要です。",
    warning: 28,
    severity: 0.8,
    penalty: 3,
    repairCost: 6000,
    options: [
      "コストを放置する。",
      "アクセスパターンを分析し、キャッシュと契約を見直す。",
      "CDNを無効化する。"
    ],
    correct: 1,
    explanation: "正解：CDNコスト急増は分析と見直しで対応します。放置は財務リスクを招き、無効化は性能低下です。"
  },
  {
    id: "startup-devenv-setup",
    equipmentId: "devenv",
    category: "ENVIRONMENT",
    title: "開発環境セットアップの不備",
    description: "新規メンバーの開発環境セットアップに時間がかかりすぎています。",
    warning: 26,
    severity: 1.0,
    penalty: 5,
    repairCost: 8000,
    options: [
      "セットアップを放置する。",
      "Docker等で環境をコンテナ化し、自動化スクリプトを提供する。",
      "マニュアルを充実させるだけ。"
    ],
    correct: 1,
    explanation: "正解：セットアップ不備はコンテナ化と自動化で対応します。放置は効率低下を招き、マニュアルのみは不十分です。"
  },
  {
    id: "startup-devenv-dependency",
    equipmentId: "devenv",
    category: "DEPENDENCY",
    title: "依存関係の不一致",
    description: "開発環境と本番環境で依存バージョンが異なり、環境依存の不具合があります。",
    warning: 24,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "不一致を放置する。",
      "依存管理ツールを導入し、バージョンを固定する。",
      "本番環境に合わせる。"
    ],
    correct: 1,
    explanation: "正解：依存不一致は管理ツールと固定で対応します。放置は不具合を招き、本番合わせは開発阻害です。"
  },
  {
    id: "startup-devenv-code",
    equipmentId: "devenv",
    category: "QUALITY",
    title: "コードレビューの不備",
    description: "コードレビューが不十分で、品質低下とバグ混入が懸念されます。",
    warning: 23,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "レビューを廃止する。",
      "レビュー プロセスを強化し、自動チェックを導入する。",
      "リーダーだけがレビューする。"
    ],
    correct: 1,
    explanation: "正解：レビュー不備はプロセス強化と自動化で対応します。廃止は品質低下を招き、リーダー限定はボトルネックです。"
  },
  {
    id: "startup-devenv-test",
    equipmentId: "devenv",
    category: "TESTING",
    title: "ローカルテストの不備",
    description: "ローカルでのテスト実行が不十分で、CIで頻繁に失敗しています。",
    warning: 25,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "ローカルテストを放置する。",
      "ローカルテスト環境を整備し、pre-commitフックを導入する。",
      "CIでだけテストする。"
    ],
    correct: 1,
    explanation: "正解：ローカルテスト不備は環境整備とフックで対応します。放置はCI負荷を招き、CIのみは遅延です。"
  },
  {
    id: "startup-devenv-documentation",
    equipmentId: "devenv",
    category: "DOCUMENTATION",
    title: "ドキュメントの不備",
    description: "技術ドキュメントが不足しており、知識共有が不十分です。",
    warning: 27,
    severity: 0.9,
    penalty: 4,
    repairCost: 7000,
    options: [
      "ドキュメントを放置する。",
      "ドキュメント標準を策定し、定期的な更新を義務付ける。",
      "口頭で伝えるだけ。"
    ],
    correct: 1,
    explanation: "正解：ドキュメント不備は標準策定と更新で対応します。放置は知識損失を招き、口頭は不十分です。"
  },
  {
    id: "startup-devenv-onboarding",
    equipmentId: "devenv",
    category: "TRAINING",
    title: "オンボーディングの不備",
    description: "新規メンバーのオンボーディングが不十分で、生産性向上に時間がかかります。",
    warning: 28,
    severity: 0.8,
    penalty: 3,
    repairCost: 6000,
    options: [
      "オンボーディングを放置する。",
      "オンボーディングプログラムを策定し、メンター制度を導入する。",
      "マニュアルを渡すだけ。"
    ],
    correct: 1,
    explanation: "正解：オンボーディング不備はプログラム策定とメンターで対応します。放置は生産性低下を招き、マニュアルのみは不十分です。"
  },
  {
    id: "startup-devenv-tools",
    equipmentId: "devenv",
    category: "TOOLS",
    title: "開発ツールの不統一",
    description: "チームで開発ツールが統一されておらず、効率が低下しています。",
    warning: 26,
    severity: 1.0,
    penalty: 5,
    repairCost: 8000,
    options: [
      "ツールを放置する。",
      "標準ツールセットを定義し、チームで統一する。",
      "各人が好きなツールを使う。"
    ],
    correct: 1,
    explanation: "正解：ツール不統一は標準定義と統一で対応します。放置は効率低下を招き、自由は統一不可です。"
  },
  {
    id: "startup-devenv-communication",
    equipmentId: "devenv",
    category: "COMMUNICATION",
    title: "開発チームのコミュニケーション不備",
    description: "チーム内コミュニケーションが不十分で、認識齟齬が発生しています。",
    warning: 25,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "コミュニケーションを放置する。",
      "定例ミーティングとチャンネル整理を実施し、情報共有を強化する。",
      "全員で常に会議する。"
    ],
    correct: 1,
    explanation: "正解：コミュニケーション不備は定例と整理で対応します。放置は齟齬を招き、常時会議は非効率です。"
  },
  {
    id: "startup-devenv-knowledge",
    equipmentId: "devenv",
    category: "KNOWLEDGE",
    title: "技術ナレッジの偏在",
    description: "特定のメンバーに技術ナレッジが集中しており、単一障害点になっています。",
    warning: 24,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "ナレッジを放置する。",
      "ナレッジ共有セッションを開催し、ドキュメント化を進める。",
      "担当者を固定する。"
    ],
    correct: 1,
    explanation: "正解：ナレッジ偏在は共有とドキュメント化で対応します。放置はリスクを招き、固定は偏在強化です。"
  },
  {
    id: "startup-cloud-instance-type",
    equipmentId: "cloud",
    category: "OPTIMIZATION",
    title: "クラウドインスタンスタイプの最適化不備",
    description: "インスタンスタイプがワークロードに適しておらず、コスト効率が悪いです。",
    warning: 18,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "タイプを変更しない。",
      "ワークロードを分析し、適切なインスタンスタイプに変更する。",
      "すべてを最大サイズにする。"
    ],
    correct: 1,
    explanation: "正解：インスタンスタイプの最適化が重要です。無変更はコスト効率を悪化させ、最大サイズは過剰コストです。"
  },
  {
    id: "startup-cloud-reservation",
    equipmentId: "cloud",
    category: "COST",
    title: "クラウドリザーブインスタンスの未活用",
    description: "常時稼働インスタンスがリザーブインスタンスを使用しておらず、コストが高くなっています。",
    warning: 20,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "リザーブを導入しない。",
      "常時稼働インスタンスをリザーブインスタンスに変更する。",
      "すべてをスポットインスタンスにする。"
    ],
    correct: 1,
    explanation: "正解：リザーブインスタンスの活用が重要です。無導入はコスト高を招き、スポットは中断リスクがあります。"
  },
  {
    id: "startup-cicd-cache",
    equipmentId: "cicd",
    category: "PERFORMANCE",
    title: "ビルドキャッシュの不具合",
    description: "ビルドキャッシュが効いておらず、ビルド時間が長くなっています。",
    warning: 18,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "キャッシュを無効化する。",
      "キャッシュ設定を見直し、有効化する。",
      "キャッシュを手動で管理する。"
    ],
    correct: 1,
    explanation: "正解：キャッシュ設定の見直しが重要です。無効化はビルド時間を長くし、手動管理は非効率です。"
  },
  {
    id: "startup-cicd-parallel",
    equipmentId: "cicd",
    category: "PERFORMANCE",
    title: "並列ビルドの不備",
    description: "ビルドが逐次実行されており、並列化の機会を損失しています。",
    warning: 20,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "並列化しない。",
      "ビルドパイプラインを並列化し、ビルド時間を短縮する。",
      "すべてのビルドを同時に実行する。"
    ],
    correct: 1,
    explanation: "正解：並列化が重要です。無並列化は時間を長くし、全同時実行はリソース過剰です。"
  },
  {
    id: "startup-cicd-artifact",
    equipmentId: "cicd",
    category: "STORAGE",
    title: "アーティファクトの肥大化",
    description: "ビルドアーティファクトが肥大化し、ストレージを圧迫しています。",
    warning: 16,
    severity: 1.0,
    penalty: 5,
    repairCost: 8000,
    options: [
      "アーティファクトを放置する。",
      "古いアーティファクトを削除し、保持ポリシーを策定する。",
      "ストレージを増やすだけ。"
    ],
    correct: 1,
    explanation: "正解：アーティファクト削除とポリシー策定が重要です。放置はストレージ圧迫を招き、増加のみは不十分です。"
  },
  {
    id: "startup-cicd-test",
    equipmentId: "cicd",
    category: "QUALITY",
    title: "テストカバレッジの低下",
    description: "テストカバレッジが低下しており、品質リスクがあります。",
    warning: 22,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "テストを追加しない。",
      "テストカバレッジ目標を設定し、テストを追加する。",
      "すべてのコードをテストする。"
    ],
    correct: 1,
    explanation: "正解：テストカバレッジ目標設定が重要です。無追加はリスクを残し、全テストは非現実的です。"
  },
  {
    id: "startup-cicd-rollback",
    equipmentId: "cicd",
    category: "DEPLOYMENT",
    title: "ロールバック手順の不備",
    description: "デプロイ失敗時のロールバック手順が不十分です。",
    warning: 24,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "手順を策定しない。",
      "ロールバック手順を策定し、定期的にテストする。",
      "手動で対応する。"
    ],
    correct: 1,
    explanation: "正解：ロールバック手順策定が重要です。無策定は復旧遅延を招き、手動対応はミスリスクがあります。"
  },
  {
    id: "startup-cicd-env",
    equipmentId: "cicd",
    category: "CONFIGURATION",
    title: "環境設定の不整合",
    description: "開発・本番環境で設定が異なり、環境依存の不具合があります。",
    warning: 20,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "設定を統一しない。",
      "設定管理ツールを導入し、環境設定を統一する。",
      "すべての環境を同じにする。"
    ],
    correct: 1,
    explanation: "正解：設定管理ツール導入が重要です。無統一は不具合を招き、全同一は柔軟性を失います。"
  },
  {
    id: "startup-cicd-dependency",
    equipmentId: "cicd",
    category: "SECURITY",
    title: "依存ライブラリの脆弱性",
    description: "依存ライブラリに脆弱性が検出されました。",
    warning: 26,
    severity: 1.7,
    penalty: 12,
    repairCost: 15000,
    options: [
      "脆弱性を放置する。",
      "脆弱性のあるライブラリを更新する。",
      "ライブラリを削除する。"
    ],
    correct: 1,
    explanation: "正解：ライブラリ更新が重要です。放置はセキュリティリスクを残し、削除は機能不全を招きます。"
  },
  {
    id: "startup-cicd-notification",
    equipmentId: "cicd",
    category: "MONITORING",
    title: "ビルド通知の不備",
    description: "ビルド失敗の通知が適切に届いていません。",
    warning: 18,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "通知を設定しない。",
      "通知チャンネルを設定し、ビルド失敗を通知する。",
      "全員に常に通知する。"
    ],
    correct: 1,
    explanation: "正解：通知チャンネル設定が重要です。無設定は対応遅延を招き、全通知はノイズになります。"
  },
  {
    id: "startup-cicd-resource",
    equipmentId: "cicd",
    category: "RESOURCE",
    title: "ビルドリソースの不足",
    description: "ビルド実行環境のリソースが不足し、ビルドが遅延しています。",
    warning: 20,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "リソースを増やさない。",
      "ビルドリソースを増強し、並列度を上げる。",
      "ビルドを減らす。"
    ],
    correct: 1,
    explanation: "正解：リソース増強が重要です。無増強は遅延を招き、ビルド削減は開発速度を低下させます。"
  },
  {
    id: "startup-cicd-secret",
    equipmentId: "cicd",
    category: "SECURITY",
    title: "シークレット管理の不備",
    description: "シークレットがコードにハードコードされており、セキュリティリスクがあります。",
    warning: 28,
    severity: 1.8,
    penalty: 13,
    repairCost: 17000,
    options: [
      "放置する。",
      "シークレット管理ツールを導入し、コードから削除する。",
      "コードを暗号化する。"
    ],
    correct: 1,
    explanation: "正解：シークレット管理ツール導入が重要です。放置は漏洩リスクを残し、暗号化は不十分です。"
  },
  {
    id: "startup-db-connection",
    equipmentId: "db",
    category: "PERFORMANCE",
    title: "DB接続プールの枯渇",
    description: "DB接続プールが枯渇し、アプリケーションが接続できていません。",
    warning: 24,
    severity: 1.6,
    penalty: 11,
    repairCost: 14000,
    options: [
      "プールサイズを変更しない。",
      "接続プール設定を見直し、適切なサイズに調整する。",
      "プールサイズを無限にする。"
    ],
    correct: 1,
    explanation: "正解：接続プール設定の調整が重要です。無変更は枯渇を招き、無限はリソース過剰です。"
  },
  {
    id: "startup-db-index",
    equipmentId: "db",
    category: "PERFORMANCE",
    title: "DBインデックスの不備",
    description: "クエリが遅く、インデックスの追加が必要です。",
    warning: 20,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "インデックスを追加しない。",
      "スロークエリを分析し、適切なインデックスを追加する。",
      "すべてのカラムにインデックスを追加する。"
    ],
    correct: 1,
    explanation: "正解：スロークエリ分析とインデックス追加が重要です。無追加は性能低下を招き、全追加は書き込み性能を低下させます。"
  },
  {
    id: "startup-db-backup",
    equipmentId: "db",
    category: "BACKUP",
    title: "DBバックアップの不備",
    description: "DBバックアップが定期的に取得されていません。",
    warning: 26,
    severity: 1.7,
    penalty: 12,
    repairCost: 16000,
    options: [
      "バックアップを取得しない。",
      "バックアップスケジュールを設定し、定期的に取得する。",
      "手動でバックアップする。"
    ],
    correct: 1,
    explanation: "正解：定期的バックアップが重要です。無バックアップはデータ損失リスクを残し、手動は忘れる可能性があります。"
  },
  {
    id: "startup-db-replication",
    equipmentId: "db",
    category: "AVAILABILITY",
    title: "DBレプリケーションの遅延",
    description: "DBレプリケーションで遅延が発生し、データ整合性に問題があります。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "レプリケーションを放置する。",
      "レプリケーション設定を見直し、遅延を改善する。",
      "レプリケーションを停止する。"
    ],
    correct: 1,
    explanation: "正解：レプリケーション設定見直しが重要です。放置は整合性問題を招き、停止は可用性を低下させます。"
  },
  {
    id: "startup-db-sharding",
    equipmentId: "db",
    category: "SCALING",
    title: "DBシャーディングの必要性",
    description: "DBデータ量が増加し、シャーディングが必要です。",
    warning: 24,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "シャーディングしない。",
      "データアクセスパターンを分析し、適切にシャーディングする。",
      "すべてのデータを同じDBにする。"
    ],
    correct: 1,
    explanation: "正解：適切なシャーディングが重要です。無シャーディングは性能低下を招き、単一DBはスケーラビリティを失います。"
  },
  {
    id: "startup-db-migration",
    equipmentId: "db",
    category: "MAINTENANCE",
    title: "DBマイグレーションの不備",
    description: "スキーマ変更時のマイグレーション手順が不十分です。",
    warning: 20,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "手順を策定しない。",
      "マイグレーション手順を策定し、テスト環境で検証する。",
      "本番で直接変更する。"
    ],
    correct: 1,
    explanation: "正解：マイグレーション手順策定が重要です。無策定はリスクを残し、本番直接変更は危険です。"
  },
  {
    id: "startup-dashboard-alert",
    equipmentId: "dashboard",
    category: "MONITORING",
    title: "ダッシュボードアラートの不備",
    description: "重要なメトリクスのアラートが設定されていません。",
    warning: 18,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "アラートを設定しない。",
      "重要メトリクスを特定し、適切なアラートを設定する。",
      "すべてのメトリクスにアラートを設定する。"
    ],
    correct: 1,
    explanation: "正解：適切なアラート設定が重要です。無設定は異常検知遅延を招き、全アラートはノイズになります。"
  },
  {
    id: "startup-dashboard-visualization",
    equipmentId: "dashboard",
    category: "MONITORING",
    title: "ダッシュボード可視化の不備",
    description: "ダッシュボードが複雑すぎ、状況把握が困難です。",
    warning: 16,
    severity: 1.0,
    penalty: 5,
    repairCost: 8000,
    options: [
      "ダッシュボードを放置する。",
      "ダッシュボードを簡素化し、重要な情報に集中する。",
      "ダッシュボードを削除する。"
    ],
    correct: 1,
    explanation: "正解：ダッシュボード簡素化が重要です。放置は状況把握を困難にし、削除は可視化を失います。"
  },
  {
    id: "startup-dashboard-sla",
    equipmentId: "dashboard",
    category: "METRICS",
    title: "SLAメトリクスの不備",
    description: "SLA関連のメトリクスが追跡されていません。",
    warning: 20,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "SLAを追跡しない。",
      "SLAメトリクスを定義し、ダッシュボードに追加する。",
      "SLAを廃止する。"
    ],
    correct: 1,
    explanation: "正解：SLAメトリクス定義が重要です。無追跡はSLA違反を招き、廃止はサービス品質を低下させます。"
  },
  {
    id: "startup-dashboard-anomaly",
    equipmentId: "dashboard",
    category: "MONITORING",
    title: "異常検知の不備",
    description: "異常検知アルゴリズムが設定されておらず、異常を自動検知できていません。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "異常検知を導入しない。",
      "異常検知アルゴリズムを導入し、自動検知を有効にする。",
      "手動で異常を検知する。"
    ],
    correct: 1,
    explanation: "正解：異常検知導入が重要です。無導入は検知遅延を招き、手動検知は非効率です。"
  },
  {
    id: "startup-container-image",
    equipmentId: "container",
    category: "OPTIMIZATION",
    title: "コンテナイメージの肥大化",
    description: "コンテナイメージが肥大化し、デプロイ時間が長くなっています。",
    warning: 18,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "イメージを最適化しない。",
      "マルチステージビルドを導入し、イメージを最適化する。",
      "イメージを削除する。"
    ],
    correct: 1,
    explanation: "正解：マルチステージビルド導入が重要です。無最適化はデプロイ遅延を招き、削除は機能不全を招きます。"
  },
  {
    id: "startup-container-orchestration",
    equipmentId: "container",
    category: "MANAGEMENT",
    title: "コンテナオーケストレーションの不備",
    description: "コンテナのスケジューリングが最適ではなく、リソース利用効率が悪いです。",
    warning: 20,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "オーケストレーションを放置する。",
      "スケジューリングポリシーを見直し、リソース効率を改善する。",
      "すべてのコンテナを同じノードに配置する。"
    ],
    correct: 1,
    explanation: "正解：スケジューリングポリシー見直しが重要です。放置は効率低下を招き、同一配置はリスクを残します。"
  },
  {
    id: "startup-cdn-cache",
    equipmentId: "cdn",
    category: "PERFORMANCE",
    title: "CDNキャッシュの不備",
    description: "CDNキャッシュが効いておらず、オリジンサーバーへの負荷が高いです。",
    warning: 18,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "キャッシュを設定しない。",
      "キャッシュポリシーを見直し、適切に設定する。",
      "すべてをキャッシュする。"
    ],
    correct: 1,
    explanation: "正解：キャッシュポリシー見直しが重要です。無設定は負荷を招き、全キャッシュは鮮度問題を招きます。"
  },
  {
    id: "startup-cdn-origin",
    equipmentId: "cdn",
    category: "AVAILABILITY",
    title: "オリジンサーバーの可用性",
    description: "オリジンサーバーが単一障害点になっており、可用性リスクがあります。",
    warning: 24,
    severity: 1.6,
    penalty: 11,
    repairCost: 14000,
    options: [
      "オリジンを冗長化しない。",
      "オリジンサーバーを冗長化し、ロードバランシングを導入する。",
      "CDNを無効化する。"
    ],
    correct: 1,
    explanation: "正解：オリジン冗長化が重要です。無冗長化はリスクを残し、CDN無効化は性能低下を招きます。"
  },
  {
    id: "startup-cdn-ssl",
    equipmentId: "cdn",
    category: "SECURITY",
    title: "CDN SSL証明書の不備",
    description: "CDNのSSL証明書が期限切れ、または設定が不適切です。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "証明書を更新しない。",
      "SSL証明書を更新し、設定を確認する。",
      "SSLを無効化する。"
    ],
    correct: 1,
    explanation: "正解：SSL証明書更新が重要です。無更新はセキュリティリスクを残し、無効化は危険です。"
  },
  {
    id: "startup-cdn-purge",
    equipmentId: "cdn",
    category: "MAINTENANCE",
    title: "CDNキャッシュパージの不備",
    description: "コンテンツ更新時のキャッシュパージ手順が不十分です。",
    warning: 16,
    severity: 1.0,
    penalty: 5,
    repairCost: 8000,
    options: [
      "パージ手順を策定しない。",
      "キャッシュパージ手順を策定し、自動化する。",
      "手動でパージする。"
    ],
    correct: 1,
    explanation: "正解：キャッシュパージ手順策定が重要です。無策定は鮮度問題を招き、手動は忘れる可能性があります。"
  },
  {
    id: "startup-devenv-onboarding",
    equipmentId: "devenv",
    category: "PROCESS",
    title: "開発環境セットアップの不備",
    description: "新メンバーの開発環境セットアップに時間がかかりすぎています。",
    warning: 18,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "セットアップを自動化しない。",
      "開発環境セットアップを自動化し、ドキュメント化する。",
      "担当者が手動でセットアップする。"
    ],
    correct: 1,
    explanation: "正解：セットアップ自動化が重要です。無自動化は時間を浪費し、手動は負荷を集中させます。"
  },
  {
    id: "startup-devenv-code-review",
    equipmentId: "devenv",
    category: "QUALITY",
    title: "コードレビューの不備",
    description: "コードレビューが実施されておらず、品質リスクがあります。",
    warning: 20,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "コードレビューを導入しない。",
      "コードレビュープロセスを策定し、必須にする。",
      "すべてのコードをレビューする。"
    ],
    correct: 1,
    explanation: "正解：コードレビュープロセス策定が重要です。無導入は品質リスクを残し、全レビューは非効率です。"
  },
  {
    id: "startup-devenv-testing",
    equipmentId: "devenv",
    category: "QUALITY",
    title: "開発環境でのテスト不備",
    description: "開発環境でテストが実施されておらず、本番で不具合が発見されています。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "テストを実施しない。",
      "開発環境で自動テストを導入し、品質を向上させる。",
      "本番でテストする。"
    ],
    correct: 1,
    explanation: "正解：開発環境テスト導入が重要です。無テストは本番不具合を招き、本番テストは危険です。"
  },
  {
    id: "startup-api-rate-limit",
    equipmentId: "cloud",
    category: "INTEGRATION",
    title: "外部APIのレート制限に達している",
    description: "外部APIから429エラーが返り、ユーザー登録処理が失敗しています。",
    warning: 18,
    severity: 1.7,
    penalty: 12,
    repairCost: 15000,
    learningTags: ["API", "レート制限", "外部連携"],
    examPoint: "外部API連携では、レート制限、リトライ、バックオフ、代替処理を考慮します。",
    options: ["無限リトライで成功するまで送信する。", "レート制限を確認し、指数バックオフやキュー処理で再試行する。", "ユーザーに何も表示せず失敗させる。"],
    correct: 1,
    explanation: "正解：429はレート制限の代表的な応答です。制限を確認し、バックオフやキューで再試行します。"
  },
  {
    id: "startup-db-deadlock",
    equipmentId: "db",
    category: "DATABASE",
    title: "データベースでデッドロックが発生している",
    description: "注文処理中にデータベースのデッドロックが増え、処理が失敗しています。",
    warning: 20,
    severity: 1.8,
    penalty: 13,
    repairCost: 16500,
    learningTags: ["DB", "トランザクション", "ロック"],
    examPoint: "デッドロックは複数処理が互いにロックを待ち合う状態です。ロック順序やトランザクション範囲を見直します。",
    options: ["ロック順序とトランザクション範囲を確認し、再試行処理も検討する。", "データベースを毎回再起動する。", "全テーブルの制約を削除する。"],
    correct: 0,
    explanation: "正解：デッドロックはロック順序やトランザクション範囲の見直しが重要です。必要なら安全な再試行も入れます。"
  },
  {
    id: "startup-cicd-secret-leak",
    equipmentId: "cicd",
    category: "SECURITY",
    title: "CI/CDログにシークレットが出力されている",
    description: "デプロイログにAPIキーらしき文字列が表示され、閲覧できる状態になっています。",
    warning: 16,
    severity: 2.0,
    penalty: 15,
    repairCost: 18000,
    learningTags: ["シークレット", "CI/CD", "情報漏えい"],
    examPoint: "APIキーやパスワードはシークレット管理に保存し、ログへ出力しないようマスクします。漏えい時はローテーションします。",
    options: ["ログを放置し、次回から気をつける。", "該当シークレットを無効化・再発行し、ログマスクと権限を見直す。", "ログを社外に共有して原因を聞く。"],
    correct: 1,
    explanation: "正解：シークレット漏えい時は無効化・再発行し、ログマスクと管理方法を見直します。"
  },
  {
    id: "startup-container-image-vuln",
    equipmentId: "container",
    category: "VULNERABILITY",
    title: "コンテナイメージに重大な脆弱性がある",
    description: "本番で使うコンテナイメージのスキャン結果に、重大度Criticalの脆弱性が含まれています。",
    warning: 24,
    severity: 1.9,
    penalty: 14,
    repairCost: 17500,
    learningTags: ["コンテナ", "脆弱性", "イメージスキャン"],
    examPoint: "コンテナ運用では、ベースイメージ更新、不要パッケージ削減、イメージスキャンが重要です。",
    options: ["スキャン結果を無視してそのままデプロイする。", "脆弱性の影響を確認し、ベースイメージ更新や修正版へ差し替える。", "コンテナを使うこと自体を禁止する。"],
    correct: 1,
    explanation: "正解：重大な脆弱性は影響を確認し、更新や修正版への差し替えでリスクを下げます。"
  },];

const startupIncidents = dedupeIncidentsById([...startupMappedIncidents, ...startupCustomIncidents]);
