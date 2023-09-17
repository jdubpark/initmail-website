import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
//   braveWallet,
//   coinbaseWallet,
//   ledgerWallet,
  metaMaskWallet,
//   rainbowWallet,
//   walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets'
import { configureChains } from 'wagmi'
import * as wagmiChains from 'wagmi/chains'
// import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { Web3AuthConnectorInstance } from '~~/components/wagmi'
import scaffoldConfig from '~~/scaffold.config'
// import { burnerWalletConfig } from '~~/services/web3/wagmi-burner/burnerWalletConfig'
import { getTargetNetwork } from '~~/utils/scaffold-eth'

const configuredNetwork = getTargetNetwork()
// const { onlyLocalBurnerWallet } = scaffoldConfig

// We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
// const enabledChains =
//   configuredNetwork.id === 1
//     ? [configuredNetwork]
//     : [
//         configuredNetwork,
//         wagmiChains.hardhat,
//         wagmiChains.arbitrumGoerli,
//         wagmiChains.optimismGoerli,
//         wagmiChains.arbitrum,
//         wagmiChains.optimism
//       ]

/**
 * Chains for the app
 */
export const appChains = configureChains(
  [
    wagmiChains.arbitrum,
    // wagmiChains.hardhat,
    // wagmiChains.arbitrumGoerli,
    // wagmiChains.optimismGoerli,
    // wagmiChains.arbitrum,
    wagmiChains.optimism
  ],
  [publicProvider()],
  {
    // We might not need this checkout https://github.com/scaffold-eth/scaffold-eth-2/pull/45#discussion_r1024496359, will test and remove this before merging
    stallTimeout: 3_000,
    // Sets pollingInterval if using chain's other than local hardhat chain
    ...(configuredNetwork.id !== wagmiChains.hardhat.id
      ? {
          pollingInterval: scaffoldConfig.pollingInterval
        }
      : {})
  }
)

const walletsOptions = { chains: appChains.chains, projectId: scaffoldConfig.walletConnectProjectId }
// console.log(appChains, Web3AuthConnectorInstance)
const wallets = [
  // metaMaskWallet({ ...walletsOptions, shimDisconnect: true }),
  // walletConnectWallet(walletsOptions),
  // ledgerWallet(walletsOptions),
  // braveWallet(walletsOptions),
  // coinbaseWallet({ ...walletsOptions, appName: "scaffold-eth-2" }),
  // rainbowWallet(walletsOptions),
  // ...(configuredNetwork.id === chains.hardhat.id || !onlyLocalBurnerWallet
  //   ? [burnerWalletConfig({ chains: [appChains.chains[0]] })]
  //   : []),
  // appChains && appChains.chains ? Web3AuthConnectorInstance() as any : {}
  // Web3AuthConnectorInstance(appChains.chains) as any
]

/**
 * wagmi connectors for the wagmi context
 */
export const wagmiConnectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      // Web3AuthConnectorInstance(appChains.chains) as any,
    ],
  }
])
