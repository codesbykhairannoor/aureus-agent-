/** Aureus Protocol · Web Application Shell.
 *  STRICT AUTHENTICATION SEPARATION:
 *  1. BEFORE LOGIN (!isLoggedIn):
 *     - Only Public Marketing Pages are accessible (Home, Features, How It Works, Ecosystem, Security, Docs).
 *     - Clean Glassmorphism Top Navbar with "Connect Wallet / Login" CTA.
 *     - Pro Dashboard routes (/terminal, /skills, /council, etc.) are protected behind the Web3 Auth Gate.
 *     - NO sidebar is displayed.
 *  2. AFTER LOGIN (isLoggedIn):
 *     - Transitions fully into the Pro Trading Dashboard with dedicated LEFT SIDEBAR.
 *     - Contains strictly authenticated trading, strategy, governance, and audit modules.
 *     - Topbar with live circuit breaker shield, breadcrumbs, and user wallet profile.
 *     - Sidebar includes quick disconnect / log out to return to marketing.
 */

import { Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import './index.css'
import { GITHUB_URL } from './config'
import { shortAddr } from './ui'
import {
  BrandLogo, IconMenu, IconClose, IconPalette, IconCheck, IconCaret,
  IconRadar, IconBot, IconBolt, IconShield, IconGavel, IconScale, IconDocs, IconWallet,
} from './icons'
import { Web3WalletProvider, WalletNavButton, useWeb3Wallet } from './web3Wallet'
import Web3AmbientLayer from './Web3AmbientLayer'

// Lazy-loaded routes for optimal bundle splitting (modular per page)
const Landing = lazy(() => import('./pages/Landing'))
const MarketingFeatures = lazy(() => import('./pages/MarketingFeatures'))
const MarketingHowItWorks = lazy(() => import('./pages/MarketingHowItWorks'))
const MarketingEcosystem = lazy(() => import('./pages/MarketingEcosystem'))
const MarketingSecurity = lazy(() => import('./pages/MarketingSecurity'))
const AuthGate = lazy(() => import('./pages/AuthGate'))

const AgentCockpit = lazy(() => import('./pages/AgentCockpit'))
const SkillStudio = lazy(() => import('./pages/SkillStudio'))
const Protocol = lazy(() => import('./pages/Protocol'))
const SkillOrchestra = lazy(() => import('./pages/SkillOrchestra'))
const Docs = lazy(() => import('./pages/Docs'))
const JudgeMode = lazy(() => import('./pages/JudgeMode'))
const TrustWallet = lazy(() => import('./pages/TrustWallet'))
const CoinMarketCap = lazy(() => import('./pages/CoinMarketCap'))
const BnbChain = lazy(() => import('./pages/BnbChain'))

/* ─────────── Navigation Configurations ─────────── */

// Dedicated Public Marketing Navigation (Before Login) - Logo navigates to Home
export const MARKETING_NAV = [
  { path: '/features', label: 'Features' },
  { path: '/how-it-works', label: 'How It Works' },
  { path: '/ecosystem', label: 'Ecosystem' },
  { path: '/security', label: 'Security & Audit' },
  { path: '/docs', label: 'Whitepaper & Specs' },
]

// Exclusively for Logged-In Pro Application (Left Sidebar)
export const PRO_CORE_NAV = [
  { path: '/terminal', label: 'Live Terminal', badge: 'LIVE', Icon: IconRadar },
  { path: '/skills', label: 'Strategy Skills', badge: '5 EDGES', Icon: IconBolt },
  { path: '/council', label: 'AI Council', badge: 'SENATE', Icon: IconScale },
]

export const PRO_VERIFY_NAV = [
  { path: '/protocol', label: 'Protocol Proofs', badge: 'ON-CHAIN', Icon: IconShield },
  { path: '/audit', label: 'Audit Scorecard', badge: '98/100', Icon: IconGavel },
]

export const PRO_ECO_NAV = [
  { path: '/trust', label: 'Trust Wallet Gate', badge: 'ESCROW', Icon: IconWallet },
  { path: '/cmc', label: 'CoinMarketCap Hub', badge: 'FEEDS', Icon: IconRadar },
  { path: '/bnb', label: 'BNB Smart Chain', badge: 'L1', Icon: IconBolt },
  { path: '/docs', label: 'Whitepaper & Specs', badge: 'V2', Icon: IconDocs },
]

// Mobile bottom tab bar (<=760px) in Pro Dashboard mode
const BOTTOM_NAV: { path: string; label: string; Icon: (p: { size?: number }) => ReactNode }[] = [
  { path: '/terminal', label: 'Terminal', Icon: IconBot },
  { path: '/skills', label: 'Skills', Icon: IconBolt },
  { path: '/council', label: 'Council', Icon: IconScale },
  { path: '/protocol', label: 'Protocol', Icon: IconShield },
  { path: '/audit', label: 'Audit', Icon: IconGavel },
]

const THEMES: { id: string; label: string; swatch: string }[] = [
  { id: 'obsidian', label: 'BNB Obsidian', swatch: '#F0B90B' },
  { id: 'daylight', label: 'Daylight Gold', swatch: '#d4a000' },
]

const PRO_PAGES: Record<string, { title: string; category: string }> = {
  '/terminal': { title: 'Live Terminal', category: 'Trading Cockpit' },
  '/skills': { title: 'Strategy Skills', category: 'Trading Cockpit' },
  '/council': { title: 'AI Council', category: 'Governance Senate' },
  '/protocol': { title: 'Protocol Proofs', category: 'Verification & Ledger' },
  '/audit': { title: 'Audit Scorecard', category: 'Verification & Ledger' },
  '/trust': { title: 'Trust Wallet Gate', category: 'Ecosystem & Feeds' },
  '/cmc': { title: 'CoinMarketCap Hub', category: 'Ecosystem & Feeds' },
  '/bnb': { title: 'BNB Smart Chain', category: 'Ecosystem & Feeds' },
  '/docs': { title: 'Whitepaper & Specs', category: 'Technical Documentation' },
}

function normalize(p: string) {
  let path = p.replace(/\/+$/, '') || '/'
  if (path === '/compete' || path === '/compete/') return '/'
  if (path.startsWith('/compete/')) path = path.replace('/compete', '')
  if (path === '/agent') return '/terminal'
  if (path === '/orchestra') return '/council'
  if (path === '/judge') return '/audit'
  return path || '/'
}

function usePref(key: string, fallback: string, valid: string[]) {
  const [val, setVal] = useState(() => {
    try { const v = localStorage.getItem(key); if (v && valid.includes(v)) return v } catch { /* ignore */ }
    return fallback
  })
  const set = useCallback((v: string) => {
    setVal(v)
    try { localStorage.setItem(key, v) } catch { /* ignore */ }
  }, [key])
  return [val, set] as const
}

/* ═══════════════════════════════════════════════════════
   INNER APPLICATION SHELL (CONSUMES WEB3 WALLET CONTEXT)
   ═══════════════════════════════════════════════════════ */
function AppShellInner() {
  const { account, disconnect, setModalOpen, balance, chainId, isBsc } = useWeb3Wallet()
  const isLoggedIn = !!account

  const [path, setPath] = useState(() => normalize(window.location.pathname))
  const [theme, setTheme] = usePref('aureus_theme', 'obsidian', THEMES.map((t) => t.id).concat(['midnight', 'ocean']))
  const font = 'jakarta'
  const lang = 'en'
  const [menu, setMenu] = useState<null | 'theme'>(null)
  const [drawer, setDrawer] = useState(false)
  const [showTopBtn, setShowTopBtn] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  const go = useCallback((to: string) => {
    const next = normalize(to)
    window.history.pushState({}, '', next)
    setPath(next)
    setDrawer(false)
    setMenu(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const onPop = () => setPath(normalize(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Dynamic Browser Title per page
  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Aureus Agent · Verifiable Autonomous Trading on BNB Chain',
      '/features': 'Features & Risk Math · Aureus Protocol',
      '/how-it-works': 'How It Works · 4-Stage Execution Lifecycle',
      '/ecosystem': 'Ecosystem & BSC Deployments · Aureus Protocol',
      '/security': 'Security & Audit (98/100) · Aureus Protocol',
      '/docs': 'Whitepaper & Technical Specs · Aureus Protocol',
      '/terminal': 'Live Terminal · Aureus Pro Cockpit',
      '/skills': 'Strategy Skills · Aureus Pro',
      '/council': 'AI Senate Council · Aureus Pro',
      '/protocol': 'Protocol Proofs · Aureus Pro',
      '/audit': 'Audit Scorecard · Aureus Pro',
      '/trust': 'Trust Wallet Gate · Aureus Pro',
      '/cmc': 'CoinMarketCap Hub · Aureus Pro',
      '/bnb': 'BNB Smart Chain · Aureus Pro',
      '/login': 'Connect Web3 Wallet · Aureus Protocol',
    }
    document.title = titles[path] || 'Aureus Agent · Verifiable Autonomous Protocol'
  }, [path])

  // Scroll listener for floating Back-to-Top button
  useEffect(() => {
    const onScroll = () => {
      setShowTopBtn(window.scrollY > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close popovers on outside click / escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenu(null)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu(null)
        setDrawer(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  // When user logs in, if they were on a marketing landing or login, route them to pro terminal
  const prevLoggedIn = useRef(isLoggedIn)
  useEffect(() => {
    if (!prevLoggedIn.current && isLoggedIn) {
      if (path === '/' || path === '/login') {
        go('/terminal')
      }
    }
    prevLoggedIn.current = isLoggedIn
  }, [isLoggedIn, path, go])

  // Router resolution
  const renderView = () => {
    // If not logged in and attempting to access pro dashboard routes -> render AuthGate
    const isProRoute = ['/terminal', '/skills', '/council', '/protocol', '/audit', '/trust', '/cmc', '/bnb'].includes(path)
    if (!isLoggedIn && isProRoute) {
      return <AuthGate go={go} intendedPath={path} />
    }

    switch (path) {
      // Marketing routes
      case '/': return <Landing go={go} />
      case '/features': return <MarketingFeatures go={go} />
      case '/how-it-works': return <MarketingHowItWorks go={go} />
      case '/ecosystem': return <MarketingEcosystem go={go} />
      case '/security': return <MarketingSecurity go={go} />
      case '/login': return <AuthGate go={go} />

      // Authenticated Pro Routes
      case '/terminal': return <AgentCockpit go={go} />
      case '/skills': return <SkillStudio go={go} />
      case '/council': return <SkillOrchestra go={go} />
      case '/protocol': return <Protocol go={go} />
      case '/audit': return <JudgeMode go={go} />
      case '/trust': return <TrustWallet go={go} />
      case '/cmc': return <CoinMarketCap go={go} />
      case '/bnb': return <BnbChain go={go} />
      case '/docs': return <Docs go={go} />
      default: return <Landing go={go} />
    }
  }

  return (
    <div className="compete-root" data-theme={theme} data-font={font} data-lang={lang}>
      {/* Flagship Web3 Ambient Layer: Cosmic Starfield, Glowing Orbs, Floating Wireframes & Circuit Traces */}
      <Web3AmbientLayer />

      {/* ═════════════════════════════════════════════════════════════
          STATE 1: BEFORE LOGIN (!isLoggedIn)
          Only public marketing pages with dedicated Top Navbar.
          NO SIDEBAR is shown!
          ═════════════════════════════════════════════════════════════ */}
      {!isLoggedIn ? (
        <>
          {/* Top Glassmorphism Marketing Navigation */}
          <nav className="cp-mkt-nav" ref={navRef}>
            <div className="cp-mkt-inner">
              <button
                onClick={() => go('/')}
                style={{ background: 'none', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: 0 }}
                aria-label="Aureus home"
              >
                <BrandLogo height={26} dark={theme !== 'daylight'} />
                <div className="cp-network-pill cp-nav-desktop" style={{ fontSize: 10, height: 24, padding: '0 8px', letterSpacing: '0.04em' }}>
                  <span className="cp-net-dot" />
                  <span>BSC MAINNET #56</span>
                </div>
              </button>

              {/* Marketing Navbar Links */}
              <div className="cp-mkt-links">
                {MARKETING_NAV.map((n) => (
                  <button
                    key={n.path}
                    className={`cp-mkt-link ${path === n.path ? 'active' : ''}`}
                    onClick={() => go(n.path)}
                  >
                    {n.label}
                  </button>
                ))}
              </div>

              {/* Right controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Theme Selector */}
                <div style={{ position: 'relative' }}>
                  <button
                    className="cp-iconbtn"
                    onClick={() => setMenu(menu === 'theme' ? null : 'theme')}
                    title="Color theme"
                    aria-label="Color theme"
                  >
                    <IconPalette />
                  </button>
                  {menu === 'theme' && (
                    <div className="cp-pop" style={{ right: 0, left: 'auto', minWidth: 170 }}>
                      <div className="cp-pop-label">Color theme</div>
                      {THEMES.map((t) => (
                        <button
                          key={t.id}
                          className={`cp-pop-row ${theme === t.id ? 'on' : ''}`}
                          onClick={() => { setTheme(t.id); setMenu(null) }}
                        >
                          <span className="cp-swatch" style={{ background: t.swatch }} />{t.label}
                          {theme === t.id && <IconCheck size={16} style={{ marginLeft: 'auto' }} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <a
                  className="btn btn-ghost btn-sm cp-nav-desktop"
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source
                </a>

                {/* Primary CTA: Connect Wallet / Login with gold glow */}
                <button
                  className="cp-mkt-btn-connect"
                  onClick={() => setModalOpen(true)}
                >
                  <IconWallet size={16} />
                  <span>Connect Wallet</span>
                </button>

                {/* Mobile hamburger button */}
                <div className="cp-nav-mobile">
                  <button className="cp-iconbtn" onClick={() => setDrawer(true)} aria-label="Open menu">
                    <IconMenu />
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile Drawer for Marketing Navigation */}
          <div className={`cp-drawer ${drawer ? 'open' : ''}`}>
            <div className="cp-drawer-scrim" onClick={() => setDrawer(false)} />
            <div className="cp-drawer-panel">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <BrandLogo height={24} />
                <button className="cp-iconbtn" onClick={() => setDrawer(false)} aria-label="Close menu" style={{ minWidth: 44, minHeight: 44 }}>
                  <IconClose />
                </button>
              </div>

              <div style={{ marginBottom: 18 }}>
                <button
                  className="btn btn-primary"
                  onClick={() => { setModalOpen(true); setDrawer(false) }}
                  style={{ width: '100%', justifyContent: 'center', minHeight: 46, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <IconWallet size={18} />
                  <span>Connect Wallet / Login</span>
                </button>
              </div>

              <div className="cp-drawer-section">
                <div className="cp-pop-label">Explore Marketing</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {MARKETING_NAV.map((n) => (
                    <button
                      key={n.path}
                      className={`cp-drawer-navlink ${path === n.path ? 'active' : ''}`}
                      onClick={() => go(n.path)}
                    >
                      <span style={{ fontWeight: path === n.path ? 700 : 600 }}>{n.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="cp-drawer-section" style={{ marginTop: 18 }}>
                <div className="cp-pop-label">Theme</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      className={`cp-pop-row ${theme === t.id ? 'on' : ''}`}
                      onClick={() => setTheme(t.id)}
                      style={{ padding: '8px 10px', minHeight: 44 }}
                    >
                      <span className="cp-swatch" style={{ background: t.swatch }} />
                      <span style={{ fontSize: 12 }}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--c-line)' }}>
                <a className="btn btn-ghost" href={GITHUB_URL} target="_blank" rel="noopener noreferrer" style={{ width: '100%', justifyContent: 'center', minHeight: 44 }}>
                  Source Code on GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Marketing Content */}
          <Suspense fallback={<div className="cp-route-loading" aria-busy="true"><span className="cp-spinner" /></div>}>
            {renderView()}
          </Suspense>

          {/* Full Rich Marketing Footer */}
          <footer className="cp-footer">
            <div className="cp-foot-grid" />
            <div style={{ position: 'relative', zIndex: 1, maxWidth: 1320, margin: '0 auto', padding: '52px 22px 26px' }}>
              <div className="cp-foot-cols" style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1.6fr) repeat(3, minmax(130px, 1fr))', gap: 32 }}>
                <div className="cp-foot-brand">
                  <BrandLogo height={26} />
                  <p style={{ fontSize: 13.5, color: 'var(--c-text-2)', lineHeight: 1.65, margin: '16px 0 0', maxWidth: 360 }}>
                    The verifiable autonomous trader. Every call is sealed to the BSC ledger before the outcome is known and a chain anchored circuit breaker makes the risk cap unbreakable.
                  </p>
                  <div style={{ marginTop: 18 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
                      Connect Wallet ↗
                    </button>
                  </div>
                </div>

                <div className="cp-foot-col-product">
                  <div className="cp-foot-col-h">Marketing</div>
                  {MARKETING_NAV.map((n) => (
                    <span key={n.path} className="cp-foot-link" onClick={() => go(n.path)}>
                      {n.label}
                    </span>
                  ))}
                </div>

                <div className="cp-foot-col2-wrap">
                  <div>
                    <div className="cp-foot-col-h">Ecosystem</div>
                    <span className="cp-foot-link" onClick={() => go('/ecosystem')}>BNB Smart Chain</span>
                    <span className="cp-foot-link" onClick={() => go('/ecosystem')}>Trust Wallet</span>
                    <span className="cp-foot-link" onClick={() => go('/ecosystem')}>CoinMarketCap</span>
                  </div>
                  <div className="cp-foot-resources">
                    <div className="cp-foot-col-h">Resources</div>
                    <span className="cp-foot-link" onClick={() => go('/docs')}>Documentation</span>
                    <a className="cp-foot-link" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
                    <span className="cp-foot-link" onClick={() => go('/security')}>Security Scorecard</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 36, paddingTop: 20, borderTop: '1px solid var(--c-line)', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--c-muted)' }}>Aureus Agent · Verifiable Autonomous Trading Protocol on BNB Chain</span>
                <span style={{ fontSize: 12, color: 'var(--c-muted)' }}>Non-custodial architecture · does not constitute financial advice.</span>
              </div>
            </div>
          </footer>

          {/* Floating Back-to-Top Button */}
          {showTopBtn && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              style={{
                position: 'fixed',
                bottom: 26,
                right: 26,
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--c-panel)',
                border: '1px solid var(--c-primary)',
                color: 'var(--c-primary)',
                boxShadow: '0 8px 24px var(--c-shadow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 99,
                transition: 'all 0.2s ease',
              }}
            >
              <IconCaret dir="up" size={18} />
            </button>
          )}
        </>
      ) : (
        /* ═════════════════════════════════════════════════════════════
            STATE 2: AFTER LOGIN (isLoggedIn === true)
            PRO TRADING DASHBOARD WITH DEDICATED LEFT SIDEBAR.
            Strictly authenticated features; no marketing pollution!
            ═════════════════════════════════════════════════════════════ */
        <div className="app-shell">
          {/* Mobile sidebar backdrop */}
          {drawer && <div className="app-sidebar-backdrop" onClick={() => setDrawer(false)} />}

          {/* Left Pro Sidebar (AUTHENTICATED ONLY) */}
          <aside className={`app-sidebar ${drawer ? 'open' : ''}`}>
            <div className="app-sidebar-head">
              <button
                onClick={() => go('/terminal')}
                style={{ background: 'none', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: 0 }}
                aria-label="Aureus Pro"
              >
                <BrandLogo height={23} dark={theme !== 'daylight'} />
                <span className="app-badge" style={{ fontSize: 9.5, padding: '2px 6px' }}>PRO COCKPIT</span>
              </button>
              <button
                className="cp-iconbtn app-sidebar-toggle"
                onClick={() => setDrawer(false)}
                aria-label="Close sidebar"
              >
                <IconClose size={18} />
              </button>
            </div>

            <div className="app-sidebar-body">
              {/* Group 1: Autonomous Trading */}
              <div className="app-sidebar-section">Autonomous Trading</div>
              {PRO_CORE_NAV.map((n) => {
                const active = path === n.path
                return (
                  <button
                    key={n.path}
                    className={`app-sidebar-item ${active ? 'active' : ''}`}
                    onClick={() => go(n.path)}
                  >
                    <n.Icon size={17} style={{ color: active ? 'var(--c-primary)' : 'var(--c-text-2)', flexShrink: 0 }} />
                    <span>{n.label}</span>
                    {n.badge && <span className="app-badge">{n.badge}</span>}
                  </button>
                )
              })}

              {/* Group 2: Verification & Risks */}
              <div className="app-sidebar-section" style={{ marginTop: 12 }}>Verification & Risks</div>
              {PRO_VERIFY_NAV.map((n) => {
                const active = path === n.path
                return (
                  <button
                    key={n.path}
                    className={`app-sidebar-item ${active ? 'active' : ''}`}
                    onClick={() => go(n.path)}
                  >
                    <n.Icon size={17} style={{ color: active ? 'var(--c-primary)' : 'var(--c-text-2)', flexShrink: 0 }} />
                    <span>{n.label}</span>
                    {n.badge && <span className="app-badge">{n.badge}</span>}
                  </button>
                )
              })}

              {/* Group 3: Ecosystem & Feeds */}
              <div className="app-sidebar-section" style={{ marginTop: 12 }}>Ecosystem & Feeds</div>
              {PRO_ECO_NAV.map((n) => {
                const active = path === n.path
                return (
                  <button
                    key={n.path}
                    className={`app-sidebar-item ${active ? 'active' : ''}`}
                    onClick={() => go(n.path)}
                  >
                    <n.Icon size={17} style={{ color: active ? 'var(--c-primary)' : 'var(--c-text-2)', flexShrink: 0 }} />
                    <span>{n.label}</span>
                    {n.badge && <span className="app-badge">{n.badge}</span>}
                  </button>
                )
              })}
            </div>

            {/* Authenticated Pro Sidebar Footer */}
            <div className="app-sidebar-foot" ref={navRef}>
              {/* Connected User Account Card */}
              <div style={{ background: 'var(--c-fill-2)', border: '1px solid var(--c-line)', borderRadius: 8, padding: '9px 11px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="cp-net-dot" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--c-text)' }}>BSC Mainnet</span>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)' }}>#56</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--c-primary)', fontWeight: 700 }}>
                    {shortAddr(account)}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--c-text)' }}>
                    {balance || '0.000 BNB'}
                  </span>
                </div>
              </div>

              {/* Log Out (Disconnect) Button */}
              <button
                className="app-sidebar-item"
                onClick={() => {
                  disconnect()
                  go('/')
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.22)',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 12.5,
                }}
              >
                <span>Disconnect (Log Out)</span>
              </button>

              {/* View Public Website Link */}
              <button
                className="app-sidebar-item"
                onClick={() => go('/')}
                style={{ background: 'none', border: 'none', color: 'var(--c-muted)', justifyContent: 'center', fontSize: 12, padding: '4px' }}
              >
                <span>← View Public Website</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
                <div style={{ position: 'relative' }}>
                  <button
                    className="cp-iconbtn"
                    onClick={() => setMenu(menu === 'theme' ? null : 'theme')}
                    title="Color theme"
                    aria-label="Color theme"
                  >
                    <IconPalette size={16} />
                  </button>
                  {menu === 'theme' && (
                    <div className="cp-pop" style={{ bottom: '100%', left: 0, marginBottom: 8, minWidth: 170 }}>
                      <div className="cp-pop-label">Color theme</div>
                      {THEMES.map((t) => (
                        <button
                          key={t.id}
                          className={`cp-pop-row ${theme === t.id ? 'on' : ''}`}
                          onClick={() => { setTheme(t.id); setMenu(null) }}
                        >
                          <span className="cp-swatch" style={{ background: t.swatch }} />{t.label}
                          {theme === t.id && <IconCheck size={16} style={{ marginLeft: 'auto' }} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <a
                  className="btn btn-ghost btn-sm"
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 11, padding: '4px 10px' }}
                >
                  GitHub
                </a>
              </div>
            </div>
          </aside>

          {/* Main Pro Workspace Area */}
          <div className="app-main">
            {/* Pro Topbar */}
            <header className="app-topbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  className="cp-iconbtn app-sidebar-toggle"
                  onClick={() => setDrawer(true)}
                  aria-label="Open sidebar"
                >
                  <IconMenu size={18} />
                </button>

                <div className="app-breadcrumbs">
                  <span style={{ cursor: 'pointer' }} onClick={() => go('/terminal')}>Aureus Pro</span>
                  <span style={{ opacity: 0.4 }}>/</span>
                  <span className="crumb-current">{PRO_PAGES[path]?.title || 'Cockpit'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Live Shield Protection Badge */}
                <div
                  className="cp-nav-desktop"
                  style={{
                    fontSize: 11,
                    background: 'rgba(16,185,129,0.12)',
                    color: '#10b981',
                    border: '1px solid rgba(16,185,129,0.25)',
                    padding: '3px 9px',
                    borderRadius: 6,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  <span>Shield: ARMED</span>
                </div>

                <WalletNavButton />
              </div>
            </header>

            {/* Pro App Content */}
            <main className="app-content">
              <Suspense fallback={<div className="cp-route-loading" aria-busy="true"><span className="cp-spinner" /></div>}>
                {renderView()}
              </Suspense>
            </main>

            {/* Minimalist Pro Status Bar */}
            <footer style={{ padding: '12px 20px', borderTop: '1px solid var(--c-line)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: 'var(--c-muted)', background: 'var(--c-panel)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="cp-net-dot" />
                <span>Aureus Autonomous Agent v2.4 · BSC Mainnet #56 Live</span>
              </div>
              <div>
                <span>Non-Custodial Account Abstraction · Proof-of-Execution Sealed</span>
              </div>
            </footer>
          </div>

          {/* Mobile bottom tab bar (<=760px) for quick pro thumb switching */}
          <nav className="cp-tabbar" aria-label="Primary">
            {BOTTOM_NAV.map((n) => {
              const active = path === n.path
              return (
                <button key={n.path} className={`cp-tab ${active ? 'active' : ''}`} onClick={() => go(n.path)} aria-current={active ? 'page' : undefined}>
                  <n.Icon size={20} />
                  <span className="cp-tab-label">{n.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   ROOT EXPORT WITH WEB3 PROVIDER WRAPPER
   ═══════════════════════════════════════════════════════ */
export default function CompeteApp() {
  return (
    <Web3WalletProvider>
      <AppShellInner />
    </Web3WalletProvider>
  )
}
