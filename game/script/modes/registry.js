// ===== ゲームモードレジストリ =====
// 全モードの定義と現在のモード取得関数

// 他の専門モード（セキュリティ、インフラ、スタートアップ）へ移譲されたインシデントのID
const delegatedIncidentIds = [
  // セキュリティ
  "phishing", "endpoint-scan", "malware-alert", "file-encrypt", "login-alert", 
  "data-leak", "security-audit", "password-sharing", "usb-policy", "insecure-site", 
  "suspicious-device", "rogue-ap",
  // インフラ
  "network-wide", "dns-failure", "switch-failure", "bandwidth-spike", "external-connection", 
  "deleted-file", "storage-full", "shared-drive-unreachable", 
  "service-down", "patch-failure", "ap-overheating",
  // スタートアップ
  "server-permission", "password-expire", "account-expire", "file-lock", 
  "software-update", "scan-failure", "driver-update", "firewall-block", "proxy-error", 
  "ip-conflict", "dhcp-failure", "qos-issue", "database-error"
];

// 一般企業オフィスモード用には、他の専門モードに移譲されなかった身近なインシデント（PC、プリンタ、Wi-Fi、会議室の問題など）を割り当てる
const filteredOfficeIncidents = officeIncidents.filter(i => !delegatedIncidentIds.includes(i.id));

const gameModes = [
  {
    id: "office",
    name: "一般企業",
    subtitle: "総務・情報システム担当",
    description: "日常業務で起きるITトラブルに対応。PC、ネットワーク、アカウント、ファイル共有など資格試験の基礎を学びます。",
    icon: "🏢",
    accentColor: "#42d7ef",
    floorEyebrow: "NORMAL MODE / GENERAL OFFICE",
    floorTitle: "第1営業フロア",
    logLabel: "オフィス",
    equipment: officeEquipment,
    rooms: officeRooms,
    incidents: balanceIncidentsByEquipment(filteredOfficeIncidents, officeEquipment, "office")
  },
  {
    id: "security",
    name: "セキュリティ運用会社",
    subtitle: "SOC・CSIRTアナリスト",
    description: "SOC監視、ログ分析、マルウェア、不正アクセス対応を通して、情報セキュリティの考え方を学びます。",
    icon: "🛡️",
    accentColor: "#ff6b7a",
    floorEyebrow: "SECURITY MODE / SOC CENTER",
    floorTitle: "SOCオペレーションルーム",
    logLabel: "SOCセンター",
    equipment: securityEquipment,
    rooms: securityRooms,
    incidents: balanceIncidentsByEquipment(securityIncidents, securityEquipment, "security")
  },
  {
    id: "infra",
    name: "データセンター運用会社",
    subtitle: "インフラ・データセンターエンジニア",
    description: "サーバー、ネットワーク、ストレージ、電源、冷却、監視など、止めないためのインフラ運用を学びます。",
    icon: "🗄️",
    accentColor: "#8ee87a",
    floorEyebrow: "INFRA MODE / DATA CENTER",
    floorTitle: "データセンター棟",
    logLabel: "データセンター",
    equipment: infraEquipment,
    rooms: infraRooms,
    incidents: balanceIncidentsByEquipment(infraIncidents, infraEquipment, "infra")
  },
  {
    id: "startup",
    name: "Webサービス運営会社",
    subtitle: "SRE・Webサービス運用担当",
    description: "Webアプリ、API、DB、クラウド、CI/CD、外部サービス連携など、Web運用の障害対応を学びます。",
    icon: "💻",
    accentColor: "#b56aff",
    floorEyebrow: "WEB SERVICE MODE / CLOUD PLATFORM",
    floorTitle: "Webサービス運用フロア",
    logLabel: "Webサービス",
    equipment: startupEquipment,
    rooms: startupRooms,
    incidents: balanceIncidentsByEquipment(startupIncidents, startupEquipment, "startup")
  }
];

/** 現在選択中のモード設定を返す */
function getCurrentMode() {
  return gameModes.find(m => m.id === state.gameMode) || gameModes[0];
}

function getDifficultyEquipmentCount(baseEquipment) {
  const configuredCount = getDifficulty().equipmentCount;
  return Number.isFinite(configuredCount)
    ? Math.min(baseEquipment.length, configuredCount)
    : baseEquipment.length;
}

/** 現在のモードの部屋配列を、設備数に応じて動的にサイズ調整して返す */
function getAdjustedRooms() {
  const mode = getCurrentMode();
  const rooms = mode.rooms || [];
  if (rooms.length !== 4) return rooms; // 2x2グリッド以外ならそのまま返す
  
  const baseEquipment = mode.equipment || [];
  const targetCount = getDifficultyEquipmentCount(baseEquipment);
  
  const countByRoom = {};
  rooms.forEach(r => countByRoom[r.id] = 0);
  
  for (let i = 0; i < targetCount; i++) {
    const source = baseEquipment[i % baseEquipment.length];
    if (source && source.room) {
      countByRoom[source.room] = (countByRoom[source.room] || 0) + 1;
    }
  }
  
  // 部屋サイズ：設備数が多いほど少し大きく（最小40%〜最大46%）
  const minSize = 40;
  const maxSize = 46;
  const maxPossibleCount = 12;
  
  const getRoomSize = (count) => {
    const ratio = Math.min(1, count / maxPossibleCount);
    return minSize + ratio * (maxSize - minSize);
  };
  
  // 外縁マージン（フロア端からの余白）と部屋間の隙間を確保
  const outerMargin = 3;   // フロア端からの余白（%）
  // 各部屋の幅と高さを個別に決定
  const sizes = rooms.map(r => {
    const count = countByRoom[r.id] || 0;
    const size = getRoomSize(count);
    return { w: size, h: size };
  });
  
  // 左列：outerMargin から開始
  // 右列：100 - outerMargin - size から開始
  // 上行：outerMargin から開始
  // 下行：100 - outerMargin - size から開始
  const leftX  = outerMargin;
  const rightX = (pct) => 100 - outerMargin - pct;
  const topY   = outerMargin;
  const botY   = (pct) => 100 - outerMargin - pct;
  
  return [
    {
      ...rooms[0], // 左上 (Top-Left)
      x: `${leftX}%`,
      y: `${topY}%`,
      width: `${sizes[0].w}%`,
      height: `${sizes[0].h}%`
    },
    {
      ...rooms[1], // 右上 (Top-Right)
      x: `${rightX(sizes[1].w)}%`,
      y: `${topY}%`,
      width: `${sizes[1].w}%`,
      height: `${sizes[1].h}%`
    },
    {
      ...rooms[2], // 左下 (Bottom-Left)
      x: `${leftX}%`,
      y: `${botY(sizes[2].h)}%`,
      width: `${sizes[2].w}%`,
      height: `${sizes[2].h}%`
    },
    {
      ...rooms[3], // 右下 (Bottom-Right)
      x: `${rightX(sizes[3].w)}%`,
      y: `${botY(sizes[3].h)}%`,
      width: `${sizes[3].w}%`,
      height: `${sizes[3].h}%`
    }
  ];
}

/** 現在のモードの設備配列を返す（難易度に応じて設備数を調整、位置を最適化） */
function getActiveEquipment() {
  const cacheKey = `${state.gameMode}-${state.difficulty}`;
  
  if (state.cachedEquipment && state.cachedEquipment.key === cacheKey) {
    return state.cachedEquipment.equipment;
  }
  
  const baseEquipment = getCurrentMode().equipment;
  const targetCount = getDifficultyEquipmentCount(baseEquipment);
  
  const fullEquipmentList = [];
  for (let i = 0; i < targetCount; i++) {
    const source = baseEquipment[i];
    fullEquipmentList.push({
      ...source,
      id: source.id,
      baseId: source.id
    });
  }
  
  const result = [];
  
  const equipmentByRoom = {};
  fullEquipmentList.forEach(eq => {
    const r = eq.room || "unassigned";
    if (!equipmentByRoom[r]) equipmentByRoom[r] = [];
    equipmentByRoom[r].push(eq);
  });
  
  // 動的にサイズ調整された部屋定義を取得
  const adjustedRooms = getAdjustedRooms();
  
  Object.keys(equipmentByRoom).forEach(roomId => {
    const eqs = equipmentByRoom[roomId];
    if (eqs.length === 0) return;
    
    const room = adjustedRooms.find(r => r.id === roomId);
    if (!room) return;

    // 部屋名や壁と重ならないようにするための絶対座標での境界を計算
    const roomX = parseFloat(room.x);
    const roomY = parseFloat(room.y);
    const roomWidth = parseFloat(room.width);
    const roomHeight = parseFloat(room.height);

    // 部屋内の相対マージン（上部は部屋名回避のため広めにとる）
    const marginRelX = 10;
    const marginRelYTop = 25;
    const marginRelYBot = 10;

    const absMinX = roomX + (marginRelX * roomWidth / 100);
    const absMaxX = roomX + ((100 - marginRelX) * roomWidth / 100);
    const absMinY = roomY + (marginRelYTop * roomHeight / 100);
    const absMaxY = roomY + ((100 - marginRelYBot) * roomHeight / 100);
    
    // ジッタード・グリッドで自然な配置を実現
    // グリッドの各セル内でランダムにオフセットを加え、きっちり並びすぎない見た目にする
    const placedItems = [];
    
    // 部屋の縦横比に合わせてグリッド列数・行数を決定
    const availableWidth  = absMaxX - absMinX;
    const availableHeight = absMaxY - absMinY;
    const roomRatio = availableWidth / availableHeight;
    
    let gridCols, gridRows;
    if (roomRatio > 1.3) {
      gridCols = Math.ceil(Math.sqrt(eqs.length * roomRatio));
      gridRows = Math.ceil(eqs.length / gridCols);
    } else if (roomRatio < 0.77) {
      gridRows = Math.ceil(Math.sqrt(eqs.length / roomRatio));
      gridCols = Math.ceil(eqs.length / gridRows);
    } else {
      gridCols = Math.ceil(Math.sqrt(eqs.length));
      gridRows = Math.ceil(eqs.length / gridCols);
    }
    
    // セル間のスペースは「部屋の実寸に対する固定%」ではなく「セルサイズに対する比率」で決定する。
    // 固定%だと、行数・列数が多い部屋や部屋自体が小さい場合にセルの高さ／幅が
    // マイナス値近くまで縮み、隣接する設備カードが完全に重なってしまう不具合があった。
    // 比率にすることで、部屋のサイズに関わらずセルサイズは必ず正の妥当な値になる。
    const spacingRatio = 0.32; // セル1個の大きさに対して32%相当の余白（カード固定高さ化に合わせて拡大）
    const cellW = availableWidth / (gridCols + (gridCols - 1) * spacingRatio);
    const cellH = availableHeight / (gridRows + (gridRows - 1) * spacingRatio);
    const cellSpacingX = cellW * spacingRatio;
    const cellSpacingY = cellH * spacingRatio;
    
    // 設備UI の半サイズ（%単位、重なり防止の最小距離として使用）
    // equipment CSS: width clamp(60px,6vw,92px) / height clamp(78px,8.5vh,106px)（固定高さ）
    // → 部屋幅・高さに対して概算で広めに確保
    // セルピッチ（中心間距離）が狭い＝設備が密集している部屋では、
    // 固定サイズのままだとクランプ処理で複数カードが同座標に押し込まれ重なってしまう。
    // ただし縮小しすぎるとカード内の文字が読みにくくなるため、下限を高めに設定し、
    // 縮小率はマイルドに留める（最大でも元サイズの8割程度までしか縮めない）。
    const pitchX = cellW + cellSpacingX;
    const pitchY = cellH + cellSpacingY;
    const equipHalfW = Math.min(10, Math.max(8, pitchX * 0.48));
    const equipHalfH = Math.min(12, Math.max(9.6, pitchY * 0.48));
    
    eqs.forEach((eq, index) => {
      const col = index % gridCols;
      const row = Math.floor(index / gridCols);
      
      // セル中心の絶対座標（スペースを考慮）
      let posX = absMinX + col * (cellW + cellSpacingX) + cellW / 2;
      let posY = absMinY + row * (cellH + cellSpacingY) + cellH / 2;
      
      // 部屋の内側に収まるようにクランプ
      posX = Math.max(absMinX + equipHalfW, Math.min(absMaxX - equipHalfW, posX));
      posY = Math.max(absMinY + equipHalfH, Math.min(absMaxY - equipHalfH, posY));
      
      placedItems.push({ eq, x: posX, y: posY });
    });
    
    // 簡易反発ループ：近接しすぎている設備を少し引き離す（最大5回）
    // ※ テキスト幅・高さに対して十分な間隔を確保するため、係数を2.5→2.8に拡大
    const minDistX = equipHalfW * 2.8;
    const minDistY = equipHalfH * 2.8;
    for (let pass = 0; pass < 8; pass++) {
      let moved = false;
      for (let a = 0; a < placedItems.length; a++) {
        for (let b = a + 1; b < placedItems.length; b++) {
          const dx = placedItems[b].x - placedItems[a].x;
          const dy = placedItems[b].y - placedItems[a].y;
          const overlapX = minDistX - Math.abs(dx);
          const overlapY = minDistY - Math.abs(dy);
          if (overlapX > 0 && overlapY > 0) {
            // 重なりが小さい軸方向にだけ押し出す
            if (overlapX < overlapY) {
              const push = overlapX / 2 + 0.5;
              const dir = dx >= 0 ? 1 : -1;
              placedItems[a].x = Math.max(absMinX + equipHalfW, Math.min(absMaxX - equipHalfW, placedItems[a].x - dir * push));
              placedItems[b].x = Math.max(absMinX + equipHalfW, Math.min(absMaxX - equipHalfW, placedItems[b].x + dir * push));
            } else {
              const push = overlapY / 2 + 0.5;
              const dir = dy >= 0 ? 1 : -1;
              placedItems[a].y = Math.max(absMinY + equipHalfH, Math.min(absMaxY - equipHalfH, placedItems[a].y - dir * push));
              placedItems[b].y = Math.max(absMinY + equipHalfH, Math.min(absMaxY - equipHalfH, placedItems[b].y + dir * push));
            }
            moved = true;
          }
        }
      }
      if (!moved) break;
    }

    // 確定した絶対座標を設備オブジェクトに適用
    placedItems.forEach(p => {
      p.eq.x = `${p.x}%`;
      p.eq.y = `${p.y}%`;
      result.push(p.eq);
    });
  });
  
  state.cachedEquipment = { key: cacheKey, equipment: result };
  return result;
}

/** 現在のモードのインシデントカタログを返す */
function getActiveIncidents() {
  const activeEquipmentIds = new Set(getActiveEquipment().map((equipment) => equipment.id));
  return getCurrentMode().incidents.filter((incident) => activeEquipmentIds.has(incident.equipmentId));
}
