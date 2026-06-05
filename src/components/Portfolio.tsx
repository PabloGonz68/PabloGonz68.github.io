import { useState, useEffect } from 'react'
import {
  motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence,
} from 'framer-motion'
import {
  ChevronDown, Mail, Phone, MapPin, Github, Linkedin,
  ExternalLink, Download, Shield, Menu, X,
} from 'lucide-react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import emailjs from '@emailjs/browser'
import ScrollReveal from './ScrollReveal'
import CyberSection from './CyberSection'
import ExperienceSection from './ExperienceSection'
import EducationSection from './EducationSection'

// ── Typewriter ────────────────────────────────────────────────
function useTypewriter(texts: string[], speed = 90, del = 45, pause = 2200) {
  const [txt, setTxt] = useState('')
  const [idx, setIdx] = useState(0)
  const [del_, setDel] = useState(false)
  useEffect(() => {
    const cur = texts[idx]
    let t: ReturnType<typeof setTimeout>
    if (!del_) {
      if (txt.length < cur.length) t = setTimeout(() => setTxt(cur.slice(0, txt.length + 1)), speed)
      else t = setTimeout(() => setDel(true), pause)
    } else {
      if (txt.length > 0) t = setTimeout(() => setTxt(cur.slice(0, txt.length - 1)), del)
      else { setDel(false); setIdx((p) => (p + 1) % texts.length) }
    }
    return () => clearTimeout(t)
  }, [txt, del_, texts, idx])
  return txt
}

// ── Navbar ────────────────────────────────────────────────────
const NAV = [
  { l: 'Inicio', h: '#hero' },
  { l: 'Tecnologías', h: '#skills' },
  { l: 'Experiencia', h: '#experience' },
  { l: 'Educación', h: '#education' },
  { l: 'Proyectos', h: '#projects' },
  { l: 'Ciberseguridad', h: '#cybersecurity' },
  { l: 'Contacto', h: '#contact' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const h = () => { if (window.innerWidth >= 1024) setOpen(false) }
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const go = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          height: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px',
          background: scrolled || open ? 'rgba(4,6,15,0.92)' : 'transparent',
          backdropFilter: scrolled || open ? 'blur(20px)' : 'none',
          borderBottom: scrolled || open ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s',
        }}
      >
        {/* Logo */}
        <motion.button
          whileHover={{ opacity: 0.8 }}
          onClick={() => go('#hero')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.88rem',
            fontWeight: 700, color: '#60a5fa', letterSpacing: '0.01em',
            flexShrink: 0,
          }}
        >
          {'<pablo />'}
        </motion.button>

        {/* Desktop links — visible only on lg+ */}
        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }} className="hidden lg:flex">
          {NAV.map((n) => (
            <button
              key={n.l}
              onClick={() => go(n.h)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '6px 11px', borderRadius: '8px',
                fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)',
                fontFamily: 'var(--font-sans)',
                transition: 'color 0.2s, background 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#f1f5ff'
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-muted)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {n.l}
            </button>
          ))}
        </div>

        {/* Hamburger button — visible below lg */}
        <motion.button
          className="lg:hidden"
          onClick={() => setOpen(!open)}
          whileTap={{ scale: 0.9 }}
          style={{
            background: open ? 'rgba(79,139,255,0.12)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${open ? 'rgba(79,139,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '10px',
            cursor: 'pointer',
            color: open ? '#60a5fa' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '38px', height: '38px',
            transition: 'background 0.25s, border-color 0.25s, color 0.25s',
          }}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X size={18} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Menu size={18} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden"
            style={{
              position: 'fixed', top: '60px', left: 0, right: 0, zIndex: 99,
              background: 'rgba(4,6,15,0.97)',
              backdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              padding: '8px 0 16px',
            }}
          >
            {NAV.map((n, i) => (
              <motion.button
                key={n.l}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => go(n.h)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  width: '100%', background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                  padding: '13px 28px',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem', fontFamily: 'var(--font-sans)', fontWeight: 500,
                  transition: 'color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#f1f5ff'
                  e.currentTarget.style.background = 'rgba(79,139,255,0.06)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-muted)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <span style={{
                  width: '4px', height: '4px', borderRadius: '50%',
                  background: '#4f8bff', opacity: 0.6, flexShrink: 0,
                }} />
                {n.l}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── Skill card ────────────────────────────────────────────────
function SkillCard({ s, i }: { s: { name: string; icon: string; category: string }; i: number }) {
  const [h, setH] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? 'rgba(79,139,255,0.08)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${h ? 'rgba(79,139,255,0.35)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '14px', padding: '20px 12px 16px',
        textAlign: 'center', cursor: 'default',
        backdropFilter: 'blur(6px)',
        transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
        boxShadow: h ? '0 8px 24px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <img src={s.icon} alt={s.name}
        style={{
          width: '34px', height: '34px', objectFit: 'contain', margin: '0 auto 10px', display: 'block',
          filter: h ? 'brightness(1.1) drop-shadow(0 0 6px rgba(96,165,250,0.4))' : 'none',
          transition: 'filter 0.3s',
        }}
      />
      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: h ? '#f1f5ff' : '#c8d5f0', transition: 'color 0.2s' }}>
        {s.name}
      </div>
      <div style={{ fontSize: '0.62rem', color: 'var(--text-subtle)', marginTop: '3px', fontFamily: 'var(--font-mono)' }}>
        {s.category}
      </div>
    </motion.div>
  )
}

// ── Project card ──────────────────────────────────────────────
const GRADIENTS = [
  'linear-gradient(135deg,#0f2744,#1a3a6e)',
  'linear-gradient(135deg,#2d1b69,#1a0f4d)',
  'linear-gradient(135deg,#1a4a2e,#143d22)',
  'linear-gradient(135deg,#4a1a1a,#3d1414)',
]

function ProjectCard({ p, i }: { p: typeof PROJECTS[0]; i: number }) {
  const [h, setH] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const mx = useMotionValue(0); const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 250, damping: 25 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 250, damping: 25 })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  const TC: Record<string, string> = {
    React: '#22d3ee', 'Spring Boot': '#4ade80', Java: '#f87171',
    MySQL: '#38bdf8', 'Tailwind CSS': '#818cf8', Angular: '#f43f5e',
    '.NET Core': '#a78bfa', 'SQL Server': '#60a5fa', Docker: '#38bdf8',
    SQLite: '#fbbf24', PHP: '#a78bfa', Laravel: '#fb7185', 'Android Studio': '#4ade80',
  }

  return (
    <ScrollReveal variant="fadeInUp" delay={i * 0.1}>
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={() => { mx.set(0); my.set(0); setH(false) }}
        onMouseEnter={() => setH(true)}
        style={{
          rotateX: rx, rotateY: ry,
          transformStyle: 'preserve-3d',
          perspective: 800,
        }}
      >
        <div style={{
          background: 'rgba(255,255,255,0.025)',
          border: `1px solid ${h ? 'rgba(79,139,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: '18px', overflow: 'hidden',
          boxShadow: h ? '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,139,255,0.2)' : '0 4px 16px rgba(0,0,0,0.3)',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}>
          {/* Image */}
          <div style={{
            height: '220px', overflow: 'hidden', position: 'relative',
            background: imgErr ? GRADIENTS[i % GRADIENTS.length] : undefined,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {!imgErr ? (
              <motion.img
                src={p.image} alt={p.title}
                onError={() => setImgErr(true)}
                animate={{ scale: h ? 1.06 : 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '1.8rem', fontWeight: 900 }}>
                {p.title}
              </span>
            )}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(4,6,15,0.85) 0%, transparent 55%)',
            }} />

            {/* Hover actions */}
            <AnimatePresence>
              {h && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}
                >
                  {[
                    { href: p.github, icon: Github, label: 'GitHub' },
                    { href: p.demo, icon: ExternalLink, label: 'Demo' },
                  ].map(({ href, icon: Icon, label }) => href !== '#' && (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          background: 'rgba(4,6,15,0.85)', backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(79,139,255,0.3)', borderRadius: '8px',
                          padding: '7px', color: '#60a5fa', display: 'flex', cursor: 'pointer',
                        }}
                      >
                        <Icon size={14} />
                      </motion.div>
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content */}
          <div style={{ padding: '22px 24px 26px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5ff', marginBottom: '8px' }}>
              {p.title}
            </h3>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '16px' }}>
              {p.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {p.tech.map((t) => (
                <span key={t} style={{
                  fontSize: '0.68rem', fontWeight: 500, fontFamily: 'var(--font-mono)',
                  padding: '3px 10px', borderRadius: '999px',
                  color: TC[t] || '#93c5fd',
                  background: `${TC[t] || '#60a5fa'}14`,
                  border: `1px solid ${TC[t] || '#60a5fa'}30`,
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  )
}

// ── Datos ─────────────────────────────────────────────────────
const SKILLS = [
  { name: 'Java',                icon: '/assets/svgs/java.svg',                   category: 'Backend'   },
  { name: 'Spring Boot',         icon: '/assets/svgs/spring.svg',                 category: 'Backend'   },
  { name: 'React',               icon: '/assets/svgs/react.svg',                  category: 'Frontend'  },
  { name: 'Angular',             icon: '/assets/svgs/angularJS.svg',              category: 'Frontend'  },
  { name: 'TypeScript',          icon: '/assets/svgs/typescript.svg',             category: 'Frontend'  },
  { name: 'MySQL',               icon: '/assets/svgs/mysql.svg',                  category: 'Database'  },
  { name: 'MongoDB',             icon: '/assets/svgs/mongodb.svg',                category: 'Database'  },
  { name: 'Tailwind CSS',        icon: '/assets/svgs/tailwind CSS.svg',           category: 'Frontend'  },
  { name: 'Astro',               icon: '/assets/svgs/astro.svg',                  category: 'Frontend'  },
  { name: 'PHP',                 icon: '/assets/svgs/PHP.svg',                    category: 'Backend'   },
  { name: 'Laravel',             icon: '/assets/svgs/Laravel.svg',               category: 'Backend'   },
  { name: 'Docker',              icon: '/assets/svgs/Docker.svg',                 category: 'DevOps'    },
  { name: '.NET',                icon: '/assets/svgs/NET.svg',                    category: 'Backend'   },
  { name: 'WordPress',           icon: '/assets/svgs/WordPress.svg',              category: 'CMS'       },
  { name: 'Android Studio',      icon: '/assets/svgs/AndroidStudio.svg',          category: 'Mobile'    },
  { name: 'Python',              icon: '/assets/svgs/Python.svg',                 category: 'Backend'   },
  { name: 'SQL Server',          icon: '/assets/svgs/Microsoft SQL Server.svg',   category: 'Database'  },
  { name: 'Git',                 icon: '/assets/svgs/git.svg',                    category: 'DevOps'    },
  { name: 'GitHub',              icon: '/assets/svgs/github.svg',                 category: 'DevOps'    },
  { name: 'Linux',               icon: '/assets/svgs/linux.svg',                  category: 'DevOps'    },
  { name: 'Bash Scripting',      icon: '/assets/svgs/gnubash.svg',                category: 'DevOps'    },
  { name: 'Postman',             icon: '/assets/svgs/postman.svg',                category: 'Tools'     },
  { name: 'JWT',                 icon: '/assets/svgs/jsonwebtokens.svg',          category: 'Security'  },
  { name: 'Odoo',                icon: '/assets/svgs/odoo.svg',                   category: 'CMS'       },
  { name: 'Unity',               icon: '/assets/svgs/unity.svg',                  category: 'Game Dev'  },
]

// ── Section header ─────────────────────────────────────────
// Usa whileInView nativo de Framer Motion — viewport={{ once: true }} garantiza
// que la animación solo se ejecuta UNA vez sin importar los re-renders del padre.
// El patrón useInView + animate={isInView ? 'visible' : 'hidden'} es susceptible
// a re-triggers cuando el componente padre actualiza estado frecuentemente.
function SH({ label, title, sub }: { label: string; title: string; sub: string }) {
  return (
    <motion.div
      className="text-center mb-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
        color: 'rgba(79,139,255,0.55)', letterSpacing: '0.3em',
        textTransform: 'uppercase', marginBottom: '10px',
      }}>{label}</p>
      <h2 style={{
        fontFamily: 'var(--font-sans)', fontWeight: 800,
        fontSize: 'clamp(1.8rem, 4vw, 2.9rem)',
        letterSpacing: '-0.025em', color: '#f1f5ff', marginBottom: '12px',
      }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto', lineHeight: 1.65 }}>{sub}</p>
    </motion.div>
  )
}

const PROJECTS = [
  {

    title: 'Hospeda',
    description: 'Plataforma de hospedaje entre particulares desarrollada con React, Spring Boot y MySQL.',
    tech: ['React', 'Spring Boot', 'Java', 'MySQL', 'Tailwind CSS'],
    image: '/projects/hospeda.webp',
    github: '#',
    demo: '#',
  },
  {
    title: 'MixPlace',
    description: 'Aplicación de gestión de tareas con Angular, .NET Core y base de datos SQL Server.',
    tech: ['Angular', '.NET Core', 'SQL Server', 'Docker'],
    image: '/task-management-app.png',
    github: '#',
    demo: '#',
  },
  {
    title: 'Unitidy',
    description: 'App móvil de gestión de tareas para pisos de estudiantes con Android Studio y SQLite.',
    tech: ['Java', 'Android Studio', 'SQLite'],
    image: '/projects/unitidy (2).webp',
    github: '#',
    demo: '#',
  },
  {
    title: 'Basic Instagram Clone',
    description: 'Clon básico de Instagram desarrollado con Laravel, PHP, Tailwind CSS y MySQL.',
    tech: ['Laravel', 'PHP', 'Tailwind CSS', 'MySQL'],
    image: '/cms-dashboard-admin-panel.png',
    github: '#',
    demo: '#',
  },
]

function CoinAvatar() {
  const [flipped, setFlipped] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)

  // Auto-flip cada 10 segundos
  useEffect(() => {
    const id = setInterval(() => {
      if (!isHovering) {
        setFlipped(f => !f)
      }
    }, 10000)
    return () => clearInterval(id)
  }, [isHovering])

  const handleHoverStart = () => {
    setIsHovering(true)
    if (!isFlipping) {
      setIsFlipping(true)
      setFlipped(f => !f)
      setTimeout(() => setIsFlipping(false), 900)
    }
  }

  const handleHoverEnd = () => {
    setIsHovering(false)
  }

  const rotation = flipped ? 180 : 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: '28px' }}
    >
      {/* Contenedor interactivo */}
      <motion.div
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        style={{
          position: 'relative',
          width: '148px',
          height: '148px',
          margin: '0 auto',
          cursor: 'pointer',
        }}
      >
        {/* Animated gradient ring + GLOW GENERAL */}
        <motion.div
          animate={{
            background: flipped
              ? 'conic-gradient(from 0deg, #4f8bff, #a855f7, #22d3ee, #4ade80, #4f8bff)'
              : 'conic-gradient(from 0deg, #4f8bff, #22d3ee, #60a5fa, #3b82f6, #4f8bff)',
            rotate: [0, 360],
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
            background: { duration: 0.8 },
          }}
          style={{
            position: 'absolute',
            inset: '-3px',
            borderRadius: '50%',
            padding: '3px',
            zIndex: 0,
            /* Aquí está el nuevo resplandor uniforme */
            boxShadow: '0 0 25px 8px rgba(79, 139, 255, 0.4)',
          }}
        />

        {/* Contenedor de la moneda (SIN LEVITACIÓN, solo perspectiva 3D) */}
        <div
          style={{
            position: 'relative',
            width: '148px',
            height: '148px',
            perspective: '600px',
            zIndex: 1,
          }}
        >
          {/* 3D flip inner */}
          <motion.div
            animate={{ rotateY: rotation }}
            transition={{
              duration: 0.85,
              ease: [0.25, 0.8, 0.25, 1],
            }}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* FRONT — Profile photo (Fondo sólido añadido para evitar que sea translúcida) */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              overflow: 'hidden',
              border: '3px solid transparent',
              background: 'linear-gradient(var(--bg-base), var(--bg-base)) padding-box, linear-gradient(135deg, #4f8bff, #22d3ee) border-box',
              backgroundColor: 'var(--bg-base)', /* Fuerza opacidad */
            }}>
              <img
                src="/assets/fotoPablo.webp"
                alt="Pablo González Silva"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  display: 'block',
                  backgroundColor: '#000', /* Capa extra de seguridad contra la transparencia */
                }}
              />
            </div>

            {/* BACK — Logo */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              overflow: 'hidden',
              border: '3px solid transparent',
              background: 'linear-gradient(var(--bg-base), var(--bg-base)) padding-box, linear-gradient(135deg, #a855f7, #22d3ee) border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#06242E', /* Fuerza opacidad */
            }}>
              <img
                src="/assets/logo-pg-2.webp"
                alt="PG Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '50%',
                  display: 'block',
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Hover hint ring pulse */}
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0, 0.35, 0],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '50%',
            border: '2px solid rgba(79,139,255,0.6)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      </motion.div>
    </motion.div>
  )
}
// ── Componente principal ──────────────────────────────────────
export default function Portfolio() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], ['0%', '30%'])
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 30 })
  const tw = useTypewriter(['Desarrollador Full Stack', 'Especialista React & Spring Boot', 'Apasionado por la Ciberseguridad'])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await emailjs.send('service_msl1fzv', 'template_i2n5eel', form, 'hSwt5QFBvJ9dlEx7O')
      setStatus('sent')
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  const dlCV = () => {
    const a = document.createElement('a')
    a.href = '/assets/cv/CV Pablo González Silva.pdf'
    a.download = 'CV Pablo González Silva.pdf'
    a.click()
  }

  // SH movido fuera del componente — ver línea ~330

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* Progress bar */}
      <motion.div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 200,
        background: 'linear-gradient(90deg, #4f8bff, #22d3ee)',
        scaleX, transformOrigin: '0%',
        boxShadow: '0 0 8px rgba(79,139,255,0.5)',
      }} />

      <Navbar />

      {/* ═══════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════ */}
      <section id="hero" style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', paddingTop: '60px',
      }}>
        {/* Grid bg */}
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

        {/* Radial glow — UNO, centrado, sutil */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(79,139,255,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <motion.div style={{ y: heroY }} className="container mx-auto px-6 z-10 text-center">

          {/* Avatar — Coin Flip */}
          <CoinAvatar />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '999px', padding: '5px 14px', marginBottom: '18px',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', flexShrink: 0 }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              Disponible para nuevos proyectos
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-sans)', fontWeight: 900,
              fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
              color: '#f1f5ff', letterSpacing: '-0.035em',
              lineHeight: 1.08, marginBottom: '14px',
            }}
          >
            Pablo González <span className="text-gradient">Silva</span>
          </motion.h1>

          {/* Typewriter */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              color: '#60a5fa', fontWeight: 500, minHeight: '1.6em', marginBottom: '20px',
            }}
          >
            {tw}<span className="cursor" />
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            style={{
              fontSize: 'clamp(0.88rem, 1.8vw, 0.97rem)',
              color: 'var(--text-muted)', maxWidth: '540px',
              margin: '0 auto 36px', lineHeight: 1.75,
            }}
          >
            Técnico superior graduado en DAM y DAW con experiencia en desarrollo web y móvil.
            Especializado en tecnologías modernas, arquitecturas escalables y ciberseguridad.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.6 }}
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '44px' }}
          >
            {[
              {
                label: 'Contactar', icon: <Mail size={15} />, primary: true,
                action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }),
              },
              { label: 'Descargar CV', icon: <Download size={15} />, primary: false, action: dlCV },
              {
                label: 'Ver Proyectos', icon: null, primary: false,
                action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }),
              },
            ].map(({ label, icon, primary, action }) => (
              <motion.button
                key={label}
                onClick={action}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '11px 26px', borderRadius: '999px',
                  fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600,
                  cursor: 'pointer',
                  background: primary
                    ? 'linear-gradient(135deg, #4f8bff, #3b82f6)'
                    : 'rgba(255,255,255,0.04)',
                  border: primary
                    ? '1px solid rgba(79,139,255,0.4)'
                    : '1px solid rgba(255,255,255,0.1)',
                  color: primary ? 'white' : 'var(--text-muted)',
                  boxShadow: primary ? '0 4px 20px rgba(79,139,255,0.3)' : 'none',
                  transition: 'box-shadow 0.2s',
                }}
              >
                {icon}{label}
              </motion.button>
            ))}
          </motion.div>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            style={{
              display: 'flex', gap: '18px', justifyContent: 'center',
              flexWrap: 'wrap', padding: '0 16px',
            }}
          >
            {[
              { href: 'https://github.com/PabloGonz68', Icon: Github },
              { href: 'https://www.linkedin.com/in/pablo-gonz%C3%A1lez-silva-/', Icon: Linkedin },
              { href: 'mailto:pablogonzalezsilva6@gmail.com', Icon: Mail },
              {
                href: '#cybersecurity', Icon: Shield,
                onClick: () => document.getElementById('cybersecurity')?.scrollIntoView({ behavior: 'smooth' }),
              },
            ].map(({ href, Icon, onClick }) => (
              <motion.a
                key={href}
                href={onClick ? undefined : href}
                onClick={onClick}
                target={onClick ? undefined : '_blank'}
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -2 }}
                style={{ color: 'var(--text-subtle)', display: 'flex', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#60a5fa')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-subtle)')}
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)' }}
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-subtle)', letterSpacing: '0.15em' }}>
              SCROLL
            </span>
            <ChevronDown size={16} style={{ color: 'rgba(79,139,255,0.5)' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SKILLS
          ═══════════════════════════════════════════════════ */}
      <section id="skills" style={{
        padding: '100px 0',
        background: 'linear-gradient(180deg, var(--bg-base), var(--bg-surface))',
      }}>
        <div className="container mx-auto px-6">
          <SH label="> stack técnico" title="Tecnologías" sub="Experiencia en un amplio stack de tecnologías modernas" />
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
          }}>
            {SKILLS.map((s, i) => (
              <div key={s.name} style={{ flex: '0 1 110px', minWidth: '100px', maxWidth: '140px' }}>
                <SkillCard s={s} i={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          EXPERIENCE
          ═══════════════════════════════════════════════════ */}
      <ExperienceSection />

      {/* ═══════════════════════════════════════════════════
          EDUCATION
          ═══════════════════════════════════════════════════ */}
      <EducationSection />

      {/* ═══════════════════════════════════════════════════
          PROJECTS
          ═══════════════════════════════════════════════════ */}
      <section id="projects" style={{ padding: '100px 0', background: 'var(--bg-surface)' }}>
        <div className="container mx-auto px-6">
          <SH label="> mi trabajo" title="Proyectos" sub="Algunos de mis trabajos más destacados" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '20px',
          }}>
            {PROJECTS.map((p, i) => <ProjectCard key={p.title} p={p} i={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CYBERSECURITY
          ═══════════════════════════════════════════════════ */}
      <CyberSection />

      {/* ═══════════════════════════════════════════════════
          CONTACT
          ═══════════════════════════════════════════════════ */}
      <section id="contact" style={{ padding: '100px 0', background: 'var(--bg-surface)' }}>
        <div className="container mx-auto px-6">
          <SH label="> hablemos" title="Contacto" sub="¿Tienes un proyecto en mente? ¡Hablemos!" />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '48px', maxWidth: '1000px', margin: '0 auto',
          }}>
            {/* Info */}
            <ScrollReveal variant="slideInLeft">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { Icon: Mail, label: 'Email', val: 'pablogonzalezsilva6@gmail.com', href: 'mailto:pablogonzalezsilva6@gmail.com' },
                  { Icon: Phone, label: 'Teléfono', val: '+34 601 42 11 10', href: 'tel:+34601421110' },
                  { Icon: MapPin, label: 'Ubicación', val: 'Cádiz, España', href: '#' },
                ].map(({ Icon, label, val, href }) => (
                  <motion.div
                    key={label} whileHover={{ x: 5 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
                  >
                    <div style={{
                      background: 'rgba(79,139,255,0.1)',
                      border: '1px solid rgba(79,139,255,0.2)',
                      borderRadius: '10px', padding: '11px', display: 'flex', flexShrink: 0,
                    }}>
                      <Icon size={18} style={{ color: '#60a5fa' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5ff', marginBottom: '2px' }}>{label}</div>
                      <a href={href} style={{
                        fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#60a5fa')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                      >
                        {val}
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            {/* Form */}
            <ScrollReveal variant="slideInRight">
              <form onSubmit={onSubmit} style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '18px', padding: '28px',
                display: 'flex', flexDirection: 'column', gap: '14px',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Input placeholder="Nombre" name="name" required value={form.name} onChange={onChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-blue-500/50" />
                  <Input type="email" placeholder="Email" name="email" required value={form.email} onChange={onChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-blue-500/50" />
                </div>
                <Input placeholder="Asunto" name="subject" required value={form.subject} onChange={onChange}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-blue-500/50" />
                <Textarea placeholder="Mensaje" name="message" rows={5} required value={form.message} onChange={onChange}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-blue-500/50 resize-none" />

                <AnimatePresence mode="wait">
                  {status === 'sent' ? (
                    <motion.div key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{
                        background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
                        borderRadius: '10px', padding: '12px', textAlign: 'center',
                        color: '#86efac', fontSize: '0.85rem'
                      }}>
                      ✓ Mensaje enviado correctamente
                    </motion.div>
                  ) : status === 'error' ? (
                    <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{
                        background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
                        borderRadius: '10px', padding: '12px', textAlign: 'center',
                        color: '#fca5a5', fontSize: '0.85rem'
                      }}>
                      ✗ Error al enviar. Inténtalo de nuevo.
                    </motion.div>
                  ) : (
                    <motion.button
                      key="btn"
                      type="submit"
                      disabled={status === 'sending'}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        background: 'linear-gradient(135deg, #4f8bff, #3b82f6)',
                        border: 'none', borderRadius: '10px', padding: '13px',
                        color: 'white', fontSize: '0.9rem', fontWeight: 600,
                        fontFamily: 'var(--font-sans)', cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                        opacity: status === 'sending' ? 0.6 : 1,
                        boxShadow: '0 4px 16px rgba(79,139,255,0.3)',
                      }}
                    >
                      {status === 'sending' ? 'Enviando...' : 'Enviar Mensaje'}
                    </motion.button>
                  )}
                </AnimatePresence>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════ */}
      <footer style={{
        padding: '28px 24px',
        background: 'var(--bg-base)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', color: '#4f8bff', fontSize: '0.85rem', fontWeight: 700 }}>
            {'<pablo />'}
          </span>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} Pablo González Silva · Astro · React · Framer Motion
          </p>
          <div style={{ display: 'flex', gap: '14px' }}>
            {[
              { href: 'https://github.com/PabloGonz68', Icon: Github },
              { href: 'https://www.linkedin.com/in/pablo-gonz%C3%A1lez-silva-/', Icon: Linkedin },
              { href: 'mailto:pablogonzalezsilva6@gmail.com', Icon: Mail },
            ].map(({ href, Icon }) => (
              <motion.a key={href} href={href} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -2 }}
                style={{ color: 'var(--text-subtle)', display: 'flex', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#60a5fa')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-subtle)')}
              >
                <Icon size={17} />
              </motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
