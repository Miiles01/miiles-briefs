// Mi trabajo: variación 15 de "On-Scroll Column & Row Animations" de Codrops (three.js WebGPU con respaldo WebGL 2).
// La cuadrícula está de pie arriba de la mitad de la pantalla y abajo se curva hacia ti hasta quedar como un piso.
// Cambios para esta página: el lienzo se recorta a la sección "Mi trabajo" y solo dibuja mientras se ve.
import * as THREE from 'three/webgpu';
import { Fn, uniform, texture, uv, vec2, vec3, vec4, positionGeometry, cos, sin, min, dot } from 'three/tsl';

const section = document.querySelector('.works');
const grid = section.querySelector('.columns');
const items = [...grid.querySelectorAll('.column__item')].map(element => ({
  element,
  image: element.querySelector('.column__item-img'),
}));

const BEND = 0.25;     // radio de la curva, como fracción del alto de la pantalla
const SEGMENTS = 32;   // filas de vértices por foto para que se doble suave
const LIGHT = new THREE.Vector3(0, 0, 1);
const AMBIENT = 0.3;

// Encuadre equivalente a background-size: cover con background-position 50% 20%
const cover = Fn(([uvs, size, image]) => {
  const ratio = vec2(
    min(size.x.div(size.y).div(image.x.div(image.y)), 1),
    min(size.y.div(size.x).div(image.y.div(image.x)), 1)
  );
  return uvs.mul(ratio).add(vec2(0.5, 0.8).mul(ratio.oneMinus()));
});

const isSoftware = renderer => {
  if (new URLSearchParams(location.search).has('gl')) return false;
  const { backend } = renderer;
  if (backend.isWebGPUBackend) return backend.device.adapterInfo?.isFallbackAdapter === true;
  const { gl } = backend;
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const name = gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER);
  return /swiftshader|llvmpipe|software/i.test(name);
};

export async function createStage() {
  const renderer = new THREE.WebGPURenderer({ alpha: true, antialias: true });
  await renderer.init();
  if (isSoftware(renderer)) {
    renderer.dispose();
    throw new Error('solo hay render por software');
  }
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.classList.add('grid-canvas');
  document.body.append(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 10000);
  const viewport = uniform(new THREE.Vector2(1, 1));
  const geometry = new THREE.PlaneGeometry(1, 1, 1, SEGMENTS);
  const loader = new THREE.TextureLoader();
  const textures = new Map();

  const meshes = await Promise.all(items.map(async item => {
    const src = getComputedStyle(item.image).backgroundImage.slice(5, -2);
    if (!textures.has(src)) textures.set(src, loader.loadAsync(src));
    const map = await textures.get(src);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;

    const center = uniform(new THREE.Vector2(0, 0));
    const size = uniform(new THREE.Vector2(1, 1));
    const flatY = center.y.add(positionGeometry.y.mul(size.y));
    const below = flatY.negate().max(0);
    const radius = viewport.y.mul(BEND);
    const turn = below.div(radius).min(Math.PI / 2);
    const lit = normal => min(dot(normal, vec3(LIGHT.x, LIGHT.y, LIGHT.z)).max(0).mul(1 - AMBIENT).add(AMBIENT).div(AMBIENT + (1 - AMBIENT) * LIGHT.z), 1).pow(2.2);

    const material = new THREE.MeshBasicNodeMaterial();
    material.positionNode = Fn(() => {
      const x = center.x.add(positionGeometry.x.mul(size.x));
      const y = flatY.max(0).sub(radius.mul(sin(turn)));
      const z = radius.mul(cos(turn).oneMinus()).add(below.sub(radius.mul(Math.PI / 2)).max(0));
      return vec3(x, y, z);
    })();
    material.colorNode = Fn(() => {
      const shade = lit(vec3(0, sin(turn), cos(turn)));
      return vec4(texture(map, cover(uv(), size, vec2(map.image.width, map.image.height))).rgb.mul(shade), 1);
    })();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    mesh.userData = { item, center, size };
    scene.add(mesh);
    return mesh;
  }));

  const place = () => {
    const { innerWidth: width, innerHeight: height } = window;
    meshes.forEach(mesh => {
      const rect = mesh.userData.item.element.getBoundingClientRect();
      mesh.userData.center.value.set(rect.left + rect.width / 2 - width / 2, height / 2 - rect.top - rect.height / 2);
      mesh.userData.size.value.set(rect.width, rect.height);
    });
  };

  const resize = () => {
    const { innerWidth: width, innerHeight: height } = window;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = height / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.near = camera.position.z / 10;
    camera.far = camera.position.z * 10;
    camera.updateProjectionMatrix();
    viewport.value.set(width, height);
  };

  // Recorta el lienzo al área de la sección para que el "piso" no tape lo de antes ni lo de después
  const clip = () => {
    const r = section.getBoundingClientRect();
    const h = window.innerHeight;
    const visible = r.bottom > 0 && r.top < h;
    canvas.style.visibility = visible ? 'visible' : 'hidden';
    canvas.style.clipPath = `inset(${Math.max(0, r.top)}px 0 ${Math.max(0, h - r.bottom)}px 0)`;
    return visible;
  };

  let lastScroll = null;
  let needsResize = true;
  const onResize = () => { needsResize = true; };
  const render = () => {
    if (needsResize) { resize(); needsResize = false; lastScroll = null; }
    if (window.scrollY === lastScroll) return;
    lastScroll = window.scrollY;
    if (!clip()) return;
    place();
    renderer.render(scene, camera);
  };

  const show = () => {
    document.documentElement.classList.add('is-webgl');
    needsResize = true;
    window.addEventListener('resize', onResize);
    gsap.ticker.add(render);
    render();
  };
  const hide = () => {
    gsap.ticker.remove(render);
    window.removeEventListener('resize', onResize);
    document.documentElement.classList.remove('is-webgl');
  };

  renderer.onDeviceLost = () => hide();

  resize();
  place();
  await renderer.compileAsync(scene, camera);
  return { show, hide };
}
