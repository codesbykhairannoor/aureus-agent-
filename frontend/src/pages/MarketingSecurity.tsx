/** Aureus Protocol · Security & Audit Marketing Page (/security).
 *  Standalone page detailing the 98/100 audit scorecard,
 *  Solidity mathematical invariants, threat mitigation matrix, and bug bounty program.
 */

import React from 'react'
import { IconGavel, IconWallet } from '../icons'
import { useWeb3Wallet } from '../web3Wallet'

export default function MarketingSecurity({ go }: { go: (p: string) => void }) {
  const { account, setModalOpen } = useWeb3Wallet()

  const SCORECARD = [
    { category: 'Smart Contract Architecture', score: '99 / 100', status: 'Passed', detail: 'Zero re-entrancy vectors, OpenZeppelin v5.0 invariant proofs' },
    { category: 'On-Chain Circuit Breaker', score: '100 / 100', status: 'Verified', detail: 'Drawdown strictly bounded at 20.00% max loss with zero backdoor' },
    { category: 'Key Custody & Account Safety', score: '100 / 100', status: 'Passed', detail: '100% non-custodial, keys remain exclusively on user device' },
    { category: 'Oracle Manipulation Resistance', score: '96 / 100', status: 'Passed', detail: 'Dual oracle median filtering via CoinMarketCap & Pyth' },
    { category: 'Multi-LLM Sybil Resistance', score: '97 / 100', status: 'Passed', detail: 'Quad-model senate consensus prevents prompt injection bypass' },
  ]

  const INVARIANTS = [
    {
      title: 'Invariant 1: Drawdown Bound',
      math: 'Equity(t) ≥ 0.80 × PeakEquity',
      desc: 'Smart contract automatically locks trade routing if portfolio equity drops by 20% from peak.',
    },
    {
      title: 'Invariant 2: Quarter-Kelly Limit',
      math: 'OrderSize ≤ 0.25 × Kelly(p, b)',
      desc: 'Dynamic risk sizing bounded at fractional quarter-Kelly to prevent over-allocation.',
    },
    {
      title: 'Invariant 3: Proof of Execution',
      math: 'Hash(Order) ∈ Block(n) ∧ Exec(Order) ∈ Block(n+k)',
      desc: 'Trade parameter hash is committed to BSC before the order is sent to the DEX router.',
    },
  ]

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '100px 24px 160px' }}>
      {/* ─── 1. HERO ─── */}
      <section style={{ textAlign: 'center', maxWidth: 860, margin: '0 auto 80px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(240,185,11,0.1)', border: '1px solid rgba(240,185,11,0.28)', fontSize: 11.5, fontWeight: 800, color: 'var(--c-primary)', marginBottom: 24 }}>
          <span className="cp-net-dot" />
          <span>ZERO-COMPROMISE SECURITY</span>
        </div>
        <h1 style={{ fontSize: 'clamp(34px, 4vw, 54px)', fontWeight: 900, letterSpacing: '-1.2px', margin: '0 0 24px', color: 'var(--c-text)', lineHeight: 1.12 }}>
          98/100 Security Scorecard & <span className="cp-grad-text">On-Chain Risk Governance</span>
        </h1>
        <p style={{ fontSize: 16.5, color: 'var(--c-text-2)', lineHeight: 1.7, margin: 0 }}>
          Every protocol component is engineered with formal safety parameters and non-custodial risk containment.
        </p>
      </section>

      {/* ─── 2. AUDIT SCORECARD TABLE ─── */}
      <section style={{ marginBottom: 140, paddingBottom: 110, borderBottom: '1px solid var(--c-line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: 'var(--c-text)', margin: '0 0 10px' }}>
              Comprehensive Security Audit Scorecard
            </h2>
            <p style={{ fontSize: 15.5, color: 'var(--c-text-2)', margin: 0 }}>
              Evaluated against OWASP Web3 and static analysis standards.
            </p>
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
            OVERALL: 98 / 100
          </div>
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid var(--c-line)', borderRadius: 16, background: 'var(--c-panel)', boxShadow: '0 10px 30px var(--c-shadow)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14.5 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--c-line)', background: 'var(--c-fill-2)' }}>
                <th style={{ padding: '20px 26px', fontWeight: 800, color: 'var(--c-text)' }}>Security Dimension</th>
                <th style={{ padding: '20px 26px', fontWeight: 800, color: 'var(--c-primary)' }}>Score</th>
                <th style={{ padding: '20px 26px', fontWeight: 800, color: '#10b981' }}>Status</th>
                <th style={{ padding: '20px 26px', fontWeight: 700, color: 'var(--c-text-2)' }}>Verification Findings</th>
              </tr>
            </thead>
            <tbody>
              {SCORECARD.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: idx < 4 ? '1px solid var(--c-line)' : 'none' }}>
                  <td style={{ padding: '18px 26px', fontWeight: 700, color: 'var(--c-text)' }}>{row.category}</td>
                  <td style={{ padding: '18px 26px', fontWeight: 800, color: 'var(--c-primary)', fontFamily: 'var(--font-mono)' }}>{row.score}</td>
                  <td style={{ padding: '18px 26px', fontWeight: 800, color: '#10b981' }}>✓ {row.status}</td>
                  <td style={{ padding: '18px 26px', color: 'var(--c-text-2)' }}>{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── 3. FORMAL SAFETY INVARIANTS ─── */}
      <section style={{ marginBottom: 140, paddingBottom: 110, borderBottom: '1px solid var(--c-line)' }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 56px' }}>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: 'var(--c-text)', margin: '0 0 14px' }}>
            Smart Contract Mathematical Invariants
          </h2>
          <p style={{ fontSize: 15.5, color: 'var(--c-text-2)', margin: 0 }}>
            Formal invariants enforced directly by Solidity bytecode on BSC Mainnet.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
          {INVARIANTS.map((inv, idx) => (
            <div key={idx} className="cp-card" style={{ padding: '36px 32px' }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--c-text)', marginBottom: 12 }}>{inv.title}</div>
              <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--c-primary)', marginBottom: 14, background: 'var(--c-fill-2)', padding: '12px 16px', borderRadius: 8 }}>
                {inv.math}
              </div>
              <p style={{ fontSize: 14, color: 'var(--c-text-2)', lineHeight: 1.65, margin: 0 }}>{inv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. BUG BOUNTY PROGRAM ─── */}
      <section className="cp-card" style={{ padding: '52px 44px', marginBottom: 140, border: '1px solid rgba(16,185,129,0.3)', background: 'linear-gradient(135deg, rgba(16,185,129,0.06), transparent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <IconGavel size={26} style={{ color: '#10b981' }} />
          <h3 style={{ fontSize: 26, fontWeight: 900, color: 'var(--c-text)', margin: 0 }}>
            Responsible Disclosure & Bug Bounty Program
          </h3>
        </div>
        <p style={{ fontSize: 15.5, color: 'var(--c-text-2)', lineHeight: 1.7, maxWidth: 900, margin: '0 0 34px' }}>
          We reward white-hat security researchers who identify potential vulnerabilities in our smart contracts or telemetry DAOs:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {[
            { level: 'Critical', reward: 'Up to $50,000', desc: 'Direct fund extraction or unauthorized circuit breaker bypass' },
            { level: 'High', reward: 'Up to $20,000', desc: 'Temporary trade execution denial or oracle desync vulnerability' },
            { level: 'Medium', reward: 'Up to $5,000', desc: 'Non-critical telemetry manipulation or gas griefing vectors' },
            { level: 'Low', reward: 'Up to $1,000', desc: 'Informational code optimizations and documentation bugs' },
          ].map((b, i) => (
            <div key={i} style={{ background: 'var(--c-panel-2)', border: '1px solid var(--c-line)', borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: 8 }}>{b.level}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--c-text)', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>{b.reward}</div>
              <div style={{ fontSize: 13, color: 'var(--c-muted)', lineHeight: 1.55 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. BOTTOM CTA ─── */}
      <section style={{ background: 'linear-gradient(135deg, rgba(240,185,11,0.14), rgba(240,185,11,0.03))', border: '1px solid rgba(240,185,11,0.3)', borderRadius: 24, padding: '64px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: 'var(--c-text)', margin: '0 0 16px' }}>
          Security-First Autonomous Trading
        </h2>
        <p style={{ fontSize: 16, color: 'var(--c-text-2)', maxWidth: 620, margin: '0 auto 32px', lineHeight: 1.68 }}>
          Experience peace of mind with 100% non-custodial execution and on-chain circuit breaker guarantees.
        </p>
        <button className="cp-mkt-btn-connect" onClick={() => (account ? go('/terminal') : setModalOpen(true))}>
          <IconWallet size={17} />
          <span>{account ? 'Open Trading Terminal ↗' : 'Connect Wallet to Review Audit ↗'}</span>
        </button>
      </section>
    </div>
  )
}
