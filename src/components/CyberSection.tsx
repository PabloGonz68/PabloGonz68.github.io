import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HackerLaptop from './HackerLaptop'
import { useApp } from '../lib/AppContext'

// ── Inline SVG Icons ─────────────────────────────────────────
const ICONS: Record<string, React.ReactNode> = {
  metasploit: <img src="/assets/svgs/cyber/metasploit.svg" alt="Metasploit" style={{ width: '100%', height: '100%', filter: 'brightness(0) invert(1)' }} />,
  wireshark:  <img src="/assets/svgs/cyber/wireshark.svg"  alt="Wireshark"  style={{ width: '100%', height: '100%', filter: 'brightness(0) invert(1)' }} />,
  burpsuite:  <img src="/assets/svgs/cyber/burpsuite.svg"  alt="Burp Suite" style={{ width: '100%', height: '100%', filter: 'brightness(0) invert(1)' }} />,
  hashcat:    <img src="/assets/svgs/cyber/hashcat.svg"    alt="Hashcat"    style={{ width: '100%', height: '100%', filter: 'brightness(0) invert(1)' }} />,
  kalilinux:  <img src="/assets/svgs/cyber/kalilinux.svg"  alt="Kali Linux" style={{ width: '100%', height: '100%', filter: 'brightness(0) invert(1)' }} />,
  elasticsearch: <img src="/assets/svgs/cyber/elasticsearch.svg" alt="ELK" style={{ width: '100%', height: '100%', filter: 'brightness(0) invert(1)' }} />,
  kibana:     <img src="/assets/svgs/cyber/kibana.svg"     alt="Kibana"     style={{ width: '100%', height: '100%', filter: 'brightness(0) invert(1)' }} />,
  logstash:   <img src="/assets/svgs/cyber/logstash.svg"   alt="Logstash"   style={{ width: '100%', height: '100%', filter: 'brightness(0) invert(1)' }} />,
  graylog:    <img src="/assets/svgs/cyber/graylog.svg"    alt="Graylog"    style={{ width: '100%', height: '100%', filter: 'brightness(0) invert(1)' }} />,
  snort:      <img src="/assets/svgs/cyber/snort.svg"      alt="Snort"      style={{ width: '100%', height: '100%', filter: 'brightness(0) invert(1)' }} />,
  opnsense:   <img src="/assets/svgs/cyber/opnsense.svg"   alt="OPNsense"   style={{ width: '100%', height: '100%', filter: 'brightness(0) invert(1)' }} />,
  sonarqube:  <img src="/assets/svgs/cyber/sonarqube.svg"  alt="SonarQube"  style={{ width: '100%', height: '100%', filter: 'brightness(0) invert(1)' }} />,
  wazuh: (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1L2 6v6c0 5.25 4.25 10.15 10 11.35C17.75 22.15 22 17.25 22 12V6L12 1zm0 2.18L20 7.3V12c0 4.1-3.25 7.95-8 9.1C7.25 19.95 4 16.1 4 12V7.3l8-4.12z"/>
      <path d="M12 7l-4 2v3c0 2.5 1.75 4.85 4 5.45 2.25-.6 4-2.95 4-5.45V9l-4-2z" opacity=".7"/>
    </svg>
  ),
  nmap: (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="2"/>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
      <path d="M12 6v2M12 16v2M6 12H4M20 12h-2M8.46 8.46l-1.42-1.42M16.96 16.96l-1.42-1.42M8.46 15.54l-1.42 1.42M16.96 7.04l-1.42 1.42" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2"/>
    </svg>
  ),
  gobuster: (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
      <path d="M7 9h5M9.5 6.5v5" strokeWidth="1.2" stroke="currentColor" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  johntheripper: (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
    </svg>
  ),
  bacula: (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.54 15.46 0 12.34 0c-1.71 0-3.22.77-4.27 1.99L6.5 3.5 4.96 2.18C4.39 1.67 3.7 1.38 3 1.38 1.34 1.38 0 2.72 0 4.38c0 .94.44 1.78 1.13 2.34L2 7.44V19c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM11 17H9v-2h2v2zm0-4H9v-4h2v4zm4 4h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </svg>
  ),
  volatility: (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
      <path d="M13 9l1.5 2.5L16 10l2 3H10l3-4z" opacity=".6"/>
    </svg>
  ),
  autopsy: (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
    </svg>
  ),
  ftkimager: (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4C2.9 4 2 4.9 2 6zm2 0h16v14H4V6z"/>
      <circle cx="12" cy="13" r="3.5"/>
      <circle cx="12" cy="13" r="1.5" fill="var(--bg-base)"/>
      <path d="M8 6h8v2H8z" opacity=".5"/>
    </svg>
  ),
  owaspzap: (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" opacity=".2"/>
      <path d="M12 3.18L5 6.3V11c0 4.52 3.02 8.76 7 9.93 3.98-1.17 7-5.41 7-9.93V6.3l-7-3.12zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
  ),
  dirbuster: (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm2-4H6v-2h10v2z"/>
      <path d="M13 10h3l-4-4v3c0 .55.45 1 1 1z" opacity=".6"/>
    </svg>
  ),
}

// ── Tool data by category ────────────────────────────────────
const CATEGORIES_BASE = [
  {
    id: 'blue',
    color: '#60a5fa',
    glowColor: 'rgba(96,165,250,0.15)',
    borderColor: 'rgba(96,165,250,0.25)',
    tools: [
      { name: 'Wazuh',       iconKey: 'wazuh',         cat: 'SIEM / XDR'              },
      { name: 'ELK Stack',   iconKey: 'elasticsearch', cat: 'Análisis de eventos'      },
      { name: 'Graylog',     iconKey: 'graylog',       cat: 'Log Management'           },
      { name: 'Snort',       iconKey: 'snort',         cat: 'IDS / IPS'               },
      { name: 'OPNsense',    iconKey: 'opnsense',      cat: 'Firewall'                 },
      { name: 'Bacula',      iconKey: 'bacula',        cat: 'Backup & Recovery'        },
    ],
  },
  {
    id: 'red',
    color: '#f87171',
    glowColor: 'rgba(248,113,113,0.15)',
    borderColor: 'rgba(248,113,113,0.25)',
    tools: [
      { name: 'Metasploit',       iconKey: 'metasploit',    cat: 'Exploitation'         },
      { name: 'Nmap',             iconKey: 'nmap',          cat: 'Reconnaissance'       },
      { name: 'Hashcat / JtR',    iconKey: 'hashcat',       cat: 'Password Cracking'    },
      { name: 'Gobuster',         iconKey: 'gobuster',      cat: 'Enumeración activa'   },
    ],
  },
  {
    id: 'web',
    color: '#fb923c',
    glowColor: 'rgba(251,146,60,0.15)',
    borderColor: 'rgba(251,146,60,0.25)',
    tools: [
      { name: 'Burp Suite',  iconKey: 'burpsuite',  cat: 'Web Security'              },
      { name: 'OWASP ZAP',   iconKey: 'owaspzap',   cat: 'Automatización escaneos'   },
      { name: 'SonarQube',   iconKey: 'sonarqube',  cat: 'SAST'                      },
    ],
  },
  {
    id: 'forensics',
    color: '#c084fc',
    glowColor: 'rgba(192,132,252,0.15)',
    borderColor: 'rgba(192,132,252,0.25)',
    tools: [
      { name: 'Volatility',   iconKey: 'volatility', cat: 'Memory Forensics'  },
      { name: 'Autopsy',      iconKey: 'autopsy',    cat: 'Forense digital'   },
      { name: 'FTK Imager',   iconKey: 'ftkimager',  cat: 'Forense digital'   },
      { name: 'Wireshark',    iconKey: 'wireshark',  cat: 'Traffic Analysis'  },
    ],
  },
]

const WORKSHOP_EXTRAS = [
  { color: '#a855f7', tags: ['Red TOR', 'OSINT', 'Privacidad'], github: 'https://github.com/alcinacarlos/Taller-TOR-Grupo2', dates: [{ label: '', date: '6 Feb 2026' }] },
  { color: '#22d3ee', tags: ['Concienciación', 'Ingeniería Social', 'Educación'], dates: [{ label: '', date: '23 Feb 2026' }, { label: '', date: '25 Feb 2026' }] },
  { color: '#4ade80', tags: ['CTF', 'Forense', 'Criptografía', 'Web', 'OSINT'] },
]

// ── Stagger variants ──────────────────────────────────────────
const containerV = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}
const itemV = {
  hidden:  { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
}

// ── Tool card ─────────────────────────────────────────────────
function ToolCard({ tool, accent }: { tool: any; accent: string }) {
  const [h, setH] = useState(false)
  const icon = ICONS[tool.iconKey]

  return (
    <motion.div
      variants={itemV}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{
        background: h ? `${accent}0a` : 'var(--card-bg)',
        border: `1px solid ${h ? accent + '40' : 'var(--card-border)'}`,
        borderRadius: '14px',
        padding: '16px 14px 14px',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(6px)',
        transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
        boxShadow: h ? `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${accent}20` : '0 2px 8px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: h ? `radial-gradient(ellipse at 50% 0%, ${accent}18 0%, transparent 65%)` : 'transparent',
        transition: 'background 0.3s',
      }} />

      <div style={{
        width: '36px', height: '36px',
        borderRadius: '10px',
        background: h ? `${accent}18` : `${accent}0d`,
        border: `1px solid ${accent}${h ? '40' : '20'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '10px',
        color: accent,
        transition: 'background 0.3s, border-color 0.3s',
        padding: '7px',
        flexShrink: 0,
        position: 'relative', zIndex: 1,
      }}>
        {icon}
      </div>

      <div style={{
        fontWeight: 600, fontSize: '0.78rem',
        color: h ? 'var(--text-primary)' : 'var(--text-muted)',
        marginBottom: '3px',
        transition: 'color 0.2s',
        lineHeight: 1.25,
        position: 'relative', zIndex: 1,
      }}>
        {tool.name}
      </div>
      <div style={{
        fontSize: '0.62rem', fontFamily: 'var(--font-mono)',
        color: accent, opacity: 0.75, letterSpacing: '0.03em',
        lineHeight: 1.2,
        position: 'relative', zIndex: 1,
      }}>
        {tool.cat}
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${accent}70, transparent)`,
        opacity: h ? 1 : 0, transition: 'opacity 0.3s',
      }} />
    </motion.div>
  )
}

// ── Category block ────────────────────────────────────────────
function CategoryBlock({ cat, i }: { cat: any; i: number }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'var(--card-bg)',
        border: `1px solid ${cat.borderColor}`,
        borderRadius: '18px',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left',
          padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px',
          borderBottom: expanded ? `1px solid ${cat.borderColor}` : 'none',
          transition: 'border-color 0.3s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: cat.color,
            boxShadow: `0 0 8px ${cat.color}80`,
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)',
            letterSpacing: '0.01em',
          }}>
            {cat.label}
          </span>
          <span style={{
            fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
            color: cat.color, background: `${cat.color}18`,
            border: `1px solid ${cat.color}30`,
            padding: '1px 8px', borderRadius: '999px',
          }}>
            {cat.tools.length} tools
          </span>
        </div>

        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ color: 'var(--text-subtle)', flexShrink: 0 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="tools"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <motion.div
              variants={containerV}
              initial="hidden"
              animate="visible"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                gap: '10px',
                padding: '16px',
              }}
            >
              {cat.tools.map((tool: any) => (
                <ToolCard key={tool.name} tool={tool} accent={cat.color} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Workshop card ─────────────────────────────────────────────
interface WorkshopCardProps {
  color: string
  badge: string
  title: string
  subtitle: string
  venue: string
  dates: { label?: string; date: string }[]
  description: string
  tags: string[]
  github?: string
  context: string
}

function WorkshopCard({ color, badge, title, subtitle, venue, dates, description, tags, github, context }: WorkshopCardProps) {
  const [h, setH] = useState(false)
  return (
    <motion.div
      onHoverStart={() => setH(true)}
      onHoverEnd={() => setH(false)}
      whileHover={{ y: -5, boxShadow: `0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px ${color}30` }}
      transition={{ duration: 0.25 }}
      style={{
        background: h ? `${color}07` : 'var(--card-bg)',
        border: `1px solid ${h ? color + '35' : 'var(--card-border)'}`,
        borderTop: `3px solid ${color}`,
        borderRadius: '18px',
        padding: '22px 22px 20px',
        transition: 'background 0.3s, border-color 0.3s',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', gap: '14px',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '120px', height: '100px',
        background: `radial-gradient(circle at top right, ${color}15, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <span style={{
            display: 'inline-block', marginBottom: '8px',
            fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em',
            fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
            color, background: `${color}18`,
            border: `1px solid ${color}30`,
            padding: '2px 9px', borderRadius: '999px',
          }}>
            {badge}
          </span>
          <h4 style={{
            fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)',
            lineHeight: 1.3, marginBottom: '2px',
          }}>{title}</h4>
          <p style={{
            fontSize: '0.78rem', fontStyle: 'italic',
            color: color, opacity: 0.85, marginBottom: '6px',
          }}>{subtitle}</p>
          <p style={{
            fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
            color: 'var(--text-subtle)', letterSpacing: '0.02em',
          }}>{context}</p>
        </div>

        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
              background: 'rgba(100,100,100,0.1)',
              border: '1px solid rgba(100,100,100,0.2)',
              color: 'var(--text-subtle)',
              transition: 'background 0.2s, color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = `${color}20`
              ;(e.currentTarget as HTMLElement).style.color = color
              ;(e.currentTarget as HTMLElement).style.borderColor = `${color}40`
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(100,100,100,0.1)'
              ;(e.currentTarget as HTMLElement).style.color = 'var(--text-subtle)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,100,100,0.2)'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
            </svg>
          </a>
        )}
      </div>

      <div style={{
        background: 'rgba(100,100,100,0.05)',
        border: '1px solid rgba(100,100,100,0.1)',
        borderRadius: '10px', padding: '10px 14px',
        display: 'flex', flexDirection: 'column', gap: '6px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '0.74rem', color: 'var(--text-muted)',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span style={{ fontWeight: 600 }}>{venue}</span>
        </div>

        {dates.map((d, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
          }}>
            {d.label && (
              <span style={{
                color, background: `${color}15`, border: `1px solid ${color}25`,
                padding: '1px 7px', borderRadius: '999px',
                fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.05em',
                flexShrink: 0,
              }}>{d.label}</span>
            )}
            <span style={{ color: 'var(--text-subtle)' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {d.date}
            </span>
          </div>
        ))}
      </div>

      <p style={{
        fontSize: '0.8rem', color: 'var(--text-muted)',
        lineHeight: 1.65, margin: 0,
      }}>{description}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {tags.map(t => (
          <span key={t} style={{
            fontSize: '0.63rem', fontWeight: 600, fontFamily: 'var(--font-mono)',
            padding: '2px 9px', borderRadius: '999px',
            color, background: `${color}12`, border: `1px solid ${color}28`,
          }}>{t}</span>
        ))}
      </div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function CyberSection() {
  const { t } = useApp()

  const CATEGORIES = CATEGORIES_BASE.map((base, i) => ({
    ...base,
    label: t.cyber.categories[i].label,
  }))

  const WORKSHOPS = t.cyber.workshopList.map((w, i) => {
    let dates = WORKSHOP_EXTRAS[i].dates
    if (!dates) dates = t.cyber.ctfDates
    return {
      ...w,
      ...WORKSHOP_EXTRAS[i], 
      dates,
    }
  })

  return (
    <section
      id="cybersecurity"
      style={{
        padding: '100px 0 120px',
        background: 'linear-gradient(180deg, var(--bg-base) 0%, var(--bg-surface) 50%, var(--bg-base) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none' }} />

      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(79,139,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
            color: 'rgba(79,139,255,0.6)', letterSpacing: '0.3em',
            textTransform: 'uppercase', marginBottom: '10px',
          }}>
            {t.cyber.label}
          </p>
          <h2 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800,
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            letterSpacing: '-0.025em', lineHeight: 1.1,
            marginBottom: '14px',
          }}>
            <span className="text-gradient-cyan">{t.cyber.title}</span>
          </h2>
          <p style={{
            color: 'var(--text-muted)', fontSize: '0.95rem',
            maxWidth: '460px', margin: '0 auto', lineHeight: 1.7,
          }}>
            {t.cyber.sub}
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,380px) 1fr',
          gap: '40px',
          alignItems: 'start',
        }}
          className="flex-col-mobile"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '20px',
              padding: '40px 24px 48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              position: 'sticky',
              top: '80px',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
              color: 'rgba(79,139,255,0.4)', letterSpacing: '0.15em',
              textTransform: 'uppercase', alignSelf: 'flex-start',
            }}>
              // writeups terminal
            </div>
            <HackerLaptop />
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              color: 'var(--text-subtle)', textAlign: 'center', marginTop: '4px',
              letterSpacing: '0.02em',
            }}>
              {t.cyber.writeups}
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {CATEGORIES.map((cat, i) => (
              <CategoryBlock key={cat.id} cat={cat} i={i} />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: 'flex', justifyContent: 'center', gap: '0',
            marginTop: '56px',
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          {[
            { val: '17+', label: t.cyber.statsTools },
            { val: '4',   label: t.cyber.statsCategories },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                flex: 1, textAlign: 'center', padding: '24px 16px',
                borderRight: i < 2 ? '1px solid var(--card-border)' : 'none',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700,
                color: '#60a5fa', letterSpacing: '-0.02em',
              }}>{s.val}</div>
              <div style={{
                fontSize: '0.72rem', color: 'var(--text-subtle)',
                marginTop: '4px', letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: '72px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
              color: 'rgba(34,211,238,0.55)', letterSpacing: '0.3em',
              textTransform: 'uppercase', marginBottom: '8px',
            }}>{t.cyber.activityLabel}</p>
            <h3 style={{
              fontFamily: 'var(--font-sans)', fontWeight: 800,
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              letterSpacing: '-0.02em', color: 'var(--text-primary)',
            }}>
              {t.cyber.workshops} <span className="text-gradient-cyan">{t.cyber.talks}</span>
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}>
            {WORKSHOPS.map((w, i) => (
              <WorkshopCard key={i} {...w} />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
