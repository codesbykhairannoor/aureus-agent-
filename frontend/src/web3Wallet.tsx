import React, { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react'
import QRCode from 'qrcode'
import { Portal, shortAddr } from './ui'
import { IconClose, IconCheck, IconExternal, IconWallet, LogoBnb, LogoTrust, IconBot } from './icons'

export interface Web3WalletContextType {
  account: string | null
  chainId: number | null
  balance: string | null
  isConnecting: boolean
  modalOpen: boolean
  setModalOpen: (open: boolean) => void
  connect: (walletType?: string) => Promise<boolean>
  disconnect: () => void
  isBsc: boolean
  switchNetwork: () => Promise<void>
  setCustomSession: (addr: string, chainId?: number, prov?: any) => Promise<void>
}

const Web3WalletContext = createContext<Web3WalletContextType | null>(null)

const BSC_CHAIN_ID_HEX = '0x38' // 56
const BSC_CHAIN_ID_DEC = 56
const BSC_RPC_URL = import.meta.env.VITE_BSC_RPC_URL || 'https://bsc-dataseed.binance.org/'
const WC_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'c0891d12d1bca7289e089af886e1945b'

let wcProviderSingleton: any = null

async function getWcProvider() {
  if (wcProviderSingleton) return wcProviderSingleton
  const { EthereumProvider } = await import('@walletconnect/ethereum-provider')
  wcProviderSingleton = await EthereumProvider.init({
    projectId: WC_PROJECT_ID,
    chains: [BSC_CHAIN_ID_DEC],
    showQrModal: false,
    metadata: {
      name: 'Aureus Protocol',
      description: 'Autonomous AI Risk & Trading Agent',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://aureus.trade',
      icons: ['https://binance.com/favicon.ico'],
    },
  })
  return wcProviderSingleton
}

async function fetchBscBalance(address: string, prov?: any): Promise<string> {
  try {
    const p = prov || (typeof window !== 'undefined' ? (window as any).ethereum : null)
    if (p && p.request) {
      const hex = await p.request({ method: 'eth_getBalance', params: [address, 'latest'] })
      const wei = BigInt(hex)
      const bnb = Number(wei) / 1e18
      return `${bnb.toFixed(4)} BNB`
    }
  } catch (e) {
    console.warn('Failed to fetch balance:', e)
  }
  return '0.0000 BNB'
}

async function switchToBsc(prov?: any): Promise<void> {
  const p = prov || (typeof window !== 'undefined' ? (window as any).ethereum : null)
  if (!p || !p.request) return
  try {
    await p.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BSC_CHAIN_ID_HEX }],
    })
  } catch (err: any) {
    if (err.code === 4902) {
      await p.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: BSC_CHAIN_ID_HEX,
          chainName: 'BNB Smart Chain Mainnet',
          nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
          rpcUrls: [BSC_RPC_URL],
          blockExplorerUrls: ['https://bscscan.com/'],
        }],
      })
    }
  }
}

export function Web3WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const activeProviderRef = useRef<any>(null)

  const isBsc = chainId === BSC_CHAIN_ID_DEC

  const disconnect = useCallback(() => {
    setAccount(null)
    setChainId(null)
    setBalance(null)
    activeProviderRef.current = null
    localStorage.removeItem('aureus_wallet_type')
    localStorage.removeItem('aureus_wallet_addr')
    if (wcProviderSingleton) {
      try { wcProviderSingleton.disconnect() } catch {}
    }
  }, [])

  const setCustomSession = useCallback(async (addr: string, cId = 56, prov: any = null) => {
    setAccount(addr)
    setChainId(cId)
    activeProviderRef.current = prov
    localStorage.setItem('aureus_wallet_type', 'custom')
    localStorage.setItem('aureus_wallet_addr', addr)
    if (prov) {
      const bal = await fetchBscBalance(addr, prov)
      setBalance(bal)
    } else {
      setBalance('12.4500 BNB')
    }
  }, [])

  const connect = useCallback(async (walletType: string = 'injected'): Promise<boolean> => {
    setIsConnecting(true)
    try {
      if (walletType === 'demo') {
        const demoAddr = '0x71C8364665BA10b89230571d7945d8b76251b695'
        setAccount(demoAddr)
        setChainId(56)
        setBalance('12.4500 BNB')
        localStorage.setItem('aureus_wallet_type', 'demo')
        localStorage.setItem('aureus_wallet_addr', demoAddr)
        setModalOpen(false)
        return true
      }

      const anyWin = typeof window !== 'undefined' ? (window as any) : {}
      let prov: any = null

      if (walletType === 'binance' && anyWin.BinanceChain) {
        prov = anyWin.BinanceChain
      } else if (walletType === 'trust' && anyWin.trustwallet) {
        prov = anyWin.trustwallet
      } else {
        prov = anyWin.ethereum || anyWin.trustwallet || anyWin.BinanceChain
      }

      if (!prov) {
        setModalOpen(true)
        return false
      }

      activeProviderRef.current = prov
      const accounts = await prov.request({ method: 'eth_requestAccounts' })
      if (!accounts || accounts.length === 0) return false

      const addr = accounts[0]
      setAccount(addr)

      const chainHex = await prov.request({ method: 'eth_chainId' }).catch(() => '0x38')
      const cId = parseInt(chainHex, 16) || 56
      setChainId(cId)

      if (cId !== 56) {
        await switchToBsc(prov).catch(() => {})
      }

      const bal = await fetchBscBalance(addr, prov)
      setBalance(bal)

      localStorage.setItem('aureus_wallet_type', walletType)
      localStorage.setItem('aureus_wallet_addr', addr)
      setModalOpen(false)
      return true
    } catch (err: any) {
      console.warn('Connect wallet error:', err)
      return false
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const switchNetwork = useCallback(async () => {
    await switchToBsc(activeProviderRef.current)
  }, [])

  // Auto reconnect on mount
  useEffect(() => {
    const savedType = localStorage.getItem('aureus_wallet_type')
    const savedAddr = localStorage.getItem('aureus_wallet_addr')
    if (!savedType) return

    if (savedType === 'demo') {
      setAccount(savedAddr || '0x71C8364665BA10b89230571d7945d8b76251b695')
      setChainId(56)
      setBalance('12.4500 BNB')
      return
    }

    const anyWin = typeof window !== 'undefined' ? (window as any) : {}
    const prov = anyWin.ethereum || anyWin.trustwallet || anyWin.BinanceChain
    if (prov) {
      prov.request({ method: 'eth_accounts' }).then(async (accs: string[]) => {
        if (accs && accs.length > 0) {
          setAccount(accs[0])
          activeProviderRef.current = prov
          const chainHex = await prov.request({ method: 'eth_chainId' }).catch(() => '0x38')
          setChainId(parseInt(chainHex, 16) || 56)
          const bal = await fetchBscBalance(accs[0], prov)
          setBalance(bal)
        }
      }).catch(() => {})
    }
  }, [])

  // Provider event listeners
  useEffect(() => {
    const anyWin = typeof window !== 'undefined' ? (window as any) : {}
    const prov = activeProviderRef.current || anyWin.ethereum
    if (!prov || !prov.on) return

    const handleAccounts = (accs: string[]) => {
      if (!accs || accs.length === 0) {
        disconnect()
      } else {
        setAccount(accs[0])
        fetchBscBalance(accs[0], prov).then(setBalance)
      }
    }

    const handleChain = (cHex: string) => {
      setChainId(parseInt(cHex, 16) || 56)
      if (account) fetchBscBalance(account, prov).then(setBalance)
    }

    prov.on('accountsChanged', handleAccounts)
    prov.on('chainChanged', handleChain)

    return () => {
      if (prov.removeListener) {
        prov.removeListener('accountsChanged', handleAccounts)
        prov.removeListener('chainChanged', handleChain)
      }
    }
  }, [account, disconnect])

  return (
    <Web3WalletContext.Provider
      value={{
        account,
        chainId,
        balance,
        isConnecting,
        modalOpen,
        setModalOpen,
        connect,
        disconnect,
        isBsc,
        switchNetwork,
        setCustomSession,
      }}
    >
      {children}
      {modalOpen && <ConnectWalletModal onClose={() => setModalOpen(false)} />}
    </Web3WalletContext.Provider>
  )
}

export function useWeb3Wallet(): Web3WalletContextType {
  const ctx = useContext(Web3WalletContext)
  if (!ctx) {
    throw new Error('useWeb3Wallet must be used within a Web3WalletProvider')
  }
  return ctx
}

/* ═══════════════════════════════════════════════════════
   WALLET CONNECT MODAL (CLEAN & FAST)
   ═══════════════════════════════════════════════════════ */
function ConnectWalletModal({ onClose }: { onClose: () => void }) {
  const { connect, setCustomSession } = useWeb3Wallet()
  const [view, setView] = useState<'list' | 'qr'>('list')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [wcUri, setWcUri] = useState('')
  const [copied, setCopied] = useState(false)
  const [qrLoading, setQrLoading] = useState(false)
  const [qrError, setQrError] = useState('')

  const startQr = async () => {
    setView('qr')
    setQrError('')
    if (qrDataUrl) return

    setQrLoading(true)
    try {
      const provider = await getWcProvider()

      const renderUri = async (uri: string) => {
        if (!uri) return
        setWcUri(uri)
        try {
          const url = await QRCode.toDataURL(uri, {
            width: 260,
            margin: 1,
            color: { dark: '#0a0d14', light: '#ffffff' },
          })
          setQrDataUrl(url)
          setQrLoading(false)
        } catch {
          // Instant fallback
          setQrDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(uri)}`)
          setQrLoading(false)
        }
      }

      provider.on('display_uri', (uri: string) => {
        renderUri(uri)
      })

      // Try instant pairing creation
      try {
        const pairing = await provider.signer?.client?.core?.pairing?.create?.()
        if (pairing?.uri) {
          await renderUri(pairing.uri)
          provider.connect({ pairingTopic: pairing.topic }).then(async () => {
            if (provider.accounts?.[0]) {
              await setCustomSession(provider.accounts[0], provider.chainId || 56, provider)
              onClose()
            }
          }).catch(() => {})
          return
        }
      } catch {
        // continue to normal connect
      }

      if (provider.signer?.uri) {
        await renderUri(provider.signer.uri)
      }

      provider.connect().then(async () => {
        if (provider.accounts?.[0]) {
          await setCustomSession(provider.accounts[0], provider.chainId || 56, provider)
          onClose()
        }
      }).catch(() => {})

      // Watchdog timeout to prevent infinite spinner
      setTimeout(() => {
        setQrLoading(false)
      }, 4000)
    } catch (e: any) {
      console.warn('QR session init error:', e)
      setQrError('WalletConnect relay took too long. Try again or use Browser Extension.')
      setQrLoading(false)
    }
  }

  const copyUri = () => {
    if (!wcUri) return
    navigator.clipboard.writeText(wcUri)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Portal>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          background: 'rgba(5, 7, 12, 0.78)',
          backdropFilter: 'blur(10px)',
          animation: 'cp-fade-in 0.2s ease',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 420,
            background: 'var(--c-panel, #12151e)',
            border: '1px solid var(--c-line-2, rgba(255,255,255,0.12))',
            borderRadius: 20,
            padding: '24px 22px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            color: 'var(--c-text, #fff)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {view === 'qr' && (
                <button
                  type="button"
                  onClick={() => setView('list')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--c-muted, #8b949e)',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 700,
                    padding: '2px 6px',
                  }}
                >
                  ← Back
                </button>
              )}
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
                {view === 'qr' ? 'Scan Mobile Wallet' : 'Connect Wallet'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--c-line, rgba(255,255,255,0.1))',
                borderRadius: 8,
                padding: 6,
                color: 'var(--c-muted, #8b949e)',
                cursor: 'pointer',
                display: 'flex',
              }}
            >
              <IconClose size={16} />
            </button>
          </div>

          {view === 'list' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* MetaMask / Browser Extension */}
              <button
                type="button"
                onClick={() => connect('injected')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--c-line, rgba(255,255,255,0.08))',
                  cursor: 'pointer',
                  color: 'inherit',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(240, 185, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F0B90B' }}>
                    <LogoBnb size={22} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>MetaMask / Browser Extension</div>
                    <div style={{ fontSize: 11.5, color: 'var(--c-muted, #8b949e)' }}>Chrome, Brave, Edge & desktop extensions</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.08)' }}>Connect</span>
              </button>

              {/* WalletConnect / Trust / Mobile QR */}
              <button
                type="button"
                onClick={startQr}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--c-line, rgba(255,255,255,0.08))',
                  cursor: 'pointer',
                  color: 'inherit',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(5, 145, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0591ff' }}>
                    <LogoTrust size={20} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>WalletConnect / Mobile QR</div>
                    <div style={{ fontSize: 11.5, color: 'var(--c-muted, #8b949e)' }}>Trust Wallet, SafePal, Binance app</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(5, 145, 255, 0.15)', color: '#0591ff' }}>QR Code</span>
              </button>

              {/* 1-Click Instant Demo */}
              <button
                type="button"
                onClick={() => connect('demo')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 14,
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  cursor: 'pointer',
                  color: 'inherit',
                  transition: 'all 0.15s ease',
                  marginTop: 6,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                    <IconBot size={20} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#10b981' }}>1-Click Instant Demo Mode</div>
                    <div style={{ fontSize: 11.5, color: 'var(--c-muted, #8b949e)' }}>Instant access without browser extension</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: 'rgba(16, 185, 129, 0.25)', color: '#10b981' }}>Free</span>
              </button>
            </div>
          ) : (
            /* QR View */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0' }}>
              <div
                style={{
                  width: 260,
                  height: 260,
                  background: '#ffffff',
                  borderRadius: 16,
                  padding: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                  marginBottom: 16,
                }}
              >
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="WalletConnect QR" style={{ width: 244, height: 244, display: 'block', borderRadius: 8 }} />
                ) : qrLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <span className="cp-spinner" style={{ width: 32, height: 32, borderColor: '#3b82f6', borderTopColor: 'transparent' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>Generating QR code...</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 16, textAlign: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#dc2626' }}>Relay did not respond</span>
                    <button
                      type="button"
                      onClick={startQr}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: 11, padding: '6px 12px' }}
                    >
                      🔄 Retry QR
                    </button>
                  </div>
                )}
              </div>

              <p style={{ margin: '0 0 14px', fontSize: 12, color: 'var(--c-muted, #8b949e)', textAlign: 'center', lineHeight: 1.5 }}>
                Open Trust Wallet, SafePal, or MetaMask Mobile on your phone and scan to connect.
              </p>

              {wcUri && (
                <button
                  type="button"
                  onClick={copyUri}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--c-line, rgba(255,255,255,0.12))',
                    color: copied ? 'var(--green, #10b981)' : 'inherit',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {copied ? <IconCheck size={14} /> : null}
                  <span>{copied ? 'Copied link!' : 'Copy raw connection URI'}</span>
                </button>
              )}
            </div>
          )}

          {/* Footer badge */}
          <div
            style={{
              marginTop: 20,
              paddingTop: 14,
              borderTop: '1px solid var(--c-line, rgba(255,255,255,0.08))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 11.5,
              color: 'var(--c-muted, #8b949e)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#F0B90B' }} />
              <span>BNB Smart Chain (#56)</span>
            </div>
            <span>100% Non-Custodial</span>
          </div>
        </div>
      </div>
    </Portal>
  )
}

/* ═══════════════════════════════════════════════════════
   WALLET NAV BUTTON
   ═══════════════════════════════════════════════════════ */
export function WalletNavButton() {
  const { account, balance, isBsc, disconnect, setModalOpen, switchNetwork } = useWeb3Wallet()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  if (!account) {
    return (
      <button
        type="button"
        className="cp-mkt-btn-connect"
        onClick={() => setModalOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '8px 16px',
          borderRadius: 999,
          fontWeight: 800,
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        <IconWallet size={15} />
        <span>Connect Wallet</span>
      </button>
    )
  }

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid var(--c-line-2, rgba(255,255,255,0.15))',
          color: 'var(--c-text, #fff)',
          fontWeight: 700,
          fontSize: 12.5,
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: isBsc ? '#10b981' : '#f59e0b',
            boxShadow: isBsc ? '0 0 6px #10b981' : 'none',
          }}
        />
        {balance && <span style={{ color: 'var(--c-text-2, #94a3b8)' }}>{balance}</span>}
        <span style={{ fontFamily: 'monospace' }}>{shortAddr(account)}</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            width: 240,
            background: 'var(--c-panel, #12151e)',
            border: '1px solid var(--c-line-2, rgba(255,255,255,0.15))',
            borderRadius: 14,
            padding: 12,
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ padding: '4px 6px' }}>
            <div style={{ fontSize: 11, color: 'var(--c-muted, #8b949e)' }}>Connected Account</div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: 'var(--c-text, #fff)' }}>
              {shortAddr(account)}
            </div>
          </div>

          {!isBsc && (
            <button
              type="button"
              onClick={switchNetwork}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 8,
                background: 'rgba(240, 185, 11, 0.15)',
                border: '1px solid rgba(240, 185, 11, 0.4)',
                color: '#F0B90B',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Switch to BNB Chain (#56)
            </button>
          )}

          <a
            href={`https://bscscan.com/address/${account}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              borderRadius: 6,
              color: 'var(--c-muted, #8b949e)',
              textDecoration: 'none',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <span>View on BscScan</span>
            <IconExternal size={12} />
          </a>

          <div style={{ height: 1, background: 'var(--c-line, rgba(255,255,255,0.08))', margin: '2px 0' }} />

          <button
            type="button"
            onClick={() => { disconnect(); setOpen(false) }}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#ef4444',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  )
}
