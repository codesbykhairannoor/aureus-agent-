/** Aureus Protocol · How It Works Marketing Page (/how-it-works).
 *  Standalone page detailing the 4-stage execution pipeline,
 *  AI senate deliberation matrix, Solidity commit interface, and pipeline FAQ.
 */

import React, { useState } from 'react'
import {
  IconScale, IconLock, IconWallet, IconCaret,
} from '../icons'
import { useWeb3Wallet } from '../web3Wallet'

export default function MarketingHowItWorks({ go }: { go: (p: string) => void }) {
  const { setModalOpen, account } = useWeb3Wallet()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const STAGES = [
    {
      num: '01',
      title: 'Signal Ingestion & Telemetry Filter',
      desc: 'The agent continuously streams order books and price feeds from CoinMarketCap and BSC RPC nodes. Outlier trades, spoofing anomalies, and micro-liquidity pairs are filtered through strict pre-trade thresholds.',
      specs: ['150ms Ingestion Latency', 'Multi-Oracle Median Filtering', 'Volume Anomaly Filter'],
    },
    {
      num: '02',
      title: 'Quad-Model Senate Deliberation',
      desc: 'The proposed trade signal is broadcast to 4 distinct LLMs simultaneously. Each model examines macroeconomic sentiment, smart contract safety, quantitative Kelly expectancy, and flash-crash risks.',
      specs: ['GPT-4o + Claude 3.5 + DeepSeek + Gemini', '3/4 Quorum Requirement', 'Independent Confidence Scoring'],
    },
    {
      num: '03',
      title: 'Cryptographic Pre-Execution Hash Commit',
      desc: 'Before any order interacts with DEX liquidity, its exact parameters are serialized into keccak256 hash and sealed on the BSC blockchain. This renders front-running and retroactive outcome tampering impossible.',
      specs: ['SHA-256 / Keccak-256 Hashing', 'Anchored to BSC Block Height', 'Immutable Public Proof'],
    },
    {
      num: '04',
      title: 'Non-Custodial Settlement & Circuit Shield',
      desc: 'The trade executes via user-authorized account abstraction. The smart contract circuit breaker tracks cumulative portfolio drawdown against the 20% hard cap, guaranteeing safety at the blockchain level.',
      specs: ['Trust Wallet Non-Custodial Swap', '20.00% Hard Drawdown Hard Stop', 'Zero Private Key Custody'],
    },
  ]

  const MODELS = [
    {
      name: 'GPT-4o (OpenAI)',
      role: 'Macro Sentiment & News Telemetry',
      focus: 'Analyzes cross-market sentiment, macroeconomic announcements, and global crypto news momentum.',
    },
    {
      name: 'Claude 3.5 Sonnet (Anthropic)',
      role: 'Contract Security & Honeypot Analysis',
      focus: 'Rigorous inspection of token contract bytecodes, liquidity lock duration, and tax/fee structures.',
    },
    {
      name: 'DeepSeek V3 (DeepSeek)',
      role: 'Quantitative Depth & Kelly Formulations',
      focus: 'Solves bid-ask spread decay equations and calculates exact fractional Kelly position size limits.',
    },
    {
      name: 'Gemini 2.0 Flash (Google)',
      role: 'High-Frequency Volatility & Flash-Crash Shield',
      focus: 'Ultra-low latency detection of cascade liquidations and sudden liquidity withdrawal events.',
    },
  ]

  const HOW_FAQS = [
    {
      q: 'How does the Pre-Execution Hash prevent front-running?',
      a: 'By hashing the exact trade parameters (pair, size, direction, expected price) and recording that hash on BSC before routing, the agent cannot retroactively alter its intent after observing market movement.',
    },
    {
      q: 'What happens if one of the AI model APIs goes down or times out?',
      a: 'The Senate Quorum rule requires at least 3 out of 4 models to participate and vote affirmative. If a model times out, the remaining 3 models must vote with unanimous 3/3 consensus, otherwise the trade is safely aborted.',
    },
    {
      q: 'Can the circuit breaker be overridden by the agent during high volatility?',
      a: 'No. The circuit breaker is written in Solidity and deployed directly to the BSC Mainnet. The contract logic does not contain any admin backdoor to disable the 20% drawdown limit.',
    },
  ]

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '100px 24px 160px' }}>
      {/* ─── 1. HERO ─── */}
      <section style={{ textAlign: 'center', maxWidth: 860, margin: '0 auto 80px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(240,185,11,0.1)', border: '1px solid rgba(240,185,11,0.28)', fontSize: 11.5, fontWeight: 800, color: 'var(--c-primary)', marginBottom: 24 }}>
          <span className="cp-net-dot" />
          <span>VERIFIABLE EXECUTION PIPELINE</span>
        </div>
        <h1 style={{ fontSize: 'clamp(34px, 4vw, 54px)', fontWeight: 900, letterSpacing: '-1.2px', margin: '0 0 24px', color: 'var(--c-text)', lineHeight: 1.12 }}>
          The Immutable <span className="cp-grad-text">4-Stage Execution Lifecycle</span>
        </h1>
        <p style={{ fontSize: 16.5, color: 'var(--c-text-2)', lineHeight: 1.7, margin: 0 }}>
          Every trade follows an immutable cryptographic pipeline designed to prevent black-box failures, front-running, and unauthorized risk expansion.
        </p>
      </section>

      {/* ─── 2. THE 4 STAGES ─── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 36, marginBottom: 140, paddingBottom: 110, borderBottom: '1px solid var(--c-line)' }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 16px' }}>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: 'var(--c-text)', margin: '0 0 14px' }}>
            Stage-by-Stage Verification Breakdown
          </h2>
          <p style={{ fontSize: 15.5, color: 'var(--c-text-2)', margin: 0 }}>
            From high-frequency order book telemetry to cryptographic BSC settlement.
          </p>
        </div>

        {STAGES.map((s, idx) => (
          <div key={idx} className="cp-card" style={{ padding: '40px 44px', display: 'flex', alignItems: 'flex-start', gap: 36, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 44, fontWeight: 900, color: 'var(--c-primary)', fontFamily: 'var(--font-mono)', minWidth: 68, lineHeight: 1 }}>
              {s.num}
            </div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--c-text)', margin: '0 0 14px' }}>{s.title}</h3>
              <p style={{ fontSize: 15, color: 'var(--c-text-2)', lineHeight: 1.72, margin: '0 0 24px' }}>{s.desc}</p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {s.specs.map((spec, sIdx) => (
                  <span key={sIdx} className="cp-tag-mini" style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, background: 'var(--c-fill-2)', color: 'var(--c-text)', fontWeight: 700, border: '1px solid var(--c-line)' }}>
                    ✓ {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ─── 3. THE SENATE ARCHITECTURE ─── */}
      <section style={{ marginBottom: 140, paddingBottom: 110, borderBottom: '1px solid var(--c-line)' }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 56px' }}>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: 'var(--c-text)', margin: '0 0 14px' }}>
            The AI Senate Deliberation Matrix
          </h2>
          <p style={{ fontSize: 15.5, color: 'var(--c-text-2)', margin: 0 }}>
            Four independent LLM architectures evaluate complementary risk vectors before quorum is achieved.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
          {MODELS.map((m, i) => (
            <div key={i} className="cp-card" style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <IconScale size={22} style={{ color: 'var(--c-primary)' }} />
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--c-text)' }}>{m.name}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-primary)', marginBottom: 14 }}>{m.role}</div>
              <p style={{ fontSize: 14, color: 'var(--c-text-2)', lineHeight: 1.65, margin: 0, flex: 1 }}>{m.focus}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. CODE SPECIFICATION BLOCK ─── */}
      <section className="cp-card" style={{ padding: '44px 40px', marginBottom: 140, background: 'var(--c-panel-2)', border: '1px solid var(--c-line-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconLock size={22} style={{ color: 'var(--c-primary)' }} />
            <span style={{ fontSize: 15.5, fontWeight: 800, color: 'var(--c-text)', fontFamily: 'var(--font-mono)' }}>
              ICommitRevealPredictionRegistry.sol
            </span>
          </div>
          <span className="cp-tag-mini" style={{ fontSize: 11.5, padding: '5px 12px', borderRadius: 4, background: 'rgba(240,185,11,0.15)', color: 'var(--c-primary)', fontWeight: 800 }}>
            BSC MAINNET #56
          </span>
        </div>

        <pre style={{ margin: 0, padding: 24, borderRadius: 14, background: '#0b0e11', color: '#e6edf3', fontSize: 13.5, lineHeight: 1.7, overflowX: 'auto', fontFamily: 'var(--font-mono)', border: '1px solid rgba(240,185,11,0.2)' }}>
{`// Cryptographic Commit of Pre-Execution Intent
function commitSignal(bytes32 commitHash, uint256 blockDeadline) external returns (bytes32 signalId) {
    require(block.number < blockDeadline, "EXPIRED_DEADLINE");
    require(commitRegistry[commitHash] == 0, "HASH_ALREADY_SEALED");
    
    commitRegistry[commitHash] = block.number;
    emit TradeCommitted(commitHash, block.number, msg.sender);
    return commitHash;
}

// Post-Trade Cryptographic Reveal Verification
function verifyAndExecute(TradeParams calldata params, bytes calldata proofSig) external nonReentrant {
    bytes32 computedHash = keccak256(abi.encode(params, block.chainid));
    require(commitRegistry[computedHash] > 0, "UNSEALED_SIGNAL");
    require(RiskGovernor.drawdownBps() < 2000, "CIRCUIT_BREAKER_ACTIVE");
    
    // Execute via Trust Wallet Non-Custodial Router
    Router.executeSwap(params);
}`}
        </pre>
      </section>

      {/* ─── 5. ARCHITECTURE FAQ ─── */}
      <section style={{ maxWidth: 880, margin: '0 auto 140px', paddingBottom: 110, borderBottom: '1px solid var(--c-line)' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: 'var(--c-text)', margin: '0 0 14px' }}>
            Pipeline Architecture FAQ
          </h2>
          <p style={{ fontSize: 15.5, color: 'var(--c-text-2)', margin: 0 }}>
            Technical explanations for security auditors and DeFi systems engineers.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {HOW_FAQS.map((faq, idx) => {
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

      {/* ─── 6. BOTTOM CTA ─── */}
      <section style={{ background: 'linear-gradient(135deg, rgba(240,185,11,0.14), rgba(240,185,11,0.03))', border: '1px solid rgba(240,185,11,0.3)', borderRadius: 24, padding: '64px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: 'var(--c-text)', margin: '0 0 16px' }}>
          Ready to Inspect Live Execution?
        </h2>
        <p style={{ fontSize: 16, color: 'var(--c-text-2)', maxWidth: 620, margin: '0 auto 32px', lineHeight: 1.68 }}>
          Launch the Pro Trading Cockpit to observe live order book commitments and Senate consensus signals in real time.
        </p>
        <button className="cp-mkt-btn-connect" onClick={() => (account ? go('/terminal') : setModalOpen(true))}>
          <IconWallet size={17} />
          <span>{account ? 'Open Trading Terminal ↗' : 'Connect Wallet to Launch App ↗'}</span>
        </button>
      </section>
    </div>
  )
}
