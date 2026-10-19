import React, { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import QRCode from 'qrcode'
import { IconClose, IconCheck, IconExternal, IconWallet, LogoTrust, LogoBnb } from './icons'
import { shortAddr } from './ui'

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
const BSC_RPC_URL = import.meta.env.VITE_BSC_RPC_URL || 'https://bsc-dataseed.binance.org/'
const BSC_CHAIN_PARAMS = {
  chainId: BSC_CHAIN_ID_HEX,
  chainName: 'BNB Smart Chain Mainnet',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  rpcUrls: [BSC_RPC_URL],
  blockExplorerUrls: ['https://bscscan.com/'],
}

// Helpers
function getInjectedProvider(walletType?: string): any {
  if (typeof window === 'undefined') return null
  const anyWin = window as any
  if (walletType === 'trust' && anyWin.trustwallet) {
    return anyWin.trustwallet
  }
  if (walletType === 'binance' && anyWin.BinanceChain) {
    return anyWin.BinanceChain
  }
  if (anyWin.ethereum) {
    if (walletType === 'metamask' && anyWin.ethereum.isMetaMask) {
      return anyWin.ethereum
    }
    return anyWin.ethereum
  }
  return null
}

export function Web3WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(() => {
    try {
      return localStorage.getItem('aureus_wallet_account') || null
    } catch {
      return null
    }
  })
  const [chainId, setChainId] = useState<number | null>(() => {
    try {
      const c = localStorage.getItem('aureus_wallet_chain')
      return c ? Number(c) : null
    } catch {
      return null
    }
  })
  const [balance, setBalance] = useState<string | null>(null)
  const [providerInstance, setProviderInstance] = useState<any>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const isBsc = chainId === 56

  const fetchBalance = useCallback(async (addr: string, prov?: any) => {
    const p = prov || providerInstance || getInjectedProvider()
    if (p?.request) {
      try {
        const hexBal = await p.request({
          method: 'eth_getBalance',
          params: [addr, 'latest'],
        })
        if (hexBal) {
          const val = parseInt(hexBal, 16) / 1e18
          setBalance(`${val.toFixed(3)} BNB`)
          return
        }
      } catch {
        /* fallback to public RPC */
      }
    }

    try {
      const res = await fetch(BSC_RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getBalance',
          params: [addr, 'latest'],
        }),
      })
      const data = await res.json()
      if (data?.result) {
        const val = parseInt(data.result, 16) / 1e18
        setBalance(`${val.toFixed(3)} BNB`)
        return
      }
    } catch {
      /* ignore */
    }
    setBalance('0.000 BNB')
  }, [providerInstance])

  const switchNetwork = useCallback(async () => {
    const provider = providerInstance || getInjectedProvider()
    if (!provider) return
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_CHAIN_ID_HEX }],
      })
    } catch (switchError: any) {
      if (switchError?.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [BSC_CHAIN_PARAMS],
          })
        } catch {
          /* ignore */
        }
      }
    }
  }, [providerInstance])

  const connect = useCallback(async (walletType?: string): Promise<boolean> => {
    setIsConnecting(true)

    // Demo connection fallback if user chooses or if no web3 extension found
    if (walletType === 'demo') {
      const demoAddr = '0x71C8A6992E991C2AcC5B09E962cD619554e73A9F'
      setAccount(demoAddr)
      setChainId(56)
      setBalance('1.845 BNB')
      try {
        localStorage.setItem('aureus_wallet_account', demoAddr)
        localStorage.setItem('aureus_wallet_chain', '56')
      } catch { /* ignore */ }
      setIsConnecting(false)
      setModalOpen(false)
      return true
    }

    const provider = getInjectedProvider(walletType)
    if (!provider) {
      setIsConnecting(false)
      return false
    }

    try {
      const accounts: string[] = await provider.request({ method: 'eth_requestAccounts' })
      if (!accounts || accounts.length === 0) {
        setIsConnecting(false)
        return false
      }
      const addr = accounts[0]
      setAccount(addr)

      const hexChain = await provider.request({ method: 'eth_chainId' })
      const cId = parseInt(hexChain, 16)
      setChainId(cId)

      try {
        localStorage.setItem('aureus_wallet_account', addr)
        localStorage.setItem('aureus_wallet_chain', String(cId))
      } catch { /* ignore */ }

      // If not on BSC, prompt switch
      if (cId !== 56) {
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BSC_CHAIN_ID_HEX }],
          })
          setChainId(56)
        } catch (switchError: any) {
          if (switchError?.code === 4902) {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [BSC_CHAIN_PARAMS],
            })
            setChainId(56)
          }
        }
      }

      await fetchBalance(addr, provider)
      setModalOpen(false)
      setIsConnecting(false)
      return true
    } catch {
      setIsConnecting(false)
      return false
    }
  }, [fetchBalance])

  const setCustomSession = useCallback(async (addr: string, chainIdNum: number = 56, prov?: any) => {
    setAccount(addr)
    setChainId(chainIdNum)
    if (prov) {
      setProviderInstance(prov)
    }
    try {
      localStorage.setItem('aureus_wallet_account', addr)
      localStorage.setItem('aureus_wallet_chain', String(chainIdNum))
      localStorage.setItem('aureus_wallet_type', prov ? 'walletconnect' : 'custom')
    } catch { /* ignore */ }
    await fetchBalance(addr, prov)
  }, [fetchBalance])

  const disconnect = useCallback(() => {
    if (providerInstance?.disconnect) {
      try {
        providerInstance.disconnect()
      } catch { /* ignore */ }
    }
    setProviderInstance(null)
    setAccount(null)
    setChainId(null)
    setBalance(null)
    try {
      localStorage.removeItem('aureus_wallet_account')
      localStorage.removeItem('aureus_wallet_chain')
      localStorage.removeItem('aureus_wallet_type')
    } catch { /* ignore */ }
  }, [providerInstance])

  // Auto-connect on load if previously connected
  useEffect(() => {
    if (!account) return
    if (account.startsWith('0x71C8A6992E991C2')) return // demo account preserved
    const wType = typeof window !== 'undefined' ? localStorage.getItem('aureus_wallet_type') : null
    
    if (wType === 'walletconnect') {
      import('@walletconnect/ethereum-provider').then(async ({ EthereumProvider }) => {
        try {
          const provider = await EthereumProvider.init({
            projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'c0891d12d1bca7289e089af886e1945b',
            chains: [56],
            optionalChains: [56, 1, 97],
            showQrModal: false,
            metadata: {
              name: 'Aureus Sentinel AI',
              description: 'AI-Powered BSC Sentinel & Trading Terminal',
              url: typeof window !== 'undefined' ? window.location.origin : 'https://aureus-agent.vercel.app',
              icons: ['https://bin.bnbstatic.com/static/images/common/favicon.ico'],
            },
          })
          if (provider.connected && provider.accounts?.length > 0) {
            setProviderInstance(provider)
            fetchBalance(provider.accounts[0], provider)
          } else {
            disconnect()
          }
        } catch {
          // keep cached account
        }
      }).catch(() => {})
      return
    }

    const provider = getInjectedProvider()
    if (!provider) return

    provider.request({ method: 'eth_accounts' })
      .then((accs: string[]) => {
        if (accs && accs.length > 0) {
          setAccount(accs[0])
          provider.request({ method: 'eth_chainId' }).then((c: string) => {
            setChainId(parseInt(c, 16))
          })
          fetchBalance(accs[0], provider)
        } else {
          disconnect()
        }
      })
      .catch(() => disconnect())

    const handleAccounts = (accs: string[]) => {
      if (accs && accs.length > 0) {
        setAccount(accs[0])
        fetchBalance(accs[0], provider)
      } else {
        disconnect()
      }
    }

    const handleChain = (c: string) => {
      setChainId(parseInt(c, 16))
    }

    if (provider.on) {
      provider.on('accountsChanged', handleAccounts)
      provider.on('chainChanged', handleChain)
      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccounts)
          provider.removeListener('chainChanged', handleChain)
        }
      }
    }
  }, [account, disconnect, fetchBalance])

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

export function useWeb3Wallet() {
  const ctx = useContext(Web3WalletContext)
  if (!ctx) throw new Error('useWeb3Wallet must be used within Web3WalletProvider')
  return ctx
}

/* ═══════════════ SVG ICONS FOR WALLETCONNECT & QR ═══════════════ */
function LogoWalletConnect({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5.5 8.5C9.09 4.91 14.91 4.91 18.5 8.5L19.2 9.2C19.5 9.5 19.5 10 19.2 10.3L17.5 12C17.3 12.2 17 12.2 16.8 12L15.7 10.9C13.66 8.86 10.34 8.86 8.3 10.9L7.1 12.1C6.9 12.3 6.6 12.3 6.4 12.1L4.8 10.5C4.5 10.2 4.5 9.7 4.8 9.4L5.5 8.5ZM21.7 11.7L23.2 13.2C23.5 13.5 23.5 14 23.2 14.3L17.9 19.6C17.6 19.9 17.1 19.9 16.8 19.6L13.1 15.9C13 15.8 12.8 15.8 12.7 15.9L9 19.6C8.7 19.9 8.2 19.9 7.9 19.6L0.8 12.5C0.5 12.2 0.5 11.7 0.8 11.4L2.3 9.9C2.6 9.6 3.1 9.6 3.4 9.9L7.1 13.6C7.2 13.7 7.4 13.7 7.5 13.6L11.2 9.9C11.5 9.6 12 9.6 12.3 9.9L16 13.6C16.1 13.7 16.3 13.7 16.4 13.6L20.1 9.9C20.4 9.6 20.9 9.6 21.2 9.9L21.7 10.4C22 10.7 22 11.2 21.7 11.5L21.7 11.7Z"
        fill="#3B99FC"
      />
    </svg>
  )
}

function IconQrCode({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <path d="M7 7h.01M17 7h.01M7 17h.01M17 17h.01M10 7h1M10 17h1M7 10v1M17 10v1M14 10h3" />
    </svg>
  )
}

let globalWcProvider: any = null
let globalWcProviderPromise: Promise<any> | null = null

async function getOrInitWcProvider() {
  if (globalWcProvider) return globalWcProvider
  if (!globalWcProviderPromise) {
    globalWcProviderPromise = (async () => {
      const { EthereumProvider } = await import('@walletconnect/ethereum-provider')
      const { ConnectionController } = await import('@reown/appkit-controllers')
      const projId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'c0891d12d1bca7289e089af886e1945b'

      const provider = await EthereumProvider.init({
        projectId: projId,
        chains: [56],
        optionalChains: [56, 1, 97],
        showQrModal: true,
        rpcMap: {
          56: 'https://bsc-dataseed.binance.org/',
          1: 'https://eth.llamarpc.com',
        },
        metadata: {
          name: 'Aureus Sentinel AI',
          description: 'AI-Powered BSC Sentinel & Trading Terminal',
          url: typeof window !== 'undefined' ? window.location.origin : 'https://aureus-agent.vercel.app',
          icons: ['https://bin.bnbstatic.com/static/images/common/favicon.ico'],
        },
      })

      // Pipe display_uri directly to Reown AppKit's ConnectionController
      provider.on('display_uri', (uri: string) => {
        if (uri) {
          ConnectionController.setUri(uri)
        }
      })

      globalWcProvider = provider
      return provider
    })()
  }
  return globalWcProviderPromise
}

/* ═══════════════ CONNECT WALLET MODAL ═══════════════ */
function ConnectWalletModal({ onClose }: { onClose: () => void }) {
  const { connect, isConnecting, setCustomSession } = useWeb3Wallet()
  const [errorMsg, setErrorMsg] = useState('')
  const [isLaunchingAppKit, setIsLaunchingAppKit] = useState(false)
  const anyWin = typeof window !== 'undefined' ? (window as any) : {}

  const hasInjected = typeof window !== 'undefined' && !!anyWin.ethereum
  const hasTrust = typeof window !== 'undefined' && (!!anyWin.trustwallet || !!anyWin.ethereum?.isTrust)

  const openOfficialWalletConnect = async () => {
    setIsLaunchingAppKit(true)
    setErrorMsg('')
    try {
      const { ConnectionController } = await import('@reown/appkit-controllers')
      const provider = await getOrInitWcProvider()

      // If existing pairing URI is ready on the signer, push to ConnectionController immediately
      if (provider.signer?.uri) {
        ConnectionController.setUri(provider.signer.uri)
      }

      onClose() // Close custom modal so official Reown Web3Modal opens cleanly

      await provider.connect()

      if (provider.accounts && provider.accounts.length > 0) {
        await setCustomSession(provider.accounts[0], provider.chainId || 56, provider)
      }
    } catch (e: any) {
      console.warn('WalletConnect modal flow:', e?.message)
      setIsLaunchingAppKit(false)
    }
  }

  const handleSelect = async (type: string) => {
    setErrorMsg('')
    if (type === 'walletconnect') {
      await openOfficialWalletConnect()
      return
    }

    if (type === 'demo') {
      await setCustomSession('0x71C8A6992E991C2AcC5B09E962cD619554e73A9F', 56)
      onClose()
      return
    }

    if (type === 'trust') {
      if (hasTrust) {
        const ok = await connect('trust')
        if (ok) return
      }
      // If extension not present, launch official WalletConnect / AppKit modal for Trust Wallet!
      await openOfficialWalletConnect()
      return
    }

    if (type === 'metamask') {
      if (hasInjected) {
        const ok = await connect('metamask')
        if (ok) return
      }
      // If extension not present, launch official WalletConnect / AppKit modal for MetaMask!
      await openOfficialWalletConnect()
      return
    }

    const ok = await connect(type)
    if (!ok) {
      await openOfficialWalletConnect()
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="compete-root" data-theme="obsidian" style={{ position: 'fixed', inset: 0, zIndex: 999999 }}>
      <div
        className="cp-modal-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          background: 'rgba(5, 7, 13, 0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <div
          className="cp-modal card"
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: 440,
            width: '92%',
            background: 'var(--c-panel, #181a20)',
            border: '1px solid var(--c-line-2, rgba(240, 185, 11, 0.3))',
            boxShadow: '0 24px 60px rgba(0,0,0,0.85)',
            borderRadius: 18,
            padding: 24,
            maxHeight: '90vh',
            overflowY: 'auto',
            color: 'var(--c-text, #eaecef)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(240,185,11,0.12)', border: '1px solid var(--c-line-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-primary)' }}>
                  <IconWallet size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--c-text)' }}>Connect Wallet</h3>
                  <div style={{ fontSize: 11.5, color: 'var(--c-muted)', marginTop: 2 }}>BNB Smart Chain (Chain ID 56)</div>
                </div>
              </div>
              <button className="cp-iconbtn" onClick={onClose} aria-label="Close modal">
                <IconClose size={18} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: 'var(--c-text-2)', lineHeight: 1.5, margin: '0 0 18px' }}>
              Connect your non-custodial Web3 wallet. Powered by official Reown Web3Modal & WalletConnect v2 for seamless Trust Wallet & MetaMask scanning.
            </p>

            {errorMsg && (
              <div style={{ padding: '10px 12px', background: 'rgba(248,73,96,0.12)', border: '1px solid var(--red)', borderRadius: 8, fontSize: 12, color: 'var(--red)', marginBottom: 14 }}>
                {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* 1. Official WalletConnect Modal */}
              <button
                className="cp-wallet-opt"
                onClick={() => handleSelect('walletconnect')}
                disabled={isConnecting || isLaunchingAppKit}
                style={{ background: 'rgba(59, 153, 252, 0.07)', borderColor: 'rgba(59, 153, 252, 0.35)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="cp-wallet-logo" style={{ color: '#3B99FC', background: 'rgba(59, 153, 252, 0.15)' }}>
                    <LogoWalletConnect size={20} />
                  </span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--c-text)' }}>
                      {isLaunchingAppKit ? 'Opening Web3Modal...' : 'WalletConnect (Official AppKit)'}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--c-muted)' }}>Scan QR with Trust Wallet, MetaMask, Rainbow</div>
                  </div>
                </div>
                <span className="cp-tag-mini" style={{ background: 'rgba(59,153,252,0.15)', color: '#3B99FC', fontWeight: 800, padding: '3px 8px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <IconQrCode size={12} />
                  <span>OFFICIAL QR</span>
                </span>
              </button>

              {/* 2. Trust Wallet */}
              <button
                className="cp-wallet-opt"
                onClick={() => handleSelect('trust')}
                disabled={isConnecting || isLaunchingAppKit}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="cp-wallet-logo" style={{ color: '#FCD535', background: 'rgba(252,213,53,0.1)' }}>
                    <LogoTrust size={20} />
                  </span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--c-text)' }}>Trust Wallet</div>
                    <div style={{ fontSize: 11.5, color: 'var(--c-muted)' }}>Official BNB Ecosystem · Browser & Mobile App</div>
                  </div>
                </div>
                <span className="cp-tag-mini" style={{ background: 'rgba(240,185,11,0.14)', color: 'var(--c-primary)', fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>
                  {hasTrust ? 'EXTENSION READY' : 'RECOMMENDED'}
                </span>
              </button>

              {/* 3. MetaMask */}
              <button
                className="cp-wallet-opt"
                onClick={() => handleSelect('metamask')}
                disabled={isConnecting || isLaunchingAppKit}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="cp-wallet-logo" style={{ color: '#F6851B', background: 'rgba(246,133,27,0.1)' }}>
                    <IconWallet size={20} />
                  </span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--c-text)' }}>MetaMask</div>
                    <div style={{ fontSize: 11.5, color: 'var(--c-muted)' }}>Browser extension & mobile app</div>
                  </div>
                </div>
                {hasInjected && (
                  <span className="cp-tag-mini" style={{ background: 'rgba(2,192,118,0.12)', color: 'var(--green)', fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>
                    EXTENSION READY
                  </span>
                )}
              </button>

              {/* 4. Binance Web3 Wallet */}
              <button
                className="cp-wallet-opt"
                onClick={() => handleSelect('binance')}
                disabled={isConnecting || isLaunchingAppKit}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="cp-wallet-logo" style={{ color: 'var(--c-primary)', background: 'rgba(240,185,11,0.1)' }}>
                    <LogoBnb size={20} />
                  </span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--c-text)' }}>Binance Web3 Wallet</div>
                    <div style={{ fontSize: 11.5, color: 'var(--c-muted)' }}>Direct MPC Wallet from Binance app</div>
                  </div>
                </div>
              </button>

              {/* 5. Instant Demo Mode */}
              <button
                className="cp-wallet-opt"
                onClick={() => handleSelect('demo')}
                disabled={isConnecting || isLaunchingAppKit}
                style={{ border: '1px dashed var(--c-primary)', background: 'rgba(240,185,11,0.04)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="cp-wallet-logo" style={{ color: 'var(--c-primary)', background: 'rgba(240,185,11,0.15)' }}>
                    ⚡
                  </span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--c-primary)' }}>Simulated Demo Wallet</div>
                    <div style={{ fontSize: 11.5, color: 'var(--c-muted)' }}>Instant 1-click test with 1.845 BNB balance</div>
                  </div>
                </div>
                <span className="cp-tag-mini" style={{ background: 'rgba(240,185,11,0.2)', color: 'var(--c-primary)', fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>
                  INSTANT
                </span>
              </button>
            </div>

            {/* Direct Mobile Launchers */}
            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <a
                href={`https://link.trustwallet.com/open_url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : 'https://aureus-agent.vercel.app')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'center', fontSize: 11.5, gap: 5, textDecoration: 'none', color: 'inherit' }}
              >
                <LogoTrust size={15} />
                <span>Buka di Trust (HP)</span>
              </a>
              <a
                href={`https://metamask.app.link/dapp/${typeof window !== 'undefined' ? window.location.host + window.location.pathname : 'aureus-agent.vercel.app'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'center', fontSize: 11.5, gap: 5, textDecoration: 'none', color: 'inherit' }}
              >
                <IconWallet size={15} />
                <span>Buka di MetaMask (HP)</span>
              </a>
            </div>

            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--c-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: 'var(--c-muted)' }}>
              <span>Need a wallet?</span>
              <a
                href="https://trustwallet.com/download"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--c-primary)', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <span>Get Trust Wallet</span>
                <IconExternal size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

/* ═══════════════ NAVBAR CONNECTED COMPONENT ═══════════════ */
export function WalletNavButton() {
  const { account, balance, isConnecting, setModalOpen, disconnect, isBsc, switchNetwork } = useWeb3Wallet()
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!popoverOpen) return
    const onDocClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPopoverOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [popoverOpen])

  const copyAddr = () => {
    if (!account) return
    navigator.clipboard.writeText(account)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!account) {
    return (
      <button
        className="btn btn-primary btn-sm cp-connect-btn"
        onClick={() => setModalOpen(true)}
        disabled={isConnecting}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          flexShrink: 0,
          fontWeight: 800,
          boxShadow: '0 0 16px rgba(240, 185, 11, 0.28)',
          cursor: 'pointer',
        }}
      >
        <IconWallet size={15} />
        <span>{isConnecting ? 'Connecting…' : 'Connect Wallet'}</span>
      </button>
    )
  }

  return (
    <div ref={popoverRef} style={{ position: 'relative' }}>
      <button
        className="cp-account-btn"
        onClick={() => setPopoverOpen(!popoverOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--c-panel)',
          border: '1px solid var(--c-line-2)',
          borderRadius: 8,
          padding: '6px 10px',
          cursor: 'pointer',
          color: 'var(--c-text)',
          fontSize: 12.5,
          fontWeight: 700,
        }}
      >
        <span className="cp-net-dot" style={{ background: isBsc ? 'var(--green)' : 'var(--gold)' }} />
        <span className="mono">{shortAddr(account)}</span>
        {balance && (
          <span className="mono cp-tag-mini" style={{ background: 'rgba(240,185,11,0.12)', color: 'var(--c-primary)', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>
            {balance}
          </span>
        )}
      </button>

      {popoverOpen && (
        <div
          className="cp-pop"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            minWidth: 260,
            padding: 16,
            zIndex: 1000,
            background: 'var(--c-panel)',
            border: '1px solid var(--c-line-2)',
            borderRadius: 12,
            boxShadow: '0 12px 36px var(--c-shadow-2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: 'var(--c-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Connected Account</span>
            <span className="cp-tag-mini" style={{ color: isBsc ? 'var(--green)' : 'var(--gold)', background: isBsc ? 'rgba(2,192,118,0.12)' : 'rgba(240,185,11,0.12)', padding: '2px 6px', borderRadius: 4, fontSize: 10.5, fontWeight: 800 }}>
              {isBsc ? 'BSC MAINNET' : 'SWITCH TO BSC'}
            </span>
          </div>

          <div className="mono" style={{ fontSize: 13, wordBreak: 'break-all', padding: 8, background: 'var(--c-bg)', borderRadius: 8, border: '1px solid var(--c-line)', marginBottom: 12, color: 'var(--c-text)' }}>
            {account}
          </div>

          {!isBsc && (
            <button
              className="btn btn-primary btn-sm"
              onClick={switchNetwork}
              style={{ width: '100%', marginBottom: 10, justifyContent: 'center' }}
            >
              Switch to BNB Smart Chain
            </button>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
            <button
              className="cp-pop-row"
              onClick={copyAddr}
              style={{ justifyContent: 'center', padding: '6px 8px', fontSize: 12, minHeight: 34 }}
            >
              {copied ? <IconCheck size={14} style={{ color: 'var(--green)' }} /> : null}
              <span>{copied ? 'Copied!' : 'Copy Address'}</span>
            </button>
            <a
              href={`https://bscscan.com/address/${account}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cp-pop-row"
              style={{ justifyContent: 'center', padding: '6px 8px', fontSize: 12, textDecoration: 'none', color: 'inherit', minHeight: 34 }}
            >
              <span>BscScan</span>
              <IconExternal size={12} />
            </a>
          </div>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { disconnect(); setPopoverOpen(false) }}
            style={{ width: '100%', justifyContent: 'center', color: 'var(--red)', borderColor: 'rgba(248,73,96,0.3)' }}
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  )
}
