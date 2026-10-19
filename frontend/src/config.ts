/* Static facts for Aureus Agent. Contract / wallet addresses are
   the project's verified BSC deployments: the result ledger, the ERC-8004 identity,
   the commit reveal registry, the RiskGovernor and its keeper all on BSC mainnet.
   Edit GITHUB_URL / DOCS links in one place. */

// Open-source repository. Update to the exact public repo before submission.
export const GITHUB_URL = 'https://github.com/codesbykhairannoor/aureus-agent-'
export const CONTACT_EMAIL = 'dev@khairan.tech'
export const GRANT_LINKS = {
  bnbGrants: 'https://www.bnbchain.org/en/grants',
  bnbPrograms: 'https://www.bnbchain.org/en/programs',
  doraHacks: 'https://dorahacks.io/org/bnbchain',
}
export const TERMINAL_URL = '/terminal'
// The live ERC-8004 registration-v1 document the agent's identity points its
// agentURI at. Serving it from the same origin keeps the minted identity and the
// served card from drifting, so it doubles as the agent's public registration.
export const AGENT_CARD_URL = '/agent-card'
export const COMPETITION = 'Aureus Agent · Autonomous Trading Infrastructure'
// Per-user Telegram bot subscription for the agent's trade feed.
export const TELEGRAM_FEED_URL = 'https://t.me/aureusagent_bot?start=agentfeed'

/* Verified BSC deployments + identities, all live on BSC mainnet (chain 56):
   the result ledger, the ERC-8004 identity, the commit reveal registry, the
   RiskGovernor and its equity keeper. This matches the agent's chain writer,
   which is pinned to chain 56 in production, so the judged record is anchored to
   mainnet and stays un backfillable. */
export const ADDR = {
  registry:  '0xcA9499a2d20cFAa98f9Bc3b2F1386A70f51c2FEB', // CommitRevealPredictionRegistry (mainnet)
  governor:  '0xFACBc0a9b5a7dd34BfD0B91e1102dF4E72b9e43f', // RiskGovernor, maxDrawdownBps=1400 (mainnet)
  agent:     '0xD5df700Ed5355f0c778159592a072B8773faE1CC', // agent wallet (holds the mainnet identity)
  keeper:    '0x064Af3880d562720963bba400B51F95d45AF91d3', // oracle/keeper, feeds the governor (mainnet)
  ledger:    '0x77511fEFF4c0CA8bD5aeA8d64dC6a8dAe88C0744', // result ledger (mainnet)
  erc8004:   '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432', // ERC-8004 Identity Registry (mainnet)
}
// The internal commit id: the keccak identity seed the commit reveal registry
// binds predictions under. This is NOT the ERC-8004 token id (see below).
export const AGENT_ID = '0x7069f5fdcd64bcfa682ebd4d6654229c39b40753dc81f609fb6e9c34c4a246d4'
// The minted ERC-8004 identity token id, an integer, live on chain 56 and
// returned by /agent/identity as registry.agent_id. Prefer reading it live.
export const ERC8004_AGENT_ID = '131181'

/* Normalize a commit/reveal tx field to a bare hash. The backend now serves
   commit_tx / reveal_tx as full BscScan URLs (https://bscscan.com/tx/0x..),
   so strip any explorer prefix before building a link or shortening it. */
export const txHashOf = (v?: string): string =>
  !v ? '' : (v.includes('/tx/') ? v.split('/tx/').pop()! : v)

/* Every contract above is on BSC mainnet (chain 56), so the explorer link and
   the chain label always resolve to mainnet. */
export const chainOf = (_addr: string): 56 | 97 => 56
export const chainLabel = (addr: string): string =>
  chainOf(addr) === 97 ? 'BSC testnet' : 'BSC mainnet'
export const scan = (addr: string) =>
  `https://${chainOf(addr) === 97 ? 'testnet.bscscan.com' : 'bscscan.com'}/address/${addr}`

/* Protocol & technology stack with unified Aureus & BNB palette. */
export const SPONSORS: { name: string; tone: string; img?: string; url: string }[] = [
  { name: 'BNB Chain', tone: '#F0B90B', url: 'https://www.bnbchain.org' },
  { name: 'Trust Wallet', tone: '#FCD535', url: 'https://trustwallet.com' },
  { name: 'CoinMarketCap', tone: '#F0B90B', url: 'https://coinmarketcap.com' },
  { name: 'PancakeSwap', tone: '#02C076', url: 'https://pancakeswap.finance' },
  { name: 'ERC-8004', tone: '#FCD535', url: 'https://eips.ethereum.org/EIPS/eip-8004' },
  { name: 'x402', tone: '#02C076', url: 'https://www.x402.org' },
  { name: 'Binance Data', tone: '#F0B90B', url: 'https://www.binance.com' },
  { name: 'BscScan', tone: '#FCD535', url: 'https://bscscan.com' },
]

export const TRACKS = [
  {
    id: 'agent', path: '/terminal', tone: '#F0B90B',
    title: 'Autonomous Trading Agent',
    blurb: 'A self-driving trading engine that fuses multiple quantitative signals into a single conviction score, sizes with an unbreakable drawdown budget, and proves each trade before it executes.',
  },
  {
    id: 'skills', path: '/skills', tone: '#FCD535',
    title: 'Quantitative Strategy Engine',
    blurb: 'Empirical Kelly allocation, dynamic TP/SL optimization, narrative momentum, and regime adaptation powered by 195k verified outcomes and real-time market telemetry.',
  },
  {
    id: 'protocol', path: '/protocol', tone: '#F0B90B',
    title: 'On-Chain Verifiable Protocol',
    blurb: 'Cryptographic commit-reveal prediction registry, smart contract drawdown circuit breaker (RiskGovernor), and machine-payable x402 telemetry feed on BSC Mainnet.',
  },
]

// Verifiable dataset commitment: the private production outcome base is sealed by
// its Merkle root on BSC mainnet (scripts/seal_dataset.py over signal_performance
// in id order). A juror reproduces the algorithm on the public sample, and under
// NDA/escrow reproduces the exact sealed root on the private DB byte for byte.
export const DATASET_SEAL = {
  txHash: '0xc3501e1e40954a8b4ca8da36a1018c7d32016e5aa823e63cdc02a5794a9917bc',
  merkleRoot: '0x42ce0ec21ca92a98f5b3a696a417255ee1adb739f240b3649abb6b736de183d5',
  sampleRoot: '0x36eac52e8e21e2d25eb600b186f22cad865c3e551a935904b95c87ffb9bb309b',
  rows: 198248, resolved: 195868, symbols: 42,
}
