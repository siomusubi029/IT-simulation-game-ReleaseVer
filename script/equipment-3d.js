// ===== Equipment 3D model buttons =====
(function () {
  const SCRIPT_BASE_URL = document.currentScript?.src || window.location.href;
  const THREE_URL = `${new URL("../assets/vendor/three/three.module.js", SCRIPT_BASE_URL).href}?v=160-local`;
  const GLTF_LOADER_URL = `${new URL("../assets/vendor/three/GLTFLoader.js", SCRIPT_BASE_URL).href}?v=160-local`;

  const MODEL_SOURCES = {
    office: "GeneralCompany.glb?v=office-wifi-marker-20260821-1420",
    security: "SecurityCompany.glb?v=security-floor-20260818",
    infra: "DataCenterCompany.glb",
    startup: "WebServiceCompany.glb"
  };

  const EQUIPMENT_MODEL_MAP = {
    office: {
      pc: ["PCDeskArea_Root", "PCDesk_Root"],
      printer: "MFP_Root",
      wifi: "WifiAP_Root",
      network: "ServerRack_Root",
      server: ["FileServerStack_Root", "FileServer_Root"],
      meeting: "Conference_Root",
      security: ["AccountTerminal_Root", "AT_Root"],
      backup: "BackupDevice_Root",
      portal: ["PortalTerminal_Root", "PT_Root"],
      vpn: "VPNGateway_Root",
      mail: "MailServer_Root",
      asset: ["AssetMgmt_Root", "AM_Root"]
    },
    security: {
      siem: "SIEMConsole_Root",
      soc: "SOCTerminal_Root",
      malware: "MalwareAnalysis_Root",
      firewall: "Firewall_Root",
      ids: "IDSIPS_Root",
      intel: "ThreatIntel_Root",
      incident: "IncidentResponsePC_Root",
      logstorage: "LogStorageServer_Root",
      zerotrust: "ZeroTrustGateway_Root",
      edr: "EDRConsole_Root",
      vulnscan: "VulnScanServer_Root",
      forensic: "ForensicTerminal_Root"
    },
    infra: {
      web: "Web_Root",
      rack: "DB_Root",
      dns: "DNS_Root",
      storage: "Storage_Root",
      dr: "DCBackupServer_Root",
      router: "Router_Root",
      network: "Switch_Root",
      loadbalancer: "LoadBalancer_Root",
      monitor: "DCMonitorServer_Root",
      ups: "UPS_Root",
      virt: "VirtPlatform_Root",
      cooling: "CoolingSystem_Root"
    },
    startup: {
      wa: "WA_Root",
      api: "API_Root",
      cloud: "CloudStorage_Root",
      container: "ContainerPlatform_Root",
      cicd: "CICDPipeline_Root",
      dashboard: "MonitorDashboard_Root",
      db: "Database_Root",
      cdn: "CDNCache_Root",
      queue: "MessageQueue_Root",
      auth: "AuthPlatform_Root",
      devenv: "DeveloperPC_Root",
      payment: "PaymentAPI_Root"
    }
  };

  const COMPANY_MODEL_LAYOUT = {
    office: {
      pc: { scale: 1.02, center: { x: -0.92, z: -0.5 } },
      printer: { scale: 1.04, rotationY: -0.18, center: { x: -0.38, z: -0.52 } },
      wifi: { scale: 1.1, rotationY: 0.28, center: { x: -1.46, z: -0.44 } },
      network: { scale: 1.08, rotationY: 0.35, center: { x: -1.18, z: 0.72 } },
      server: { scale: 1.08, rotationY: -0.22, center: { x: -0.55, z: 0.7 } },
      meeting: { scale: 0.92, rotationY: 0.12, center: { x: 1.02, z: -0.55 } },
      security: { scale: 1.04, rotationY: -0.35, center: { x: 1.05, z: 0.74 } }
    },
    security: {
      siem: { scale: 1.18, rotationY: -0.2 },
      soc: { scale: 1.14, rotationY: 0.18 },
      malware: { scale: 1.18, rotationY: 0.32 },
      firewall: { scale: 1.25, rotationY: -0.26 },
      ids: { scale: 1.2, rotationY: 0.22 },
      intel: { scale: 1.16, rotationY: -0.14 },
      incident: { scale: 1.18, rotationY: 0.28 },
      logstorage: { scale: 1.16, rotationY: -0.18 },
      zerotrust: { scale: 1.18, rotationY: 0.2 },
      edr: { scale: 1.16, rotationY: -0.2 },
      vulnscan: { scale: 1.16, rotationY: 0.18 },
      forensic: { scale: 1.16, rotationY: 0.3 }
    },
    infra: {
      web: { scale: 1.2, rotationY: -0.12 },
      rack: { scale: 1.24, rotationY: -0.18 },
      dns: { scale: 1.18, rotationY: 0.2 },
      storage: { scale: 1.2, rotationY: 0.24 },
      dr: { scale: 1.22, rotationY: -0.28 },
      router: { scale: 1.16, rotationY: -0.18 },
      network: { scale: 1.18, rotationY: 0.18 },
      loadbalancer: { scale: 1.16, rotationY: 0.24 },
      monitor: { scale: 1.18, rotationY: -0.22 },
      ups: { scale: 1.16, rotationY: 0.3 },
      virt: { scale: 1.16, rotationY: -0.2 },
      cooling: { scale: 1.22, rotationY: -0.12 }
    },
    startup: {
      wa: { scale: 1.16, rotationY: -0.18 },
      api: { scale: 1.16, rotationY: 0.16 },
      cloud: { scale: 1.16, rotationY: -0.2 },
      container: { scale: 1.2, rotationY: 0.22 },
      cicd: { scale: 1.16, rotationY: -0.28 },
      dashboard: { scale: 1.18, rotationY: 0.14 },
      db: { scale: 1.22, rotationY: -0.18 },
      cdn: { scale: 1.18, rotationY: 0.3 },
      queue: { scale: 1.16, rotationY: -0.14 },
      auth: { scale: 1.16, rotationY: 0.2 },
      devenv: { scale: 1.14, rotationY: -0.1 },
      payment: { scale: 1.16, rotationY: 0.24 }
    }
  };

  const PRESERVE_MODEL_LAYOUT_MODES = new Set(["office", "security"]);

  const gltfCache = new Map();
  const activeEquipmentRenderers = new Set();
  const activeModeRenderers = new Set();
  const activeCompanyRenderers = new Set();
  let activeCompanyScene = null;
  let pendingCompanySceneKey = null;
  let threeRuntimePromise = null;

  function loadThreeRuntime() {
    if (!threeRuntimePromise) {
      threeRuntimePromise = Promise.all([
        import(THREE_URL),
        import(GLTF_LOADER_URL)
      ]).then(([THREE, loaderModule]) => ({ THREE, GLTFLoader: loaderModule.GLTFLoader }));
    }
    return threeRuntimePromise;
  }

  function getBaseEquipmentId(item) {
    return item.baseId || String(item.id).replace(/-copy-\d+$/, "");
  }

  function getModelInfo(item) {
    const mode = state.gameMode;
    const baseId = getBaseEquipmentId(item);
    const nodeName = EQUIPMENT_MODEL_MAP[mode]?.[baseId];
    const src = MODEL_SOURCES[mode];
    return nodeName && src ? { src, nodeName } : null;
  }

  function getNodeNamesForItem(item) {
    const info = getModelInfo(item);
    if (!info) return [];
    return Array.isArray(info.nodeName) ? info.nodeName : [info.nodeName];
  }

  function findModelRoots(modelRoot, nodeNames) {
    const roots = [];
    const seen = new Set();
    const names = Array.isArray(nodeNames) ? nodeNames : [nodeNames];
    const isMatchingNodeName = (childName, nodeName) => {
      if (childName === nodeName) return true;
      if (childName.startsWith(`${nodeName}.`)) return true;
      if (childName.startsWith(nodeName) && /^\d+$/.test(childName.slice(nodeName.length))) return true;
      return false;
    };
    names.forEach((rawName) => {
      if (!rawName) return;
      const nodeName = String(rawName).trim();
      const matches = [];
      const exact = modelRoot.getObjectByName(nodeName);
      if (exact) matches.push(exact);
      modelRoot.traverse((child) => {
        const childName = String(child.name || "").trim();
        if (!isMatchingNodeName(childName, nodeName)) return;
        matches.push(child);
      });
      matches.forEach((match) => {
        if (seen.has(match.uuid)) return;
        seen.add(match.uuid);
        roots.push(match);
      });
    });
    return roots.filter((root) => {
      let parent = root.parent;
      while (parent) {
        if (seen.has(parent.uuid)) return false;
        parent = parent.parent;
      }
      return true;
    });
  }

  function getLayoutForItem(item) {
    const modeLayout = COMPANY_MODEL_LAYOUT[state.gameMode] || {};
    return modeLayout[item.id] || modeLayout[getBaseEquipmentId(item)] || null;
  }

  function applyEquipmentLayout(THREE, modelRoot, equipment) {
    equipment.forEach((item) => {
      const layout = getLayoutForItem(item);
      if (!layout) return;
      const roots = findModelRoots(modelRoot, getNodeNamesForItem(item));
      if (!roots.length) return;

      const offset = layout.position || {};
      roots.forEach((root) => {
        if (layout.rotationY) root.rotation.y += layout.rotationY;
        if (layout.rotationX) root.rotation.x += layout.rotationX;
        if (layout.rotationZ) root.rotation.z += layout.rotationZ;
        if (layout.scale) root.scale.multiplyScalar(layout.scale);
      });

      if (layout.center) {
        const box = new THREE.Box3();
        roots.forEach((root) => box.union(new THREE.Box3().setFromObject(root)));
        if (!box.isEmpty()) {
          const currentCenter = new THREE.Vector3();
          box.getCenter(currentCenter);
          const targetY = layout.center.y ?? currentCenter.y;
          const delta = new THREE.Vector3(
            (layout.center.x ?? currentCenter.x) - currentCenter.x,
            targetY - currentCenter.y,
            (layout.center.z ?? currentCenter.z) - currentCenter.z
          );
          roots.forEach((root) => root.position.add(delta));
        }
      }

      roots.forEach((root) => {
        root.position.x += offset.x || 0;
        root.position.y += offset.y || 0;
        root.position.z += offset.z || 0;
      });
    });
  }

  function loadGltf(src, GLTFLoader) {
    if (!gltfCache.has(src)) {
      const loader = new GLTFLoader();
      gltfCache.set(src, loader.loadAsync(src));
    }
    return gltfCache.get(src);
  }

  function clearChildren(element) {
    while (element.firstChild) element.removeChild(element.firstChild);
  }

  function showCompanySceneNotice(container, message) {
    if (!container) return;
    const existing = container.querySelector(".company-scene-notice");
    if (existing) existing.remove();
    const notice = document.createElement("div");
    notice.className = "company-scene-notice";
    notice.textContent = message;
    container.appendChild(notice);
  }

  function clearCompanySceneNotice(container) {
    const existing = container?.querySelector(".company-scene-notice");
    if (existing) existing.remove();
  }

  function createFallback(container, icon) {
    clearChildren(container);
    const fallback = document.createElement("span");
    fallback.className = "equipment-model-fallback";
    fallback.textContent = icon || "□";
    container.appendChild(fallback);
  }
  function cloneModelNodes(THREE, gltf, nodeNames) {
    const group = new THREE.Group();
    nodeNames.forEach((nodeName) => {
      const source = gltf.scene.getObjectByName(nodeName);
      if (!source) return;
      group.add(source.clone(true));
    });
    return group.children.length ? group : null;
  }

  function frameObject(THREE, object) {
    const box = new THREE.Box3().setFromObject(object);
    if (box.isEmpty()) return;
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const longestSide = Math.max(size.x, size.y, size.z) || 1;
    const scaleFactor = 2.35 / longestSide;
    object.scale.multiplyScalar(scaleFactor);
    object.position.x -= center.x * scaleFactor;
    object.position.y -= center.y * scaleFactor;
    object.position.z -= center.z * scaleFactor;
    const groundedBox = new THREE.Box3().setFromObject(object);
    object.position.y -= groundedBox.min.y;
  }

  function applyStatusTint(THREE, scene, status, hasIncident) {
    const color = status === "broken" ? 0xff5e6c : hasIncident ? 0xffd35a : 0x64eaf4;
    scene.add(new THREE.HemisphereLight(0xffffff, color, 1.15));

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.6);
    fillLight.position.set(-2, 2.4, 2.5);
    scene.add(fillLight);

    const keyLight = new THREE.DirectionalLight(color, 2.25);
    keyLight.position.set(2.4, 4.2, 3.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(512, 512);
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 12;
    keyLight.shadow.camera.left = -3;
    keyLight.shadow.camera.right = 3;
    keyLight.shadow.camera.top = 3;
    keyLight.shadow.camera.bottom = -3;
    scene.add(keyLight);
  }

  function createDepthStage(THREE, scene, status, hasIncident) {
    const color = status === "broken" ? 0xff5e6c : hasIncident ? 0xffd35a : 0x64eaf4;
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.34, 64),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.24, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.018;
    shadow.scale.set(1.1, 0.58, 1);
    scene.add(shadow);

    const platform = new THREE.Mesh(
      new THREE.CircleGeometry(1.22, 64),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.08, transparent: true, opacity: 0.12, roughness: 0.7, metalness: 0.2 })
    );
    platform.rotation.x = -Math.PI / 2;
    platform.position.y = -0.012;
    platform.receiveShadow = true;
    scene.add(platform);

    const grid = new THREE.GridHelper(2.65, 8, color, color);
    grid.position.y = -0.006;
    grid.material.transparent = true;
    grid.material.opacity = 0.22;
    grid.material.depthWrite = false;
    scene.add(grid);
  }

  function enableObjectDepth(object) {
    object.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) {
        child.material = child.material.clone();
        child.material.needsUpdate = true;
      }
    });
  }

  function brightenOfficeModel(THREE, object) {
    object.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material.color) {
          material.color.lerp(new THREE.Color(0xdff7ff), 0.015);
        }
        if (material.emissive) {
          material.emissive.lerp(new THREE.Color(0x2c6376), 0.035);
          material.emissiveIntensity = Math.max(material.emissiveIntensity || 0, 0.025);
        }
        material.needsUpdate = true;
      });
    });
  }

  function emphasizeOfficeEquipment(THREE, modelRoot, equipment) {
    const accentByBaseId = {
      pc: 0x79d7ff,
      printer: 0xf7f1db,
      wifi: 0x64eaf4,
      network: 0x88b7ff,
      server: 0x9fe3ff,
      meeting: 0xffe188,
      security: 0xffde8a,
      backup: 0xb4f2ff,
      portal: 0xa5eaff,
      vpn: 0xffd57a,
      mail: 0xffc785,
      asset: 0xd8f5ff
    };

    equipment.forEach((item) => {
      const roots = findModelRoots(modelRoot, getNodeNamesForItem(item));
      if (!roots.length) return;
      const baseId = getBaseEquipmentId(item);
      const accent = new THREE.Color(accentByBaseId[baseId] || 0xdff7ff);
      roots.forEach((root) => {
        root.scale.multiplyScalar(1);
        root.renderOrder = 5;
        root.traverse((child) => {
          if (!child.isMesh || !child.material) return;
          child.renderOrder = 5;
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => {
            if (material.color) material.color.lerp(accent, 0.08);
            if (material.emissive) {
              material.emissive.lerp(accent, 0.08);
              material.emissiveIntensity = Math.max(material.emissiveIntensity || 0, 0.08);
            }
            material.depthTest = true;
            material.depthWrite = true;
            material.needsUpdate = true;
          });
        });
      });
    });
  }

  function rememberRenderer(renderer, bucket = activeEquipmentRenderers) {
    bucket.add(renderer);
  }

  function disposeRendererSet(renderers) {
    renderers.forEach((renderer) => {
      renderer.dispose();
      renderer.domElement.remove();
    });
    renderers.clear();
  }

  window.resetEquipmentModelViews = function resetEquipmentModelViews() {
    disposeRendererSet(activeEquipmentRenderers);
  };

  window.resetModeModelViews = function resetModeModelViews() {
    disposeRendererSet(activeModeRenderers);
  };

  window.resetCompanySceneView = function resetCompanySceneView() {
    disposeRendererSet(activeCompanyRenderers);
    activeCompanyScene = null;
    pendingCompanySceneKey = null;
  };

  window.renderEquipmentModel = async function renderEquipmentModel(container, item, options = {}) {
    const info = getModelInfo(item);
    if (!container || !info) {
      if (container) createFallback(container, item.icon);
      return;
    }

    try {
      const { THREE, GLTFLoader } = await loadThreeRuntime();
      if (!document.body.contains(container)) return;

      const gltf = await loadGltf(info.src, GLTFLoader);
      if (!document.body.contains(container)) return;

      const source = findModelRoots(gltf.scene, getNodeNamesForItem(item))[0];
      if (!source) {
        createFallback(container, item.icon);
        return;
      }

      clearChildren(container);
      const width = Math.max(72, container.clientWidth || 88);
      const height = Math.max(58, container.clientHeight || 72);
      const scene = new THREE.Scene();
      const object = source.clone(true);
      frameObject(THREE, object);
      enableObjectDepth(object);
      object.rotation.set(0, 0.72, 0);
      scene.add(object);
      createDepthStage(THREE, scene, options.status, options.hasIncident);
      applyStatusTint(THREE, scene, options.status, options.hasIncident);

      const camera = new THREE.PerspectiveCamera(31, width / height, 0.1, 100);
      camera.position.set(1.95, 1.42, 3.35);
      camera.lookAt(0, 0.62, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.domElement.className = "equipment-model-canvas";
      container.appendChild(renderer.domElement);
      rememberRenderer(renderer);

      let frames = 0;
      const renderFrame = () => {
        if (!document.body.contains(container) || !container.contains(renderer.domElement)) return;
        frames += 1;
        object.rotation.y += 0.004;
        camera.position.x = 1.95 + Math.sin(frames * 0.012) * 0.08;
        camera.lookAt(0, 0.62, 0);
        renderer.render(scene, camera);
        if (frames < 420) requestAnimationFrame(renderFrame);
      };
      renderFrame();
    } catch (error) {
      console.warn("3Dモデルを読み込めませんでした", info, error);
      createFallback(container, item.icon);
    }
  };

  function getModeAccent(mode) {
    return {
      office: 0x64eaf4,
      security: 0xff5e6c,
      infra: 0x8ee87a,
      startup: 0xb56aff
    }[mode] || 0x64eaf4;
  }

  function renderModeFallback(container) {
    createFallback(container, container.dataset.fallback || "□");
  }

  window.renderModeModel = async function renderModeModel(container, mode) {
    const src = MODEL_SOURCES[mode];
    if (!container || !src) {
      if (container) renderModeFallback(container);
      return;
    }

    try {
      const { THREE, GLTFLoader } = await loadThreeRuntime();
      if (!document.body.contains(container)) return;

      const gltf = await loadGltf(src, GLTFLoader);
      if (!document.body.contains(container)) return;

      clearChildren(container);
      const width = Math.max(96, container.clientWidth || 128);
      const height = Math.max(74, container.clientHeight || 92);
      const accent = getModeAccent(mode);
      const scene = new THREE.Scene();
      const object = gltf.scene.clone(true);

      frameObject(THREE, object);
      enableObjectDepth(object);
      object.rotation.set(0, 0.64, 0);
      scene.add(object);
      createDepthStage(THREE, scene, "normal", false);
      applyStatusTint(THREE, scene, "normal", false);

      const rimLight = new THREE.DirectionalLight(accent, 1.15);
      rimLight.position.set(2.8, 1.6, -2.2);
      scene.add(rimLight);

      const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 100);
      camera.position.set(2.15, 1.28, 3.45);
      camera.lookAt(0, 0.66, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.domElement.className = "mode-model-canvas";
      container.appendChild(renderer.domElement);
      rememberRenderer(renderer, activeModeRenderers);

      let frames = 0;
      const renderFrame = () => {
        if (!document.body.contains(container) || !container.contains(renderer.domElement)) return;
        frames += 1;
        object.rotation.y += 0.003;
        camera.position.x = 2.15 + Math.sin(frames * 0.01) * 0.08;
        camera.lookAt(0, 0.66, 0);
        renderer.render(scene, camera);
        if (frames < 720) requestAnimationFrame(renderFrame);
      };
      renderFrame();
    } catch (error) {
      console.warn("企業3Dモデルを読み込めませんでした", { mode, src }, error);
      renderModeFallback(container);
    }
  };

  window.renderModeModels = function renderModeModels() {
    resetModeModelViews();
    document.querySelectorAll(".mode-model[data-mode-model]").forEach((container) => {
      renderModeModel(container, container.dataset.modeModel);
    });
  };

  function tagClickableEquipment(THREE, modelRoot, equipment) {
    const clickableMeshes = [];
    const statusMeshes = [];
    equipment.forEach((item) => {
      let roots = findModelRoots(modelRoot, getNodeNamesForItem(item));
      if (!roots.length) {
        const fallbackObject = createFallbackEquipmentObject(THREE, item);
        if (fallbackObject) {
          modelRoot.add(fallbackObject);
          roots = [fallbackObject];
        }
      }
      roots.forEach((root) => {
        root.userData.equipmentId = item.id;
        root.userData.baseEquipmentId = getBaseEquipmentId(item);
        root.traverse((child) => {
          if (!child.isMesh) return;
          child.userData.equipmentId = item.id;
          child.userData.baseEquipmentId = getBaseEquipmentId(item);
          child.userData.originalMaterial = Array.isArray(child.material)
            ? child.material.map((material) => material.clone())
            : child.material?.clone();
          statusMeshes.push(child);
          clickableMeshes.push(child);
        });
      });
    });
    return { clickableMeshes, statusMeshes };
  }

  function createStatusMarker(THREE, label, color) {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(64, 64, 46, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.82)";
    ctx.stroke();
    ctx.font = "900 70px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(label, 64, 67);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
    sprite.scale.set(0.38, 0.38, 0.38);
    sprite.renderOrder = 20;
    return sprite;
  }

  function createFallbackEquipmentObject(THREE, item) {
    const baseId = getBaseEquipmentId(item);
    if (baseId !== "wifi") return null;

    const layout = getLayoutForItem(item);
    const position = layout?.center || { x: -1.45, y: 0.22, z: -0.48 };
    const group = new THREE.Group();
    group.name = "WifiAP_Root";
    group.position.set(position.x, position.y ?? 0.22, position.z);
    group.scale.setScalar(0.75);

    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f6ff, roughness: 0.55, metalness: 0.08 });
    const accentMaterial = new THREE.MeshStandardMaterial({ color: 0x42d7ef, emissive: 0x42d7ef, emissiveIntensity: 0.18 });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.05, 18), bodyMaterial);
    base.position.y = 0.03;
    group.add(base);

    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.34, 12), bodyMaterial);
    antenna.position.y = 0.22;
    antenna.rotation.z = -0.18;
    group.add(antenna);

    [0.16, 0.25, 0.34].forEach((radius, index) => {
      const arc = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.008, 8, 36, Math.PI),
        accentMaterial
      );
      arc.position.set(0.02, 0.36 + index * 0.035, 0);
      arc.rotation.set(Math.PI / 2, 0, Math.PI);
      group.add(arc);
    });

    return group;
  }

  function cloneTintedMaterial(THREE, material, color, strength) {
    const next = material.clone();
    const materialName = material.name || "";
    const troubleColor = new THREE.Color(color);
    const isScreenGlow = /soft_screen_glow|screen_glow|screenglow|monitor_glow|monglow|holo/i.test(materialName);
    const isScreenGlass = /glass_black_screen|screen_black|monitor_screen/i.test(materialName);

    if (next.color) {
      next.color.lerp(troubleColor, isScreenGlow ? 0.12 : isScreenGlass ? 0.18 : 0.34);
    }
    if (next.emissive) {
      next.emissive.lerp(troubleColor, isScreenGlow || isScreenGlass ? 0.9 : 1);
      next.emissiveIntensity = isScreenGlow || isScreenGlass
        ? Math.max(next.emissiveIntensity || 0, strength * 1.35)
        : strength;
    }
    next.needsUpdate = true;
    return next;
  }

  function updateCompanyEquipmentStatus(THREE) {
    if (!activeCompanyScene) return;
    const activeIncidentIds = new Set(state.incidents.map((incident) => incident.equipmentId));
    activeCompanyScene.statusMarkers.forEach((marker) => activeCompanyScene.scene.remove(marker));
    activeCompanyScene.statusMarkers = [];

    activeCompanyScene.statusMeshes.forEach((mesh) => {
      const equipmentId = mesh.userData.equipmentId;
      const baseEquipmentId = mesh.userData.baseEquipmentId || equipmentId;
      const status = state.equipmentStatus[equipmentId] || state.equipmentStatus[baseEquipmentId] || "normal";
      const hasIncident = activeIncidentIds.has(equipmentId) || activeIncidentIds.has(baseEquipmentId);
      const tint = status === "broken" ? 0xff5e6c : hasIncident ? 0xffd35a : null;
      const original = mesh.userData.originalMaterial;

      if (tint) {
        const strength = status === "broken" ? 0.48 : 0.34;
        const baseMaterial = original || mesh.material;
        mesh.material = Array.isArray(baseMaterial)
          ? baseMaterial.map((material) => cloneTintedMaterial(THREE, material, tint, strength))
          : cloneTintedMaterial(THREE, baseMaterial, tint, strength);
      } else if (original) {
        mesh.material = Array.isArray(original)
          ? original.map((material) => material.clone())
          : original.clone();
      }
    });

    activeCompanyScene.equipment.forEach((item) => {
      const status = state.equipmentStatus[item.id] || "normal";
      const hasIncident = activeIncidentIds.has(item.id);
      if (status !== "broken" && !hasIncident) return;

      const roots = findModelRoots(activeCompanyScene.object, getNodeNamesForItem(item));
      const markerBox = new THREE.Box3();
      roots.forEach((root) => markerBox.union(new THREE.Box3().setFromObject(root)));
      if (markerBox.isEmpty()) return;

      const center = new THREE.Vector3();
      markerBox.getCenter(center);
      const baseEquipmentId = getBaseEquipmentId(item);
      const markerLift = baseEquipmentId === "wifi" ? 0.12 : 0.28;
      const marker = createStatusMarker(THREE, "!", status === "broken" ? "#ff5e6c" : "#ffd35a");
      marker.position.set(center.x, markerBox.max.y + markerLift, center.z);
      if (baseEquipmentId === "wifi") {
        marker.scale.set(0.32, 0.32, 0.32);
      }
      marker.userData.equipmentId = item.id;
      marker.userData.baseEquipmentId = baseEquipmentId;
      activeCompanyScene.scene.add(marker);
      activeCompanyScene.statusMarkers.push(marker);
    });

    activeCompanyScene.clickableMeshes = activeCompanyScene.baseClickableMeshes;
  }

  function findEquipmentIdFromIntersection(intersection) {
    let object = intersection.object;
    while (object) {
      if (object.userData?.equipmentId) return object.userData.equipmentId;
      object = object.parent;
    }
    return null;
  }

  function findBestEquipmentIdFromIntersections(intersections) {
    const activeIncidentIds = new Set(state.incidents.map((incident) => incident.equipmentId));
    const candidates = intersections
      .map((intersection) => findEquipmentIdFromIntersection(intersection))
      .filter(Boolean);
    return candidates.find((id) => activeIncidentIds.has(id))
      || candidates.find((id) => state.equipmentStatus[id] === "broken")
      || candidates[0]
      || null;
  }

  window.renderCompanyScene = async function renderCompanyScene(container, equipment) {
    if (!container) return;
    if (window.location.protocol === "file:") {
      showCompanySceneNotice(container, "3Dモデルは直接開くと表示できません。start-game.bat から起動してください。");
      return;
    }
    const mode = state.gameMode;
    const src = MODEL_SOURCES[mode];
    if (!src) return;

    const sceneKey = `${mode}:${src}`;
    if (activeCompanyScene?.key === sceneKey && container.contains(activeCompanyScene.renderer.domElement)) {
      const width = Math.max(320, container.clientWidth || 960);
      const height = Math.max(220, container.clientHeight || 540);
      activeCompanyScene.camera.aspect = width / height;
      activeCompanyScene.camera.updateProjectionMatrix();
      activeCompanyScene.renderer.setSize(width, height, false);
      updateCompanyEquipmentStatus(activeCompanyScene.THREE);
      return;
    }
      if (pendingCompanySceneKey === sceneKey) return;

    try {
      clearCompanySceneNotice(container);
      pendingCompanySceneKey = sceneKey;
      resetCompanySceneView();
      pendingCompanySceneKey = sceneKey;
      const { THREE, GLTFLoader } = await loadThreeRuntime();
      if (!document.body.contains(container)) return;

      const gltf = await loadGltf(src, GLTFLoader);
      if (!document.body.contains(container)) return;

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x0c2534, 8.5, 15);

      const object = gltf.scene.clone(true);
      frameObject(THREE, object);
      enableObjectDepth(object);
      object.scale.multiplyScalar(mode === "office" ? 2.9 : mode === "security" ? 1.9 : 1.5);
      if (mode === "office") {
        brightenOfficeModel(THREE, object);
        emphasizeOfficeEquipment(THREE, object, equipment);
      }
      if (!PRESERVE_MODEL_LAYOUT_MODES.has(mode)) {
        applyEquipmentLayout(THREE, object, equipment);
      }
      object.rotation.set(mode === "office" ? 0 : -0.05, mode === "office" ? 0 : -0.66, 0);
      if (mode === "office") {
        object.position.x -= 0.16;
        object.position.y += 0.26;
        object.position.z -= 0.1;
      } else if (mode === "security") {
        object.position.x += 0.1;
        object.position.z -= 1.25;
      }
      scene.add(object);

      const accent = getModeAccent(mode);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x5f8fa0, mode === "office" ? 1.25 : 2.25));

      const sun = new THREE.DirectionalLight(0xe6fbff, mode === "office" ? 1.72 : 3.05);
      sun.position.set(-3.8, 6.8, 4.4);
      sun.castShadow = true;
      scene.add(sun);

      const rim = new THREE.DirectionalLight(accent, mode === "office" ? 0.78 : 1.55);
      rim.position.set(4.8, 2.6, -3.5);
      scene.add(rim);

      const width = Math.max(320, container.clientWidth || 960);
      const height = Math.max(220, container.clientHeight || 540);
      const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
      if (mode === "office") {
        camera.position.set(0.08, 6.18, 6.0);
        camera.lookAt(0.08, 0.5, 0.02);
      } else {
        camera.position.set(3.05, 3.2, 4.25);
        camera.lookAt(0, 0.64, 0);
      }

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = mode === "office" ? 0.86 : 1.18;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      renderer.domElement.className = "company-scene-canvas";
      renderer.domElement.setAttribute("aria-label", "3D設備マップ");
      container.prepend(renderer.domElement);
      container.classList.add("has-company-scene");
      rememberRenderer(renderer, activeCompanyRenderers);

      const taggedEquipment = tagClickableEquipment(THREE, object, equipment);
      let clickableMeshes = taggedEquipment.clickableMeshes;
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();

      renderer.domElement.addEventListener("click", (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hitTargets = activeCompanyScene?.clickableMeshes || clickableMeshes;
        const hits = raycaster.intersectObjects(hitTargets, true);
        if (!hits.length) return;
        const equipmentId = findBestEquipmentIdFromIntersections(hits);
        if (equipmentId && typeof handleEquipmentClick === "function") {
          handleEquipmentClick(equipmentId);
        }
      });

      activeCompanyScene = {
        key: sceneKey,
        THREE,
        renderer,
        scene,
        camera,
        object,
        equipment,
        clickableMeshes,
        baseClickableMeshes: clickableMeshes,
        statusMeshes: taggedEquipment.statusMeshes,
        statusMarkers: []
      };
      updateCompanyEquipmentStatus(THREE);

      let frames = 0;
      const renderFrame = () => {
        if (!document.body.contains(container) || !container.contains(renderer.domElement)) return;
        frames += 1;
        object.rotation.y = mode === "office" ? 0 : -0.66 + Math.sin(frames * 0.004) * 0.025;
        if (mode === "office") {
          camera.lookAt(0.08, 0.5, 0.02);
        }
        renderer.render(scene, camera);
        requestAnimationFrame(renderFrame);
      };
      renderFrame();
      pendingCompanySceneKey = null;
    } catch (error) {
      pendingCompanySceneKey = null;
      console.warn("企業3Dシーンを読み込めませんでした", { mode, src }, error);
      container.classList.remove("has-company-scene");
      showCompanySceneNotice(container, "3Dモデルを読み込めませんでした。start-game.bat から起動し、Ctrl + F5 で再読み込みしてください。");
    }
  };
})();
