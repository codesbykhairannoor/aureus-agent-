/** Aureus Protocol · Web3 Authentication Gate.
 *  Displayed when unauthenticated users attempt to access pro trading routes.
 *  Non-custodial login via MetaMask, Trust Wallet, Binance Wallet, WalletConnect, or 1-Click Demo.
 */

import React from 'react'
import { IconShield, IconWallet, IconBot } from '../icons'
import { useWeb3Wallet } from '../web3Wallet'

export default function AuthGate({ go, intendedPath }: { go: (p: string) => void; intendedPath?: string }) {
  const { connect, setModalOpen, isConnecting } = useWeb3Wallet()

  const handleDemoLogin = async () => {
    await connect('demo')
    go(intendedPath || '/terminal')
  }

  return (
    <div style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px' }}>
      <div className="cp-mesh">
        <div className="cp-wash" />
        <div className="cp-grid-bg" />
        <div className="cp-orbs">
          <span className="cp-orb" style={{ width: 440, height: 440, left: '20%', top: '10%', background: 'var(--c-primary)', opacity: 0.16 }} />
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 540, width: '100%', background: 'var(--c-panel)', border: '1px solid var(--c-line-2)', borderRadius: 22, padding: '48px 36px', textAlign: 'center', boxShadow: '0 24px 60px var(--c-shadow-2)' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(240, 185, 11, 0.12)', border: '1px solid rgba(240, 185, 11, 0.3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: 'var(--c-primary)' }}>
          <IconShield size={36} />
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 999, background: 'rgba(240, 185, 11, 0.1)', border: '1px solid rgba(240, 185, 11, 0.25)', fontSize: 11, fontWeight: 800, color: 'var(--c-primary)', marginBottom: 18 }}>
          <span className="cp-net-dot" />
          <span>BNB SMART CHAIN #56 VERIFIED</span>
        </div>

        <h2 style={{ fontSize: 30, fontWeight: 900, color: 'var(--c-text)', margin: '0 0 14px', letterSpacing: '-0.6px' }}>
          Connect to Pro Dashboard
        </h2>

        <p style={{ fontSize: 15, color: 'var(--c-text-2)', lineHeight: 1.68, margin: '0 0 32px' }}>
          The Pro Trading Cockpit, AI Senate, and Strategy Studio are strictly non-custodial and require a Web3 wallet connection to seal cryptographic execution proofs.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <button
            className="cp-mkt-btn-connect"
            onClick={() => setModalOpen(true)}
            disabled={isConnecting}
            style={{ width: '100%', justifyContent: 'center', minHeight: 52, fontSize: 15, fontWeight: 800 }}
          >
            <IconWallet size={19} />
            <span>{isConnecting ? 'Connecting Wallet...' : 'Connect Web3 Wallet (MetaMask / Trust)'}</span>
          </button>

          <button
            className="btn btn-ghost"
            onClick={handleDemoLogin}
            style={{ width: '100%', justifyContent: 'center', minHeight: 48, fontSize: 14, fontWeight: 700, borderColor: 'var(--c-line)' }}
          >
            <IconBot size={18} style={{ marginRight: 8, color: 'var(--c-primary)' }} />
            <span>Try 1-Click Instant Demo Mode (No Wallet Needed)</span>
          </button>
        </div>

        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--c-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--c-muted)' }}>
          <span>100% Non-Custodial · Zero Key Storage</span>
          <button onClick={() => go('/')} style={{ background: 'none', border: 'none', color: 'var(--c-primary)', cursor: 'pointer', fontWeight: 700, padding: 0 }}>
            ← Return to Website
          </button>
        </div>
      </div>
    </div>
  )
}
