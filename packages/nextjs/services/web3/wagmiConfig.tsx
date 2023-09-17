import { configureChains, createConfig } from 'wagmi'
import * as wagmiChains from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { getWeb3AuthConnector } from '~~/components/wagmi'

// import { Web3AuthConnectorInstance } from '~~/components/wagmi'
import { appChains, wagmiConnectors } from '~~/services/web3/wagmiConnectors'

// const { chains, publicClient, webSocketPublicClient } = configureChains(
//   [
//     wagmiChains.localhost,
//     wagmiChains.arbitrumGoerli,
//     wagmiChains.optimismGoerli,
//     wagmiChains.arbitrum,
//     wagmiChains.optimism
//   ],
//   [publicProvider()]
// )

// const { publicClient, webSocketPublicClient } = configureChains([wagmiChains.arbitrum], [publicProvider()])

// const config = createConfig({
//   publicClient,
//   webSocketPublicClient
// })
// console.log('config', config)

export const wagmiConfig = createConfig({
  // connectors: wagmiConnectors,
  connectors: [getWeb3AuthConnector() as any],
  // autoConnect: false,
  autoConnect: true, // auto connects once the web3auth is logged in
  publicClient: appChains.publicClient
})
