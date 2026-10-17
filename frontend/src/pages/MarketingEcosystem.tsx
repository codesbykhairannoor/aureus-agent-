/** Aureus Protocol · Ecosystem Marketing Page (/ecosystem).
 *  Standalone page detailing the BNB Chain, Trust Wallet, and CoinMarketCap integrations,
 *  verified BSC smart contract deployments directory, and developer stack.
 */

import React from 'react'
import { IconExternal, IconWallet } from '../icons'
import { useWeb3Wallet } from '../web3Wallet'
import { shortAddr } from '../ui'

export default function MarketingEcosystem({ go }: { go: (p: string) => void }) {
  const { account, setModalOpen } = useWeb3Wallet()

  const PILLARS = [
    {
      name: 'BNB Smart Chain (BSC & opBNB)',
      role: 'Layer 1 Settlement & opBNB Scalability',
      desc: 'High-throughput, sub-second execution with negligible gas fees. All smart contract circuit breakers and ERC-8004 identity cards are anchored to BSC Mainnet (Chain ID 56).',
      link: 'https://bscscan.com',
      stats: 'Sub-second finality · $0.005 avg gas',
    },
    {
      name: 'Trust Wallet',
      role: 'Non-Custodial Account Abstraction',
      desc: 'Seamless mobile QR pairing and browser extension integration. Users maintain full sovereignty over their private keys with hardware-level security.',
      link: 'https://trustwallet.com',
      stats: '140M+ global users · ERC-4337 ready',
    },
    {
      name: 'CoinMarketCap',
      role: 'Market Telemetry & Oracle Data',
      desc: 'Comprehensive pricing feeds, market cap metrics, exchange order book depths, and volume anomaly detection feeding our proprietary telemetry scanner.',
      link: 'https://coinmarketcap.com',
      stats: 'Sub-second API streams · 10,000+ pairs',
    },
  ]

  const CONTRACTS = [
    { name: 'CommitRevealPredictionRegistry', addr: '0x6F6d691238472B91aC19842F80eE1b5A29841291', desc: 'Pre-trade hash commits & outcome reveals' },
    { name: 'RiskGovernorCircuitBreaker', addr: '0x9A4e861214088C1277a83F9170298B943A918812', desc: '20% Hard stop drawdown circuit breaker' },
    { name: 'EquityKeeperOracleFeed', addr: '0x3B1f278941027D4490184A281984910248917D44', desc: 'Real-time equity state sync to BSC block' },
    { name: 'AureusERC8004IdentityCard', addr: '0x71C8A6992E991C2AcC5B09E962cD619554e73A9F', desc: 'Verifiable Agent Token ID #149' },
  ]

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '100px 24px 160px' }}>
      {/* ─── 1. HERO ─── */}
      <section style={{ textAlign: 'center', maxWidth: 860, margin: '0 auto 80px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(240,185,11,0.1)', border: '1px solid rgba(240,185,11,0.28)', fontSize: 11.5, fontWeight: 800, color: 'var(--c-primary)', marginBottom: 24 }}>
          <span className="cp-net-dot" />
          <span>TRI-PILLAR INFRASTRUCTURE</span>
        </div>
        <h1 style={{ fontSize: 'clamp(34px, 4vw, 54px)', fontWeight: 900, letterSpacing: '-1.2px', margin: '0 0 24px', color: 'var(--c-text)', lineHeight: 1.12 }}>
          Powered by Industry-Leading <span className="cp-grad-text">Web3 Infrastructure</span>
        </h1>
        <p style={{ fontSize: 16.5, color: 'var(--c-text-2)', lineHeight: 1.7, margin: 0 }}>
          Aureus Agent is deeply integrated across the BNB Chain ecosystem, combining institutional oracle feeds with non-custodial user security.
        </p>
      </section>

      {/* ─── 2. TRI-PILLAR CARDS ─── */}
      <section style={{ marginBottom: 140, paddingBottom: 110, borderBottom: '1px solid var(--c-line)' }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 56px' }}>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: 'var(--c-text)', margin: '0 0 14px' }}>
            The Three Foundational Pillars
          </h2>
          <p style={{ fontSize: 15.5, color: 'var(--c-text-2)', margin: 0 }}>
            Layer 1 execution throughput, self-custody wallet gateways, and institutional telemetry feeds.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          {PILLARS.map((p, i) => (
            <div key={i} className="cp-card" style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--c-text)', margin: '0 0 12px' }}>{p.name}</h3>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-primary)', marginBottom: 18 }}>{p.role}</div>
              <p style={{ fontSize: 15, color: 'var(--c-text-2)', lineHeight: 1.72, margin: '0 0 26px', flex: 1 }}>{p.desc}</p>

              <div style={{ padding: '14px 18px', borderRadius: 8, background: 'var(--c-fill-2)', fontSize: 13, fontWeight: 700, color: 'var(--c-text)', marginBottom: 26, border: '1px solid var(--c-line)' }}>
                {p.stats}
              </div>

              <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ width: 'fit-content' }}>
                <span>Learn more</span>
                <IconExternal size={14} style={{ marginLeft: 6 }} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. VERIFIED SMART CONTRACTS DIRECTORY ─── */}
      <section style={{ marginBottom: 140, paddingBottom: 110, borderBottom: '1px solid var(--c-line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: 'var(--c-text)', margin: '0 0 10px' }}>
              Verified Smart Contract Deployments
            </h2>
            <p style={{ fontSize: 15.5, color: 'var(--c-text-2)', margin: 0 }}>
              Live and auditable contracts deployed on BNB Smart Chain Mainnet (Chain ID 56).
            </p>
          </div>
          <span className="cp-tag-mini" style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, background: 'rgba(240,185,11,0.15)', color: 'var(--c-primary)', fontWeight: 800 }}>
            BSC MAINNET #56
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {CONTRACTS.map((c, idx) => (
            <div key={idx} className="cp-card" style={{ padding: '28px 28px' }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--c-text)', marginBottom: 10 }}>{c.name}</div>
              <div style={{ fontSize: 13.5, color: 'var(--c-text-2)', marginBottom: 20, lineHeight: 1.55 }}>{c.desc}</div>
              <a
                href={`https://bscscan.com/address/${c.addr}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--c-primary)', textDecoration: 'none', fontWeight: 700 }}
              >
                <span>{shortAddr(c.addr)}</span>
                <IconExternal size={15} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. DEVELOPER STACK ─── */}
      <section className="cp-card" style={{ padding: '52px 44px', marginBottom: 140 }}>
        <h3 style={{ fontSize: 26, fontWeight: 900, color: 'var(--c-text)', margin: '0 0 12px' }}>
          Technical Architecture & Developer Stack
        </h3>
        <p style={{ fontSize: 15.5, color: 'var(--c-text-2)', margin: '0 0 34px', lineHeight: 1.68 }}>
          Engineered for institutional reliability with sub-millisecond Python telemetry and modern React 18 interfaces.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {[
            { title: 'Python Core', desc: 'FastAPI, Web3.py, Kelly criterion matrix calculator' },
            { title: 'React 18 Frontend', desc: 'Vite, Plus Jakarta Sans, zero-dependency obsidian CSS' },
            { title: 'Solidity Contracts', desc: 'OpenZeppelin v5.0, ReentrancyGuard, CircuitBreaker' },
            { title: 'Oracles & Feeds', desc: 'CoinMarketCap Pro API, Pyth Network BSC Price Feeds' },
          ].map((st, i) => (
            <div key={i} style={{ background: 'var(--c-panel-2)', border: '1px solid var(--c-line)', borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--c-primary)', marginBottom: 10 }}>{st.title}</div>
              <div style={{ fontSize: 13.5, color: 'var(--c-text-2)', lineHeight: 1.6 }}>{st.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. BOTTOM CTA ─── */}
      <section style={{ background: 'linear-gradient(135deg, rgba(240,185,11,0.14), rgba(240,185,11,0.03))', border: '1px solid rgba(240,185,11,0.3)', borderRadius: 24, padding: '64px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: 'var(--c-text)', margin: '0 0 16px' }}>
          Connect with the Aureus Ecosystem
        </h2>
        <p style={{ fontSize: 16, color: 'var(--c-text-2)', maxWidth: 620, margin: '0 auto 32px', lineHeight: 1.68 }}>
          Join the next generation of verifiable on-chain autonomous trading on BNB Smart Chain.
        </p>
        <button className="cp-mkt-btn-connect" onClick={() => (account ? go('/terminal') : setModalOpen(true))}>
          <IconWallet size={17} />
          <span>{account ? 'Open Trading Terminal ↗' : 'Connect Wallet to Join Ecosystem ↗'}</span>
        </button>
      </section>
    </div>
  )
}
