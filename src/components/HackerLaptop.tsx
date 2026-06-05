import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'

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

// ── Variantes ────────────────────────────────────────────────
const laptopVariants = {
  idle:  { scale: 1,    rotateY: 0,  filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
  hover: { scale: 1.03, rotateY: -3, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  launch: {
    scale:   [1, 1.08, 1.18, 1.05],
    rotateY: [0, 8, -6, 0],
    filter:  ['blur(0px)', 'blur(2px)', 'blur(4px)', 'blur(0px)'],
    transition: { duration: 0.55, times: [0, 0.3, 0.65, 1] },
  },
}
const flashVariants = {
  hidden: { opacity: 0 },
  flash:  { opacity: [0, 1, 0.6, 0], transition: { duration: 0.5, times: [0, 0.1, 0.5, 1] } },
}
const expandVariants = {
  hidden:  { opacity: 0, scale: 0.1, borderRadius: '24px' },
  visible: { opacity: 1, scale: 1, borderRadius: '0px', transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
}

// ── Componente principal ─────────────────────────────────────
export default function HackerLaptop() {
  const [phase, setPhase] = useState<'idle' | 'launch' | 'expand'>('idle')
  const [hovered, setHovered] = useState(false)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotX = useSpring(useTransform(my, [-60, 60], [6, -6]), { stiffness: 280, damping: 28 })
  const rotY = useSpring(useTransform(mx, [-100, 100], [-7, 7]), { stiffness: 280, damping: 28 })

  const { chars, currentLine } = useTerminalLines(LINES)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== 'idle') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(e.clientX - r.left - r.width / 2)
    my.set(e.clientY - r.top - r.height / 2)
  }
  const handleLeave = () => { mx.set(0); my.set(0); setHovered(false) }

  const handleClick = () => {
    if (phase !== 'idle') return
    setPhase('launch')
    setTimeout(() => setPhase('expand'), 550)
    setTimeout(() => { window.location.href = 'https://write-up-pablo-gonzalez-silva.vercel.app/' }, 1300)
  }

  // ── Overlays (montados en document.body para evitar el clipping
  //    que produce position:fixed dentro de un ancestor con CSS transform)
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
                Conectando...
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
      {/* ── Portátil ── */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          className="laptop-scene"
          style={{ cursor: phase === 'idle' ? 'pointer' : 'default' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleLeave}
          onMouseEnter={() => setHovered(true)}
          onClick={handleClick}
        >
          <motion.div
            style={{
              rotateX: hovered && phase === 'idle' ? rotX : 0,
              rotateY: hovered && phase === 'idle' ? rotY : 0,
              transformStyle: 'preserve-3d',
              width: '320px',
            }}
            animate={phase === 'launch' ? 'launch' : hovered && phase === 'idle' ? 'hover' : 'idle'}
            variants={laptopVariants}
          >
            {/* LID */}
            <motion.div
              style={{ transformOrigin: 'bottom center', transformStyle: 'preserve-3d', width: '320px' }}
              animate={{ rotateX: phase === 'idle' ? '-22deg' : '-5deg' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{
                background: 'linear-gradient(160deg, #1c2333 0%, #141c2e 60%, #0f1623 100%)',
                borderRadius: '12px 12px 0 0',
                padding: '10px',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
                position: 'relative',
              }}>
                {/* Cámara */}
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#1a2030', border: '1px solid rgba(255,255,255,0.08)',
                  margin: '0 auto 8px', position: 'relative',
                }}>
                  <div style={{ position: 'absolute', top: '1px', left: '1px', width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                </div>

                {/* Pantalla */}
                <div className="terminal-scan" style={{
                  background: '#010a05', borderRadius: '6px', height: '180px',
                  position: 'relative', overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.8)',
                  boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,230,118,0.06)',
                }}>
                  {/* Brillo */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '35%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 100%)',
                    borderRadius: '6px 6px 0 0', pointerEvents: 'none', zIndex: 3,
                  }} />

                  {/* Terminal */}
                  <div style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', lineHeight: 1.7, color: '#00e676', height: '100%', position: 'relative', zIndex: 1 }}>
                    {/* Barra título */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid rgba(0,230,118,0.08)' }}>
                      {['#e74c3c', '#f39c12', '#2ecc71'].map((c, i) => (
                        <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: c, opacity: 0.85 }} />
                      ))}
                      <span style={{ color: 'rgba(0,230,118,0.3)', fontSize: '0.52rem', marginLeft: '6px', letterSpacing: '0.08em' }}>pablo@kali ~</span>
                    </div>

                    {/* Líneas */}
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
                              display: 'inline-block', width: '7px', height: '12px',
                              background: '#00e676', opacity: 0.8, marginLeft: '1px',
                              verticalAlign: 'middle',
                              animation: 'blink 0.9s step-end infinite',
                            }} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* BASE */}
            <div style={{
              background: 'linear-gradient(180deg, #1c2333 0%, #141c2e 100%)',
              borderRadius: '0 0 10px 10px',
              padding: '14px 14px 10px',
              border: '1px solid rgba(255,255,255,0.06)',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              boxShadow: '0 14px 40px rgba(0,0,0,0.7), 0 4px 10px rgba(0,0,0,0.4)',
              position: 'relative', marginTop: '-1px',
            }}>
              {/* Teclado */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5px', marginBottom: '10px' }}>
                {[11, 12, 11, 10, 8].map((count, row) => (
                  <div key={row} style={{ display: 'flex', justifyContent: 'center', gap: '3px' }}>
                    {Array.from({ length: count }).map((_, i) => (
                      <div key={i} style={{
                        width: row === 4 && i === 3 ? '70px' : '19px',
                        height: '10px',
                        background: hovered ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.04)',
                        borderRadius: '2.5px',
                        border: '1px solid rgba(255,255,255,0.06)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                ))}
              </div>

              {/* Trackpad */}
              <div style={{
                width: '90px', height: '56px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '6px', margin: '0 auto',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              }} />

              {/* Tooltip hover */}
              <AnimatePresence>
                {hovered && phase === 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    style={{
                      position: 'absolute', bottom: '-38px', left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(10,16,30,0.92)',
                      border: '1px solid rgba(79,139,255,0.3)',
                      borderRadius: '8px', padding: '5px 14px',
                      fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                      color: '#60a5fa', whiteSpace: 'nowrap',
                      backdropFilter: 'blur(12px)', letterSpacing: '0.03em',
                    }}
                  >
                    Ver write-ups →
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Overlays via portal → escapan del stacking context del portátil ── */}
      {typeof document !== 'undefined' && createPortal(overlays, document.body)}
    </>
  )
}
