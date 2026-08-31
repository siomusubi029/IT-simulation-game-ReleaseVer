// ===== 従業員アニメーションシステム =====

const employeeConfig = {
  count: 6,
  speed: 15, // 秒あたりの移動速度（%）
  workDuration: { min: 3, max: 7 }, // 作業時間（秒）
  incidentChance: 0.15 // 従業員が設備に到着したときのインシデント発生確率（15%）
};

const employees = [];
let employeeAnimationId = null;
let lastEmployeeUpdate = 0;

function initEmployees() {
  const layer = document.getElementById("employee-layer");
  if (!layer) return;
  
  layer.innerHTML = "";
  employees.length = 0;
  
  const equipment = getActiveEquipment();
  if (equipment.length === 0) return;
  
  for (let i = 0; i < employeeConfig.count; i++) {
    const startEquipment = equipment[Math.floor(Math.random() * equipment.length)];
    const employee = {
      id: i,
      x: parseFloat(startEquipment.x),
      y: parseFloat(startEquipment.y),
      targetX: parseFloat(startEquipment.x),
      targetY: parseFloat(startEquipment.y),
      state: "working", // walking, working
      workTimer: Math.random() * (employeeConfig.workDuration.max - employeeConfig.workDuration.min) + employeeConfig.workDuration.min,
      element: null
    };
    
    const el = document.createElement("div");
    el.className = "employee working";
    el.innerHTML = `
      <div class="employee-body">
        <div class="employee-head"></div>
        <div class="employee-torso"></div>
        <div class="employee-legs">
          <div class="employee-leg"></div>
          <div class="employee-leg"></div>
        </div>
      </div>
    `;
    el.style.left = `${employee.x}%`;
    el.style.top = `${employee.y}%`;
    layer.appendChild(el);
    employee.element = el;
    
    employees.push(employee);
  }
  
  lastEmployeeUpdate = performance.now();
  startEmployeeAnimation();
}

function startEmployeeAnimation() {
  if (employeeAnimationId) cancelAnimationFrame(employeeAnimationId);
  employeeAnimationId = requestAnimationFrame(employeeAnimationLoop);
}

function stopEmployeeAnimation() {
  if (employeeAnimationId) {
    cancelAnimationFrame(employeeAnimationId);
    employeeAnimationId = null;
  }
}

function employeeAnimationLoop(timestamp) {
  if (!state.started || state.ended || state.paused) {
    employeeAnimationId = requestAnimationFrame(employeeAnimationLoop);
    return;
  }
  
  const deltaTime = (timestamp - lastEmployeeUpdate) / 1000;
  lastEmployeeUpdate = timestamp;
  
  updateEmployees(deltaTime);
  
  employeeAnimationId = requestAnimationFrame(employeeAnimationLoop);
}

function updateEmployees(deltaTime) {
  const equipment = getActiveEquipment();
  if (equipment.length === 0) return;
  
  employees.forEach(emp => {
    if (emp.state === "working") {
      emp.workTimer -= deltaTime;
      if (emp.workTimer <= 0) {
        // 新しい設備を選択
        const nextEquipment = equipment[Math.floor(Math.random() * equipment.length)];
        emp.targetX = parseFloat(nextEquipment.x);
        emp.targetY = parseFloat(nextEquipment.y);
        emp.targetEquipmentId = nextEquipment.id;
        emp.state = "walking";
        emp.element.classList.remove("working");
        emp.element.classList.add("walking");
      }
    } else if (emp.state === "walking") {
      const dx = emp.targetX - emp.x;
      const dy = emp.targetY - emp.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 0.5) {
        // 到着
        emp.x = emp.targetX;
        emp.y = emp.targetY;
        emp.state = "working";
        emp.workTimer = Math.random() * (employeeConfig.workDuration.max - employeeConfig.workDuration.min) + employeeConfig.workDuration.min;
        emp.element.classList.remove("walking");
        emp.element.classList.add("working");
        
        // 確率でインシデント発生（難易度に応じて変動）
        const incidentChance = getDifficulty().employeeIncidentChance ?? employeeConfig.incidentChance;
        if (Math.random() < incidentChance && emp.targetEquipmentId) {
          spawnIncident(emp.targetEquipmentId);
        }
      } else {
        // 移動
        const moveAmount = employeeConfig.speed * deltaTime;
        const ratio = Math.min(moveAmount / distance, 1);
        emp.x += dx * ratio;
        emp.y += dy * ratio;
      }
    }
    
    // 位置を更新
    emp.element.style.left = `${emp.x}%`;
    emp.element.style.top = `${emp.y}%`;
  });
}

function clearEmployees() {
  stopEmployeeAnimation();
  const layer = document.getElementById("employee-layer");
  if (layer) layer.innerHTML = "";
  employees.length = 0;
}
