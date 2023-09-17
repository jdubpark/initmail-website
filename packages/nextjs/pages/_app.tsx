import { RainbowKitProvider, connectorsForWallets, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { useDarkMode } from 'usehooks-ts'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import * as wagmiChains from 'wagmi/chains'

import '@rainbow-me/rainbowkit/styles.css'

import { Web3AuthProvider } from '~~/components/providers'
import { Footer } from '~~/components/Footer'
import { Header } from '~~/components/Header'
import { BlockieAvatar } from '~~/components/scaffold-eth'
import { Web3AuthGatedLayout } from '~~/components/Web3AuthGatedLayout'
import { useNativeCurrencyPrice } from '~~/hooks/scaffold-eth'
import { useGlobalState } from '~~/services/store/store'
import { appChains, wagmiConnectors } from '~~/services/web3/wagmiConnectors'

import '~~/styles/globals.css'
import { Web3AuthConnector, getWeb3AuthConnector } from '~~/components/wagmi'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import scaffoldConfig from '~~/scaffold.config'
import { InjectedConnector } from '@wagmi/core/connectors/injected'
// import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { publicProvider } from 'wagmi/providers/public'
import { wagmiConfig } from '~~/services/web3/wagmiConfig'

const queryClient = new QueryClient()

// const walletsOptions = { chains: appChains.chains, projectId: scaffoldConfig.walletConnectProjectId }
// const { chains, publicClient, webSocketPublicClient } = configureChains(
//   [wagmiChains.arbitrum, wagmiChains.optimism],
//   [publicProvider()]
// )
// const wagmiConfig = createConfig({
//   // connectors: wagmiConnectors,
//   // connectors: [Web3AuthConnectorInstance(appChains.chains) as any],
//   // autoConnect: false,
//   // autoConnect: true, // auto connects once the web3auth is logged in
//   // publicClient: appChains.publicClient,
//   publicClient,
//   connectors: [
//     getWeb3AuthConnector() as any,
//     // new MetaMaskConnector({ ...walletsOptions })
//     // new InjectedConnector({ chains: appChains.chains }) as any
//   ]
// })

// import { configureChains } from 'wagmi'
// import * as wagmiChains from 'wagmi/chains'
// import { publicProvider } from 'wagmi/providers/public'

// const { chains, publicClient, webSocketPublicClient } = configureChains(
//   [wagmiChains.arbitrum, wagmiChains.optimism],
//   [publicProvider()]
// )

// const wagmiConfigTest = createConfig({
//   publicClient,
//   webSocketPublicClient,
//   autoConnect: true,
//   connectors: wagmiConnectors
// })

console.log('config', wagmiConfig)

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
  // const price = useNativeCurrencyPrice()
  // const setNativeCurrencyPrice = useGlobalState((state) => state.setNativeCurrencyPrice)
  // This variable is required for initial client side rendering of correct theme for RainbowKit
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const { isDarkMode } = useDarkMode()

  // useEffect(() => {
  //   if (price > 0) {
  //     setNativeCurrencyPrice(price)
  //   }
  // }, [setNativeCurrencyPrice, price])

  useEffect(() => {
    setIsDarkTheme(isDarkMode)
  }, [isDarkMode])

  return (
    <QueryClientProvider client={queryClient}>
      <Web3AuthProvider>
        <WagmiConfig config={wagmiConfig}>
          <NextNProgress />
          <RainbowKitProvider
            chains={appChains.chains}
            avatar={BlockieAvatar}
            theme={isDarkTheme ? darkTheme() : lightTheme()}
          >
            <Web3AuthGatedLayout>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="relative flex flex-col flex-1">
                  <Component {...pageProps} />
                </main>
                <Footer />
              </div>
              <Toaster />
            </Web3AuthGatedLayout>
          </RainbowKitProvider>
        </WagmiConfig>
      </Web3AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default ScaffoldEthApp
