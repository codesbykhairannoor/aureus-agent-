/** Aureus Protocol · Features Marketing Page (/features).
 *  Standalone page detailing the 6 proprietary AI trading edges,
 *  mathematical Quarter-Kelly sizing, comparison matrix, and technical FAQ.
 */

import React, { useState } from 'react'
import {
  IconRadar, IconScale, IconShield, IconBolt, IconWallet, IconLock,
  IconCheck, IconCaret,
} from '../icons'
import { useWeb3Wallet } from '../web3Wallet'

export default function MarketingFeatures({ go }: { go: (p: string) => void }) {
  const { account, setModalOpen } = useWeb3Wallet()
  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'risk' | 'onchain'>('all')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const ALL_FEATURES = [
    {
      category: 'ai',
      icon: IconRadar,
      tag: 'TELEMETRY ORACLE',
      title: 'Multi-Source Signal Synthesis',
      desc: 'Ingests sub-second liquidity telemetry from CoinMarketCap and Binance order flow. Detects institutional volume spikes, order book imbalances, and anomalous spread volatility.',
      metric: '150ms Ingestion Latency',
    },
    {
      category: 'ai',
      icon: IconScale,
      tag: 'AI SENATE CONSENSUS',
      title: 'Four-Model LLM Deliberation',
      desc: 'GPT-4o, Claude 3.5 Sonnet, DeepSeek V3, and Gemini 2.0 Flash independently score each signal. Only trades with ≥75% unanimous Senate quorum execute.',
      metric: '3/4 Quorum Enforced',
    },
    {
      category: 'risk',
      icon: IconShield,
      tag: 'CHAIN-ANCHORED SAFETY',
      title: 'Smart Contract Circuit Breaker',
      desc: 'Drawdown hard stops are not soft software flags. The BSC smart contract enforces an unbreakable mathematical maximum loss limit directly on-chain.',
      metric: '20.00% Hard Stop Limit',
    },
    {
      category: 'risk',
      icon: IconBolt,
      tag: 'EXECUTION MATH',
      title: 'Fractional Kelly Sizing',
      desc: 'Dynamic risk management dynamically sizes every position as a mathematical function of win-rate probability and market volatility, eliminating wipeout risks.',
      metric: 'Quarter-Kelly Bounded',
    },
    {
      category: 'onchain',
      icon: IconWallet,
      tag: 'SECURITY ARCHITECTURE',
      title: 'Non-Custodial Trust Escrow',
      desc: 'Direct interaction with Trust Wallet and BSC accounts. Aureus never holds your private keys; every execution requires your on-chain authorization.',
      metric: '100% Non-Custodial',
    },
    {
      category: 'onchain',
      icon: IconLock,
      tag: 'VERIFIABILITY',
      title: 'Cryptographic Commit-Reveal',
      desc: 'Each signal commitment is hashed and sealed to the BSC ledger block before order routing, guaranteeing tamper-proof audit trails.',
      metric: 'Pre-Execution Hash Sealed',
    },
  ]

  const filteredFeatures = activeTab === 'all'
    ? ALL_FEATURES
    : ALL_FEATURES.filter((f) => f.category === activeTab)

  const FAQS = [
    {
      q: 'Does Aureus Agent ever hold custody of my funds or private keys?',
      a: 'Never. Aureus is 100% non-custodial. All orders settle directly via decentralized smart contracts on BNB Smart Chain using your connected Trust Wallet, MetaMask, or Binance Wallet.',
    },
    {
      q: 'What happens if an AI model hallucinates or outputs a flawed signal?',
      a: 'Our Quad-Model Senate architecture requires a strict 3-out-of-4 quorum. Furthermore, before any signal executes, it passes through the mathematical Quarter-Kelly filter and on-chain circuit breaker bounds.',
    },
    {
      q: 'How does the on-chain circuit breaker prevent flash crashes?',
      a: 'The RiskGovernor smart contract constantly tracks peak equity. If cumulative drawdown reaches the 20% hard threshold, the smart contract automatically locks itself, rejecting all subsequent trade transactions.',
    },
    {
      q: 'What are the gas fees for trade execution on BNB Smart Chain?',
      a: 'Because Aureus settles on BNB Smart Chain (BSC Mainnet) and opBNB, gas costs average less than $0.005 per trade commitment, making high-frequency risk calibration economically viable.',
    },
    {
      q: 'Can I inspect the cryptographic proof of a trade on BscScan?',
      a: 'Yes! Every signal generates an on-chain TradeCommitted event containing a SHA-256 hash sealed to the block height before the outcome is known, accessible publicly on BscScan.',
    },
  ]

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '100px 24px 160px' }}>
      {/* ─── 1. HERO SECTION ─── */}
      <section style={{ textAlign: 'center', maxWidth: 860, margin: '0 auto 80px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(240,185,11,0.1)', border: '1px solid rgba(240,185,11,0.28)', fontSize: 11.5, fontWeight: 800, color: 'var(--c-primary)', marginBottom: 24 }}>
          <span className="cp-net-dot" />
          <span>AUTONOMOUS DEFI INTELLIGENCE</span>
        </div>
        <h1 style={{ fontSize: 'clamp(34px, 4vw, 54px)', fontWeight: 900, letterSpacing: '-1.2px', margin: '0 0 24px', color: 'var(--c-text)', lineHeight: 1.12 }}>
          Autonomous Intelligence Engineered for <span className="cp-grad-text">Verifiable Performance</span>
        </h1>
        <p style={{ fontSize: 16.5, color: 'var(--c-text-2)', lineHeight: 1.7, margin: 0 }}>
          Aureus Agent fuses multi-LLM consensus with deterministic on-chain risk governors. Built specifically for high-velocity BNB Smart Chain liquidity.
        </p>
      </section>

      {/* ─── 2. HIGHLIGHT STATS ROW ─── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 24, marginBottom: 130, paddingBottom: 80, borderBottom: '1px solid var(--c-line)' }}>
        <div className="cp-card" style={{ padding: '30px 26px', textAlign: 'center' }}>
          <div style={{ fontSize: 34, fontWeight: 900, color: 'var(--c-primary)', fontFamily: 'var(--font-mono)' }}>4 Models</div>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--c-text)', marginTop: 8 }}>AI Senate Consensus</div>
          <div style={{ fontSize: 12, color: 'var(--c-muted)', marginTop: 4 }}>≥75% Quorum Enforced</div>
        </div>
        <div className="cp-card" style={{ padding: '30px 26px', textAlign: 'center' }}>
          <div style={{ fontSize: 34, fontWeight: 900, color: '#10b981', fontFamily: 'var(--font-mono)' }}>20.00%</div>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--c-text)', marginTop: 8 }}>Hard Circuit Breaker</div>
          <div style={{ fontSize: 12, color: 'var(--c-muted)', marginTop: 4 }}>Smart Contract Anchored</div>
        </div>
        <div className="cp-card" style={{ padding: '30px 26px', textAlign: 'center' }}>
          <div style={{ fontSize: 34, fontWeight: 900, color: '#3b82f6', fontFamily: 'var(--font-mono)' }}>150 ms</div>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--c-text)', marginTop: 8 }}>Telemetry Ingestion</div>
          <div style={{ fontSize: 12, color: 'var(--c-muted)', marginTop: 4 }}>CoinMarketCap + Pyth</div>
        </div>
        <div className="cp-card" style={{ padding: '30px 26px', textAlign: 'center' }}>
          <div style={{ fontSize: 34, fontWeight: 900, color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>100%</div>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--c-text)', marginTop: 8 }}>Non-Custodial</div>
          <div style={{ fontSize: 12, color: 'var(--c-muted)', marginTop: 4 }}>Zero Private Key Storage</div>
        </div>
      </section>

      {/* ─── 3. CATEGORY FILTER TABS & FEATURES GRID ─── */}
      <section style={{ marginBottom: 140, paddingBottom: 110, borderBottom: '1px solid var(--c-line)' }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 44px' }}>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: 'var(--c-text)', margin: '0 0 14px' }}>
            Core Architectural Capabilities
          </h2>
          <p style={{ fontSize: 15.5, color: 'var(--c-text-2)', margin: 0 }}>
            Inspect our six proprietary algorithms running in continuous production on BSC Mainnet.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 56 }}>
          {[
            { id: 'all', label: 'All Capabilities' },
            { id: 'ai', label: 'AI & Telemetry' },
            { id: 'risk', label: 'Risk Math & Circuit Breaker' },
            { id: 'onchain', label: 'On-Chain Ledger & Escrow' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`btn btn-sm ${activeTab === t.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 999, padding: '10px 24px', fontWeight: 800, fontSize: 13 }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
          {filteredFeatures.map((f, i) => (
            <div key={i} className="cp-card" style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(240, 185, 11, 0.1)', border: '1px solid rgba(240, 185, 11, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-primary)' }}>
                  <f.icon size={24} />
                </div>
                <span className="cp-tag-mini" style={{ fontSize: 10.5, padding: '4px 10px', borderRadius: 6, background: 'var(--c-fill-2)', color: 'var(--c-muted)', fontWeight: 800 }}>
                  {f.tag}
                </span>
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--c-text)', margin: '0 0 14px' }}>{f.title}</h3>
              <p style={{ fontSize: 14.5, color: 'var(--c-text-2)', lineHeight: 1.68, margin: '0 0 28px', flex: 1 }}>{f.desc}</p>

              <div style={{ paddingTop: 18, borderTop: '1px solid var(--c-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: 'var(--c-primary)' }}>
                <span>Verified Parameter</span>
                <span>{f.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. MATHEMATICAL RISK ENGINE BREAKDOWN ─── */}
      <section className="cp-card" style={{ padding: '52px 46px', marginBottom: 140, border: '1px solid rgba(240, 185, 11, 0.3)', background: 'linear-gradient(135deg, rgba(240, 185, 11, 0.05), transparent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <IconBolt size={26} style={{ color: 'var(--c-primary)' }} />
          <h3 style={{ fontSize: 26, fontWeight: 900, color: 'var(--c-text)', margin: 0 }}>
            Mathematical Quarter-Kelly Allocation Engine
          </h3>
        </div>
        <p style={{ fontSize: 15.5, color: 'var(--c-text-2)', lineHeight: 1.72, maxWidth: 900, margin: '0 0 34px' }}>
          Traditional trading bots either over-leverage or bet fixed sums regardless of edge probability. Aureus Agent computes the optimal allocation $f^*$ on every cycle using a conservative fractional Kelly formulation bounded by volatility parameters:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
          <div style={{ background: 'var(--c-panel-2)', border: '1px solid var(--c-line)', borderRadius: 14, padding: '26px 28px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--c-muted)', textTransform: 'uppercase', marginBottom: 12 }}>The Formulation</div>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--c-primary)', marginBottom: 12 }}>
              f* = (b · p - q) / b · 0.25
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--c-text-2)', lineHeight: 1.6 }}>
              Where <strong>p</strong> is win probability, <strong>q = 1 - p</strong>, <strong>b</strong> is payoff odds, scaled down by 0.25 (Quarter-Kelly) to minimize volatility variance.
            </div>
          </div>

          <div style={{ background: 'var(--c-panel-2)', border: '1px solid var(--c-line)', borderRadius: 14, padding: '26px 28px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--c-muted)', textTransform: 'uppercase', marginBottom: 12 }}>Dynamic Volatility Haircut</div>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#10b981', marginBottom: 12 }}>
              Cap = min(f*, 5.00%)
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--c-text-2)', lineHeight: 1.6 }}>
              Regardless of model confidence, no single trade ever risks more than 5.00% of portfolio equity, eliminating catastrophic tail-risk events.
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. COMPARISON MATRIX ─── */}
      <section style={{ marginBottom: 140, paddingBottom: 110, borderBottom: '1px solid var(--c-line)' }}>
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 56px' }}>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: 'var(--c-text)', margin: '0 0 14px' }}>
            How Aureus Compares to Alternatives
          </h2>
          <p style={{ fontSize: 15.5, color: 'var(--c-text-2)', margin: 0 }}>
            Deterministic on-chain risk governors versus opaque black-box trading bots.
          </p>
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid var(--c-line)', borderRadius: 16, background: 'var(--c-panel)', boxShadow: '0 10px 30px var(--c-shadow)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14.5 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--c-line)', background: 'var(--c-fill-2)' }}>
                <th style={{ padding: '20px 26px', fontWeight: 800, color: 'var(--c-text)' }}>Core Capability</th>
                <th style={{ padding: '20px 26px', fontWeight: 800, color: 'var(--c-primary)' }}>Aureus Agent</th>
                <th style={{ padding: '20px 26px', fontWeight: 700, color: 'var(--c-muted)' }}>Traditional Grid Bots</th>
                <th style={{ padding: '20px 26px', fontWeight: 700, color: 'var(--c-muted)' }}>Manual Traders</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Trade Verifiability', aureus: 'Pre-Execution Hash Sealed to BSC', trad: 'Post-facto API logs only', manual: 'Subjective screenshots' },
                { feature: 'Drawdown Protection', aureus: '20% On-Chain Hard Circuit Breaker', trad: 'Soft software stop (bypassed on lag)', manual: 'Emotional / prone to revenge trading' },
                { feature: 'Private Key Custody', aureus: '100% Non-Custodial (Your Wallet)', trad: 'Requires full API trading keys', manual: 'Self-custodial' },
                { feature: 'Model Deliberation', aureus: 'Quad-LLM Quorum (3/4 Agreement)', trad: 'Single indicator / simple moving avg', manual: 'Human intuition & fatigue' },
                { feature: 'Front-Running Protection', aureus: 'Cryptographic Commit-Reveal Scheme', trad: 'Vulnerable to MEV & sandwich bots', manual: 'Vulnerable to public mempools' },
                { feature: 'Auditability', aureus: '100% Open Source Contracts', trad: 'Proprietary black-box algorithms', manual: 'Unverified trade journal' },
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: idx < 5 ? '1px solid var(--c-line)' : 'none' }}>
                  <td style={{ padding: '18px 26px', fontWeight: 700, color: 'var(--c-text)' }}>{row.feature}</td>
                  <td style={{ padding: '18px 26px', fontWeight: 700, color: 'var(--c-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <IconCheck size={18} />
                      <span>{row.aureus}</span>
                    </div>
                  </td>
                  <td style={{ padding: '18px 26px', color: 'var(--c-text-2)' }}>{row.trad}</td>
                  <td style={{ padding: '18px 26px', color: 'var(--c-muted)' }}>{row.manual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── 6. FREQUENTLY ASKED QUESTIONS (FAQ) ─── */}
      <section style={{ maxWidth: 880, margin: '0 auto 140px', paddingBottom: 110, borderBottom: '1px solid var(--c-line)' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: 'var(--c-text)', margin: '0 0 14px' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: 15.5, color: 'var(--c-text-2)', margin: 0 }}>
            Everything you need to know about the Aureus autonomous trading protocol.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div key={idx} className="cp-card" style={{ padding: 0, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{ width: '100%', padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
                >
                  <span style={{ fontSize: 16, fontWeight: 800, color: isOpen ? 'var(--c-primary)' : 'var(--c-text)' }}>
                    {faq.q}
                  </span>
                  <IconCaret dir={isOpen ? 'up' : 'down'} size={18} style={{ color: isOpen ? 'var(--c-primary)' : 'var(--c-muted)', flexShrink: 0, marginLeft: 16 }} />
                </button>
                {isOpen && (
                  <div style={{ padding: '0 28px 24px', fontSize: 15, color: 'var(--c-text-2)', lineHeight: 1.72, borderTop: '1px solid var(--c-line)', paddingTop: 18 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ─── 7. BOTTOM CONVERSION CTA ─── */}
      <section style={{ background: 'linear-gradient(135deg, rgba(240,185,11,0.14), rgba(240,185,11,0.03))', border: '1px solid rgba(240,185,11,0.3)', borderRadius: 24, padding: '64px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: 'var(--c-text)', margin: '0 0 16px' }}>
          Experience Verifiable Autonomous Trading
        </h2>
        <p style={{ fontSize: 16, color: 'var(--c-text-2)', maxWidth: 640, margin: '0 auto 32px', lineHeight: 1.68 }}>
          Connect your Web3 wallet on BNB Smart Chain to access live execution telemetry, strategy skill management, and AI council governance.
        </p>
        <div style={{ display: 'inline-flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {!account ? (
            <button className="cp-mkt-btn-connect" onClick={() => setModalOpen(true)}>
              <IconWallet size={17} />
              <span>Connect Wallet to Launch App ↗</span>
            </button>
          ) : (
            <button className="cp-mkt-btn-connect" onClick={() => go('/terminal')}>
              <span>Go to Live Terminal ↗</span>
            </button>
          )}
          <button className="btn btn-ghost" onClick={() => go('/how-it-works')}>
            Explore 4-Stage Pipeline
          </button>
        </div>
      </section>
    </div>
  )
}
