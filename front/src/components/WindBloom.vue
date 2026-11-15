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
varying float vPetalFactor;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec3 n = normalize(position);

  // 1. Multi-scale organic billowing petal folds matching reference video
  // Broad sweeping lobes
  float n1 = snoise(n * 2.1 + vec3(0.0, 0.0, uTime * 0.14));
  // Mid-frequency undulating petal waves
  float n2 = snoise(n * 4.4 + vec3(uTime * 0.16, 0.0, uTime * 0.1));
  // Fine harmonic ripples along petal crests
  float n3 = snoise(n * 8.6 + vec3(0.0, uTime * 0.22, 0.0));

  // Organic soft folds: smooth combination with gentle crests
  float lobeShape = n1 * 0.85 + n2 * 0.42 + n3 * 0.16;
  float petalFolds = pow(max(0.0, lobeShape + 0.35), 1.45) * 1.35;

  // 2. Wind wave dynamics: continuous fluid breeze from right to center
  vec3 windDir = normalize(vec3(-0.9, 0.25, 0.2));
  float windWaveCoord = dot(position, windDir);

  float windSway = sin(windWaveCoord * 2.8 - uTime * 2.4) * 0.22;
  float windRipples = sin(windWaveCoord * 5.6 - uTime * 4.0) * 0.10;
  float softFlutter = snoise(position * 3.6 - windDir * (uTime * 3.2)) * 0.18;

  // 3. Interactive mouse wind deflection
  float mouseDist = length(position.xy - uMouse * 2.0);
  float mouseGust = exp(-mouseDist * 1.1) * (uMouseSpeed * 0.45 + 0.08);

  float totalDisplacement = petalFolds + (windSway + windRipples + softFlutter);
  vec3 windDeflection = windDir * (windSway * 0.35 + softFlutter * 0.25 + mouseGust);

  vec3 displacedPosition = position + n * totalDisplacement + windDeflection;
  vLocalPosition = displacedPosition;
  vDisplacement = totalDisplacement;
  vPetalFactor = petalFolds;

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
uniform float uIsDark;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec3 vLocalPosition;
varying float vDisplacement;
varying float vPetalFactor;

void main() {
  // Screen-space derivatives produce faceted, organic crystalline petals
  vec3 fdx = dFdx(vWorldPosition);
  vec3 fdy = dFdy(vWorldPosition);
  vec3 facetNormal = normalize(cross(fdx, fdy));

  // Blend facet normal and smooth normal for silky organic texture
  vec3 normal = normalize(mix(vNormal, facetNormal, 0.52));
  vec3 viewDir = normalize(vViewPosition);

  // Soft high-key lighting matching reference video
  vec3 lightDir1 = normalize(vec3(0.7, 0.9, 1.1));
  vec3 lightDir2 = normalize(vec3(-0.7, -0.4, 0.6));

  float diff1 = max(dot(normal, lightDir1), 0.0);
  float diff2 = max(dot(normal, lightDir2), 0.0) * 0.45;

  // High-key ambient light so shadows remain luminous and radiant (never muddy)
  float totalLight = 0.52 + diff1 * 0.58 + diff2 * 0.28;

  // Ethereal Fresnel rim lighting on petal tips and edges
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.4);

  // Subsurface translucency glow on back-lit ridges
  float sss = pow(clamp(dot(viewDir, -lightDir1) + 0.4, 0.0, 1.0), 2.2) * 0.4;

  // Exact color palette sampled from reference video:
  // Radiant white-cyan highlights
  vec3 colorWhitePeak = vec3(1.0, 1.0, 1.0);
  // Soft ice-cyan tips
  vec3 colorIceCyan   = vec3(0.72, 0.97, 1.0);
  // Vibrant electric cyan / aquamarine core
  vec3 colorCyan      = vec3(0.04, 0.92, 0.96);
  // Bright turquoise / seafoam mint
  vec3 colorTurquoise = vec3(0.12, 0.86, 0.84);
  // Deep oceanic teal shadow
  vec3 colorTealDepth = vec3(0.03, 0.62, 0.70);

  // Height and curvature factor
  float h = clamp(vDisplacement / 2.3, 0.0, 1.0);

  vec3 baseColor = mix(colorTealDepth, colorTurquoise, smoothstep(0.0, 0.38, h));
  baseColor = mix(baseColor, colorCyan, smoothstep(0.35, 0.72, h));
  baseColor = mix(baseColor, colorIceCyan, smoothstep(0.68, 0.92, h));
  baseColor = mix(baseColor, colorWhitePeak, smoothstep(0.88, 1.0, h) * 0.85);

  // Add lighting, fresnel sheen, and subsurface glow
  vec3 litColor = baseColor * totalLight;
  litColor += colorWhitePeak * (fresnel * 0.55 + sss * 0.4);

  // Dark mode adjustment: intensify neon electric cyan glow
  if (uIsDark > 0.5) {
    litColor = mix(litColor, colorCyan * 1.25 + colorIceCyan * fresnel, 0.28);
  }

  // Soft edge dissolving: outer perimeter dissolves seamlessly into background
  float dist = length(vLocalPosition);
  float edgeFade = smoothstep(3.2, 1.4, dist);
  vec3 finalColor = mix(uBgColor, litColor, edgeFade);

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

  // Geometry: High-density Icosahedron for fine organic billowing petals
  const geometry = new THREE.IcosahedronGeometry(1.68, 80)

  // Uniforms with dynamic background color (Pure white #ffffff in light mode, Pure black #000000 in dark mode)
  const initialBg = isDark.value ? new THREE.Vector3(0.0, 0.0, 0.0) : new THREE.Vector3(1.0, 1.0, 1.0)
  uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uMouseSpeed: { value: 0 },
    uBgColor: { value: initialBg },
    uIsDark: { value: isDark.value ? 1.0 : 0.0 }
  }

  // React to theme changes in real-time
  watch(isDark, (val) => {
    if (uniforms && uniforms.uBgColor) {
      if (val) {
        uniforms.uBgColor.value.set(0.0, 0.0, 0.0)
        uniforms.uIsDark.value = 1.0
      } else {
        uniforms.uBgColor.value.set(1.0, 1.0, 1.0)
        uniforms.uIsDark.value = 0.0
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
  
  // Position framed prominently in the right half of the screen matching video
  mesh.position.set(1.35, 0.05, 0)
  mesh.rotation.z = 0.22
  scene.add(mesh)

  // Handle responsive resize
  handleResize()
}

const handleResize = () => {
  if (!canvasContainer.value || !renderer || !camera || !mesh) return
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)

  // Adjust mesh position depending on screen aspect ratio
  if (width < 480) {
    // Small mobile: framed nicely on the right side without overlapping text
    mesh.position.set(0.48, -0.1, -0.4)
    mesh.scale.setScalar(0.92)
  } else if (width < 768) {
    // Tablet: balanced right positioning
    mesh.position.set(0.75, 0.0, -0.3)
    mesh.scale.setScalar(1.05)
  } else if (width < 1200) {
    mesh.position.set(1.15, 0.05, 0)
    mesh.scale.setScalar(1.18)
  } else {
    // Desktop: expansive full-height bloom framing the right half
    mesh.position.set(1.42, 0.05, 0)
    mesh.scale.setScalar(1.32)
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

const handleTouchMove = (e) => {
  if (!e.touches || e.touches.length === 0) return
  const touch = e.touches[0]
  handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY })
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
    // Fluid organic sway and floating tilt matching video wind motion
    mesh.rotation.y = elapsedTime * 0.07 + mouse.x * 0.22
    mesh.rotation.x = 0.08 + Math.sin(elapsedTime * 0.45) * 0.05 - mouse.y * 0.18
    mesh.rotation.z = 0.22 + Math.sin(elapsedTime * 0.28) * 0.04
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
  window.addEventListener('touchstart', handleTouchMove, { passive: true })
  window.addEventListener('touchmove', handleTouchMove, { passive: true })
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('touchstart', handleTouchMove)
  window.removeEventListener('touchmove', handleTouchMove)

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
