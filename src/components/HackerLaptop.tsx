import { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Environment, Html, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useApp } from '../lib/AppContext'

// ── Typewriter para la terminal ──────────────────────────────
function useTerminalLines(lines: { text: string; delay: number }[]) {
  const [typing, setTyping] = useState<{ lineIdx: number; charIdx: number } | null>(null)
  const [chars, setChars] = useState<string[]>([])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    lines.forEach((line, li) => {
      timers.push(setTimeout(() => setTyping({ lineIdx: li, charIdx: 0 }), line.delay))
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (!typing) return
    const { lineIdx, charIdx } = typing
    const text = lines[lineIdx].text
    if (charIdx < text.length) {
      const t = setTimeout(() => {
        setChars((prev) => {
          const next = [...prev]
          next[lineIdx] = text.slice(0, charIdx + 1)
          return next
        })
        setTyping({ lineIdx, charIdx: charIdx + 1 })
      }, 42)
      return () => clearTimeout(t)
    } else {
      setTyping(null)
    }
  }, [typing])

  return { chars, currentLine: typing?.lineIdx ?? null }
}

const LINES = [
  { text: 'root@pablo:~$ nmap -A writeups.local', delay: 400 },
  { text: 'Host: 10.0.0.1  Ports: 80/open', delay: 2200 },
  { text: 'root@pablo:~$ cat /etc/motd', delay: 3800 },
  { text: '47 writeups · 12 CVEs · HTB Pro', delay: 5400 },
  { text: 'root@pablo:~/writeups$ _', delay: 7000 },
]

// ── Variantes de animación ───────────────────────────────────
const flashVariants = {
  hidden: { opacity: 0 },
  flash: { opacity: [0, 1, 0.6, 0], transition: { duration: 0.5, times: [0, 0.1, 0.5, 1] } },
}
const expandVariants = {
  hidden: { opacity: 0, scale: 0.1, borderRadius: '24px' },
  visible: { opacity: 1, scale: 1, borderRadius: '0px', transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
}

// ── Terminal Screen (HTML overlay on 3D) ─────────────────────
function TerminalScreen({ chars, currentLine }: { chars: string[]; currentLine: number | null }) {
  return (
    <div style={{
      width: '290px',
      height: '182px',
      background: '#010a05',
      overflow: 'hidden',
      position: 'relative',
      fontSmoothing: 'antialiased',
    }}>
      {/* Scanlines */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)',
        pointerEvents: 'none', zIndex: 2,
      }} />
      {/* Screen glare */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 3,
      }} />
      {/* Terminal content */}
      <div style={{
        padding: '10px 12px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.58rem',
        lineHeight: 1.7,
        color: '#00e676',
        height: '100%',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          marginBottom: '6px', paddingBottom: '5px',
          borderBottom: '1px solid rgba(0,230,118,0.08)',
        }}>
          {['#e74c3c', '#f39c12', '#2ecc71'].map((c, i) => (
            <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: c, opacity: 0.85 }} />
          ))}
          <span style={{ color: 'rgba(0,230,118,0.3)', fontSize: '0.5rem', marginLeft: '5px', letterSpacing: '0.08em' }}>
            pablo@kali ~
          </span>
        </div>
        {LINES.map((line, li) => {
          const text = chars[li] || ''
          const isTyping = currentLine === li
          if (!text && !isTyping) return null
          const isCmd = text.includes('root@') || text.includes('pablo@')
          return (
            <div key={li} style={{
              color: isCmd ? '#00e676' : 'rgba(0,230,118,0.55)',
              textShadow: isCmd ? '0 0 8px rgba(0,230,118,0.4)' : 'none',
              whiteSpace: 'nowrap', overflow: 'hidden',
              display: 'flex', alignItems: 'center',
            }}>
              <span>{text}</span>
              {isTyping && (
                <span style={{
                  display: 'inline-block', width: '6px', height: '11px',
                  background: '#00e676', opacity: 0.8, marginLeft: '1px',
                  animation: 'blink 0.9s step-end infinite',
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Dimensions ───────────────────────────────────────────────
const BASE_W = 3.2
const BASE_H = 0.1
const BASE_D = 2.1
const LID_W = 3.2
const LID_H = 0.06
const LID_D = 2.0
const LID_OPEN_ANGLE = 1.15 // radians (~66° from flat = ~114° opening angle)
const SCREEN_W = 2.7
const SCREEN_H = 1.7

// ── 3D Laptop Model ─────────────────────────────────────────
function LaptopModel({
  hovered,
  setHovered,
  onClick,
  chars,
  currentLine,
}: {
  hovered: boolean
  setHovered: (v: boolean) => void
  onClick: () => void
  chars: string[]
  currentLine: number | null
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const { pointer } = useThree()

  // Dark metallic material (shared)
  const bodyMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#1a2030'),
    metalness: 0.92,
    roughness: 0.18,
    clearcoat: 0.3,
    clearcoatRoughness: 0.15,
    envMapIntensity: 1.8,
  }), [])

  const bodyMatLight = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#222d42'),
    metalness: 0.9,
    roughness: 0.15,
    clearcoat: 0.4,
    clearcoatRoughness: 0.12,
    envMapIntensity: 2.0,
  }), [])

  const keyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(hovered ? '#2a3550' : '#1e2a3f'),
    metalness: 0.5,
    roughness: 0.6,
  }), [hovered])

  const screenBgMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#010a05'),
    emissive: new THREE.Color('#00e676'),
    emissiveIntensity: 0.06,
  }), [])

  // Animation
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    // Subtle idle float
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.04 - 0.3

    if (hovered) {
      // Mouse-follow tilt
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -0.25 + pointer.y * 0.12,
        0.08
      )
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.25,
        0.08
      )
    } else {
      // Idle slow oscillation
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -0.25,
        0.04
      )
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        Math.sin(t * 0.3) * 0.08,
        0.04
      )
    }
  })

  // Key layout: [keysPerRow]
  const KEY_ROWS = [
    { count: 13, y: 0 },
    { count: 13, y: 1 },
    { count: 12, y: 2 },
    { count: 11, y: 3 },
    { count: 9, y: 4 },
  ]

  return (
    <group
      ref={groupRef}
      position={[0, -0.3, 0]}
      rotation={[-0.25, 0, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
    >
      {/* ═══════ BASE (bottom chassis) ═══════ */}
      <RoundedBox
        args={[BASE_W, BASE_H, BASE_D]}
        radius={0.06}
        smoothness={4}
        position={[0, 0, 0]}
        material={bodyMat}
        castShadow
        receiveShadow
      />

      {/* ── Top plate (slightly inset, where keyboard sits) ── */}
      <mesh position={[0, BASE_H / 2 + 0.001, -0.05]}>
        <boxGeometry args={[BASE_W - 0.15, 0.003, BASE_D - 0.15]} />
        <meshStandardMaterial color="#161e2e" metalness={0.7} roughness={0.35} />
      </mesh>

      {/* ── Keyboard keys ── */}
      <group position={[0, BASE_H / 2 + 0.01, 0]}>
        {KEY_ROWS.map((row, ri) => {
          const kw = 0.17
          const kd = 0.13
          const gap = 0.04
          const spaceIdx = ri === 4 ? 4 : -1
          const spaceW = 0.65
          const totalW = row.count * (kw + gap) - gap + (spaceIdx >= 0 ? (spaceW - kw) : 0)
          let xCursor = -totalW / 2

          return (
            <group key={ri} position={[0, 0, -0.6 + ri * (kd + gap)]}>
              {Array.from({ length: row.count }).map((_, ki) => {
                const isSpace = ki === spaceIdx
                const w = isSpace ? spaceW : kw
                const x = xCursor + w / 2
                xCursor += w + gap
                return (
                  <RoundedBox key={ki} args={[w, 0.02, kd]} radius={0.005} smoothness={2} position={[x, 0, 0]}>
                    <meshStandardMaterial
                      color={hovered ? '#4f6085' : '#283247'}
                      metalness={0.4}
                      roughness={0.7}
                    />
                  </RoundedBox>
                )
              })}
            </group>
          )
        })}
      </group>

      {/* ── Trackpad ── */}
      <RoundedBox
        args={[0.75, 0.006, 0.5]}
        radius={0.02}
        smoothness={2}
        position={[0, BASE_H / 2 + 0.004, 0.45]}
      >
        <meshPhysicalMaterial
          color="#1c2638"
          metalness={0.75}
          roughness={0.2}
          clearcoat={0.5}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* ═══════ HINGE (horizontal cylinder along X) ═══════ */}
      <mesh
        position={[0, BASE_H / 2, -BASE_D / 2 + 0.05]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.04, 0.04, BASE_W * 0.85, 20]} />
        <meshPhysicalMaterial
          color="#151c2a"
          metalness={0.95}
          roughness={0.12}
          clearcoat={0.6}
        />
      </mesh>

      {/* ═══════ LID (pivots from hinge) ═══════ */}
      <group position={[0, BASE_H / 2, -BASE_D / 2 + 0.05]}>
        <group rotation={[LID_OPEN_ANGLE, 0, 0]}>
          {/* Lid outer shell */}
          <RoundedBox
            args={[LID_W, LID_H, LID_D]}
            radius={0.05}
            smoothness={4}
            position={[0, 0, -LID_D / 2]}
            material={bodyMatLight}
            castShadow
          />

          {/* ── Screen bezel (dark, slightly inset on inner face -Y) ── */}
          <mesh position={[0, -LID_H / 2 - 0.001, -LID_D / 2]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[LID_W - 0.15, LID_D - 0.12]} />
            <meshStandardMaterial color="#0a0e18" metalness={0.1} roughness={0.95} />
          </mesh>

          {/* ── Screen emissive background ── */}
          <mesh position={[0, -LID_H / 2 - 0.003, -LID_D / 2]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[SCREEN_W, SCREEN_H]} />
            <primitive object={screenBgMat} attach="material" />
          </mesh>

          {/* ── Camera dot (top center of lid inner face) ── */}
          <mesh position={[0, -LID_H / 2 - 0.002, -0.08]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color="#1a2030" metalness={0.4} roughness={0.6} />
          </mesh>
          {/* Camera lens highlight */}
          <mesh position={[0, -LID_H / 2 - 0.002, -0.08]}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshStandardMaterial color="#2a3040" emissive="#334" emissiveIntensity={0.3} />
          </mesh>

          {/* ── HTML terminal overlay (on inner face, facing user) ── */}
          <Html
            transform
            position={[0, -LID_H / 2 - 0.005, -LID_D / 2]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.0094}
            style={{ pointerEvents: 'none' }}
          >
            <TerminalScreen chars={chars} currentLine={currentLine} />
          </Html>

          {/* ── Apple-style logo glow on outer face (+Y) ── */}
          <mesh position={[0, LID_H / 2 + 0.001, -LID_D / 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.15, 24]} />
            <meshStandardMaterial
              color="#2a3550"
              emissive="#4f8bff"
              emissiveIntensity={0.15}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      </group>

      {/* ── Front edge indicator light ── */}
      <mesh position={[0, BASE_H / 2 + 0.001, BASE_D / 2 - 0.08]}>
        <boxGeometry args={[0.03, 0.003, 0.015]} />
        <meshStandardMaterial
          color="#00e676"
          emissive="#00e676"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

// ── Scene ────────────────────────────────────────────────────
function LaptopScene({
  hovered,
  setHovered,
  onClick,
  chars,
  currentLine,
}: {
  hovered: boolean
  setHovered: (v: boolean) => void
  onClick: () => void
  chars: string[]
  currentLine: number | null
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={0.7} color="#e8f0ff" castShadow />
      <directionalLight position={[-4, 3, -3]} intensity={0.25} color="#4f8bff" />
      {/* Green screen glow */}
      <pointLight position={[0, 0.8, 0.5]} intensity={0.5} color="#00e676" distance={4} decay={2} />
      {/* Rim light from behind */}
      <pointLight position={[0, 2, -3]} intensity={0.3} color="#4f8bff" distance={6} decay={2} />

      {/* Realistic metallic reflections */}
      <Environment preset="city" />

      {/* The laptop */}
      <LaptopModel
        hovered={hovered}
        setHovered={setHovered}
        onClick={onClick}
        chars={chars}
        currentLine={currentLine}
      />

      {/* Soft contact shadow beneath */}
      <ContactShadows
        position={[0, -0.75, 0]}
        opacity={0.4}
        scale={8}
        blur={2.5}
        far={3}
        color="#000020"
      />
    </>
  )
}

// ── Componente principal ─────────────────────────────────────
export default function HackerLaptop() {
  const { lang } = useApp()
  const [phase, setPhase] = useState<'idle' | 'launch' | 'expand'>('idle')
  const [hovered, setHovered] = useState(false)
  const { chars, currentLine } = useTerminalLines(LINES)

  const handleClick = () => {
    if (phase !== 'idle') return
    setPhase('launch')
    setTimeout(() => setPhase('expand'), 550)
    setTimeout(() => { window.location.href = 'https://write-up-pablo-gonzalez-silva.vercel.app/' }, 1300)
  }

  const overlays = (
    <>
      <AnimatePresence>
        {phase === 'launch' && (
          <motion.div
            key="flash"
            variants={flashVariants}
            initial="hidden"
            animate="flash"
            style={{
              position: 'fixed', inset: 0, zIndex: 99998,
              background: 'radial-gradient(ellipse at center, rgba(79,139,255,0.9) 0%, rgba(4,6,15,0.97) 70%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'expand' && (
          <motion.div
            key="expand"
            variants={expandVariants}
            initial="hidden"
            animate="visible"
            style={{
              position: 'fixed', inset: 0, zIndex: 99999,
              background: '#010a05',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            }}
          >
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 6px)',
              pointerEvents: 'none',
            }} />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              style={{ textAlign: 'center', zIndex: 1 }}
            >
              <p style={{
                fontFamily: 'var(--font-mono)', color: '#00e676',
                fontSize: '0.9rem', letterSpacing: '0.08em',
                textShadow: '0 0 20px rgba(0,230,118,0.7)', marginBottom: '6px',
              }}>
                {lang === 'es' ? 'Conectando...' : 'Connecting...'}
              </p>
              <motion.div style={{
                width: '180px', height: '2px',
                background: 'rgba(0,230,118,0.15)',
                borderRadius: '2px', margin: '14px auto 0', overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.55, delay: 0.2, ease: 'linear' }}
                  style={{ height: '100%', background: '#00e676', boxShadow: '0 0 10px rgba(0,230,118,0.8)' }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )

  return (
    <>
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '450px',
          height: '340px',
          cursor: phase === 'idle' ? 'pointer' : 'default',
        }}>
          <Canvas
            camera={{ position: [0, 4.2, 4.8], fov: 32, near: 0.1, far: 50 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            style={{ background: 'transparent' }}
            shadows
          >
            <Suspense fallback={null}>
              <LaptopScene
                hovered={hovered}
                setHovered={setHovered}
                onClick={handleClick}
                chars={chars}
                currentLine={currentLine}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Tooltip hover */}
        <AnimatePresence>
          {hovered && phase === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              style={{
                position: 'absolute', bottom: '-6px', left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(10,16,30,0.92)',
                border: '1px solid rgba(79,139,255,0.3)',
                borderRadius: '8px', padding: '5px 14px',
                fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                color: '#60a5fa', whiteSpace: 'nowrap',
                backdropFilter: 'blur(12px)', letterSpacing: '0.03em',
                zIndex: 10,
              }}
            >
              {lang === 'es' ? 'Ver write-ups →' : 'View write-ups →'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {typeof document !== 'undefined' && createPortal(overlays, document.body)}
    </>
  )
}
