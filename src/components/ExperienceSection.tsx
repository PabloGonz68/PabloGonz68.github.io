import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, MapPin, Calendar, ChevronDown, ExternalLink } from 'lucide-react'
import ScrollReveal from './ScrollReveal'
import { useApp } from '../lib/AppContext'

// Icons array matching the order of experiences in translations
const EXP_ICONS = ['🚀', '⚙️']

// ── Tech pill ─────────────────────────────────────────────────
const TECH_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  'Astro':           { text: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.25)' },
  'React':           { text: '#22d3ee', bg: 'rgba(34,211,238,0.1)',  border: 'rgba(34,211,238,0.25)' },
  'JavaScript':      { text: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)' },
  'Tailwind CSS':    { text: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.25)' },
  'PHP':             { text: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)' },
  'Java':            { text: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)' },
  'Spring Boot':     { text: '#4ade80', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.25)' },
  'Spring Security': { text: '#86efac', bg: 'rgba(134,239,172,0.1)', border: 'rgba(134,239,172,0.25)' },
  'Visual Basic .NET':{ text: '#c084fc', bg: 'rgba(192,132,252,0.1)',border: 'rgba(192,132,252,0.25)' },
  'SQL Server':      { text: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.25)' },
}

function TechPill({ name }: { name: string }) {
  const c = TECH_COLORS[name] ?? { text: '#93c5fd', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)' }
  return (
    <span style={{
      fontSize: '0.68rem', fontWeight: 600, fontFamily: 'var(--font-mono)',
      padding: '3px 11px', borderRadius: '999px',
      color: c.text, background: c.bg, border: `1px solid ${c.border}`,
      letterSpacing: '0.01em',
      transition: 'opacity 0.2s',
    }}>
      {name}
    </span>
  )
}

// ── Experience card ───────────────────────────────────────────
function ExpCard({ exp, i }: { exp: any; i: number }) {
  const [open, setOpen] = useState(true)
  const isLeft = i % 2 === 0

  return (
    <ScrollReveal variant="fadeInUp" delay={i * 0.15}>
      {/* Mobile: stacked | Desktop: alternating sides */}
      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-0">

        {/* ── Left spacer (desktop) */}
        <div className="hidden md:flex md:w-1/2 md:justify-end md:pr-10">
          {isLeft && <CardContent exp={exp} open={open} setOpen={setOpen} align="right" />}
        </div>

        {/* ── Timeline dot (desktop) */}
        <div className="hidden md:flex flex-col items-center flex-shrink-0 z-10">
          <motion.div
            whileHover={{ scale: 1.15 }}
            style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: `radial-gradient(circle, ${exp.color}22, ${exp.color}08)`,
              border: `2px solid ${exp.color}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', boxShadow: `0 0 16px ${exp.color}25`,
              cursor: 'default',
            }}
          >
            {exp.icon}
          </motion.div>
        </div>

        {/* ── Right spacer (desktop) */}
        <div className="hidden md:flex md:w-1/2 md:pl-10">
          {!isLeft && <CardContent exp={exp} open={open} setOpen={setOpen} align="left" />}
        </div>

        {/* ── Mobile: always full width */}
        <div className="flex md:hidden w-full gap-4">
          {/* Mobile dot + line */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: `${exp.color}15`,
              border: `2px solid ${exp.color}45`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', marginTop: '4px',
            }}>
              {exp.icon}
            </div>
          </div>
          <div className="flex-1">
            <CardContent exp={exp} open={open} setOpen={setOpen} align="left" />
          </div>
        </div>
      </div>
    </ScrollReveal>
  )
}

// ── Card content ──────────────────────────────────────────────
function CardContent({
  exp, open, setOpen, align,
}: {
  exp: any
  open: boolean
  setOpen: (v: boolean) => void
  align: 'left' | 'right'
}) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: `0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px ${exp.color}25` }}
      transition={{ duration: 0.25 }}
      onClick={() => setOpen(!open)}
      style={{
        width: '100%',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '18px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'background 0.3s, border-color 0.3s',
        borderTop: `3px solid ${exp.color}`,
      }}
    >
      {/* Card header */}
      <div style={{ padding: '20px 22px 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', gap: '12px',
          flexDirection: align === 'right' ? 'row-reverse' : 'row',
        }}>
          <div style={{ flex: 1, textAlign: align === 'right' ? 'right' : 'left' }}>
            {/* Badge */}
            <span style={{
              display: 'inline-block', marginBottom: '8px',
              fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em',
              fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
              color: exp.color, background: `${exp.color}15`,
              border: `1px solid ${exp.color}30`,
              padding: '2px 9px', borderRadius: '999px',
            }}>
              {exp.type}
            </span>

            <h3 style={{
              fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)',
              marginBottom: '2px', lineHeight: 1.3,
            }}>
              {exp.role}
            </h3>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              flexDirection: align === 'right' ? 'row-reverse' : 'row',
              flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: exp.color }}>
                {exp.company}
              </span>
              <span style={{ color: 'rgba(100,116,160,0.5)', fontSize: '0.7rem' }}>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-subtle)', fontSize: '0.75rem' }}>
                <MapPin size={11} />{exp.location}
              </span>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              marginTop: '6px', color: 'var(--text-subtle)', fontSize: '0.73rem',
              fontFamily: 'var(--font-mono)',
              justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
            }}>
              <Calendar size={11} />{exp.period}
            </div>
          </div>

          {/* Expand toggle */}
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              flexShrink: 0, color: 'var(--text-subtle)',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '8px', padding: '6px',
              marginTop: '2px',
            }}
          >
            <ChevronDown size={14} />
          </motion.div>
        </div>
      </div>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 22px 20px',
              borderTop: '1px solid var(--card-border)',
              paddingTop: '14px',
            }}>
              <ul style={{
                display: 'flex', flexDirection: 'column', gap: '7px',
                marginBottom: '16px', paddingLeft: '0', listStyle: 'none',
              }}>
                {exp.description.map((line: string, idx: number) => (
                  <li key={idx} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                    fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6,
                    textAlign: align === 'right' ? 'right' : 'left',
                    flexDirection: align === 'right' ? 'row-reverse' : 'row',
                  }}>
                    <span style={{
                      flexShrink: 0, marginTop: '6px',
                      width: '4px', height: '4px', borderRadius: '50%',
                      background: exp.color, opacity: 0.7,
                    }} />
                    {line}
                  </li>
                ))}
              </ul>

              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '6px',
                justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
              }}>
                {exp.tech.map((t: string) => <TechPill key={t} name={t} />)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Section header ────────────────────────────────────────────
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
        letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: '12px',
      }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto', lineHeight: 1.65 }}>{sub}</p>
    </motion.div>
  )
}

// ── Main export ───────────────────────────────────────────────
export default function ExperienceSection() {
  const { t } = useApp()

  const EXPERIENCES = t.experience.list.map((exp, i) => ({
    ...exp,
    current: i === 0 ? false : false, // Update if needed
    tech: i === 0 ? ['Astro', 'React', 'JavaScript', 'Tailwind CSS', 'PHP'] : ['Java', 'Spring Boot', 'Spring Security', 'Visual Basic .NET', 'SQL Server'],
    color: i === 0 ? '#4f8bff' : '#22d3ee',
    icon: EXP_ICONS[i],
  }))

  return (
    <section
      id="experience"
      style={{
        padding: '100px 0',
        background: 'linear-gradient(180deg, var(--bg-surface), var(--bg-base))',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Subtle grid bg */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5 }} />

      {/* Glow accent */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(79,139,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container mx-auto px-6 relative z-10">
        <SH
          label={t.experience.label}
          title={t.experience.title}
          sub={t.experience.sub}
        />

        {/* Timeline wrapper */}
        <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>

          {/* Vertical line — desktop only */}
          <div className="hidden md:block" style={{
            position: 'absolute',
            left: '50%', top: 0, bottom: 0,
            width: '1px',
            background: 'linear-gradient(180deg, transparent, rgba(79,139,255,0.25) 15%, rgba(79,139,255,0.25) 85%, transparent)',
            transform: 'translateX(-50%)',
          }} />

          {/* Mobile line */}
          <div className="md:hidden" style={{
            position: 'absolute',
            left: '18px', top: 0, bottom: 0,
            width: '1px',
            background: 'linear-gradient(180deg, transparent, rgba(79,139,255,0.2) 10%, rgba(79,139,255,0.2) 90%, transparent)',
          }} />

          {/* Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {EXPERIENCES.map((exp, i) => (
              <ExpCard key={exp.company} exp={exp} i={i} />
            ))}
          </div>
        </div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: 'center', marginTop: '48px',
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
            color: 'var(--text-subtle)', letterSpacing: '0.08em',
          }}
        >
          {t.experience.clickHint}
        </motion.p>
      </div>
    </section>
  )
}
