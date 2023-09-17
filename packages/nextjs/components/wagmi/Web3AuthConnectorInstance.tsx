import { ModalConfig, Web3Auth, type Web3AuthOptions } from '@web3auth/modal'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { OpenloginAdapter, OPENLOGIN_NETWORK } from '@web3auth/openlogin-adapter'
import { CHAIN_NAMESPACES, WALLET_ADAPTERS, WALLET_ADAPTER_TYPE } from '@web3auth/base'
import { Chain } from 'wagmi'

import { Web3AuthConnector } from '~~/components/wagmi'
import { appChains } from '~~/services/web3/wagmiConnectors'

export const iconUrl = 'https://web3auth.io/docs/contents/logo-ethereum.png'

// export const chainConfig = {
//   chainNamespace: CHAIN_NAMESPACES.EIP155,
//   chainId: '0x' + chains[0].id.toString(16),
//   rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
//   displayName: chains[0].name,
//   tickerName: chains[0].nativeCurrency?.name,
//   ticker: chains[0].nativeCurrency?.symbol,
//   // blockExplorer: chains[0].blockExplorers?.default.url[0] as string
//   blockExplorer: 'https://etherscan.io/' // todo: fix
// }

// export const chainConfig = process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? {
//   chainNamespace: CHAIN_NAMESPACES.EIP155,
//   chainId: '0x66EEB',
//   rpcTarget: 'https://rpc.ankr.com/arbitrum',
//   displayName: 'Arbitrum One',
//   tickerName: 'Arbitrum',
//   ticker: 'ARB',
//   // blockExplorer: chains[0].blockExplorers?.default.url[0] as string
//   blockExplorer: '' // todo: fix
// } : {
//   chainNamespace: CHAIN_NAMESPACES.EIP155,
//   chainId: '0x7A69',
//   rpcTarget: 'http://127.0.0.1:8545',
//   displayName: 'Hardhat',
//   tickerName: 'Hardhat',
//   ticker: 'HH',
//   // blockExplorer: chains[0].blockExplorers?.default.url[0] as string
//   blockExplorer: '' // todo: fix
// }
export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0xa4b1', // '0x66eeb',
  rpcTarget: 'https://rpc.ankr.com/arbitrum',
  displayName: 'Arbitrum One',
  tickerName: 'Arbitrum',
  ticker: 'ARB',
  // blockExplorer: chains[0].blockExplorers?.default.url[0] as string
  blockExplorer: '' // todo: fix
}

export const web3AuthConfig: Web3AuthOptions = {
  clientId: (process.env.NEXT_PUBLIC_NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID_MAINNET
    : process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID_TESTNET) as string,
  web3AuthNetwork:
    process.env.NEXT_PUBLIC_NODE_ENV === 'production'
      ? OPENLOGIN_NETWORK.SAPPHIRE_MAINNET
      : OPENLOGIN_NETWORK.SAPPHIRE_DEVNET,
  chainConfig,
  // uiConfig refers to the whitelabeling options, which is available only on Growth Plan and above
  // Please remove this parameter if you're on the Base Plan
  uiConfig: {
    appName: 'InitMail',
    // appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
    theme: {
      primary: 'red'
    },
    mode: 'auto', // 'light' | 'dark' | 'auto'
    logoLight: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
    logoDark: 'https://web3auth.io/images/w3a-D-Favicon-1.svg',
    defaultLanguage: 'en', // en, de, ja, ko, zh, es, fr, pt, nl
    loginGridCol: 3,
    primaryButton: 'socialLogin', // "externalLogin" | "socialLogin" | "emailLogin"
    modalZIndex: '2147483647' // max z-index value
  },
  enableLogging: false
}

export const initModalConfig: {
  modalConfig: Record<WALLET_ADAPTER_TYPE, ModalConfig>
} = {
  modalConfig: {
    [WALLET_ADAPTERS.OPENLOGIN]: {
      label: 'openlogin',
      loginMethods: {
        google: {
          name: 'google login'
        },
        facebook: { name: 'facebook', showOnModal: false },
        twitter: { name: 'twitter', showOnModal: false },
        reddit: { name: 'reddit', showOnModal: false },
        discord: { name: 'discord', showOnModal: false },
        twitch: { name: 'twitch', showOnModal: false },
        apple: { name: 'apple', showOnModal: false },
        line: { name: 'line', showOnModal: false },
        github: { name: 'github', showOnModal: false },
        kakao: { name: 'kakao', showOnModal: false },
        linkedin: { name: 'linkedin', showOnModal: false },
        weibo: { name: 'weibo', showOnModal: false },
        wechat: { name: 'wechat', showOnModal: false },
        sms_passwordless: { name: 'sms', showOnModal: false }
        // email_passwordless: { name: 'email', showOnModal: false },
      },
      showOnModal: true
    },
    //
    // only allow social login, disable all external wallet
    //
    [WALLET_ADAPTERS.TORUS_EVM]: {
      label: 'torus',
      showOnModal: false,
      showOnMobile: false,
      showOnDesktop: false
    },
    [WALLET_ADAPTERS.METAMASK]: {
      label: 'metamask',
      showOnModal: false,
      showOnMobile: false,
      showOnDesktop: false
    },
    [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
      label: 'walletconnect',
      showOnModal: false,
      showOnMobile: false,
      showOnDesktop: false
    }
    // [WALLET_ADAPTERS.WALLET_CONNECT_V1]: {
    //   label: 'walletconnect',
    //   showOnModal: false,
    //   showOnMobile: false,
    //   showOnDesktop: false,
    // },
  }
}

export const openloginAdapterInstance = () => {
  const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } })
  return new OpenloginAdapter({
    privateKeyProvider,
    adapterSettings: {
      uxMode: 'redirect'
    }
  })
}

export function getWeb3AuthConnector() {
  // Create Web3Auth Instance
  const web3AuthInstance = new Web3Auth(web3AuthConfig)

  // Add openlogin adapter for customisations
  web3AuthInstance.configureAdapter(openloginAdapterInstance())
  console.log('web3AuthInstance', web3AuthInstance)

  const connector = new Web3AuthConnector({
    chains: appChains.chains,
    options: {
      web3AuthInstance,
      modalConfig: initModalConfig.modalConfig
    }
  })
  return connector
}

export function Web3AuthConnectorInstance(chains: Chain[]) {
  // Create Web3Auth Instance
  const web3AuthInstance = new Web3Auth(web3AuthConfig)

  // Add openlogin adapter for customisations
  web3AuthInstance.configureAdapter(openloginAdapterInstance())

  return {
    id: 'web3auth',
    name: 'InitMail',
    iconUrl,
    iconBackground: '#fff',
    createConnector: () => {
      const connector = new Web3AuthConnector({
        chains: chains,
        options: {
          web3AuthInstance,
          modalConfig: initModalConfig.modalConfig
        }
      })
      return {
        connector
      }
    }
  }
}
