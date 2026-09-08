const menuButton = document.querySelector('.menu-button');
const siteNav = document.querySelector('.site-nav');
const dialog = document.querySelector('.mobile-dialog');
const dialogCloseButtons = document.querySelectorAll('.dialog-close, .dialog-ok');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  siteNav.classList.toggle('is-open', !open);
});

siteNav.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    menuButton.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('is-open');
  }
});

const isMobileDevice = () => {
  if (navigator.userAgentData?.mobile) return true;
  const mobileAgent = /Android|iPhone|iPad|iPod|Mobile|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const coarseSmallScreen = matchMedia('(pointer: coarse)').matches && innerWidth < 1024;
  return mobileAgent || coarseSmallScreen;
};

document.querySelectorAll('.play-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (!isMobileDevice()) return;
    event.preventDefault();
    dialog.hidden = false;
    document.body.style.overflow = 'hidden';
    dialog.querySelector('.dialog-ok').focus();
  });
});

function closeDialog() {
  dialog.hidden = true;
  document.body.style.overflow = '';
}

dialogCloseButtons.forEach((button) => button.addEventListener('click', closeDialog));
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) closeDialog();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !dialog.hidden) closeDialog();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .14 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

async function initAboutModelViewer() {
  const viewer = document.querySelector('.about-model-viewer');
  if (!viewer) return;

  const status = viewer.querySelector('.about-model-status');
  const setError = (message) => {
    viewer.classList.add('is-error');
    if (status) status.textContent = message;
  };

  if (location.protocol === 'file:') {
    // setError('3Dモデルは start-game.bat から開くと表示されます');
    // return;
  }

  try {
    const [THREE, { GLTFLoader }] = await Promise.all([
      import('../game/assets/vendor/three/three.module.js?v=160-local'),
      import('../game/assets/vendor/three/GLTFLoader.js?v=160-local')
    ]);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x061c32);

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 200);
    camera.position.set(4.8, 5.2, 6.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    viewer.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xe8fbff, 0x15354a, 2.3));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(3.8, 6.5, 4.2);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7ddfff, 1.1);
    fillLight.position.set(-4.2, 4.5, -3.5);
    scene.add(fillLight);

    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(viewer.dataset.modelSrc || '../game/models/GeneralCompany.glb');
    const model = gltf.scene;

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z) || 1;
    const scale = 6.2 / longestSide;

    model.scale.setScalar(scale);
    model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

    const scaledBox = new THREE.Box3().setFromObject(model);
    const scaledSize = scaledBox.getSize(new THREE.Vector3());
    model.position.y -= scaledBox.min.y;
    scene.add(model);

    const target = new THREE.Vector3(0, Math.max(0.8, scaledSize.y * 0.36), 0);
    camera.lookAt(target);

    const resize = () => {
      const { width, height } = viewer.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(viewer);
    resize();

    viewer.classList.add('is-loaded');

    const render = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };
    render();
  } catch (error) {
    console.error('About page 3D preview failed:', error);
    // setError('3Dプレビューを読み込めませんでした');
  }
}

initAboutModelViewer();
