<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()
const canvasContainer = ref(null)

let scene, camera, renderer, mesh, animationFrameId
let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, speed: 0, prevX: 0, prevY: 0 }
let uniforms

// Simplex Noise GLSL Functions
const noiseGLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

const vertexShader = `
${noiseGLSL}

uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseSpeed;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec3 vLocalPosition;
varying float vDisplacement;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec3 n = normalize(position);

  // 1. Sharp organic bloom spikes formation
  float n1 = snoise(n * 2.6 + vec3(0.0, 0.0, uTime * 0.12));
  float n2 = snoise(n * 5.8 + vec3(uTime * 0.15, 0.0, 0.0));
  float n3 = snoise(n * 11.0 + vec3(0.0, uTime * 0.25, 0.0));

  // Ridged noise creates sharp petal/spike crests
  float ridge = 1.0 - abs(n1);
  float spikes = pow(ridge, 2.0) * 1.45 + pow(max(0.0, n2), 2.0) * 0.85 + n3 * 0.15;

  // 2. Wind simulation: Wind gusts blowing from right to left & oscillating
  vec3 windDir = normalize(vec3(-0.95, 0.28, 0.15));
  float windWaveCoord = dot(position, windDir);

  // Strong rolling wind waves
  float windGust1 = sin(windWaveCoord * 3.0 - uTime * 3.0) * 0.28;
  float windGust2 = sin(windWaveCoord * 6.5 - uTime * 4.8) * 0.14;

  // High-frequency tip flutter like wind blowing through soft foliage/spikes
  float tipFlutter = snoise(position * 4.2 - windDir * (uTime * 4.0)) * 0.22 * (spikes * 0.7);

  // Interactive mouse wind gust
  float mouseDist = length(position.xy - uMouse * 1.8);
  float mouseWind = exp(-mouseDist * 1.1) * (uMouseSpeed * 0.35 + 0.05);

  float totalDisplacement = spikes + (windGust1 + windGust2 + tipFlutter);
  vec3 windDeflection = windDir * (windGust1 * 0.4 + tipFlutter * 0.35 + mouseWind);

  vec3 displacedPosition = position + n * totalDisplacement + windDeflection;
  vLocalPosition = displacedPosition;
  vDisplacement = totalDisplacement;

  vec4 worldPos = modelMatrix * vec4(displacedPosition, 1.0);
  vWorldPosition = worldPos.xyz;

  vec4 mvPosition = viewMatrix * worldPos;
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`

const fragmentShader = `
uniform float uTime;
uniform vec3 uBgColor;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec3 vLocalPosition;
varying float vDisplacement;

void main() {
  // Screen-space derivatives produce faceted, organic crystalline petals
  vec3 fdx = dFdx(vWorldPosition);
  vec3 fdy = dFdy(vWorldPosition);
  vec3 facetNormal = normalize(cross(fdx, fdy));

  // Blend facet normal and smooth normal
  vec3 normal = normalize(mix(vNormal, facetNormal, 0.6));
  vec3 viewDir = normalize(vViewPosition);

  // Lighting directions
  vec3 lightDir1 = normalize(vec3(0.6, 0.8, 1.2));
  vec3 lightDir2 = normalize(vec3(-0.8, -0.3, 0.4));

  float diff1 = max(dot(normal, lightDir1), 0.0);
  float diff2 = max(dot(normal, lightDir2), 0.0) * 0.35;

  // Rim / Fresnel lighting highlighting spike tips
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.2);

  // Colors matching the image exactly:
  // Luminous white-cyan core
  vec3 colorCore = vec3(0.85, 0.99, 1.0);
  // Bright electric cyan / aquamarine
  vec3 colorBright = vec3(0.08, 0.96, 0.92);
  // Vibrant turquoise / mint green
  vec3 colorMid = vec3(0.05, 0.84, 0.76);
  // Deep emerald / oceanic shadow
  vec3 colorShadow = vec3(0.02, 0.54, 0.58);

  // Color gradient based on displacement
  float h = clamp(vDisplacement / 2.2, 0.0, 1.0);
  vec3 baseColor = mix(colorShadow, colorMid, smoothstep(0.0, 0.45, h));
  baseColor = mix(baseColor, colorBright, smoothstep(0.4, 0.85, h));
  baseColor = mix(baseColor, colorCore, smoothstep(0.8, 1.0, h) * 0.75);

  // Combine lighting
  vec3 finalColor = baseColor * (diff1 * 0.75 + diff2 + 0.35) + vec3(0.95, 1.0, 1.0) * fresnel * 0.45;

  // Feather outer spikes softly into dynamic background (Pitch-black #000000 in dark mode, light grey in light mode)
  float dist = length(vLocalPosition);
  float edgeFade = smoothstep(2.8, 1.3, dist);
  finalColor = mix(uBgColor, finalColor, edgeFade);

  gl_FragColor = vec4(finalColor, 1.0);
}
`

const initThree = () => {
  if (!canvasContainer.value) return

  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight

  // Scene
  scene = new THREE.Scene()

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 0, 5.2)

  // Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  canvasContainer.value.appendChild(renderer.domElement)

  // Geometry: High-density Icosahedron for fine organic spikes
  const geometry = new THREE.IcosahedronGeometry(1.45, 64)

  // Uniforms with dynamic background color (Pure black #000000 in dark mode)
  const initialBg = isDark.value ? new THREE.Vector3(0.0, 0.0, 0.0) : new THREE.Vector3(0.957, 0.961, 0.969)
  uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uMouseSpeed: { value: 0 },
    uBgColor: { value: initialBg }
  }

  // React to theme changes in real-time
  watch(isDark, (val) => {
    if (uniforms && uniforms.uBgColor) {
      if (val) {
        uniforms.uBgColor.value.set(0.0, 0.0, 0.0)
      } else {
        uniforms.uBgColor.value.set(0.957, 0.961, 0.969)
      }
    }
  })

  // Material
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    side: THREE.DoubleSide
  })

  // Mesh
  mesh = new THREE.Mesh(geometry, material)
  
  // Position slightly to the right side of the screen as shown in reference design
  mesh.position.set(1.3, 0.05, 0)
  mesh.rotation.z = 0.25
  scene.add(mesh)

  // Handle responsive resize
  handleResize()
}

const handleResize = () => {
  if (!canvasContainer.value || !renderer || !camera) return
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)

  // Adjust mesh position depending on screen aspect ratio
  if (width < 768) {
    // Mobile: center or slight offset
    mesh.position.set(0.6, 0.1, -0.6)
    mesh.scale.setScalar(0.9)
  } else if (width < 1200) {
    mesh.position.set(1.0, 0.05, 0)
    mesh.scale.setScalar(1.0)
  } else {
    // Desktop: positioned nicely to the right
    mesh.position.set(1.4, 0.05, 0)
    mesh.scale.setScalar(1.15)
  }
}

const handleMouseMove = (e) => {
  const rect = canvasContainer.value?.getBoundingClientRect()
  if (!rect) return

  // Normalized mouse coords (-1 to 1)
  const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1
  const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)

  mouse.targetX = normX
  mouse.targetY = normY

  const dx = e.clientX - mouse.prevX
  const dy = e.clientY - mouse.prevY
  const speed = Math.sqrt(dx * dx + dy * dy)
  mouse.speed = Math.min(speed * 0.015, 1.0)

  mouse.prevX = e.clientX
  mouse.prevY = e.clientY
}

const clock = new THREE.Clock()

const animate = () => {
  animationFrameId = requestAnimationFrame(animate)

  const elapsedTime = clock.getElapsedTime()

  // Smooth mouse interpolation
  mouse.x += (mouse.targetX - mouse.x) * 0.06
  mouse.y += (mouse.targetY - mouse.y) * 0.06
  mouse.speed *= 0.94 // decay speed

  if (uniforms) {
    uniforms.uTime.value = elapsedTime
    uniforms.uMouse.value.set(mouse.x, mouse.y)
    uniforms.uMouseSpeed.value = mouse.speed
  }

  if (mesh) {
    // Gentle rotation & floating tilt influenced by wind
    mesh.rotation.y = elapsedTime * 0.08 + mouse.x * 0.25
    mesh.rotation.x = 0.1 + Math.sin(elapsedTime * 0.5) * 0.05 - mouse.y * 0.2
    mesh.rotation.z = 0.25 + Math.sin(elapsedTime * 0.3) * 0.04
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

onMounted(() => {
  initThree()
  animate()
  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)

  if (renderer) {
    renderer.dispose()
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }

  if (mesh) {
    mesh.geometry.dispose()
    mesh.material.dispose()
  }
})
</script>

<template>
  <div ref="canvasContainer" class="wind-bloom-canvas"></div>
</template>

<style scoped>
.wind-bloom-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}
</style>

