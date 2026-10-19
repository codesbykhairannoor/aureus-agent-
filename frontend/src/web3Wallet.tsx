import React, { createContext, useContext, useMemo, type ReactNode } from 'react'
import { http, createConfig, WagmiProvider, useAccount, useDisconnect, useBalance, useChainId, useSwitchChain } from 'wagmi'
import { bsc } from 'viem/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig, useModal } from 'connectkit'

const queryClient = new QueryClient()

const DEFAULT_WC_PROJECT_ID = 'c0891d12d1bca7289e089af886e1945b'
const wcProjectId =
  (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined) || DEFAULT_WC_PROJECT_ID

export const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: 'Aureus Protocol',
    appDescription: 'Autonomous AI Risk & Trading Agent',
    appUrl: typeof window !== 'undefined' ? window.location.origin : 'https://aureus.trade',
    appIcon: 'https://binance.com/favicon.ico',
    walletConnectProjectId: wcProjectId,
    chains: [bsc],
    transports: {
      [bsc.id]: http(import.meta.env.VITE_BSC_RPC_URL || 'https://bsc-dataseed.binance.org/'),
    },
  })
)

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

function Web3WalletBridge({ children }: { children: ReactNode }) {
  const { address, isConnecting } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChainAsync } = useSwitchChain()
  const { open, setOpen } = useModal()
  const { data: balanceData } = useBalance({ address, chainId: bsc.id })

  const [demoAccount, setDemoAccount] = React.useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('aureus_demo_account')
  })

  const effectiveAccount = address || demoAccount
  const isBsc = chainId === bsc.id || !!demoAccount

  const balance = useMemo(() => {
    if (demoAccount) return '12.4500 BNB'
    if (balanceData) return `${Number(balanceData.formatted).toFixed(4)} ${balanceData.symbol}`
    return null
  }, [balanceData, demoAccount])

  const handleDisconnect = React.useCallback(() => {
    if (demoAccount) {
      setDemoAccount(null)
      localStorage.removeItem('aureus_demo_account')
    }
    disconnect()
  }, [demoAccount, disconnect])

  const handleConnect = React.useCallback(async (walletType?: string): Promise<boolean> => {
    if (walletType === 'demo') {
      const demo = '0x71C8364665BA10b89230571d7945d8b76251b695'
      setDemoAccount(demo)
      localStorage.setItem('aureus_demo_account', demo)
      return true
    }
    setOpen(true)
    return true
  }, [setOpen])

  const handleSwitchNetwork = React.useCallback(async () => {
    try {
      await switchChainAsync({ chainId: bsc.id })
    } catch (e) {
      console.warn('Switch chain error:', e)
    }
  }, [switchChainAsync])

  const setCustomSession = React.useCallback(async (addr: string) => {
    setDemoAccount(addr)
    localStorage.setItem('aureus_demo_account', addr)
  }, [])

  const value = useMemo<Web3WalletContextType>(() => ({
    account: effectiveAccount || null,
    chainId: effectiveAccount ? (chainId || 56) : null,
    balance,
    isConnecting,
    modalOpen: open,
    setModalOpen: setOpen,
    connect: handleConnect,
    disconnect: handleDisconnect,
    isBsc,
    switchNetwork: handleSwitchNetwork,
    setCustomSession,
  }), [effectiveAccount, chainId, balance, isConnecting, open, setOpen, handleConnect, handleDisconnect, isBsc, handleSwitchNetwork, setCustomSession])

  return (
    <Web3WalletContext.Provider value={value}>
      {children}
    </Web3WalletContext.Provider>
  )
}

export function Web3WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="midnight"
          customTheme={{
            '--ck-font-family': 'inherit',
            '--ck-border-radius': '16px',
            '--ck-primary-button-background': '#F0B90B',
            '--ck-primary-button-hover-background': '#d9a708',
            '--ck-primary-button-color': '#000000',
          }}
        >
          <Web3WalletBridge>
            {children}
          </Web3WalletBridge>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export function useWeb3Wallet(): Web3WalletContextType {
  const ctx = useContext(Web3WalletContext)
  if (!ctx) {
    throw new Error('useWeb3Wallet must be used within a Web3WalletProvider')
  }
  return ctx
}

export function WalletNavButton() {
  return <ConnectKitButton />
}
