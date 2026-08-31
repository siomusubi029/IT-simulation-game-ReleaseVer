// ===== セキュリティ会社：インシデントデータ =====

const securityIncidents = [
  {
    id: "sec-ddos",
    equipmentId: "firewall",
    category: "ATTACK",
    title: "DDoS攻撃の検知",
    description: "クライアント企業のWebサーバーへの大量の不正リクエストを検知しました。現在、Webサービスの応答が著しく遅延しています。",
    warning: 18,
    severity: 2.2,
    penalty: 14,
    repairCost: 20000,
    options: [
      "Webサーバーの電源を落として、攻撃が止むまで待つ。",
      "トラフィック分析でIPを特定し、レートリミットとIPブロックを実施、上流ISPと連携する。",
      "ファイアウォールのルールをすべて無効化して様子を見る。"
    ],
    correct: 1,
    explanation: "正解：DDoS対応では攻撃元の特定・フィルタリング・ISPとの連携が有効です。電源オフは正当なユーザーの接続も切断します。"
  },
  {
    id: "sec-firewall-rule",
    equipmentId: "firewall",
    category: "CONFIGURATION",
    title: "ファイアウォールルールの誤設定",
    description: "ファイアウォールのルール設定ミスにより、重要なサービスへのアクセスが遮断されています。",
    warning: 20,
    severity: 1.8,
    penalty: 12,
    repairCost: 15000,
    options: [
      "すべてのルールを削除して再設定する。",
      "ルールを確認し、誤設定を修正する。",
      "ファイアウォールをバイパスする。"
    ],
    correct: 1,
    explanation: "正解：ルールを確認して修正するのが適切です。全削除はリスクが高く、バイパスはセキュリティを低下させます。"
  },
  {
    id: "sec-firewall-perf",
    equipmentId: "firewall",
    category: "PERFORMANCE",
    title: "ファイアウォールの性能低下",
    description: "ファイアウォールのCPU使用率が高くなり、通信遅延が発生しています。",
    warning: 22,
    severity: 1.5,
    penalty: 10,
    repairCost: 12000,
    options: [
      "ファイアウォールを再起動する。",
      "負荷分散を検討し、ルールを最適化する。",
      "ファイアウォールを無効化する。"
    ],
    correct: 1,
    explanation: "正解：負荷分散とルール最適化が適切です。再起動は一時的な解決に過ぎず、無効化は危険です。"
  },
  {
    id: "sec-zero-day",
    equipmentId: "intel",
    category: "VULNERABILITY",
    title: "ゼロデイ脆弱性の報告",
    description: "利用中のVPN製品に重大なゼロデイ脆弱性が公開されました。悪用された場合、内部ネットワークへの不正アクセスが可能です。",
    warning: 22,
    severity: 2.0,
    penalty: 13,
    repairCost: 18000,
    options: [
      "ベンダーのパッチを待ちながら、影響を受けるシステムへのアクセス制限と監視強化を行う。",
      "脆弱性情報が広まる前に、社内でも情報を隠す。",
      "全VPCの設定ファイルを自分でコード修正して対応する。"
    ],
    correct: 0,
    explanation: "正解：パッチ未適用の脆弱性はアクセス制限と監視強化で緩和します。情報の隠蔽は対策の遅れを招き危険です。"
  },
  {
    id: "sec-log-tampering",
    equipmentId: "siem",
    category: "FORENSICS",
    title: "ログ改ざんの痕跡検知",
    description: "SIEMでログの一部が不自然に削除・改ざんされた形跡を検知しました。侵入後の証跡隠滅が疑われます。",
    warning: 20,
    severity: 1.9,
    penalty: 13,
    repairCost: 17000,
    options: [
      "改ざんされたログを復元しようと上書き修正する。",
      "残存するログを証拠として保全しつつ、改ざん範囲と侵入経路の調査を開始する。",
      "ログ管理システムを再起動してリセットする。"
    ],
    correct: 1,
    explanation: "正解：ログ改ざんは侵入後の証跡隠滅の可能性があります。残存ログの証拠保全を優先し、改ざん範囲と侵入経路を調査します。"
  },
  {
    id: "sec-phishing-campaign",
    equipmentId: "incident",
    category: "ATTACK",
    title: "標的型フィッシングキャンペーン",
    description: "経理部門を狙った大規模なフィッシングメールキャンペーンが検知されました。複数の社員が不審なメールを開いています。",
    warning: 16,
    severity: 2.1,
    penalty: 14,
    repairCost: 19000,
    options: [
      "メールを開いた社員のアカウントをすべて無効化する。",
      "影響範囲を特定し、パスワード変更と端末スキャンを実施、社員教育を強化する。",
      "フィッシングメールを無視して通常運用を続ける。"
    ],
    correct: 1,
    explanation: "正解：フィッシングキャンペーンでは影響範囲の特定とパスワード変更、端末スキャンが重要です。過剰な無効化は業務停止を招きます。"
  },
  {
    id: "sec-ransomware",
    equipmentId: "malware",
    category: "ATTACK",
    title: "ランサムウェア感染の兆候",
    description: "ファイルサーバーでファイルが暗号化され、身代金要求が表示されています。拡散を防ぐ必要があります。",
    warning: 14,
    severity: 2.4,
    penalty: 15,
    repairCost: 22000,
    options: [
      "身代金を支払って復号キーを入手する。",
      "感染端末をネットワークから隔離し、バックアップからの復旧手順を検討する。",
      "サーバーを再起動して様子を見る。"
    ],
    correct: 1,
    explanation: "正解：ランサムウェアでは隔離とバックアップ復旧が基本です。身代金支払いは犯罪行為であり、再起動は拡散を助長します。"
  },
  {
    id: "sec-sql-injection",
    equipmentId: "firewall",
    category: "ATTACK",
    title: "SQLインジェクション攻撃",
    description: "WebアプリケーションへのSQLインジェクション攻撃が検知されました。データベースへの不正アクセスが試みられています。",
    warning: 19,
    severity: 2.0,
    penalty: 13,
    repairCost: 18000,
    options: [
      "Webアプリケーションを即座に停止する。",
      "攻撃パターンをWAFでブロックし、アプリケーションの脆弱性を修正してパッチを適用する。",
      "データベースの管理者権限を全ユーザーに付与する。"
    ],
    correct: 1,
    explanation: "正解：SQLインジェクションはWAFブロックと脆弱性修正で対応します。即時停止は業務影響が大きく、権限付与は危険です。"
  },
  {
    id: "sec-insider-threat",
    equipmentId: "soc",
    category: "SECURITY",
    title: "内部不正の疑い",
    description: "退職予定の社員が業務時間外に大量のファイルをダウンロードしているログが検出されました。",
    warning: 21,
    severity: 1.8,
    penalty: 12,
    repairCost: 16000,
    options: [
      "即座に社員を解雇する。",
      "ダウンロード内容と目的を確認し、必要ならアクセス権限を一時停止して調査する。",
      "ログを削除して証拠を隠す。"
    ],
    correct: 1,
    explanation: "正解：内部不正の疑いでは事実確認と権限管理が重要です。即時解雇は法的リスクがあり、ログ削除は証拠隠滅です。"
  },
  {
    id: "sec-certificate-expire",
    equipmentId: "firewall",
    category: "SECURITY",
    title: "SSL証明書の期限切れ",
    description: "WebサーバーのSSL証明書が期限切れとなり、ブラウザで警告が表示されています。",
    warning: 25,
    severity: 1.3,
    penalty: 9,
    repairCost: 11000,
    options: [
      "警告を無視して運用を続ける。",
      "新しい証明書を発行し、サーバーに適用して設定を更新する。",
      "証明書を削除してHTTP通信に切り替える。"
    ],
    correct: 1,
    explanation: "正解：証明書期限切れは速やかな更新が必要です。無視は信頼性低下を招き、HTTP切り替えはセキュリティ低下です。"
  },
  {
    id: "sec-api-abuse",
    equipmentId: "firewall",
    category: "SECURITY",
    title: "APIエンドポイントの悪用",
    description: "外部からAPIエンドポイントへの異常なアクセスパターンが検知されました。認証バイパスの可能性があります。",
    warning: 20,
    severity: 1.9,
    penalty: 12,
    repairCost: 17000,
    options: [
      "APIエンドポイントを公開停止する。",
      "アクセス元を特定し、レート制限と認証強化を実施、脆弱性を修正する。",
      "全APIアクセスを許可する。"
    ],
    correct: 1,
    explanation: "正解：API悪用はアクセス元特定とレート制限、認証強化で対応します。公開停止は業務影響が大きく、全許可は危険です。"
  },
  {
    id: "sec-brute-force",
    equipmentId: "ids",
    category: "ATTACK",
    title: "ブルートフォース攻撃",
    description: "管理者アカウントへの総当たり攻撃が検知されました。多数の失敗ログイン試行が記録されています。",
    warning: 18,
    severity: 1.7,
    penalty: 11,
    repairCost: 15000,
    options: [
      "攻撃を無視して様子を見る。",
      "攻撃元IPをブロックし、アカウントロックポリシーと多要素認証を強化する。",
      "管理者パスワードを削除する。"
    ],
    correct: 1,
    explanation: "正解：ブルートフォースはIPブロックと認証強化で対応します。無視は侵入を許容し、パスワード削除は業務停止を招きます。"
  },
  {
    id: "sec-malware-spread",
    equipmentId: "malware",
    category: "ATTACK",
    title: "マルウェアの社内拡散",
    description: "1台の端末で検出されたマルウェアがネットワーク経由で他端末に拡散している可能性があります。",
    warning: 15,
    severity: 2.2,
    penalty: 14,
    repairCost: 20000,
    options: [
      "拡散を放置して様子を見る。",
      "感染端末を隔離し、ネットワークセグメンテーションで拡散を防止、全端末スキャンを実施する。",
      "全社員のPCを初期化する。"
    ],
    correct: 1,
    explanation: "正解：マルウェア拡散は隔離とセグメンテーションで防止し、全端末スキャンで完全駆除を図ります。"
  },
  {
    id: "sec-social-engineering",
    equipmentId: "incident",
    category: "SECURITY",
    title: "ソーシャルエンジニアリングの疑い",
    description: "「システム管理者を名乗る人物」からパスワード変更の指示があり、社員が従ってしまいました。",
    warning: 22,
    severity: 1.6,
    penalty: 10,
    repairCost: 14000,
    options: [
      "社員を処罰する。",
      "影響範囲を確認し、パスワード変更と社員教育、コールバック手順の導入を行う。",
      "指示通りに変更したままで様子を見る。"
    ],
    correct: 1,
    explanation: "正解：ソーシャルエンジニアリングは影響確認とパスワード変更、教育が重要です。処罰は報告を抑制し、放置はリスクを残します。"
  },
  {
    id: "sec-data-exfiltration",
    equipmentId: "siem",
    category: "SECURITY",
    title: "データ流出の検知",
    description: "大量の機密データが外部へ転送されたログが検出されました。流出先と内容の調査が必要です。",
    warning: 14,
    severity: 2.3,
    penalty: 15,
    repairCost: 21000,
    options: [
      "流出を無視して通常運用を続ける。",
      "転送を停止し、流出先と内容を調査、関係者への通知と再発防止策を講じる。",
      "ログを削除して証拠を隠す。"
    ],
    correct: 1,
    explanation: "正解：データ流出は転送停止と調査、通知が必須です。無視は被害拡大を招き、ログ削除は証拠隠滅です。"
  },
  {
    id: "sec-supply-chain",
    equipmentId: "intel",
    category: "VULNERABILITY",
    title: "サプライチェーン攻撃",
    description: "利用中のサードパーティライブラリに脆弱性が発見されました。悪用された場合、システム全体が影響を受けます。",
    warning: 20,
    severity: 2.0,
    penalty: 13,
    repairCost: 18000,
    options: [
      "脆弱性を無視して使い続ける。",
      "影響範囲を評価し、パッチ適用または代替ライブラリへの移行を検討する。",
      "全システムを停止する。"
    ],
    correct: 1,
    explanation: "正解：サプライチェーン脆弱性は影響評価とパッチ適用で対応します。無視は侵入を許容し、全停止は過剰です。"
  },
  {
    id: "sec-privilege-escalation",
    equipmentId: "soc",
    category: "SECURITY",
    title: "権限昇格の試行",
    description: "一般ユーザーアカウントから管理者権限への昇格試行が検知されました。",
    warning: 19,
    severity: 1.8,
    penalty: 12,
    repairCost: 16000,
    options: [
      "アカウントを削除する。",
      "昇格経路を特定し、権限設定を修正、アカウントの監視を強化する。",
      "管理者権限を全ユーザーに付与する。"
    ],
    correct: 1,
    explanation: "正解：権限昇格は経路特定と設定修正で対応します。削除は過剰で、全付与は危険です。"
  },
  {
    id: "sec-unauthorized-access",
    equipmentId: "ids",
    category: "SECURITY",
    title: "不正アクセスの検知",
    description: "許可されていないIPアドレスから社内システムへのアクセスが検知されました。",
    warning: 17,
    severity: 1.9,
    penalty: 13,
    repairCost: 17000,
    options: [
      "アクセスを許可する。",
      "アクセス元を特定し、IPブロックとアクセス制限を実施、侵入範囲を調査する。",
      "全システムをシャットダウンする。"
    ],
    correct: 1,
    explanation: "正解：不正アクセスはIPブロックと制限、調査で対応します。許可は危険で、全停止は過剰です。"
  },
  {
    id: "sec-malicious-file",
    equipmentId: "malware",
    category: "SECURITY",
    title: "悪意のあるファイルの検知",
    description: "社内共有フォルダに不審な実行ファイルがアップロードされました。",
    warning: 21,
    severity: 2.0,
    penalty: 13,
    repairCost: 18000,
    options: [
      "ファイルを開いて内容を確認する。",
      "ファイルを隔離し、サンドボックスで解析して脅威を特定する。",
      "全社員にファイルを配布する。"
    ],
    correct: 1,
    explanation: "正解：悪意のあるファイルは隔離とサンドボックス解析で対応します。実行は感染リスクがあり、配布は被害拡大です。"
  },
  {
    id: "sec-vpn-breach",
    equipmentId: "incident",
    category: "ATTACK",
    title: "VPN経由の侵入",
    description: "VPN接続経由で不正なアクセスが検知されました。認証情報が漏洩した可能性があります。",
    warning: 16,
    severity: 2.1,
    penalty: 14,
    repairCost: 19000,
    options: [
      "VPNを無効化する。",
      "侵入経路を特定し、認証情報の変更とVPN設定の強化、ログ監視を行う。",
      "侵入を無視して様子を見る。"
    ],
    correct: 1,
    explanation: "正解：VPN侵入は経路特定と認証変更、強化で対応します。無効化は業務影響が大きく、無視は危険です。"
  },
  {
    id: "sec-cloud-misconfig",
    equipmentId: "intel",
    category: "SECURITY",
    title: "クラウド設定の不備",
    description: "クラウドストレージの設定ミスにより、機密データが公開状態になっている可能性があります。",
    warning: 23,
    severity: 1.7,
    penalty: 11,
    repairCost: 15000,
    options: [
      "設定をそのままにする。",
      "即座にアクセス権限を修正し、公開範囲を確認、データ漏洩の有無を調査する。",
      "データを削除する。"
    ],
    correct: 1,
    explanation: "正解：設定不備は即時修正と公開範囲確認が必要です。無視は漏洩を招き、削除は業務影響が大きいです。"
  },
  {
    id: "sec-patch-missing",
    equipmentId: "soc",
    category: "VULNERABILITY",
    title: "未適用パッチの検知",
    description: "重要なセキュリティパッチが適用されていないサーバーが複数検出されました。",
    warning: 24,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "パッチ適用を延期する。",
      "影響評価を行い、メンテナンス窓を設けてパッチ適用を実施する。",
      "サーバーをすべて再起動する。"
    ],
    correct: 1,
    explanation: "正解：未適用パッチは影響評価と計画的適用で対応します。延期はリスクを残し、再起動だけでは解決しません。"
  },
  {
    id: "sec-weak-password",
    equipmentId: "soc",
    category: "SECURITY",
    title: "脆弱なパスワードの検知",
    description: "パスワードポリシー違反のアカウントが複数検出されました。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "ポリシーを緩和する。",
      "該当アカウントに強制パスワード変更を要求し、ポリシー強化と教育を実施する。",
      "アカウントを削除する。"
    ],
    correct: 1,
    explanation: "正解：脆弱なパスワードは強制変更とポリシー強化で対応します。緩和はリスクを残し、削除は過剰です。"
  },
  {
    id: "sec-port-scan",
    equipmentId: "ids",
    category: "ATTACK",
    title: "ポートスキャンの検知",
    description: "外部からのポートスキャンが検知されました。攻撃の前兆の可能性があります。",
    warning: 25,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "スキャンを無視する。",
      "スキャン元を特定し、不要なポートを閉じ、ファイアウォールルールを強化する。",
      "全ポートを開放する。"
    ],
    correct: 1,
    explanation: "正解：ポートスキャンは元特定とポート閉鎖、ルール強化で対応します。無視は侵入を許容し、全開放は危険です。"
  },
  {
    id: "sec-malicious-domain",
    equipmentId: "firewall",
    category: "SECURITY",
    title: "悪意あるドメインへのアクセス",
    description: "社内端末からマルウェア配布ドメインへのアクセスが検知されました。",
    warning: 18,
    severity: 1.8,
    penalty: 12,
    repairCost: 16000,
    options: [
      "アクセスを許可する。",
      "ドメインをブロックし、アクセス端末をスキャンして感染を確認する。",
      "インターネット接続を遮断する。"
    ],
    correct: 1,
    explanation: "正解：悪意あるドメインはブロックと端末スキャンで対応します。許可は感染を招き、遮断は業務影響が大きいです。"
  },
  {
    id: "sec-incident-response",
    equipmentId: "incident",
    category: "INCIDENT",
    title: "インシデント対応の遅延",
    description: "検知されたセキュリティインシデントへの対応が遅れており、被害が拡大しています。",
    warning: 15,
    severity: 1.9,
    penalty: 13,
    repairCost: 17000,
    options: [
      "対応をさらに延期する。",
      "即座にインシデント対応チームを招集し、影響評価と対応計画を策定・実行する。",
      "インシデントを無視して通常運用を続ける。"
    ],
    correct: 1,
    explanation: "正解：インシデント対応は迅速な招集と計画実行が重要です。延期は被害拡大を招き、無視は危険です。"
  },
  {
    id: "sec-threat-intel",
    equipmentId: "intel",
    category: "INTEL",
    title: "脅威インテリジェンスの更新",
    description: "新たな脅威インテリジェンスが入手され、自社環境への影響評価が必要です。",
    warning: 26,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "インテリジェンスを無視する。",
      "影響評価を実施し、必要な防御策を講じ、監視を強化する。",
      "全システムを停止する。"
    ],
    correct: 1,
    explanation: "正解：脅威インテリジェンスは影響評価と防御策が重要です。無視はリスクを残し、全停止は過剰です。"
  },
  {
    id: "sec-siem-alert",
    equipmentId: "siem",
    category: "MONITORING",
    title: "SIEMアラートの急増",
    description: "SIEMで異常な数のアラートが生成されています。大規模なイベントが発生している可能性があります。",
    warning: 17,
    severity: 1.7,
    penalty: 11,
    repairCost: 15000,
    options: [
      "アラートを無視する。",
      "アラートの相関分析を実施し、根本原因を特定して対応する。",
      "SIEMを無効化する。"
    ],
    correct: 1,
    explanation: "正解：SIEMアラート急増は相関分析と原因特定で対応します。無視は被害を招き、無効化は監視不全です。"
  },
  {
    id: "sec-forensics",
    equipmentId: "siem",
    category: "FORENSICS",
    title: "フォレンジック調査の実施",
    description: "侵入事件のフォレンジック調査が必要ですが、証拠保全の手順が不明確です。",
    warning: 28,
    severity: 1.1,
    penalty: 6,
    repairCost: 8000,
    options: [
      "証拠を削除して調査を放棄する。",
      "専門家を招集し、適切な手順で証拠保全と調査を実施する。",
      "社員に任せる。"
    ],
    correct: 1,
    explanation: "正解：フォレンジックは専門家と適切な手順で実施します。証拠削除は違法で、社員任せは不十分です。"
  },
  {
    id: "sec-compliance",
    equipmentId: "soc",
    category: "COMPLIANCE",
    title: "コンプライアンス違反の疑い",
    description: "監査でデータ保護規制への違反が疑われています。対応が必要です。",
    warning: 24,
    severity: 1.4,
    penalty: 9,
    repairCost: 13000,
    options: [
      "監査を拒否する。",
      "違反内容を確認し、是正措置とプロセス改善を実施、報告書を作成する。",
      "証拠を隠す。"
    ],
    correct: 1,
    explanation: "正解：コンプライアンス違反是正は確認と改善、報告が必要です。拒否は罰則を招き、証拠隠蔽は違法です。"
  },
  {
    id: "sec-training",
    equipmentId: "soc",
    category: "TRAINING",
    title: "セキュリティ教育の不足",
    description: "社員のセキュリティ意識が低く、フィッシングメールの開封率が高いです。",
    warning: 27,
    severity: 1.0,
    penalty: 5,
    repairCost: 7000,
    options: [
      "教育を実施しない。",
      "定期的なセキュリティ教育とフィッシング訓練を実施し、意識向上を図る。",
      "社員を処罰する。"
    ],
    correct: 1,
    explanation: "正解：セキュリティ意識向上は教育と訓練が効果的です。無為はリスクを残し、処罰は報告を抑制します。"
  },
  {
    id: "sec-soc-escalation",
    equipmentId: "soc",
    category: "PROCESS",
    title: "SOCエスカレーションの不備",
    description: "SOCのエスカレーションプロセスが不明確で、重要なインシデントが遅れています。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "エスカレーションしない。",
      "エスカレーションプロセスを策定し、重要なインシデントを適切にエスカレートする。",
      "担当者だけで処理する。"
    ],
    correct: 1,
    explanation: "正解：エスカレーションプロセス策定が重要です。無エスカレーションは対応遅延を招き、担当者限定は組織対応を阻害します。"
  },
  {
    id: "sec-soc-knowledge",
    equipmentId: "soc",
    category: "KNOWLEDGE",
    title: "SOCナレッジベースの不備",
    description: "SOCナレッジベースが不十分で、対応手順が不明確です。",
    warning: 18,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "ナレッジベースを作成しない。",
      "ナレッジベースを構築し、対応手順を明確化する。",
      "担当者の記憶に頼る。"
    ],
    correct: 1,
    explanation: "正解：ナレッジベース構築が重要です。無作成は対応不明確を招き、記憶依存はリスクがあります。"
  },
  {
    id: "sec-soc-report",
    equipmentId: "soc",
    category: "REPORTING",
    title: "SOCレポートの不備",
    description: "SOCレポートが不十分で、経営層への報告が困難です。",
    warning: 16,
    severity: 1.0,
    penalty: 5,
    repairCost: 8000,
    options: [
      "レポートを作成しない。",
      "SOCレポートを充実化し、経営層への報告を容易にする。",
      "口頭で報告する。"
    ],
    correct: 1,
    explanation: "正解：SOCレポート充実化が重要です。無作成は報告困難を招き、口頭のみは不十分です。"
  },
  {
    id: "sec-soc-automation",
    equipmentId: "soc",
    category: "AUTOMATION",
    title: "SOC自動化の不備",
    description: "SOCの自動化が進んでおらず、手動対応が多く効率が悪いです。",
    warning: 20,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "自動化しない。",
      "SOC自動化ツールを導入し、効率化を図る。",
      "手動対応を継続する。"
    ],
    correct: 1,
    explanation: "正解：SOC自動化ツール導入が重要です。無自動化は効率低下を招き、手動継続は負荷が高いです。"
  },
  {
    id: "sec-backup",
    equipmentId: "malware",
    category: "BACKUP",
    title: "バックアップの不備",
    description: "重要データのバックアップが不十分で、復旧が困難な状態です。",
    warning: 23,
    severity: 1.6,
    penalty: 10,
    repairCost: 14000,
    options: [
      "バックアップを見直さない。",
      "バックアップ戦略を見直し、定期的なバックアップと復旧テストを実施する。",
      "データを削除する。"
    ],
    correct: 1,
    explanation: "正解：バックアップ不備は戦略見直しと定期的実施で改善します。無為はリスクを残し、削除は致命的です。"
  },
  {
    id: "sec-isolation",
    equipmentId: "ids",
    category: "ISOLATION",
    title: "感染端末の隔離",
    description: "マルウェア感染が疑われる端末がありますが、隔離手順が不明確です。",
    warning: 19,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "隔離せずに使い続ける。",
      "ネットワークから隔離し、安全な環境でスキャンと駆除を実施する。",
      "端末を破壊する。"
    ],
    correct: 1,
    explanation: "正解：感染端末は隔離と安全環境での駆除が基本です。無為は拡散を招き、破壊は過剰です。"
  },
  {
    id: "sec-recovery",
    equipmentId: "incident",
    category: "RECOVERY",
    title: "復旧手順の不備",
    description: "インシデント後の復旧手順が整備されておらず、復旧が遅れています。",
    warning: 25,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "復旧計画を作成しない。",
      "復旧手順を策定し、定期的な訓練と更新を実施する。",
      "適当に対応する。"
    ],
    correct: 1,
    explanation: "正解：復旧手順は策定と訓練が重要です。無為は再発を招き、適当対応は不完全です。"
  },
  {
    id: "sec-communication",
    equipmentId: "incident",
    category: "COMMUNICATION",
    title: "ステークホルダーへの報告",
    description: "インシデント発生時のステークホルダーへの報告プロセスが不透明です。",
    warning: 26,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "報告しない。",
      "報告プロセスを策定し、適切なタイミングと内容でステークホルダーに通知する。",
      "情報を隠す。"
    ],
    correct: 1,
    explanation: "正解：ステークホルダー報告は透明性と信頼維持に重要です。無報告は信頼失墜を招き、情報隠蔽は違法です。"
  },
  {
    id: "sec-lessons",
    equipmentId: "siem",
    category: "IMPROVEMENT",
    title: "教訓の共有",
    description: "過去のインシデントから学んだ教訓が組織全体に共有されていません。",
    warning: 28,
    severity: 0.9,
    penalty: 5,
    repairCost: 7000,
    options: [
      "教訓を共有しない。",
      "インシデントレビューを実施し、教訓を組織全体に共有してプロセス改善を図る。",
      "担当者だけで処理する。"
    ],
    correct: 1,
    explanation: "正解：教訓共有は組織学習と再発防止に重要です。無為は再発を招き、担当者限定は組織改善を阻害します。"
  },
  {
    id: "sec-siem-correlation",
    equipmentId: "siem",
    category: "ANALYSIS",
    title: "SIEM相関分析の不備",
    description: "SIEMの相関分析ルールが不十分で、複雑な攻撃を検知できていません。",
    warning: 22,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "相関分析を行わない。",
      "相関分析ルールを強化し、複雑な攻撃を検知できるようにする。",
      "SIEMを停止する。"
    ],
    correct: 1,
    explanation: "正解：相関分析ルールの強化が重要です。無分析は検知能力を低下させ、停止は脅威検知を不可能にします。"
  },
  {
    id: "sec-siem-integration",
    equipmentId: "siem",
    category: "INTEGRATION",
    title: "SIEM連携の不備",
    description: "SIEMと他セキュリティツールの連携が不十分で、自動対応ができていません。",
    warning: 20,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "連携しない。",
      "連携設定を確認し、自動対応を有効にする。",
      "手動で対応する。"
    ],
    correct: 1,
    explanation: "正解：連携設定の確認と自動対応の有効化が重要です。無連携は効率を低下させ、手動対応は負荷が高いです。"
  },
  {
    id: "sec-siem-tuning",
    equipmentId: "siem",
    category: "CONFIGURATION",
    title: "SIEMルールのチューニング不備",
    description: "SIEMの検知ルールが適切にチューニングされておらず、誤検知が多発しています。",
    warning: 18,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "チューニングしない。",
      "検知ルールをチューニングし、誤検知を削減する。",
      "SIEMを無効化する。"
    ],
    correct: 1,
    explanation: "正解：検知ルールのチューニングが重要です。無チューニングは誤検知を招き、無効化は脅威検知を不可能にします。"
  },
  {
    id: "sec-siem-performance",
    equipmentId: "siem",
    category: "PERFORMANCE",
    title: "SIEMの性能低下",
    description: "SIEMの処理能力が不足しており、ログの一部が処理されません。",
    warning: 20,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "無視する。",
      "SIEMのリソースを増強し、処理能力を向上させる。",
      "SIEMを停止する。"
    ],
    correct: 1,
    explanation: "正解：SIEMリソース増強が重要です。無視は検知漏れを招き、停止は脅威検知を不可能にします。"
  },
  {
    id: "sec-siem-visualization",
    equipmentId: "siem",
    category: "MONITORING",
    title: "SIEM可視化の不備",
    description: "SIEMのダッシュボードが不十分で、状況把握が困難です。",
    warning: 16,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "可視化しない。",
      "ダッシュボードを改善し、状況把握を容易にする。",
      "ログを手動で確認する。"
    ],
    correct: 1,
    explanation: "正解：ダッシュボードの改善が重要です。無改善は状況把握を困難にし、手動確認は非効率です。"
  },
  {
    id: "sec-firewall-bypass",
    equipmentId: "firewall",
    category: "SECURITY",
    title: "ファイアウォールバイパスの検知",
    description: "攻撃者がファイアウォールをバイパスする手法を使用している可能性があります。",
    warning: 26,
    severity: 1.8,
    penalty: 13,
    repairCost: 17000,
    options: [
      "無視する。",
      "バイパス手法を分析し、検知ルールを更新する。",
      "ファイアウォールを無効化する。"
    ],
    correct: 1,
    explanation: "正解：バイパス手法の分析とルール更新が重要です。無視はリスクを残し、無効化は危険です。"
  },
  {
    id: "sec-firewall-redundancy",
    equipmentId: "firewall",
    category: "AVAILABILITY",
    title: "ファイアウォール冗長化の不備",
    description: "ファイアウォールが冗長化されておらず、単一障害で停止するリスクがあります。",
    warning: 24,
    severity: 1.6,
    penalty: 11,
    repairCost: 14000,
    options: [
      "冗長化しない。",
      "ファイアウォールを冗長化し、単一障害に対応する。",
      "リスクを受け入れる。"
    ],
    correct: 1,
    explanation: "正解：ファイアウォール冗長化が重要です。無冗長化はリスクを残し、リスク受容は停止リスクを高めます。"
  },
  {
    id: "sec-firewall-geo",
    equipmentId: "firewall",
    category: "SECURITY",
    title: "地理的制限の不備",
    description: "地理的IP制限が設定されておらず、海外からの不正アクセスが可能です。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "制限を設定しない。",
      "地理的IP制限を設定し、海外からのアクセスを制限する。",
      "すべてのアクセスをブロックする。"
    ],
    correct: 1,
    explanation: "正解：地理的IP制限の設定が重要です。無設定はリスクを残し、全ブロックは業務を停止させます。"
  },
  {
    id: "sec-ids-zero-day",
    equipmentId: "ids",
    category: "SECURITY",
    title: "ゼロデイ攻撃の検知",
    description: "シグネチャが存在しないゼロデイ攻撃の可能性があります。",
    warning: 28,
    severity: 1.9,
    penalty: 14,
    repairCost: 18000,
    options: [
      "無視する。",
      "異常な挙動を分析し、検知ルールを更新する。",
      "システムを停止する。"
    ],
    correct: 1,
    explanation: "正解：異常挙動の分析とルール更新が重要です。無視はリスクを残し、停止は業務を停止させます。"
  },
  {
    id: "sec-ids-tuning",
    equipmentId: "ids",
    category: "CONFIGURATION",
    title: "IDS検知ルールのチューニング不備",
    description: "IDSの検知ルールが適切にチューニングされておらず、誤検知が多発しています。",
    warning: 20,
    severity: 1.2,
    penalty: 7,
    repairCost: 9000,
    options: [
      "チューニングしない。",
      "検知ルールをチューニングし、誤検知を削減する。",
      "IDSを無効化する。"
    ],
    correct: 1,
    explanation: "正解：検知ルールのチューニングが重要です。無チューニングは誤検知を招き、無効化は脅威検知を不可能にします。"
  },
  {
    id: "sec-ids-performance",
    equipmentId: "ids",
    category: "PERFORMANCE",
    title: "IDSの性能低下",
    description: "IDSの処理能力が不足しており、トラフィックの一部が検知されません。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 11000,
    options: [
      "無視する。",
      "IDSのリソースを増強し、処理能力を向上させる。",
      "IDSを停止する。"
    ],
    correct: 1,
    explanation: "正解：IDSリソース増強が重要です。無視は検知漏れを招き、停止は脅威検知を不可能にします。"
  },
  {
    id: "sec-ids-correlation",
    equipmentId: "ids",
    category: "ANALYSIS",
    title: "IDS相関分析の不備",
    description: "IDSアラートの相関分析が不十分で、複雑な攻撃を検知できていません。",
    warning: 24,
    severity: 1.5,
    penalty: 10,
    repairCost: 12000,
    options: [
      "相関分析しない。",
      "相関分析を強化し、複雑な攻撃を検知できるようにする。",
      "IDSを停止する。"
    ],
    correct: 1,
    explanation: "正解：相関分析の強化が重要です。無分析は検知能力を低下させ、停止は脅威検知を不可能にします。"
  },
  {
    id: "sec-ids-signature",
    equipmentId: "ids",
    category: "DETECTION",
    title: "IDSシグネチャの更新遅延",
    description: "IDSシグネチャが更新されておらず、最新の攻撃を検知できていません。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 11000,
    options: [
      "更新しない。",
      "シグネチャを更新し、最新の攻撃を検知できるようにする。",
      "検知を停止する。"
    ],
    correct: 1,
    explanation: "正解：シグネチャ更新が重要です。無更新はリスクを残し、停止は脅威検知を不可能にします。"
  },
  {
    id: "sec-ids-false-positive",
    equipmentId: "ids",
    category: "CONFIGURATION",
    title: "IDS誤検知の多発",
    description: "IDSで誤検知が頻発し、業務に支障が出ています。",
    warning: 18,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "対応しない。",
      "誤検知の原因を調査し、ルールを調整する。",
      "IDSを無効化する。"
    ],
    correct: 1,
    explanation: "正解：誤検知の調査とルール調整が重要です。無対応は業務支障を招き、無効化は脅威検知を不可能にします。"
  },
  {
    id: "sec-malware-behavior",
    equipmentId: "malware",
    category: "ANALYSIS",
    title: "マルウェア挙動解析の不備",
    description: "マルウェアの挙動解析が不十分で、影響範囲が不明確です。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "解析しない。",
      "マルウェア挙動解析を実施し、影響範囲を特定する。",
      "システムを再インストールする。"
    ],
    correct: 1,
    explanation: "正解：マルウェア挙動解析が重要です。無解析は影響不明を招き、再インストールは過剰です。"
  },
  {
    id: "sec-malware-recovery",
    equipmentId: "malware",
    category: "RECOVERY",
    title: "マルウェア感染後の復旧",
    description: "マルウェア感染後の復旧手順が不十分で、復旧が遅れています。",
    warning: 24,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "復旧手順を策定しない。",
      "復旧手順を策定し、定期的に訓練する。",
      "適当に対応する。"
    ],
    correct: 1,
    explanation: "正解：復旧手順策定が重要です。無策定は復旧遅延を招き、適当対応は不完全です。"
  },
  {
    id: "sec-malware-prevention",
    equipmentId: "malware",
    category: "PREVENTION",
    title: "マルウェア予防の不備",
    description: "マルウェア予防策が不十分で、再感染のリスクがあります。",
    warning: 20,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "予防策を講じない。",
      "マルウェア予防策を強化し、再感染を防ぐ。",
      "担当者に任せる。"
    ],
    correct: 1,
    explanation: "正解：マルウェア予防策強化が重要です。無予防は再感染を招き、担当者任せは不十分です。"
  },
  {
    id: "sec-malware-training",
    equipmentId: "malware",
    category: "TRAINING",
    title: "マルウェア対応訓練の不備",
    description: "スタッフのマルウェア対応訓練が不足しており、実対応で混乱が予想されます。",
    warning: 18,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "訓練しない。",
      "マルウェア対応訓練を実施し、対応能力を向上させる。",
      "実対応で学ぶ。"
    ],
    correct: 1,
    explanation: "正解：マルウェア対応訓練が重要です。無訓練は実対応で混乱を招き、実対応学習はリスクが高いです。"
  },
  {
    id: "sec-malware-sandbox",
    equipmentId: "malware",
    category: "ANALYSIS",
    title: "マルウェアサンドボックスの不備",
    description: "マルウェアサンドボックスが正常に動作しておらず、解析が困難です。",
    warning: 20,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "解析しない。",
      "サンドボックスを修復し、解析を再開する。",
      "手動で解析する。"
    ],
    correct: 1,
    explanation: "正解：サンドボックス修復が重要です。無解析はリスクを残し、手動解析は効率が低いです。"
  },
  {
    id: "sec-malware-signature",
    equipmentId: "malware",
    category: "DETECTION",
    title: "マルウェアシグネチャの更新遅延",
    description: "マルウェアシグネチャが更新されておらず、最新のマルウェアを検知できていません。",
    warning: 22,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "更新しない。",
      "シグネチャを更新し、最新のマルウェアを検知できるようにする。",
      "検知を停止する。"
    ],
    correct: 1,
    explanation: "正解：シグネチャ更新が重要です。無更新はリスクを残し、停止は脅威検知を不可能にします。"
  },
  {
    id: "sec-intel-feed",
    equipmentId: "intel",
    category: "INTELLIGENCE",
    title: "脅威インテリジェンスフィードの不備",
    description: "脅威インテリジェンスフィードが更新されておらず、最新の脅威情報が取得できていません。",
    warning: 18,
    severity: 1.3,
    penalty: 8,
    repairCost: 11000,
    options: [
      "フィードを無効にする。",
      "フィード設定を確認し、更新頻度を調整する。",
      "手動で脅威情報を収集する。"
    ],
    correct: 1,
    explanation: "正解：フィード設定を確認して更新頻度を調整する必要があります。無効化は脅威検知能力を低下させます。"
  },
  {
    id: "sec-intel-false-positive",
    equipmentId: "intel",
    category: "INTELLIGENCE",
    title: "脅威インテリジェンスの誤検知",
    description: "脅威インテリジェンスフィードで誤検知が頻発し、業務に支障が出ています。",
    warning: 20,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "すべてのアラートを無視する。",
      "フィードの品質を評価し、誤検知の多いソースを除外する。",
      "脅威インテリジェンスを完全に停止する。"
    ],
    correct: 1,
    explanation: "正解：フィードの品質評価とソース除外が適切です。無視はリスクを残し、完全停止は脅威検知を不可能にします。"
  },
  {
    id: "sec-intel-context",
    equipmentId: "intel",
    category: "INTELLIGENCE",
    title: "脅威インテリジェンスのコンテキスト不足",
    description: "脅威インテリジェンスのコンテキスト情報が不足しており、優先度判断が困難です。",
    warning: 16,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "すべての脅威を同じ優先度で扱う。",
      "脅威インテリジェンスのコンテキスト情報を充実させ、優先度判断を改善する。",
      "脅威インテリジェンスを利用しない。"
    ],
    correct: 1,
    explanation: "正解：コンテキスト情報の充実が重要です。一律扱いは効率を低下させ、不使用は脅威検知能力を低下させます。"
  },
  {
    id: "sec-intel-sharing",
    equipmentId: "intel",
    category: "INTELLIGENCE",
    title: "脅威インテリジェンスの共有不備",
    description: "組織内で脅威インテリジェンスが適切に共有されておらず、対応が遅れています。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "共有しない。",
      "脅威インテリジェンス共有プロセスを策定し、適切なチャネルで共有する。",
      "担当者だけで処理する。"
    ],
    correct: 1,
    explanation: "正解：脅威インテリジェンス共有プロセスの策定が重要です。無共有は対応遅延を招き、担当者限定は組織対応を阻害します。"
  },
  {
    id: "sec-intel-automation",
    equipmentId: "intel",
    category: "INTELLIGENCE",
    title: "脅威インテリジェンスの自動化不備",
    description: "脅威インテリジェンスの収集・分析が手動で行われており、対応が遅れています。",
    warning: 20,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "手動を継続する。",
      "脅威インテリジェンスの自動化ツールを導入し、効率化を図る。",
      "脅威インテリジェンスを停止する。"
    ],
    correct: 1,
    explanation: "正解：自動化ツール導入が適切です。手動継続は効率が低く、停止は脅威検知能力を低下させます。"
  },
  {
    id: "sec-intel-tlp",
    equipmentId: "intel",
    category: "INTELLIGENCE",
    title: "TLP（Traffic Light Protocol）の不備",
    description: "脅威インテリジェンスのTLP分類が適切でなく、情報共有が不十分です。",
    warning: 18,
    severity: 1.2,
    penalty: 7,
    repairCost: 10000,
    options: [
      "TLP分類しない。",
      "TLP分類を適切に設定し、情報共有を最適化する。",
      "すべてを公開する。"
    ],
    correct: 1,
    explanation: "正解：TLP分類の適切な設定が重要です。無分類は共有不適切を招き、全公開はリスクを残します。"
  },
  {
    id: "sec-incident-triage",
    equipmentId: "incident",
    category: "PROCESS",
    title: "インシデントトリアージの不備",
    description: "インシデントのトリアージ（優先度付け）が不十分で、重要なインシデントが遅れています。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "トリアージしない。",
      "インシデントトリアージプロセスを策定し、優先度付けを行う。",
      "すべてのインシデントを同じに扱う。"
    ],
    correct: 1,
    explanation: "正解：インシデントトリアージプロセス策定が重要です。無トリアージは対応遅延を招き、一律扱いは効率を低下させます。"
  },
  {
    id: "sec-incident-metrics",
    equipmentId: "incident",
    category: "METRICS",
    title: "インシデントメトリクスの不備",
    description: "インシデントメトリクス（MTTR等）が追跡されておらず、改善が困難です。",
    warning: 18,
    severity: 1.1,
    penalty: 6,
    repairCost: 9000,
    options: [
      "メトリクスを追跡しない。",
      "インシデントメトリクスを定義し、追跡・改善を図る。",
      "担当者の感覚に頼る。"
    ],
    correct: 1,
    explanation: "正解：インシデントメトリクス定義が重要です。無追跡は改善困難を招き、感覚依頼は主観的です。"
  },
  {
    id: "sec-incident-forensics",
    equipmentId: "incident",
    category: "FORENSICS",
    title: "インシデントフォレンジックの不備",
    description: "インシデント時のフォレンジック調査が不十分で、原因特定が困難です。",
    warning: 26,
    severity: 1.7,
    penalty: 12,
    repairCost: 15000,
    options: [
      "フォレンジック調査しない。",
      "フォレンジック調査プロセスを策定し、原因特定を強化する。",
      "システムを再インストールする。"
    ],
    correct: 1,
    explanation: "正解：フォレンジック調査プロセス策定が重要です。無調査は原因不明を招き、再インストールは証拠を失います。"
  },
  {
    id: "sec-incident-legal",
    equipmentId: "incident",
    category: "LEGAL",
    title: "インシデント対応の法的対応",
    description: "インシデント時の法的対応（報告義務等）が不十分で、コンプライアンスリスクがあります。",
    warning: 28,
    severity: 1.8,
    penalty: 13,
    repairCost: 17000,
    options: [
      "法的対応しない。",
      "法的対応プロセスを策定し、報告義務等を遵守する。",
      "情報を隠蔽する。"
    ],
    correct: 1,
    explanation: "正解：法的対応プロセス策定が重要です。無対応はコンプライアンス違反を招き、情報隠蔽は違法です。"
  },
  {
    id: "sec-siem-correlation-gap",
    equipmentId: "siem",
    category: "LOGGING",
    title: "SIEMの相関ルールが反応していない",
    description: "複数端末で不審なログイン失敗が発生していますが、SIEMのアラートが上がっていません。",
    warning: 22,
    severity: 1.7,
    penalty: 12,
    repairCost: 15000,
    learningTags: ["SIEM", "ログ相関", "監視"],
    examPoint: "SIEMはログを集約し、相関分析で攻撃の兆候を検知します。ルールやしきい値の調整が重要です。",
    options: ["相関ルールとしきい値、ログ取り込み状況を確認する。", "失敗ログを削除してアラートを減らす。", "全端末の電源を切る。"],
    correct: 0,
    explanation: "正解：SIEMはログ取り込みと相関ルールが適切でないと検知できません。ルールとしきい値を確認します。"
  },
  {
    id: "sec-edr-isolation",
    equipmentId: "soc",
    category: "DETECTION",
    title: "EDRが不審なプロセスを検知した",
    description: "EDRが端末上で不審なPowerShell実行を検知しました。端末は社内ネットワークに接続中です。",
    warning: 18,
    severity: 2.0,
    penalty: 14,
    repairCost: 18000,
    learningTags: ["EDR", "封じ込め", "マルウェア"],
    examPoint: "感染が疑われる端末は、証拠を残しながらネットワーク隔離などで被害拡大を防ぎます。",
    options: ["端末をネットワークから隔離し、ログと検体を保全して調査する。", "利用者にそのまま作業を続けてもらう。", "検知を誤検知としてすぐ削除する。"],
    correct: 0,
    explanation: "正解：EDR検知時は封じ込めと証拠保全が重要です。安易な放置や削除は被害拡大・原因不明につながります。"
  },
  {
    id: "sec-firewall-any-any",
    equipmentId: "firewall",
    category: "POLICY",
    title: "ファイアウォールにany-any許可ルールがある",
    description: "一時対応のために作った送信元any、宛先any、ポートanyの許可ルールが残っています。",
    warning: 24,
    severity: 1.8,
    penalty: 13,
    repairCost: 16000,
    learningTags: ["ファイアウォール", "最小権限", "アクセス制御"],
    examPoint: "通信制御は必要な送信元・宛先・ポートだけを許可する最小権限の考え方が基本です。",
    options: ["便利なのでそのまま残す。", "必要な通信だけに絞り、不要な広範囲許可を削除する。", "全通信を遮断して業務を止める。"],
    correct: 1,
    explanation: "正解：any-any許可は攻撃面を広げます。必要な通信だけを許可するルールへ見直します。"
  },
  {
    id: "sec-phishing-header",
    equipmentId: "incident",
    category: "ANALYSIS",
    title: "フィッシングメールのヘッダー確認",
    description: "利用者から不審メールが転送され、送信元が正規ドメインに見えるか確認が必要です。",
    warning: 23,
    severity: 1.5,
    penalty: 10,
    repairCost: 12000,
    learningTags: ["メールヘッダー", "SPF", "DKIM", "DMARC"],
    examPoint: "メールのなりすまし確認では、表示名だけでなくヘッダー、SPF、DKIM、DMARCの結果を確認します。",
    options: ["表示名が取引先なら安全と判断する。", "メールヘッダーと認証結果、URLを確認して判定する。", "本文を全社員に転送して意見を集める。"],
    correct: 1,
    explanation: "正解：表示名だけではなりすましを判断できません。ヘッダーやメール認証、URLを確認します。"
  },];