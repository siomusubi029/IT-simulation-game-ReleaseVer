// ===== 一般企業オフィス：インシデントデータ =====

const officeIncidents = [
  {
    id: "phishing",
    equipmentId: "security",
    category: "SECURITY",
    title: "不審なメールの報告",
    description: "社員から「取引先を名乗るメールで、急いでパスワードを入力するよう求められた」と相談が来ています。",
    warning: 24,
    severity: 1.6,
    penalty: 11,
    repairCost: 12000,
    options: [
      "リンクを開かず、送信元やURLを確認して情報システムへ報告する。",
      "取引先かもしれないため、添付ファイルを開いて内容を確認する。",
      "念のため、全社員へそのメールを転送して注意を促す。"
    ],
    correct: 0,
    explanation: "正解：不審なメールはリンクや添付を開かず、送信元・URLを確認して報告します。安易な転送も被害拡大につながります。"
  },
  {
    id: "unknown-usb",
    equipmentId: "pc",
    category: "SECURITY",
    title: "見覚えのないUSBメモリ",
    description: "社員PCエリアで、持ち主不明のUSBメモリが見つかりました。ラベルには「給与データ」と書かれています。",
    warning: 20,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "中身を確認するため、近くのPCに接続する。",
      "接続せず、情報システム管理者へ届けて対応方針を確認する。",
      "誰かの私物かもしれないため、休憩室に置いておく。"
    ],
    correct: 1,
    explanation: "正解：不明なUSBメモリはマルウェア感染のリスクがあります。自分で接続せず、管理担当へ報告します。"
  },
  {
    id: "wifi-single",
    equipmentId: "wifi",
    category: "NETWORK",
    title: "特定のPCだけWi-Fiに接続できない",
    description: "一部の社員だけがネットワークに接続できないと報告しています。他の社員のPCは問題なく利用できています。",
    warning: 28,
    severity: 1.1,
    penalty: 7,
    repairCost: 8000,
    options: [
      "会社全体のルーターをすぐに初期化する。",
      "接続できないPCのWi-Fi設定や機内モード、認証状態を確認する。",
      "全社員にPCの買い替えを依頼する。"
    ],
    correct: 1,
    explanation: "正解：影響が一部端末に限られる場合、まずその端末側の設定・接続状況を切り分けます。"
  },
  {
    id: "network-wide",
    equipmentId: "network",
    category: "NETWORK",
    title: "複数部署でインターネット接続不能",
    description: "複数の部署から「Webサイトもクラウドサービスも使えない」と連絡が来ています。プリンターもネットワークエラーを表示しています。",
    warning: 17,
    severity: 2.2,
    penalty: 14,
    repairCost: 18000,
    options: [
      "影響範囲を確認し、ネットワーク機器・回線の状態を順に切り分ける。",
      "各社員にブラウザの履歴を削除するよう案内する。",
      "個別PCの壁紙設定を初期化して様子を見る。"
    ],
    correct: 0,
    explanation: "正解：複数の設備に影響がある場合は、共通の原因になり得るネットワーク機器や回線を疑い、影響範囲から切り分けます。"
  },
  {
    id: "server-permission",
    equipmentId: "server",
    category: "ACCESS",
    title: "共有フォルダへのアクセス拒否",
    description: "新しく配属された社員が、必要な共有フォルダを開けず『アクセスが拒否されました』と表示されています。",
    warning: 26,
    severity: 1.1,
    penalty: 7,
    repairCost: 9000,
    options: [
      "共有フォルダを全社員が閲覧できる設定へ変更する。",
      "本人の業務に必要な範囲を確認し、適切なアクセス権を付与する。",
      "社員のアカウントを削除して作り直す。"
    ],
    correct: 1,
    explanation: "正解：アクセス権は必要最小限に付与します。全員に公開するのは情報漏えいのリスクがあります。"
  },
  {
    id: "deleted-file",
    equipmentId: "server",
    category: "BACKUP",
    title: "重要ファイルの誤削除",
    description: "経理担当者が月次資料を誤って削除しました。明日の取締役会で使う資料です。",
    warning: 22,
    severity: 1.7,
    penalty: 11,
    repairCost: 15000,
    options: [
      "すぐに同じファイル名で空のファイルを作成して上書きする。",
      "ゴミ箱・バージョン履歴・バックアップを確認して復元を試みる。",
      "サーバー本体の電源ケーブルを抜く。"
    ],
    correct: 1,
    explanation: "正解：誤削除時は、ゴミ箱・履歴・バックアップを確認します。不用意な上書きは復元可能性を下げることがあります。"
  },
  {
    id: "meeting-display",
    equipmentId: "meeting",
    category: "HARDWARE",
    title: "会議室の画面が映らない",
    description: "重要なオンライン会議の直前、会議室モニターにPC画面が表示されなくなりました。",
    warning: 20,
    severity: 1.3,
    penalty: 8,
    repairCost: 7000,
    options: [
      "ケーブル接続とモニターの入力切替を確認する。",
      "会議参加者全員のPCを初期化する。",
      "モニターを叩いて接触不良を直す。"
    ],
    correct: 0,
    explanation: "正解：映像出力トラブルでは、まずケーブル・電源・入力切替などを確認します。"
  },
  {
    id: "login-alert",
    equipmentId: "security",
    category: "SECURITY",
    title: "見覚えのないログイン通知",
    description: "管理者アカウントに、普段と異なる地域からのログイン通知が届きました。",
    warning: 18,
    severity: 2.0,
    penalty: 13,
    repairCost: 16000,
    options: [
      "通知を無視して、忙しい時間帯をやり過ごす。",
      "パスワード変更・セッション確認を行い、必要に応じて管理者へ報告する。",
      "同じパスワードを全サービスで使い回す。"
    ],
    correct: 1,
    explanation: "正解：不審なログイン通知では、認証情報の保護と影響確認を優先します。パスワードの使い回しは危険です。"
  },
  {
    id: "printer-error",
    equipmentId: "printer",
    category: "HARDWARE",
    title: "複合機で印刷できない",
    description: "総務から、複合機にエラーが表示され印刷できないと連絡が来ています。",
    warning: 30,
    severity: 0.9,
    penalty: 6,
    repairCost: 6000,
    options: [
      "表示されているエラー、用紙・トナー、ネットワーク接続を順に確認する。",
      "社内の全PCを強制終了する。",
      "複合機の設定をすべて削除する。"
    ],
    correct: 0,
    explanation: "正解：周辺機器のトラブルは、エラー表示と基本的な接続・消耗品から確認します。"
  },
  {
    id: "password-sharing",
    equipmentId: "pc",
    category: "SECURITY",
    title: "パスワード共有の依頼",
    description: "「急ぎの仕事だから」と同僚から、共有フォルダ用のアカウントとパスワードを教えてほしいと頼まれました。",
    warning: 25,
    severity: 1.4,
    penalty: 9,
    repairCost: 10000,
    options: [
      "相手が同僚なので、チャットでパスワードを送る。",
      "本人用アカウントの利用・権限申請など、正規の手続きで対応する。",
      "パスワードを紙に書いてデスクに置く。"
    ],
    correct: 1,
    explanation: "正解：アカウントやパスワードの共有は、誰が操作したか追跡できなくなり、情報セキュリティ上のリスクになります。"
  },
  {
    id: "password-expire",
    equipmentId: "security",
    category: "SECURITY",
    title: "管理者パスワードの期限切れ警告",
    description: "管理者アカウントのパスワード有効期限が本日で切れると通知が届きました。迅速に対処する必要があります。",
    warning: 20,
    severity: 1.2,
    penalty: 8,
    repairCost: 9000,
    options: [
      "期限が切れるまで放置して、後でまとめて対応する。",
      "パスワードを強固に変更し、必要であれば追加の認証手続きを行う。",
      "同じパスワードを使い続けるよう契約書を確認する。"
    ],
    correct: 1,
    explanation: "正解：期限切れはアクセス障害につながるため、強固な新パスワードと追加認証を整備して更新します。"
  },
  {
    id: "usb-policy",
    equipmentId: "security",
    category: "SECURITY",
    title: "私物USBの持ち込み申請なし",
    description: "社員が私物USBメモリを業務で使いたいと申し出ていますが、申請書類がありません。",
    warning: 26,
    severity: 1.3,
    penalty: 9,
    repairCost: 10000,
    options: [
      "申請を簡略化してすぐに使えるよう許可する。",
      "申請手続きを案内し、USBの安全性と必要性を確認する。",
      "かってに使ってもらって問題なければ後で報告を受ける。"
    ],
    correct: 1,
    explanation: "正解：私物USBの持ち込みはリスク管理が重要なため、申請と安全確認を徹底します。"
  },
  {
    id: "suspicious-device",
    equipmentId: "security",
    category: "SECURITY",
    title: "不審な端末の社内接続",
    description: "社内ネットワークに登録されていない端末が接続されているというアラートが上がりました。",
    warning: 22,
    severity: 1.8,
    penalty: 12,
    repairCost: 15000,
    options: [
      "アラートを無視して通常運用を続ける。",
      "直ちに端末を隔離し、接続履歴と所有者を確認する。",
      "ネットワーク全体を再起動して接続をリセットする。"
    ],
    correct: 1,
    explanation: "正解：不明端末は情報漏えいやマルウェア感染の可能性があるため、隔離と原因調査を行います。"
  },
  {
    id: "insecure-site",
    equipmentId: "security",
    category: "POLICY",
    title: "業務PCで危険なサイトにアクセス",
    description: "社員PCから、運営会社が信用できないサイトへのアクセスが検知されました。",
    warning: 24,
    severity: 1.4,
    penalty: 10,
    repairCost: 11000,
    options: [
      "アクセス禁止のルールを一律に解除する。",
      "アクセス履歴を確認し、必要であれば教育とアクセス制限を強化する。",
      "あえてアクセスを許可して様子を見る。"
    ],
    correct: 1,
    explanation: "正解：危険なサイトアクセスは情報資産のリスクになるため、調査と教育、制限強化を行います。"
  },
  {
    id: "data-leak",
    equipmentId: "security",
    category: "SECURITY",
    title: "社外への機密情報流出の兆候",
    description: "ファイル共有サービスへの大量アップロードが検出され、機密資料が含まれている可能性があります。",
    warning: 16,
    severity: 2.3,
    penalty: 15,
    repairCost: 18000,
    options: [
      "状況を追跡せず、担当者に任せる。",
      "直ちに対象ファイルの送信を停止し、原因と送信先を調査する。",
      "ユーザーのアクセス権をすべて一時停止する。"
    ],
    correct: 1,
    explanation: "正解：流出兆候では送信停止と原因調査を優先し、過剰な停止は業務停止につながるため慎重に行います。"
  },
  {
    id: "shadow-it",
    equipmentId: "asset",
    category: "POLICY",
    title: "管理外のクラウドサービス利用",
    description: "一部部署が承認されていないクラウドサービスを業務で使用していることが発覚しました。",
    warning: 20,
    severity: 1.6,
    penalty: 11,
    repairCost: 12000,
    options: [
      "黙認して、後でまとめて対応する。",
      "利用実態と影響範囲を確認し、公式サービスへの移行と運用ルールを整備する。",
      "関係者全員の端末を即座にネットワークから切断する。"
    ],
    correct: 1,
    explanation: "正解：影響範囲を把握して公式対応を進めることで業務継続とセキュリティを両立します。"
  },
  {
    id: "security-audit",
    equipmentId: "security",
    category: "SECURITY",
    title: "セキュリティ監査で指摘された設定の不備",
    description: "監査により、セキュリティ機器の一部設定が社内基準に合致していないと指摘されました。",
    warning: 24,
    severity: 1.6,
    penalty: 11,
    repairCost: 13000,
    options: [
      "監査結果を無視して通常運用を続ける。",
      "指摘内容を確認し、基準に沿った設定に修正する。",
      "監査機関に再確認を依頼する。"
    ],
    correct: 1,
    explanation: "正解：監査指摘はセキュリティ基準に沿った修正を行うことで信頼性を維持します。"
  },
  {
    id: "endpoint-scan",
    equipmentId: "security",
    category: "SECURITY",
    title: "エンドポイントスキャンで脅威検出",
    description: "社内PCの脅威検出レポートで、複数の端末に未対応のマルウェアがある可能性が示されています。",
    warning: 19,
    severity: 1.9,
    penalty: 12,
    repairCost: 16000,
    options: [
      "検出レポートを無視して運用を続ける。",
      "検出端末を隔離し、詳細診断と駆除を実施する。",
      "検出内容をユーザーに通知するだけで済ませる。"
    ],
    correct: 1,
    explanation: "正解：脅威検出は影響端末の隔離と診断・駆除を行い、安全性を確保します。"
  },
  {
    id: "slow-boot",
    equipmentId: "pc",
    category: "SOFTWARE",
    title: "PCの起動が非常に遅い",
    description: "ある社員のPCが起動に数分かかり、朝の業務開始が遅れています。",
    warning: 18,
    severity: 1.0,
    penalty: 8,
    repairCost: 9000,
    options: [
      "強制終了して再起動を繰り返す。",
      "スタートアップアプリやディスク使用量を確認して影響を調査する。",
      "新しいPCをすぐに手配する。"
    ],
    correct: 1,
    explanation: "正解：起動遅延は不要なスタートアップ項目やディスク容量不足が原因になるため、構成を確認して対処します。"
  },
  {
    id: "software-update",
    equipmentId: "pc",
    category: "SOFTWARE",
    title: "更新途中でエラーが発生した",
    description: "社員PCのOS更新が途中で失敗し、再起動後にログインできない状態です。",
    warning: 18,
    severity: 1.6,
    penalty: 10,
    repairCost: 12000,
    options: [
      "強制的に再インストールして解決する。",
      "更新エラーの原因を確認し、必要に応じて復元ポイントやログを確認する。",
      "そのまま放置してユーザーが翌日対応するように依頼する。"
    ],
    correct: 1,
    explanation: "正解：更新エラーは原因を確認し、復元やログ解析で安全に復旧する必要があります。"
  },
  {
    id: "malware-alert",
    equipmentId: "pc",
    category: "SECURITY",
    title: "ウイルス検知の警告",
    description: "社員のPCでマルウェア検知ソフトが不審なプロセスを検出しました。",
    warning: 16,
    severity: 1.9,
    penalty: 12,
    repairCost: 16000,
    options: [
      "検知を無視して作業を続ける。",
      "該当PCを隔離し、詳細スキャンと影響調査を実行する。",
      "検知したソフトをそのまま削除する。"
    ],
    correct: 1,
    explanation: "正解：マルウェア検知時は影響範囲を調べながら隔離とスキャンを行い、安全に対応します。"
  },
  {
    id: "file-encrypt",
    equipmentId: "pc",
    category: "SECURITY",
    title: "ファイルが暗号化されて開けない",
    description: "特定ユーザーのPCでファイル名が変更され、開こうとするとパスワードを要求されます。",
    warning: 20,
    severity: 2.2,
    penalty: 14,
    repairCost: 18000,
    options: [
      "ファイル名だけ元に戻して開く。",
      "感染の兆候として、影響ファイルを特定し、隔離・復旧手順を検討する。",
      "その場でPCを初期化する。"
    ],
    correct: 1,
    explanation: "正解：暗号化症状はランサムウェアの兆候であるため、影響範囲を調べて適切に隔離・復旧します。"
  },
  {
    id: "email-attachment",
    equipmentId: "mail",
    category: "SOFTWARE",
    title: "添付ファイルが開けない",
    description: "業務用メールに添付された見積書が、特定の社員のPCで開けないと報告がありました。",
    warning: 22,
    severity: 1.1,
    penalty: 6,
    repairCost: 8000,
    options: [
      "ファイル形式を変換して再送させる。",
      "PCの関連付けとセキュリティ設定を確認し、必要なら専用アプリを導入する。",
      "メールサーバーを再起動する。"
    ],
    correct: 1,
    explanation: "正解：添付ファイルが開けない場合は形式・関連付け・セキュリティ設定を確認し、適切なアプリを用意します。"
  },
  {
    id: "screen-freeze",
    equipmentId: "pc",
    category: "HARDWARE",
    title: "画面がフリーズする",
    description: "社員のPCが頻繁に固まり、キーボードやマウス操作に応答しません。",
    warning: 19,
    severity: 1.4,
    penalty: 9,
    repairCost: 10000,
    options: [
      "強制終了して作業を再開させる。",
      "稼働中のプロセスとメモリ状態を確認し、原因を特定する。",
      "全社員に同じPCモデルの利用を停止させる。"
    ],
    correct: 1,
    explanation: "正解：フリーズ原因を特定するためにプロセスやメモリを確認し、安易な強制終了は避けます。"
  },
  {
    id: "profile-corrupt",
    equipmentId: "pc",
    category: "SOFTWARE",
    title: "ユーザープロファイルが破損している",
    description: "社員がログインするとプロファイルが読み込めないと表示され、デスクトップが表示されません。",
    warning: 21,
    severity: 1.7,
    penalty: 11,
    repairCost: 14000,
    options: [
      "新しいアカウントを即座に作成し、データを移行する。",
      "破損したプロファイルを修復し、必要なデータをバックアップから復元する。",
      "PCを放置して翌日に再起動させる。"
    ],
    correct: 1,
    explanation: "正解：プロファイル破損は修復とデータ復元で安全に対応し、安易なアカウント作成はデータ損失につながります。"
  },
  {
    id: "bluetooth-failure",
    equipmentId: "pc",
    category: "HARDWARE",
    title: "Bluetoothが接続できない",
    description: "ワイヤレスデバイスがPCに接続されず、会議準備が遅れています。",
    warning: 23,
    severity: 1.1,
    penalty: 7,
    repairCost: 9000,
    options: [
      "別のPCに機器を接続させる。",
      "Bluetooth設定とドライバーを確認し、再ペアリングを試みる。",
      "Bluetoothを無効化して作業を続ける。"
    ],
    correct: 1,
    explanation: "正解：接続問題はドライバーと設定を確認し、再ペアリングで解決を試みます。"
  },
  {
    id: "printer-paper-jam",
    equipmentId: "printer",
    category: "HARDWARE",
    title: "紙詰まりが頻発している",
    description: "複合機で用紙詰まりが頻発し、印刷が中断されています。",
    warning: 25,
    severity: 1.0,
    penalty: 7,
    repairCost: 7000,
    options: [
      "用紙を無理に引き抜いて、少し手を加えて再印刷する。",
      "正しい用紙サイズと給紙トレイの状態を確認し、原因を取り除く。",
      "紙詰まりのたびに複合機を再起動する。"
    ],
    correct: 1,
    explanation: "正解：紙詰まりは用紙サイズや給紙経路を確認して正しく取り除くことが重要です。"
  },
  {
    id: "low-toner",
    equipmentId: "printer",
    category: "HARDWARE",
    title: "トナー残量が少ない",
    description: "印刷品質が落ちており、トナー残量が極端に少ないと表示されています。",
    warning: 28,
    severity: 0.9,
    penalty: 6,
    repairCost: 6000,
    options: [
      "品質が落ちてもそのまま印刷を続ける。",
      "予備トナーを確認し、交換や補充を案内する。",
      "トナー残量を無視してクリーニングだけ実行する。"
    ],
    correct: 1,
    explanation: "正解：印刷品質低下はトナー残量の問題が多いため、交換と在庫確認を行います。"
  },
  {
    id: "wrong-printer",
    equipmentId: "printer",
    category: "NETWORK",
    title: "別の複合機に印刷されている",
    description: "ユーザーの印刷指示が別の複合機に送信されてしまい、資料が届きません。",
    warning: 22,
    severity: 1.1,
    penalty: 8,
    repairCost: 9000,
    options: [
      "ユーザーに別複合機でプリントするよう指示する。",
      "プリンタープロファイルと接続先を確認し、正しい出力先を指定する。",
      "全員のプリンタードライバーを削除する。"
    ],
    correct: 1,
    explanation: "正解：出力先の設定を確認し、正しい複合機に送信されるよう修正します。"
  },
  {
    id: "scan-failure",
    equipmentId: "printer",
    category: "HARDWARE",
    title: "スキャン機能が動かない",
    description: "社内文書のスキャン操作ができず、スキャン機能のエラーが表示されています。",
    warning: 20,
    severity: 1.2,
    penalty: 8,
    repairCost: 8500,
    options: [
      "スキャンソフトを再インストールする。",
      "ケーブル接続とスキャンサービスの稼働状態を確認する。",
      "別のPCでスキャン手順を変える。"
    ],
    correct: 1,
    explanation: "正解：スキャンは接続とサービス稼働を確認し、必要なら設定修正を優先します。"
  },
  {
    id: "color-shift",
    equipmentId: "printer",
    category: "HARDWARE",
    title: "印刷色が正しくない",
    description: "資料の印刷で色が不自然に変わってしまい、見た目に問題があります。",
    warning: 26,
    severity: 1.0,
    penalty: 7,
    repairCost: 8000,
    options: [
      "そのまま印刷し、後で品質確認する。",
      "トナー残量とカラープロファイル、用紙設定を確認する。",
      "プリンターの色設定を工場出荷状態に戻す。"
    ],
    correct: 1,
    explanation: "正解：色ずれは設定やトナー状態が原因のことが多いので、まず構成を確認します。"
  },
  {
    id: "network-printer",
    equipmentId: "printer",
    category: "NETWORK",
    title: "ネットワークプリンターにアクセスできない",
    description: "複合機がネットワーク上で見えなくなり、印刷できなくなっています。",
    warning: 23,
    severity: 1.4,
    penalty: 9,
    repairCost: 12000,
    options: [
      "複合機を放置して自然復旧を待つ。",
      "ネットワーク接続とIPアドレス、ファイアウォール設定を確認する。",
      "複合機を工場出荷に戻す。"
    ],
    correct: 1,
    explanation: "正解：ネットワークプリンターは接続とIP/ファイアウォール設定を確認して復旧します。"
  },
  {
    id: "print-queue",
    equipmentId: "printer",
    category: "SOFTWARE",
    title: "印刷ジョブが残る",
    description: "プリント指示を出してもジョブがキューに残り、印刷が開始されません。",
    warning: 24,
    severity: 1.3,
    penalty: 9,
    repairCost: 10000,
    options: [
      "プリントキューをそのままにして再起動する。",
      "該当ジョブを削除し、ドライバーとキューサービスを確認する。",
      "別のユーザーに印刷を依頼する。"
    ],
    correct: 1,
    explanation: "正解：印刷キューの問題はジョブ削除とドライバー確認で解決することが多いです。"
  },
  {
    id: "driver-update",
    equipmentId: "printer",
    category: "SOFTWARE",
    title: "複合機ドライバーの更新に失敗",
    description: "複合機ドライバー更新後、印刷機能が不安定になりました。",
    warning: 19,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "最新版でなくても問題ないのでそのまま使う。",
      "更新ログを確認し、必要ならロールバックまたは再インストールを行う。",
      "複合機を交換する。"
    ],
    correct: 1,
    explanation: "正解：ドライバー更新失敗はログを確認してロールバックや再インストールで対処します。"
  },
  {
    id: "duplex-failure",
    equipmentId: "printer",
    category: "HARDWARE",
    title: "両面印刷が正常に動作しない",
    description: "両面印刷を指定しても片面だけ印刷されます。",
    warning: 21,
    severity: 1.1,
    penalty: 7,
    repairCost: 9000,
    options: [
      "片面印刷で対応する。",
      "両面印刷設定と給紙機構を確認する。",
      "ドライバーを削除して再起動する。"
    ],
    correct: 1,
    explanation: "正解：両面印刷問題は設定と機構を確認して解決します。"
  },
  {
    id: "wifi-dropout",
    equipmentId: "wifi",
    category: "NETWORK",
    title: "Wi-Fi接続が断続的に切れる",
    description: "複数の社員が無線LANに接続しても接続が途切れると訴えています。",
    warning: 20,
    severity: 1.4,
    penalty: 9,
    repairCost: 11000,
    options: [
      "一部の端末だけ再起動させる。",
      "アクセスポイントの負荷と電波状況を確認し、干渉源を特定する。",
      "全社員にイーサネット接続へ切り替えるよう指示する。"
    ],
    correct: 1,
    explanation: "正解：断続的な切断はAP負荷や電波干渉の可能性が高いため、状況を調査します。"
  },
  {
    id: "dhcp-failure",
    equipmentId: "wifi",
    category: "NETWORK",
    title: "IPアドレスが取得できない",
    description: "Wi-Fiに接続されたPCがIPアドレスを取得できず、ネットに出られません。",
    warning: 22,
    severity: 1.5,
    penalty: 10,
    repairCost: 12000,
    options: [
      "PCのネットワーク設定を初期化する。",
      "DHCPサーバーとAPの設定・接続状態を確認する。",
      "正しいIPアドレスを手動で割り当てる。"
    ],
    correct: 1,
    explanation: "正解：IP取得問題はDHCPサーバーやAP設定を確認し、手動割り当ては一時措置です。"
  },
  {
    id: "slow-speed",
    equipmentId: "wifi",
    category: "NETWORK",
    title: "Wi-Fiの回線速度が極端に遅い",
    description: "動画会議ができないほど無線LANの速度が遅くなっています。",
    warning: 24,
    severity: 1.3,
    penalty: 9,
    repairCost: 10000,
    options: [
      "ユーザーに回線を使わないように伝える。",
      "無線チャネル、アクセスポイント負荷、隣接する干渉源を確認する。",
      "Wi-Fiアクセスポイントをすべて交換する。"
    ],
    correct: 1,
    explanation: "正解：速度低下はチャンネル干渉やAP負荷が原因になるため、環境を調査します。"
  },
  {
    id: "ssid-conflict",
    equipmentId: "wifi",
    category: "NETWORK",
    title: "複数のWi-Fiが同じSSIDを使用している",
    description: "社内と別部署の無線が同じSSIDになっており、接続が不安定です。",
    warning: 23,
    severity: 1.2,
    penalty: 8,
    repairCost: 9500,
    options: [
      "SSIDをそのままにして様子を見る。",
      "社内Wi-FiのSSIDとチャネルを整理し、混線を防ぐ。",
      "全端末の無線設定を削除する。"
    ],
    correct: 1,
    explanation: "正解：SSID混在は混線の原因となるため、適切なSSID・チャネル管理で改善します。"
  },
  {
    id: "guest-portal",
    equipmentId: "portal",
    category: "NETWORK",
    title: "ゲストWi-Fiの認証ページが表示されない",
    description: "来客用の無線LANでログイン画面が出ず、接続できません。",
    warning: 21,
    severity: 1.3,
    penalty: 8,
    repairCost: 10500,
    options: [
      "来客に通常の社内Wi-Fiを使わせる。",
      "ゲストポータルの設定と認証サーバーを確認し、必要なら再起動する。",
      "ゲスト接続を無効にする。"
    ],
    correct: 1,
    explanation: "正解：認証ポータルは設定とサーバー状態を確認し、来客接続の安定化を図ります。"
  },
  {
    id: "wifi-auth",
    equipmentId: "wifi",
    category: "NETWORK",
    title: "Wi-Fi認証に失敗するPCがある",
    description: "特定のPCだけWi-Fiパスワードを正しく入力しても接続できません。",
    warning: 20,
    severity: 1.4,
    penalty: 9,
    repairCost: 10500,
    options: [
      "Wi-Fiパスワードを再設定してもらう。",
      "端末の認証証明書・設定を確認し、無線設定を再構成する。",
      "すべてのユーザーのパスワードを変更する。"
    ],
    correct: 1,
    explanation: "正解：特定端末の認証失敗は端末設定か証明書の問題が多いため、再構成して対応します。"
  },
  {
    id: "ap-overheating",
    equipmentId: "wifi",
    category: "HARDWARE",
    title: "Wi-Fiアクセスポイントが熱を持っている",
    description: "無線機器の動作温度が高くなり、接続が不安定になっているとの報告です。",
    warning: 26,
    severity: 1.2,
    penalty: 8,
    repairCost: 9500,
    options: [
      "アクセスポイントを冷却せずに使い続ける。",
      "設置場所の通気を改善し、故障の前に機器の交換を検討する。",
      "全社のWi-Fiを停止する。"
    ],
    correct: 1,
    explanation: "正解：APの過熱は故障の前兆なので、通気改善と早期交換を検討します。"
  },
  {
    id: "band-selection",
    equipmentId: "wifi",
    category: "NETWORK",
    title: "2.4GHzと5GHzの切り替え問題",
    description: "一部PCが2.4GHzにしか接続できず、速度が低くなっています。",
    warning: 23,
    severity: 1.1,
    penalty: 7,
    repairCost: 9000,
    options: [
      "5GHzを使わない方針に変更する。",
      "端末とアクセスポイントのバンド設定を確認し、適切に切り替えられるよう調整する。",
      "全社員に有線接続を強制する。"
    ],
    correct: 1,
    explanation: "正解：利用バンドの問題は設定と対応機種を確認して解決します。"
  },
  {
    id: "rogue-ap",
    equipmentId: "wifi",
    category: "SECURITY",
    title: "不審なアクセスポイントが検出された",
    description: "社内Wi-Fiネットワーク上に許可されていないアクセスポイントが検出されました。",
    warning: 25,
    severity: 2.0,
    penalty: 13,
    repairCost: 16000,
    options: [
      "アクセスポイントを無視して通常の運用を続ける。",
      "不審なAPを隔離し、電波源と接続機器を特定する。",
      "社内Wi-Fiをすべて停止する。"
    ],
    correct: 1,
    explanation: "正解：不審APはセキュリティリスクのため、隔離と特定を優先します。"
  },
  {
    id: "vpn-issue",
    equipmentId: "vpn",
    category: "NETWORK",
    title: "VPN経由で社内に接続できない",
    description: "リモートワーク中の社員がVPN経由で社内システムに接続できません。",
    warning: 22,
    severity: 1.7,
    penalty: 11,
    repairCost: 14000,
    options: [
      "VPNを使わずにクラウドサービスで代替する。",
      "VPNトンネルと認証情報、証明書の状態を確認する。",
      "リモートワーカーに別のプロバイダを契約させる。"
    ],
    correct: 1,
    explanation: "正解：VPN接続問題はトンネル・認証・証明書を確認して復旧します。"
  },
  {
    id: "dns-failure",
    equipmentId: "network",
    category: "NETWORK",
    title: "社内DNSが名前解決できない",
    description: "社内サービスのドメイン名が解決できず、業務アプリがエラーになります。",
    warning: 18,
    severity: 1.8,
    penalty: 12,
    repairCost: 15000,
    options: [
      "クライアント側でHostsファイルを編集する。",
      "DNSサーバーの状態と設定を確認し、必要なら冗長構成を復旧する。",
      "社外DNSを使うように案内する。"
    ],
    correct: 1,
    explanation: "正解：DNS障害はサーバー構成やサービス状態を確認して根本原因を解決します。"
  },
  {
    id: "firewall-block",
    equipmentId: "network",
    category: "NETWORK",
    title: "外部サービスへの接続がファイアウォールで遮断される",
    description: "クラウドサービスへのアクセスが急に遮断され、業務に支障が出ています。",
    warning: 20,
    severity: 1.9,
    penalty: 13,
    repairCost: 16000,
    options: [
      "ファイアウォールのすべてのルールを無効化する。",
      "遮断されたトラフィックを確認し、必要なサービスだけ安全に許可する。",
      "アクセス先をVPN経由に切り替える。"
    ],
    correct: 1,
    explanation: "正解：遮断原因を特定し、必要な通信のみ安全に許可する運用が求められます。"
  },
  {
    id: "switch-failure",
    equipmentId: "network",
    category: "HARDWARE",
    title: "ネットワークスイッチが一部故障している",
    description: "一部セグメントで接続できない機器があり、スイッチ故障が疑われています。",
    warning: 17,
    severity: 2.1,
    penalty: 14,
    repairCost: 17000,
    options: [
      "影響が出ている機器だけ交換する。",
      "障害箇所とポートを特定し、必要ならスイッチを交換または再設定する。",
      "全社ネットワークを停止して調査する。"
    ],
    correct: 1,
    explanation: "正解：影響範囲を把握し、故障ポートを切り分けて復旧するのが適切です。"
  },
  {
    id: "ip-conflict",
    equipmentId: "network",
    category: "NETWORK",
    title: "IPアドレスの競合が発生している",
    description: "同じIPアドレスを持つ機器が複数検出され、通信が不安定です。",
    warning: 22,
    severity: 1.6,
    penalty: 11,
    repairCost: 13000,
    options: [
      "影響が小さいのでそのままにする。",
      "競合している機器を特定し、DHCP範囲と固定IPを見直す。",
      "全端末に同じIPを割り当てる。"
    ],
    correct: 1,
    explanation: "正解：IP競合は根本的に範囲や固定割当を見直して解決します。"
  },
  {
    id: "bandwidth-spike",
    equipmentId: "network",
    category: "NETWORK",
    title: "帯域使用率が急上昇している",
    description: "ネットワークの帯域が急に逼迫し、業務アプリの応答が悪くなりました。",
    warning: 19,
    severity: 1.5,
    penalty: 10,
    repairCost: 13000,
    options: [
      "帯域制限を解除して再度試す。",
      "トラフィックの発生源を確認し、不要な通信を制限する。",
      "全社のインターネット回線を増やす。"
    ],
    correct: 1,
    explanation: "正解：急激な帯域使用は発生源を特定し、無駄な通信を制限することが先決です。"
  },
  {
    id: "external-connection",
    equipmentId: "network",
    category: "NETWORK",
    title: "外部回線が不安定でクラウドに接続できない",
    description: "インターネット回線が断続的に切れ、クラウドサービスが使えません。",
    warning: 18,
    severity: 2.0,
    penalty: 13,
    repairCost: 15000,
    options: [
      "外部回線業者へすぐに連絡して詳細を確認する。",
      "社内ネットワーク全体を再起動する。",
      "社外サービスを諦めて社内作業に切り替える。"
    ],
    correct: 0,
    explanation: "正解：外部回線の不安定さは通信事業者と連携して原因を調査する必要があります。"
  },
  {
    id: "proxy-error",
    equipmentId: "network",
    category: "NETWORK",
    title: "プロキシ経由で通信できない",
    description: "社内ではプロキシサーバー経由のみでインターネットアクセスが許可されており、接続エラーが発生しています。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 11000,
    options: [
      "プロキシを使わず直接接続するように指示する。",
      "プロキシサーバーの稼働状況と証明書を確認する。",
      "すべてのブラウザをアンインストールする。"
    ],
    correct: 1,
    explanation: "正解：プロキシ経由障害はサーバー状態と証明書を確認して復旧します。"
  },
  {
    id: "qos-issue",
    equipmentId: "network",
    category: "NETWORK",
    title: "音声会議の通信品質が悪い",
    description: "社内の音声会議で遅延や途切れが発生しています。",
    warning: 23,
    severity: 1.5,
    penalty: 10,
    repairCost: 12000,
    options: [
      "会議を中断して後で行う。",
      "QoS設定とネットワーク負荷を確認し、必要なトラフィックを優先する。",
      "音声会議を別のサービスに切り替える。"
    ],
    correct: 1,
    explanation: "正解：品質問題はQoS設定と負荷管理で改善を試みるべきです。"
  },
  {
    id: "backup-failure",
    equipmentId: "backup",
    category: "BACKUP",
    title: "夜間バックアップが失敗した",
    description: "昨夜のサーバーバックアップが失敗し、最新データの復旧が危ぶまれています。",
    warning: 20,
    severity: 1.8,
    penalty: 12,
    repairCost: 15000,
    options: [
      "バックアップを翌日に再実行する。",
      "失敗原因を確認し、バックアップ設定とストレージの空き容量を確認する。",
      "バックアップを停止して新しい方法を検討する。"
    ],
    correct: 1,
    explanation: "正解：バックアップ失敗は原因調査と設定確認で再実行する必要があります。"
  },
  {
    id: "storage-full",
    equipmentId: "server",
    category: "BACKUP",
    title: "サーバーの保存領域が満杯に近い",
    description: "ファイルサーバーの空き容量が少なく、保存処理が失敗しはじめています。",
    warning: 21,
    severity: 1.7,
    penalty: 11,
    repairCost: 14000,
    options: [
      "不要なファイルをそのままにしておく。",
      "不要データの整理と古いバックアップの整理を検討する。",
      "すぐにサーバーのディスクを交換する。"
    ],
    correct: 1,
    explanation: "正解：容量逼迫は不要データ整理とバックアップ管理で対応し、即座の交換は最終手段です。"
  },
  {
    id: "service-down",
    equipmentId: "server",
    category: "ACCESS",
    title: "ファイル共有サービスが停止している",
    description: "社員が共有サーバーにアクセスできず、ファイル管理サービスが停止しているようです。",
    warning: 19,
    severity: 2.0,
    penalty: 13,
    repairCost: 16000,
    options: [
      "サービスをそのままにして待機する。",
      "サービスの状態を確認し、ログを調査して再起動や復旧を行う。",
      "手動でファイルを各担当者に配布する。"
    ],
    correct: 1,
    explanation: "正解：停止サービスはログ確認と再起動で復旧を試み、原因を特定します。"
  },
  {
    id: "account-expire",
    equipmentId: "server",
    category: "ACCESS",
    title: "アカウントの有効期限切れでアクセスできない",
    description: "営業担当がサーバーにログインできず、アカウントの有効期限切れが原因と疑われます。",
    warning: 23,
    severity: 1.3,
    penalty: 8,
    repairCost: 9000,
    options: [
      "期限切れを無視してアクセスを許可する。",
      "アカウントの利用状況を確認し、必要に応じて期限延長や再発行を行う。",
      "別のアカウントですぐにログインさせる。"
    ],
    correct: 1,
    explanation: "正解：期限切れアカウントは利用状況を確認し、適切に延長または再発行します。"
  },
  {
    id: "file-lock",
    equipmentId: "server",
    category: "ACCESS",
    title: "共有ファイルがロックされたまま開けない",
    description: "重要資料が他者のロック状態のままで、編集できないと報告されています。",
    warning: 24,
    severity: 1.4,
    penalty: 9,
    repairCost: 10500,
    options: [
      "ロックを強制解除してすぐに編集する。",
      "ロック状況と担当者を確認し、正しい手順で解除する。",
      "ファイルをコピーして別名で保存する。"
    ],
    correct: 1,
    explanation: "正解：ロック解除は状況確認と適切な手順で行い、強制解除は最終手段です。"
  },
  {
    id: "patch-failure",
    equipmentId: "server",
    category: "SOFTWARE",
    title: "サーバーパッチ適用に失敗した",
    description: "定例パッチ適用後、サーバーの一部サービスが起動しなくなりました。",
    warning: 18,
    severity: 2.1,
    penalty: 13,
    repairCost: 17000,
    options: [
      "適用を無視し、次回のパッチまで待つ。",
      "影響のあるサービスを特定し、必要であればロールバックや修正パッチを検討する。",
      "サーバーそのものを新しい機種に置き換える。"
    ],
    correct: 1,
    explanation: "正解：パッチ失敗は影響範囲を特定し、ロールバックや修正で対応します。"
  },
  {
    id: "database-error",
    equipmentId: "server",
    category: "SOFTWARE",
    title: "データベースが応答しない",
    description: "業務システムがデータベースに接続できず、アプリケーションが停止しています。",
    warning: 17,
    severity: 2.3,
    penalty: 14,
    repairCost: 18000,
    options: [
      "データベースを再起動してすべて解決する。",
      "ログを確認し、接続設定とリソース状況を診断する。",
      "データベースを削除して再構築する。"
    ],
    correct: 1,
    explanation: "正解：応答停止はログと設定を確認し、安定した復旧を目指す必要があります。"
  },
  {
    id: "shared-drive-unreachable",
    equipmentId: "server",
    category: "ACCESS",
    title: "共有ドライブがマウントできない",
    description: "複数ユーザーが共有ドライブにアクセスできず、マウントエラーが出ています。",
    warning: 22,
    severity: 1.9,
    penalty: 13,
    repairCost: 15000,
    options: [
      "各ユーザーのPCを再起動するよう指示する。",
      "共有ドライブの設定と接続状態を確認し、サーバー側のサービスを復旧する。",
      "別の共有ドライブを新しく作る。"
    ],
    correct: 1,
    explanation: "正解：共有ドライブ障害はサーバー設定と接続を確認して復旧します。"
  },
  {
    id: "mic-issue",
    equipmentId: "meeting",
    category: "HARDWARE",
    title: "会議室マイクの音声が届かない",
    description: "オンライン会議で会議室の発言が相手側に聞こえないと報告されています。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 9500,
    options: [
      "マイクをそのまま使い続ける。",
      "マイクの接続とミュート設定、音量を確認する。",
      "会議を延期する。"
    ],
    correct: 1,
    explanation: "正解：音声が届かない場合は接続とミュート設定を確認することが基本です。"
  },
  {
    id: "camera-off",
    equipmentId: "meeting",
    category: "HARDWARE",
    title: "会議室カメラが映らない",
    description: "カメラをオンにしても映像が送信されず、リモート参加者が見えません。",
    warning: 23,
    severity: 1.2,
    penalty: 8,
    repairCost: 9000,
    options: [
      "カメラを交換せずに会議を進行する。",
      "カメラの電源と接続、ドライバーを確認する。",
      "公開用カメラに切り替える。"
    ],
    correct: 1,
    explanation: "正解：まず機器接続とドライバーを確認し、正常な映像出力を試みます。"
  },
  {
    id: "conference-software",
    equipmentId: "meeting",
    category: "SOFTWARE",
    title: "会議システムが参加できない",
    description: "会議室PCでオンライン会議システムにログインできない問題が発生しています。",
    warning: 21,
    severity: 1.6,
    penalty: 10,
    repairCost: 12000,
    options: [
      "別の会議システムを使う。",
      "ログイン情報とネットワーク接続、ソフトウェアの状態を確認する。",
      "会議を中止する。"
    ],
    correct: 1,
    explanation: "正解：会議システム問題はログイン・接続・ソフト状態を確認し、原因を特定します。"
  },
  {
    id: "room-schedule",
    equipmentId: "meeting",
    category: "POLICY",
    title: "会議室予約と現状が一致しない",
    description: "予約された会議室が別の利用者に使われており、会議進行に支障が出ています。",
    warning: 26,
    severity: 1.1,
    penalty: 7,
    repairCost: 8500,
    options: [
      "現地で利用者同士が話し合って解決させる。",
      "予約管理システムと現状を確認し、調整ルールを明確にする。",
      "会議室を増やす。"
    ],
    correct: 1,
    explanation: "正解：予約トラブルは現状把握とルール整備で再発防止を図るのが正しい対応です。"
  },
  {
    id: "presentation-file",
    equipmentId: "meeting",
    category: "SOFTWARE",
    title: "発表資料が開けない",
    description: "資料を表示しようとすると、「ファイルが見つかりません」とエラーが出ます。",
    warning: 22,
    severity: 1.4,
    penalty: 9,
    repairCost: 10000,
    options: [
      "ファイルを別の形式に変換してあきらめる。",
      "ファイルパスとアクセス権を確認し、正しいファイルを復元する。",
      "新しい資料をその場で作成する。"
    ],
    correct: 1,
    explanation: "正解：資料ファイル障害はパスとアクセス権を確認し、正しいファイルを復元します。"
  },
  {
    id: "remote-guest",
    equipmentId: "meeting",
    category: "NETWORK",
    title: "リモート参加者の音声が届かない",
    description: "会議室からリモート参加者に音声が届かず、発言が伝わりません。",
    warning: 21,
    severity: 1.5,
    penalty: 10,
    repairCost: 11500,
    options: [
      "会議参加者に直接伝える。",
      "音声入力・出力デバイスとネットワーク設定を確認する。",
      "リモート参加者のマイクをミュートにする。"
    ],
    correct: 1,
    explanation: "正解：伝送音声問題はデバイス・設定・ネットワークを確認して修正します。"
  },
  {
    id: "projector-lens",
    equipmentId: "meeting",
    category: "HARDWARE",
    title: "プロジェクターレンズが汚れている",
    description: "会議室のプロジェクター映像がぼやけており、レンズ汚れが疑われます。",
    warning: 27,
    severity: 0.9,
    penalty: 6,
    repairCost: 6500,
    options: [
      "そのまま映像を使う。",
      "安全な手順でレンズを清掃し、映像が正常か確認する。",
      "プロジェクターを別の部屋に移動する。"
    ],
    correct: 1,
    explanation: "正解：機器の映像品質問題は適切な清掃と確認で改善します。"
  },
  {
    id: "speaker-sound",
    equipmentId: "meeting",
    category: "HARDWARE",
    title: "会議室のスピーカーの音量が小さい",
    description: "会議室の音声が小さくて聞き取りにくいと参加者から苦情が来ています。",
    warning: 23,
    severity: 1.0,
    penalty: 7,
    repairCost: 8500,
    options: [
      "音量を最大にして使う。",
      "スピーカー接続と音量設定、ドライバーを確認する。",
      "代替の外部スピーカーをすぐに購入する。"
    ],
    correct: 1,
    explanation: "正解：音量問題は接続と設定を確認し、必要なら適切に調整します。"
  },
  {
    id: "whiteboard",
    equipmentId: "meeting",
    category: "HARDWARE",
    title: "電子ホワイトボードがタッチに反応しない",
    description: "会議室の電子ボードがタッチ操作を受け付けず、会議進行に影響が出ています。",
    warning: 24,
    severity: 1.5,
    penalty: 10,
    repairCost: 11000,
    options: [
      "手動でホワイトボードを交換する。",
      "電源と接続、タッチキャリブレーションを確認する。",
      "会議をホワイトボードなしで続行する。"
    ],
    correct: 1,
    explanation: "正解：反応不良はハードウェア接続とキャリブレーションを確認して解決します。"
  },
  {
    id: "office-dhcp-apipa",
    equipmentId: "wifi",
    category: "NETWORK",
    title: "PCに169.254から始まるIPアドレスが割り当てられている",
    description: "社員PCがネットワークに接続できず、IPアドレスが169.254.x.xになっています。",
    warning: 24,
    severity: 1.4,
    penalty: 9,
    repairCost: 10500,
    learningTags: ["DHCP", "IPアドレス", "ネットワーク"],
    examPoint: "169.254.x.xはAPIPAの代表例です。DHCPからIPアドレスを取得できていない可能性を考えます。",
    options: ["DHCPサーバーやWi-Fi接続、LAN設定を確認する。", "PCの壁紙を初期化して再起動する。", "全社員のアカウントを削除する。"],
    correct: 0,
    explanation: "正解：169.254.x.xはDHCPからIPアドレスを取得できないときに割り当てられることがあります。DHCPと接続状態を確認します。"
  },
  {
    id: "office-mfa-reset",
    equipmentId: "security",
    category: "ACCESS",
    title: "多要素認証の再設定依頼",
    description: "社員からスマートフォンを機種変更したため、多要素認証を再設定したいと依頼がありました。",
    warning: 26,
    severity: 1.3,
    penalty: 8,
    repairCost: 9500,
    learningTags: ["MFA", "本人確認", "認証"],
    examPoint: "多要素認証の再設定では、本人確認を行ってから再登録します。なりすまし対策が重要です。",
    options: ["依頼メールだけを信じて、すぐにMFAを解除する。", "本人確認を行い、手順に従ってMFAを再登録する。", "全社員のMFAを一時的に無効化する。"],
    correct: 1,
    explanation: "正解：MFAの再設定は本人確認を行い、正式な手順で再登録します。安易な解除は不正アクセスにつながります。"
  },
  {
    id: "office-printer-confidential",
    equipmentId: "printer",
    category: "SECURITY",
    title: "機密書類が複合機に置き忘れられている",
    description: "複合機の排紙トレイに、顧客情報が入った印刷物が置き忘れられています。",
    warning: 18,
    severity: 1.6,
    penalty: 11,
    repairCost: 12000,
    learningTags: ["情報漏えい", "クリアデスク", "機密性"],
    examPoint: "機密情報は放置せず、持ち主確認、回収、印刷ルールの見直しで漏えいを防ぎます。",
    options: ["そのまま置いておき、持ち主が取りに来るのを待つ。", "内容を確認して社内チャットに写真を投稿する。", "管理者へ報告し、持ち主確認と回収、印刷ルールの見直しを行う。"],
    correct: 2,
    explanation: "正解：機密書類の置き忘れは情報漏えいリスクです。管理者へ報告し、適切に回収・再発防止します。"
  },
  {
    id: "office-shared-folder-retention",
    equipmentId: "server",
    category: "MANAGEMENT",
    title: "共有フォルダに古い個人情報ファイルが残っている",
    description: "共有フォルダに、保存期限を過ぎた顧客情報ファイルが大量に残っていることがわかりました。",
    warning: 30,
    severity: 1.5,
    penalty: 10,
    repairCost: 11000,
    learningTags: ["個人情報", "保存期間", "データ管理"],
    examPoint: "個人情報は利用目的と保存期間を意識し、不要になったデータは規程に従って削除します。",
    options: ["保存期間と規程を確認し、不要データを適切に削除する。", "念のため永久保存する。", "容量を空けるため、確認せず全ファイルを削除する。"],
    correct: 0,
    explanation: "正解：個人情報は保存期間や社内規程に従って管理します。不要データの放置も無断削除も問題になります。"
  },];
