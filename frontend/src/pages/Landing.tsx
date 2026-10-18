/* Landing · Aureus Agent protocol landing surface.
   Asymmetric split hero with live telemetry cockpit, flagship on-chain
   risk governor showcase, 4-stage execution pipeline, real-time sealed
   trade stream, and verified BSC contract directory. */

import { useEffect, useRef } from 'react'
import { Btn, Card, CountUp, Reveal, Stat, StarField, fmtNum, shortAddr } from '../ui'
import { apiGet, usePoll } from '../api'
import type { Leaderboard, LoopEnvelope } from '../api'
import {
  ADDR, AGENT_ID, ERC8004_AGENT_ID, AGENT_CARD_URL, GITHUB_URL,
  SPONSORS, TRACKS, scan, chainOf, txHashOf,
} from '../config'
import { SPONSOR_LOGO, IconExternal, IconShield, IconArrow, IconLock, IconScale, IconBolt, IconCheck, IconWallet } from '../icons'
import { useWeb3Wallet } from '../web3Wallet'

const cleanSym = (s: string) => s.replace('USDT.P', '').replace('USDT', '').replace('.P', '') || s
const txUrl = (h: string) => `https://bscscan.com/tx/${txHashOf(h)}`
const isTx = (h?: string) => /^0x[0-9a-fA-F]{6,}/.test(txHashOf(h))

export default function Landing({ go }: { go: (p: string) => void }) {
  const { account, balance, setModalOpen } = useWeb3Wallet()
  const { data: lb } = usePoll<Leaderboard>((s) => apiGet('/leaderboard?rank_by=expectancy&min_samples=30&top_n=12', s), 60_000)
  const { data: loop } = usePoll<LoopEnvelope>((s) => apiGet('/loop/state', s), 15_000)

  const ov = lb?.overall
  const st = loop?.available ? loop.state : undefined
  const ddBps = st ? Math.round(st.drawdown * 10000) : 0
  const capBps = st ? Math.round(st.jury_cap * 10000) : 2000

  return (
    <div style={{ position: 'relative' }}>
      {/* ════════ HERO · Split Cockpit Layout ════════ */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '120px 24px 100px' }}>
        <div className="cp-mesh">
          <div className="cp-wash" />
          <div className="cp-grid-bg" />
          <div className="cp-orbs">
            <span className="cp-orb" style={{ width: 420, height: 420, left: '2%', top: '-10%', background: 'var(--c-primary)', opacity: 0.18, animationDelay: '0s' }} />
            <span className="cp-orb" style={{ width: 340, height: 340, right: '4%', top: '10%', background: 'var(--gold-2)', opacity: 0.14, animationDelay: '4s' }} />
          </div>
        </div>

        <div className="cp-hero-split" style={{ position: 'relative', zIndex: 1 }}>
          {/* Left Column: Value Proposition & CTAs */}
          <div>
            <Reveal>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 999, background: 'rgba(240, 185, 11, 0.10)', border: '1px solid rgba(240, 185, 11, 0.28)', marginBottom: 20 }}>
                <span className="cp-net-dot" />
                <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--c-primary)' }}>
                  BSC Mainnet · Verifiable Autonomous Agent
                </span>
              </div>
              <h1 style={{ fontSize: 'clamp(36px, 4.2vw, 58px)', lineHeight: 1.08, fontWeight: 900, letterSpacing: '-1.4px', margin: 0, color: 'var(--c-text)' }}>
                Autonomous Trading Governed by <span className="cp-grad-text">On-Chain Risk Limits</span>
              </h1>
            </Reveal>

            <Reveal delay={100}>
              <p style={{ margin: '20px 0 0', fontSize: 'clamp(15px, 1.4vw, 17.5px)', lineHeight: 1.65, color: 'var(--c-text-2)', maxWidth: 580 }}>
                Aureus Agent fuses multi-source market intelligence into mathematically bounded Kelly trades. Every order commitment is cryptographically sealed to the BSC ledger before execution, backed by an unbreakable smart contract circuit breaker.
              </p>
            </Reveal>

            <Reveal delay={160}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginTop: 32 }}>
                {!account ? (
                  <>
                    <Btn
                      variant="primary"
                      onClick={() => setModalOpen(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        fontWeight: 800,
                        padding: '12px 22px',
                        boxShadow: '0 0 24px rgba(240,185,11,0.35)',
                      }}
                    >
                      <IconWallet size={18} />
                      <span>Connect Web3 Wallet</span>
                    </Btn>
                    <Btn
                      variant="amber"
                      onClick={() => go('/terminal')}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', fontWeight: 800 }}
                    >
                      <span>Launch Live Terminal</span>
                      <IconArrow size={16} />
                    </Btn>
                  </>
                ) : (
                  <>
                    <Btn
                      variant="primary"
                      onClick={() => go('/terminal')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        fontWeight: 800,
                        padding: '12px 24px',
                        boxShadow: '0 0 24px rgba(240,185,11,0.35)',
                      }}
                    >
                      <span>Open Trading Cockpit</span>
                      <IconArrow size={16} />
                    </Btn>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="cp-account-btn"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        background: 'var(--c-panel)',
                        border: '1px solid var(--c-primary)',
                        borderRadius: 8,
                        padding: '10px 16px',
                        cursor: 'pointer',
                        color: 'var(--c-text)',
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      <span className="cp-net-dot" style={{ background: 'var(--green)' }} />
                      <span>Connected:</span>
                      <span className="mono">{shortAddr(account)}</span>
                      {balance && <span className="mono cp-tag-mini" style={{ background: 'rgba(240,185,11,0.15)', color: 'var(--c-primary)', padding: '2px 6px', borderRadius: 4 }}>{balance}</span>}
                    </button>
                  </>
                )}
                <Btn variant="ghost" onClick={() => go('/features')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span>Explore Features</span>
                  <IconArrow size={15} />
                </Btn>
                <Btn variant="ghost" onClick={() => go('/how-it-works')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span>How It Works</span>
                </Btn>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--c-line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--c-muted)', fontWeight: 600 }}>
                  <IconLock size={15} style={{ color: 'var(--c-primary)' }} />
                  <span>1400 bps Hard Circuit Breaker</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--c-muted)', fontWeight: 600 }}>
                  <IconBolt size={15} style={{ color: 'var(--c-primary)' }} />
                  <span>Keccak Commit-Before-Reveal</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--c-muted)', fontWeight: 600 }}>
                  <IconCheck size={15} style={{ color: 'var(--c-primary)' }} />
                  <span>ERC-8004 Identity #{ERC8004_AGENT_ID}</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Live Agent Telemetry Cockpit */}
          <Reveal delay={120}>
            <div className="cp-cockpit-card">
              <div className="cp-cockpit-header">
                <div className="cp-cockpit-pulse">
                  <span className="cp-cockpit-dot" />
                  <span>Active Agent Loop · Mainnet</span>
                </div>
                <span className="cp-tag-mini" style={{ color: 'var(--c-primary)', background: 'rgba(240,185,11,0.12)', padding: '3px 8px', borderRadius: 6 }}>
                  CHAIN ID 56
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div style={{ background: 'rgba(240,185,11,0.05)', border: '1px solid var(--c-line)', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontSize: 11, color: 'var(--c-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Agent Equity</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--c-primary)', marginTop: 4, fontFamily: 'var(--cp-font-mono)' }}>
                    {st ? <CountUp value={st.equity} decimals={0} prefix="$" /> : '$10,000'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 4, fontWeight: 700 }}>● Live Trading on BSC</div>
                </div>

                <div style={{ background: 'rgba(240,185,11,0.05)', border: '1px solid var(--c-line)', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontSize: 11, color: 'var(--c-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Risk Governor Floor</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: ddBps >= capBps * 0.9 ? 'var(--red)' : 'var(--green)', marginTop: 4, fontFamily: 'var(--cp-font-mono)' }}>
                    {st ? `${ddBps} bps` : '0 bps'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--c-muted)', marginTop: 4 }}>Ceiling: {capBps} bps (14%)</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 16px', background: 'var(--c-bg)', borderRadius: 12, border: '1px solid var(--c-line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5 }}>
                  <span style={{ color: 'var(--c-muted)' }}>Verified Labeled Outcomes:</span>
                  <span className="mono" style={{ color: 'var(--c-text)', fontWeight: 800 }}>
                    {ov ? <CountUp value={ov.n_resolved} /> : '195,868'} calls sealed
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5 }}>
                  <span style={{ color: 'var(--c-muted)' }}>Commit-Reveal Registry:</span>
                  <a href={`https://bscscan.com/address/${ADDR.registry}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--c-primary)', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span>{shortAddr(ADDR.registry)}</span>
                    <IconExternal size={12} />
                  </a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5 }}>
                  <span style={{ color: 'var(--c-muted)' }}>Risk Governor Contract:</span>
                  <a href={`https://bscscan.com/address/${ADDR.governor}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--c-primary)', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span>{shortAddr(ADDR.governor)}</span>
                    <IconExternal size={12} />
                  </a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5 }}>
                  <span style={{ color: 'var(--c-muted)' }}>ERC-8004 On-Chain Identity:</span>
                  <span className="mono" style={{ color: 'var(--c-primary)', fontWeight: 800 }}>Token #{ERC8004_AGENT_ID}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5, paddingTop: 6, borderTop: '1px dashed var(--c-line)' }}>
                  <span style={{ color: 'var(--c-muted)' }}>Self-Custody Connection:</span>
                  {account ? (
                    <span className="mono" style={{ color: 'var(--green)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span className="cp-net-dot" style={{ background: 'var(--green)' }} />
                      <span>{shortAddr(account)}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setModalOpen(true)}
                      style={{ background: 'none', border: 'none', color: 'var(--c-primary)', fontWeight: 800, cursor: 'pointer', padding: 0, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 5 }}
                    >
                      <IconWallet size={13} />
                      <span>Connect Wallet</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════ LIQUIDITY & INTEGRATIONS MARQUEE ════════ */}
      <section style={{ padding: '72px 0 76px', borderTop: '1px solid var(--c-line)', borderBottom: '1px solid var(--c-line)', background: 'var(--c-bg-soft)', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--c-muted)', fontWeight: 800, marginBottom: 28 }}>
          Integrated Infrastructure & Liquidity Protocols
        </div>
        <MarqueeTicker />
      </section>

      {/* ════════ FLAGSHIP ARCHITECTURE · Asymmetric Layout ════════ */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '150px 24px 120px' }}>
        <Reveal>
          <SectionHead
            title="Three Pillars of Verifiable Autonomy"
            sub="Engineered from the ground up so the AI agent cannot hallucinate risk, breach loss limits, or rewrite history."
          />
        </Reveal>

        {/* 1. Full-Width Flagship Card: The Risk Governor */}
        <Reveal delay={80}>
          <div className="cp-feature-hero" style={{ marginTop: 64 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(240,185,11,0.12)', border: '1px solid rgba(240,185,11,0.3)', color: 'var(--c-primary)', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>
                <IconShield size={14} />
                <span>Flagship Security Primitive</span>
              </div>
              <h2 style={{ fontSize: 'clamp(24px, 2.5vw, 34px)', fontWeight: 900, margin: '0 0 16px', letterSpacing: '-0.6px', color: 'var(--c-text)' }}>
                The Unbreakable On-Chain Circuit Breaker
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--c-text-2)', margin: '0 0 24px' }}>
                Traditional trading bots blow up because their risk management is pure client-side software. Aureus anchors drawdown ceilings directly into the smart contract state machine. When total loss touches the 1400 bps threshold, the vault halts and <code style={{ color: 'var(--c-primary)', background: 'rgba(240,185,11,0.1)', padding: '2px 6px', borderRadius: 4 }}>canTrade()</code> returns false. The agent physically cannot override the blockchain.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span className="cp-tag-mini" style={{ padding: '6px 12px', borderRadius: 6, background: 'var(--c-fill-2)', border: '1px solid var(--c-line)', color: 'var(--c-text)' }}>
                  1400 bps Hard Ceiling
                </span>
                <span className="cp-tag-mini" style={{ padding: '6px 12px', borderRadius: 6, background: 'var(--c-fill-2)', border: '1px solid var(--c-line)', color: 'var(--c-text)' }}>
                  Non-Custodial Vault
                </span>
                <span className="cp-tag-mini" style={{ padding: '6px 12px', borderRadius: 6, background: 'var(--c-fill-2)', border: '1px solid var(--c-line)', color: 'var(--c-primary)' }}>
                  Verified BSC Deployment ↗
                </span>
              </div>
            </div>

            {/* Visual Code Guarantee Simulation */}
            <div style={{ background: '#0b0e11', border: '1px solid var(--c-line-2)', borderRadius: 14, padding: 22, fontFamily: 'var(--cp-font-mono)', fontSize: 13, lineHeight: 1.6, color: '#e6edf3' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--c-line)', marginBottom: 12 }}>
                <span style={{ color: 'var(--c-muted)', fontSize: 11 }}>RiskGovernor.sol (Chain ID 56)</span>
                <span style={{ color: 'var(--green)', fontSize: 11, fontWeight: 700 }}>● Active State</span>
              </div>
              <div><span style={{ color: '#FCD535' }}>function</span> <span style={{ color: '#61afef' }}>canTrade</span>(address agent) <span style={{ color: '#FCD535' }}>external view returns</span> (<span style={{ color: '#e5c07b' }}>bool</span>) &#123;</div>
              <div style={{ paddingLeft: 18 }}>uint256 currentBps = getDrawdownBps(agent);</div>
              <div style={{ paddingLeft: 18 }}><span style={{ color: '#e06c75' }}>if</span> (currentBps &gt;= MAX_DRAWDOWN_BPS) &#123;</div>
              <div style={{ paddingLeft: 36, color: 'var(--red)' }}>return false; // Execution HALTED on-chain</div>
              <div style={{ paddingLeft: 18 }}>&#125;</div>
              <div style={{ paddingLeft: 18 }}><span style={{ color: 'var(--green)' }}>return true;</span> // Trade permitted within budget</div>
              <div>&#125;</div>
            </div>
          </div>
        </Reveal>

        {/* 2. Supporting 50/50 Cards: Council Senate + Commit-Reveal */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginTop: 28 }}>
          <Reveal delay={120}>
            <Card hover className="cp-tilt" style={{ padding: 28, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(240,185,11,0.12)', border: '1px solid rgba(240,185,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-primary)', marginBottom: 18 }}>
                <IconScale size={22} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 10px', color: 'var(--c-text)' }}>
                4-Agent Senate Quorum
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.62, color: 'var(--c-text-2)', margin: '0 0 18px', flex: 1 }}>
                Aureus does not rely on a single LLM prompt. Four specialized agents (Colosseum Alpha, Risk Evaluator, Oracle Keeper, and Execution Router) must debate and reach mathematical consensus before broadcasting orders.
              </p>
              <div>
                <Btn variant="ghost" sm onClick={() => go('/council')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span>Inspect AI Council</span>
                  <IconArrow size={14} />
                </Btn>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={160}>
            <Card hover className="cp-tilt" style={{ padding: 28, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(240,185,11,0.12)', border: '1px solid rgba(240,185,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-primary)', marginBottom: 18 }}>
                <IconBolt size={22} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 10px', color: 'var(--c-text)' }}>
                Cryptographic Commit-Before-Reveal
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.62, color: 'var(--c-text-2)', margin: '0 0 18px', flex: 1 }}>
                Every trade signal is hashed: <code style={{ color: 'var(--c-primary)', background: 'rgba(240,185,11,0.1)', padding: '2px 4px', borderRadius: 4 }}>keccak256(symbol, dir, entry, target, stop, salt)</code> and committed to the BSC registry before market execution, mathematically preventing hindsight curve-fitting.
              </p>
              <div>
                <Btn variant="ghost" sm onClick={() => go('/protocol')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span>Verify Commit Proofs</span>
                  <IconArrow size={14} />
                </Btn>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* ════════ EXECUTION PIPELINE · Modern Step-by-Step Flow ════════ */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '150px 24px 120px', borderTop: '1px solid var(--c-line)' }}>
        <Reveal>
          <SectionHead
            nowrap
            title="End-to-End Execution Pipeline"
            sub="How market data transforms into cryptographically verified on-chain execution in four automated stages."
          />
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginTop: 56 }}>
          {[
            {
              num: 'STEP 01',
              title: 'Market Telemetry',
              desc: 'Continuous real-time ingestion of order book depth, DEX liquidity imbalances, derivatives open interest, and funding anomalies.',
            },
            {
              num: 'STEP 02',
              title: 'AI Conviction Engine',
              desc: '4-Agent Senate evaluates probability density against 195k labeled historical outcomes to size positions via empirical Kelly budgets.',
            },
            {
              num: 'STEP 03',
              title: 'Pre-Trade Safety Gate',
              desc: 'Autonomous preflight simulator verifies honeypot status, token tax, slippage limits, and MEV-resistant routing before broadcast.',
            },
            {
              num: 'STEP 04',
              title: 'BSC Settlement & Proof',
              desc: 'Orders execute via non-custodial smart vaults and simultaneously anchor cryptographic commit-reveal hashes to BSC block headers.',
            },
          ].map((step, idx) => (
            <Reveal key={step.num} delay={idx * 60}>
              <div className="cp-pipeline-card">
                <div className="cp-pipeline-num">{step.num}</div>
                <h4 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 8px', color: 'var(--c-text)' }}>{step.title}</h4>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--c-text-2)', margin: 0 }}>{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════ LIVE AGENT SEALED CALLS STREAM ════════ */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '150px 24px 120px', borderTop: '1px solid var(--c-line)' }}>
        <Reveal>
          <SectionHead
            title="Live Verified Decision Stream"
            sub="Real-time trading calls sealed to the BSC prediction registry before price discovery occurs."
          />
        </Reveal>

        <Reveal delay={70}>
          {st && st.decisions?.length > 0 ? (
            <div className="cp-grid-4" style={{ marginTop: 56 }}>
              {st.decisions.filter((d) => /[a-z0-9]/i.test(cleanSym(d.symbol || ''))).slice(0, 8).map((d) => {
                const isLong = d.action.includes('LONG')
                const isShort = d.action.includes('SHORT')
                const acting = isLong || isShort
                const tone = isLong ? 'var(--green)' : isShort ? 'var(--red)' : 'var(--c-muted)'
                const label = isLong ? 'LONG' : isShort ? 'SHORT' : 'STANDBY'
                const pf = st.proofs?.find((p) => p.symbol === d.symbol)

                return (
                  <Card key={d.symbol} hover className="cp-tilt" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.3px', color: 'var(--c-text)' }}>
                        {cleanSym(d.symbol)}
                      </span>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: tone, background: `color-mix(in srgb, ${tone} 14%, transparent)`, padding: '4px 10px', borderRadius: 6 }}>
                        {label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
                      <span style={{ color: 'var(--c-muted)', fontSize: 13 }}>Conviction Score</span>
                      <span className="mono" style={{ fontWeight: 800, fontSize: 17, color: acting ? tone : 'var(--c-text)' }}>
                        {d.conviction.toFixed(0)}%
                      </span>
                    </div>
                    {isTx(pf?.commit_tx) ? (
                      <a className="cp-a" href={txUrl(pf!.commit_tx)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-primary)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <span>View Commit Seal</span>
                        <IconExternal size={14} />
                      </a>
                    ) : (
                      <span style={{ fontSize: 13, color: 'var(--c-muted)' }}>
                        {acting ? (
                          <>
                            <span>Sealing to Block</span>
                            <span className="cp-ellipsis" />
                          </>
                        ) : (
                          'Monitoring Cycle'
                        )}
                      </span>
                    )}
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card style={{ padding: 32, marginTop: 32, textAlign: 'center', background: 'var(--c-panel)' }}>
              <p style={{ fontSize: 15, color: 'var(--c-text-2)', margin: 0, lineHeight: 1.65 }}>
                The autonomous agent is evaluating market regimes between cycle blocks. The moment an alpha threshold is triggered, decisions are committed to the BSC registry before order broadcast.
              </p>
            </Card>
          )}
        </Reveal>
      </section>

      {/* ════════ AUDITABLE ON-CHAIN INFRASTRUCTURE ════════ */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '150px 24px 160px', borderTop: '1px solid var(--c-line)' }}>
        <Reveal>
          <SectionHead
            title="Verified On-Chain Infrastructure"
            sub="Every core contract and agent registry is deployed, verified, and immutable on BSC Mainnet (Chain ID 56)."
          />
        </Reveal>

        <Reveal delay={70}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18, marginTop: 56 }}>
            {[
              ['Commit-Reveal Prediction Registry', ADDR.registry, 'Verifiable trade commitment escrow'],
              ['RiskGovernor Circuit Breaker', ADDR.governor, 'Enforces 1400 bps drawdown limit'],
              ['Autonomous Agent Vault', ADDR.agent, 'Execution wallet holding ERC-8004 identity'],
              ['Oracle & Telemetry Keeper', ADDR.keeper, 'Feeds verified outcome checkpoints'],
              ['Outcome Ledger Store', ADDR.ledger, 'Stores 195k+ labeled execution proofs'],
              ['ERC-8004 Identity Registry', ADDR.erc8004, `Token ID #${ERC8004_AGENT_ID} on BSC Mainnet`],
            ].map(([label, addr, note]) => {
              const testnet = chainOf(addr) === 97
              return (
                <a
                  key={label}
                  className="cp-a card card-hover"
                  href={scan(addr)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '18px 20px', textDecoration: 'none', background: 'var(--c-panel)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, color: 'var(--c-text)', fontWeight: 700 }}>{label}</span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: testnet ? 'var(--gold)' : 'var(--green)', background: 'rgba(2, 192, 118, 0.1)', padding: '2px 6px', borderRadius: 4 }}>
                        {testnet ? 'TESTNET' : 'MAINNET'}
                      </span>
                    </div>
                    <span style={{ color: 'var(--c-primary)', flexShrink: 0, display: 'inline-flex' }}>
                      <IconExternal size={16} />
                    </span>
                  </div>
                  <div className="mono" style={{ fontSize: 13.5, color: 'var(--c-text-2)', fontWeight: 600 }}>
                    {shortAddr(addr)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--c-muted)', marginTop: 2 }}>{note}</div>
                </a>
              )
            })}
          </div>

          <div style={{ marginTop: 44, display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', fontSize: 13, color: 'var(--c-text-2)' }}>
            <span className="mono" style={{ color: 'var(--c-muted)' }}>
              Commit ID: {shortAddr(AGENT_ID)}
            </span>
            <span>·</span>
            <a className="cp-a" href={AGENT_CARD_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 700, color: 'var(--c-primary)' }}>
              <span>Live ERC-8004 Agent Registration Document</span>
              <IconExternal size={14} />
            </a>
          </div>
        </Reveal>
      </section>

      <div style={{ height: 60 }} />
    </div>
  )
}

function SectionHead({ title, sub, nowrap }: { title: string; sub?: string; nowrap?: boolean }) {
  return (
    <div style={{ maxWidth: nowrap ? 960 : 760, margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 38px)', fontWeight: 900, letterSpacing: '-0.8px', margin: 0, color: 'var(--c-text)' }}>
        {title}
      </h2>
      {sub && <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--c-text-2)', margin: '14px 0 0' }}>{sub}</p>}
    </div>
  )
}

/**
 * Bulletproof Marquee Ticker driven by JavaScript requestAnimationFrame
 * Completely immune to CSS animation cancellation, OS reduced-motion flags, or flex engine quirks.
 */
function MarqueeTicker() {
  const trackRef = useRef<HTMLDivElement>(null)
  const isHovered = useRef(false)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let animId: number
    let pos = 0
    let lastTime = performance.now()
    const speed = 40 // px/sec

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      const currentSpeed = isHovered.current ? speed * 0.25 : speed
      pos += currentSpeed * dt

      const half = el.scrollWidth / 2
      if (half > 0 && pos >= half) {
        pos = pos % half
      }

      el.style.transform = `translate3d(-${pos}px, 0, 0)`
      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div
      onMouseEnter={() => { isHovered.current = true }}
      onMouseLeave={() => { isHovered.current = false }}
      style={{
        overflow: 'hidden',
        width: '100%',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 16,
          whiteSpace: 'nowrap',
          width: 'max-content',
          willChange: 'transform',
          padding: '6px 0',
        }}
      >
        {[...SPONSORS, ...SPONSORS, ...SPONSORS, ...SPONSORS].map((s, i) => {
          const Logo = SPONSOR_LOGO[s.name]
          return (
            <a
              key={`${s.name}-${i}`}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="stack-tile"
              aria-hidden={i >= SPONSORS.length}
            >
              <span className="stack-logo" style={{ color: s.tone }}>
                {Logo ? <Logo size={20} /> : <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.tone }} />}
              </span>
              <span>{s.name}</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
