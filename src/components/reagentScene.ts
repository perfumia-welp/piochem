import {
  ACESFilmicToneMapping,
  BackSide,
  CanvasTexture,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  FrontSide,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LatheGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  RepeatWrapping,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
  Object3D,
  OctahedronGeometry,
  type Material,
  type BufferGeometry,
  type Texture,
} from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"

/** Text printed on the jar label. Swap for a real Piochem SKU when available. */
export type ReagentLabel = {
  name: string
  formula: string
  meta: string
  grade: string
  quantity: string
  lot: string
}

export type ReagentSceneOptions = {
  label: ReagentLabel
  reducedMotion: boolean
  onFirstFrame?: () => void
}

export type ReagentSceneHandle = {
  /** Normalised pointer (-1..1), or null to ease back to rest. */
  setPointer: (p: { x: number; y: number } | null) => void
  /** Pause the render loop when the section is off-screen. */
  setActive: (active: boolean) => void
  dispose: () => void
}

const RED = "#c51632"
const INK = "#171719"

// Jar proportions (scene units). Wide-mouth reagent jar, ~500 g size.
const BODY_R = 0.72
const NECK_R = 0.54
const BOTTOM_Y = -0.8
const FILL_TOP_Y = 0.12
const LABEL_Y = -0.27
const LABEL_H = 0.7
const LABEL_ARC = 2.15 // radians of wrap

const BASE_YAW = -0.32
const BASE_PITCH = 0.1
// Pointer rotation limits: X ±6°, Y ±9°. Idle drift stays inside these.
const MAX_PITCH = (6 * Math.PI) / 180
const MAX_YAW = (9 * Math.PI) / 180
const IDLE_YAW = (3 * Math.PI) / 180
const POINTER_RESPONSE = 12

function v(x: number, y: number) {
  return new Vector2(x, y)
}

function glassProfile() {
  return [
    v(0, BOTTOM_Y),
    v(0.61, BOTTOM_Y),
    v(0.685, BOTTOM_Y + 0.02),
    v(BODY_R, BOTTOM_Y + 0.08),
    v(BODY_R, 0.5),
    v(0.7, 0.6),
    v(0.65, 0.69),
    v(0.57, 0.76),
    v(NECK_R, 0.8),
    v(NECK_R, 0.92),
  ]
}

function powderProfile() {
  const pts = [v(0, BOTTOM_Y + 0.035), v(0.61, BOTTOM_Y + 0.035), v(0.67, BOTTOM_Y + 0.08), v(0.675, FILL_TOP_Y - 0.06)]
  // Soft mound on top, the way free-flowing crystals settle.
  for (let i = 1; i <= 8; i++) {
    const t = i / 8
    const r = 0.675 * (1 - t)
    pts.push(v(r, FILL_TOP_Y - 0.06 + Math.sin((t * Math.PI) / 2) * 0.08))
  }
  return pts
}

function capProfile() {
  return [v(NECK_R, 0.81), v(0.595, 0.84), v(0.6, 0.875), v(0.6, 1.24), v(0.585, 1.285), v(NECK_R, 1.305), v(0, 1.305)]
}

/** Vertical knurling on the cap skirt, applied as a radial displacement. */
function knurl(geo: BufferGeometry) {
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const r = Math.hypot(x, z)
    if (r < 0.585 || y < 0.875 || y > 1.25) continue
    const a = Math.atan2(x, z)
    const nr = r + Math.max(0, Math.cos(a * 72)) * 0.011
    pos.setXYZ(i, (x / r) * nr, y, (z / r) * nr)
  }
  geo.computeVertexNormals()
}

/** Tiny seeded noise texture used as a bump map for the powder. */
function grainTexture() {
  const size = 128
  const c = document.createElement("canvas")
  c.width = c.height = size
  const ctx = c.getContext("2d")!
  const img = ctx.createImageData(size, size)
  let s = 7
  for (let i = 0; i < size * size; i++) {
    s = (s * 16807) % 2147483647
    const n = 150 + ((s / 2147483647) * 105) | 0
    img.data.set([n, n, n, 255], i * 4)
  }
  ctx.putImageData(img, 0, 0)
  const t = new CanvasTexture(c)
  t.wrapS = t.wrapT = RepeatWrapping
  t.repeat.set(6, 3)
  return t
}

function shadowTexture() {
  const c = document.createElement("canvas")
  c.width = c.height = 128
  const ctx = c.getContext("2d")!
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, "rgba(23,23,25,0.55)")
  g.addColorStop(0.45, "rgba(23,23,25,0.2)")
  g.addColorStop(1, "rgba(23,23,25,0)")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new CanvasTexture(c)
}

function labelTexture(label: ReagentLabel, maxAniso: number) {
  const W = 1024
  const H = 544
  const c = document.createElement("canvas")
  c.width = W
  c.height = H
  const ctx = c.getContext("2d")!
  const font = (w: number, px: number) => `${w} ${px}px Manrope, Arial, sans-serif`
  const spaced = (text: string, x: number, y: number, spacing: number, align: "left" | "right" = "left") => {
    const chars = [...text]
    const width = chars.reduce((sum, ch) => sum + ctx.measureText(ch).width + spacing, -spacing)
    let cx = align === "right" ? x - width : x
    for (const ch of chars) {
      ctx.fillText(ch, cx, y)
      cx += ctx.measureText(ch).width + spacing
    }
  }

  ctx.fillStyle = "#fbfaf8"
  ctx.fillRect(0, 0, W, H)

  // Crimson brand band.
  ctx.fillStyle = RED
  ctx.fillRect(0, 0, W, 96)
  ctx.fillStyle = "#ffffff"
  ctx.font = font(700, 34)
  ctx.textBaseline = "middle"
  spaced("PIOCHEM", 96, 50, 10)
  ctx.font = font(600, 17)
  ctx.globalAlpha = 0.8
  spaced("LABORATORY CHEMICALS", W - 96, 50, 4, "right")
  ctx.globalAlpha = 1

  ctx.textBaseline = "alphabetic"
  ctx.fillStyle = INK
  ctx.font = font(600, 72)
  ctx.fillText(label.name, 96, 206)

  ctx.fillStyle = "#55565a"
  ctx.font = font(500, 28)
  ctx.fillText(label.formula, 96, 258)
  ctx.font = font(500, 22)
  ctx.fillText(label.meta, 96, 296)

  ctx.fillStyle = RED
  ctx.font = font(700, 19)
  spaced(label.grade.toUpperCase(), 96, 352, 4)

  // Hairline + footer.
  ctx.fillStyle = "#d9d5d1"
  ctx.fillRect(96, 392, W - 192, 2)
  ctx.fillStyle = "#8a8a8e"
  ctx.font = font(600, 17)
  spaced(label.lot.toUpperCase(), 96, 452, 3)
  ctx.fillStyle = INK
  ctx.font = font(600, 64)
  ctx.textAlign = "right"
  ctx.fillText(label.quantity, W - 96, 470)
  ctx.textAlign = "left"

  // Small hazard-style pictogram frame — kept as an empty outline, no claim.
  ctx.strokeStyle = "#c9c4c0"
  ctx.lineWidth = 2
  ctx.save()
  ctx.translate(W - 150, 225)
  ctx.rotate(Math.PI / 4)
  ctx.strokeRect(-36, -36, 72, 72)
  ctx.restore()

  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = Math.min(8, maxAniso)
  return t
}

export function createReagentScene(canvas: HTMLCanvasElement, opts: ReagentSceneOptions): ReagentSceneHandle {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.setClearColor(0x000000, 0)

  const scene = new Scene()
  const camera = new PerspectiveCamera(24, 1, 0.1, 50)

  // One-time prefiltered studio environment: cheap, gives the glass real reflections.
  const pmrem = new PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const envRT = pmrem.fromScene(room, 0.04)
  scene.environment = envRT.texture
  scene.environmentIntensity = 0.85
  room.dispose()
  pmrem.dispose()

  const key = new DirectionalLight("#fffdf8", 2.15)
  key.position.set(3, 5, 4)
  const rim = new DirectionalLight(new Color("#eaded8"), 1.15)
  rim.position.set(-4, 1.5, -3)
  scene.add(key, rim)

  const geometries: BufferGeometry[] = []
  const materials: Material[] = []
  const textures: Texture[] = []
  const track = <T,>(x: T, list: unknown[]) => (list.push(x), x)

  const jar = new Group()
  const tilt = new Group()
  tilt.add(jar)
  scene.add(tilt)

  // Contents — matte white crystalline powder.
  const grain = track(grainTexture(), textures)
  const powderGeo = track(new LatheGeometry(powderProfile(), 64), geometries)
  const powderMat = track(
    new MeshStandardMaterial({ color: "#f1eee9", roughness: 0.9, bumpMap: grain, bumpScale: 1.6, envMapIntensity: 0.55 }),
    materials,
  )
  jar.add(new Mesh(powderGeo, powderMat))

  // Physical surface detail adapted from the original Chemical Maker vessel.
  // Instancing keeps the powder bed dimensional without hundreds of draw calls.
  const grainGeo = track(new IcosahedronGeometry(1, 0), geometries)
  const crystalGeo = track(new OctahedronGeometry(1, 0), geometries)
  const pelletGeo = track(new SphereGeometry(1, 10, 8), geometries)
  const grainMat = track(new MeshStandardMaterial({ color: "#fbfaf7", roughness: 0.96 }), materials)
  const crystalMat = track(
    new MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.22, transmission: 0.18, thickness: 0.15 }),
    materials,
  )
  const pelletMat = track(new MeshStandardMaterial({ color: "#e9e5de", roughness: 0.72 }), materials)
  const grains = new InstancedMesh(grainGeo, grainMat, 150)
  const crystals = new InstancedMesh(crystalGeo, crystalMat, 22)
  const pellets = new InstancedMesh(pelletGeo, pelletMat, 12)
  const dummy = new Object3D()
  let seed = 4127
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
  const scatter = (mesh: InstancedMesh, count: number, minScale: number, extraScale: number, lift: number) => {
    for (let i = 0; i < count; i++) {
      const radius = Math.sqrt(random()) * (BODY_R - 0.09)
      const angle = random() * Math.PI * 2
      const mound = 0.065 * (1 - Math.pow(radius / BODY_R, 2))
      dummy.position.set(radius * Math.cos(angle), FILL_TOP_Y - 0.035 + mound + random() * lift, radius * Math.sin(angle))
      dummy.rotation.set(random() * Math.PI, random() * Math.PI, random() * Math.PI)
      dummy.scale.setScalar(minScale + random() * extraScale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
    jar.add(mesh)
  }
  scatter(grains, 150, 0.012, 0.018, 0.035)
  scatter(crystals, 22, 0.032, 0.034, 0.06)
  scatter(pellets, 12, 0.025, 0.022, 0.05)

  // Label — opaque paper wrapped on the front of the jar.
  const labelGeo = track(
    new CylinderGeometry(BODY_R + 0.004, BODY_R + 0.004, LABEL_H, 64, 1, true, -LABEL_ARC / 2, LABEL_ARC),
    geometries,
  )
  const labelMap = track(labelTexture(opts.label, renderer.capabilities.getMaxAnisotropy()), textures)
  const labelMat = track(new MeshStandardMaterial({ map: labelMap, roughness: 0.62 }), materials)
  const labelMesh = new Mesh(labelGeo, labelMat)
  labelMesh.position.y = LABEL_Y
  jar.add(labelMesh)

  // Glass — back faces first, then front faces, so transparency sorts cleanly.
  const glassGeo = track(new LatheGeometry(glassProfile(), 72), geometries)
  const glassProps = {
    color: "#d9dfdf",
    roughness: 0.09,
    metalness: 0,
    transmission: 0.52,
    thickness: 0.24,
    ior: 1.46,
    clearcoat: 0.7,
    clearcoatRoughness: 0.12,
    transparent: true,
    depthWrite: false,
    envMapIntensity: 1,
  }
  const glassBack = track(new MeshPhysicalMaterial({ ...glassProps, side: BackSide, opacity: 0.16 }), materials)
  const glassFront = track(new MeshPhysicalMaterial({ ...glassProps, side: FrontSide, opacity: 0.22 }), materials)
  // Fresnel edge: glass gets denser toward its silhouette, the way real glass reads on a light backdrop.
  for (const m of [glassBack, glassFront]) {
    m.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `float fres = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 2.6);
        gl_FragColor.a = mix(gl_FragColor.a, 0.68, fres);
        #include <dithering_fragment>`,
      )
    }
  }
  const back = new Mesh(glassGeo, glassBack)
  const front = new Mesh(glassGeo, glassFront)
  back.renderOrder = 1
  front.renderOrder = 2
  jar.add(back, front)

  // Crisp edge catches make the transparent wall and thick base readable on warm white.
  const edgeMat = track(new MeshBasicMaterial({ color: "#aab6b8", transparent: true, opacity: 0.34 }), materials)
  const baseRing = new Mesh(track(new TorusGeometry(BODY_R - 0.04, 0.012, 8, 96), geometries), edgeMat)
  baseRing.position.y = BOTTOM_Y + 0.055
  baseRing.rotation.x = Math.PI / 2
  const shoulderRing = new Mesh(track(new TorusGeometry(BODY_R - 0.018, 0.008, 8, 96), geometries), edgeMat)
  shoulderRing.position.y = 0.51
  shoulderRing.rotation.x = Math.PI / 2
  jar.add(baseRing, shoulderRing)

  // Ribbed black screw cap.
  const capGeo = track(new LatheGeometry(capProfile(), 192), geometries)
  knurl(capGeo)
  const capMat = track(
    new MeshPhysicalMaterial({ color: "#111113", roughness: 0.32, clearcoat: 0.48, clearcoatRoughness: 0.24 }),
    materials,
  )
  jar.add(new Mesh(capGeo, capMat))

  // Grounding shadow — a single soft quad, no shadow maps.
  const shadowMap = track(shadowTexture(), textures)
  const shadowGeo = track(new CircleGeometry(1, 48), geometries)
  const shadowMat = track(new MeshBasicMaterial({ map: shadowMap, transparent: true, depthWrite: false }), materials)
  const shadow = new Mesh(shadowGeo, shadowMat)
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = BOTTOM_Y - 0.08
  shadow.scale.set(1.05, 0.55, 1)
  scene.add(shadow)

  // Scale the jar itself for each layout without changing the stage or camera.
  let visualScale = 1
  const setVisualScale = () => {
    const viewportWidth = window.innerWidth
    visualScale =
      viewportWidth >= 1600
        ? 0.73
        : viewportWidth >= 1360
          ? 0.72
          : viewportWidth >= 1200
            ? 0.7
            : viewportWidth >= 900
              ? 0.69
              : viewportWidth >= 700
                ? 0.68
                : 0.78
    jar.scale.setScalar(visualScale)
    shadow.position.y = BOTTOM_Y * visualScale - 0.08
    shadow.scale.set(1.05 * visualScale, 0.55 * visualScale, 1)
  }

  // --- Sizing -------------------------------------------------------------
  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    setVisualScale()
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    const tan = Math.tan((camera.fov * Math.PI) / 360)
    const dist = Math.max(2.42 / 2 / tan, 1.7 / 2 / (tan * camera.aspect))
    camera.position.set(0, 0.42, dist)
    camera.lookAt(0, 0.12, 0)
    camera.updateProjectionMatrix()
  }

  // --- Motion -------------------------------------------------------------
  // Inertial follow adapted from ChemicalMaker MaterialObject3D: velocity pulled toward
  // the target and bled off by exponential drag.
  const target = { x: 0, y: 0 }
  const state = { x: 0, y: 0, vx: 0, vy: 0 }
  let active = false
  let raf = 0
  let last = 0
  let t = 0
  let firstFrame = true

  const apply = () => {
    tilt.rotation.set(BASE_PITCH + state.x, BASE_YAW + state.y, 0)
    if (!opts.reducedMotion) {
      const float = Math.sin(t * 0.7) * 0.025
      jar.position.y = float
      jar.rotation.z = Math.sin(t * 0.5) * 0.008
      // Pointer and idle motion add together; neither replaces the other.
      jar.rotation.y = Math.sin(t * 0.28) * IDLE_YAW
      shadow.scale.set((1.05 - float * 0.9) * visualScale, (0.55 - float * 0.45) * visualScale, 1)
      shadowMat.opacity = 0.9 - float * 3
    }
  }

  const render = () => {
    renderer.render(scene, camera)
    if (firstFrame) {
      firstFrame = false
      opts.onFirstFrame?.()
    }
  }

  const tick = (now: number) => {
    const dt = Math.min((now - (last || now)) / 1000, 1 / 30)
    last = now
    t += dt
    // Delta-time-aware, critically damped response: most of the target is reached
    // in roughly 350 ms, with smooth inertia and no overshoot across refresh rates.
    const drag = Math.exp(-2 * POINTER_RESPONSE * dt)
    const stiffness = POINTER_RESPONSE * POINTER_RESPONSE
    state.vx = (state.vx + (target.x - state.x) * stiffness * dt) * drag
    state.vy = (state.vy + (target.y - state.y) * stiffness * dt) * drag
    state.x += state.vx * dt
    state.y += state.vy * dt
    apply()
    render()
    raf = requestAnimationFrame(tick)
  }

  const start = () => {
    if (raf || opts.reducedMotion || !active || document.hidden) return
    last = 0
    raf = requestAnimationFrame(tick)
  }
  const stop = () => {
    cancelAnimationFrame(raf)
    raf = 0
  }

  const ro = new ResizeObserver(() => {
    resize()
    if (!raf) render()
  })
  ro.observe(canvas)
  const onVisibility = () => (document.hidden ? stop() : start())
  document.addEventListener("visibilitychange", onVisibility)

  resize()
  apply()
  // Re-draw the label once Manrope is ready so the canvas text uses the brand face.
  document.fonts?.load("600 40px Manrope").then(() => {
    const next = labelTexture(opts.label, renderer.capabilities.getMaxAnisotropy())
    labelMat.map = next
    labelMap.dispose()
    textures.push(next)
    if (!raf) render()
  })
  render()

  return {
    setPointer(p) {
      if (opts.reducedMotion) return
      // Face turns toward the cursor: up = tip back, right = turn right.
      target.x = p ? p.y * MAX_PITCH : 0
      target.y = p ? p.x * MAX_YAW : 0
    },
    setActive(next) {
      active = next
      if (active) start()
      else stop()
    },
    dispose() {
      stop()
      ro.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      geometries.forEach((g) => g.dispose())
      materials.forEach((m) => m.dispose())
      textures.forEach((x) => x.dispose())
      envRT.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
