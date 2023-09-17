/* eslint-disable import/no-extraneous-dependencies */
import { Address, Chain, Connector, ConnectorData, Storage, WalletClient } from '@wagmi/core'
import {
  ADAPTER_STATUS,
  CHAIN_NAMESPACES,
  type IWeb3Auth,
  log,
  type SafeEventEmitterProvider,
  type WALLET_ADAPTER_TYPE,
  WALLET_ADAPTERS
} from '@web3auth/base'
import type { IWeb3AuthModal, ModalConfig } from '@web3auth/modal'
import type { OpenloginLoginParams } from '@web3auth/openlogin-adapter'
import { createWalletClient, custom, getAddress, SwitchChainError, UserRejectedRequestError } from 'viem'

export interface Options {
  web3AuthInstance: IWeb3Auth | IWeb3AuthModal
  loginParams?: OpenloginLoginParams
  modalConfig?: Record<WALLET_ADAPTER_TYPE, ModalConfig>
}

const IS_SERVER = typeof window === 'undefined'

function isIWeb3AuthModal(obj: IWeb3Auth | IWeb3AuthModal): obj is IWeb3AuthModal {
  return typeof (obj as IWeb3AuthModal).initModal !== 'undefined'
}

function normalizeChainId(chainId: string | number | bigint) {
  if (typeof chainId === 'string') return Number.parseInt(chainId, chainId.trim().substring(0, 2) === '0x' ? 16 : 10)
  if (typeof chainId === 'bigint') return Number(chainId)
  return chainId
}

export class Web3AuthConnector extends Connector<SafeEventEmitterProvider, Options> {
  ready = !IS_SERVER

  readonly id = 'web3auth'

  readonly name = 'Web3Auth'

  protected provider?: SafeEventEmitterProvider

  private loginParams: OpenloginLoginParams | null

  private modalConfig: Record<WALLET_ADAPTER_TYPE, ModalConfig> | null

  private web3AuthInstance: IWeb3Auth | IWeb3AuthModal

  constructor({ chains, options }: { chains?: Chain[]; options: Options }) {
    super({ chains, options })
    this.web3AuthInstance = options.web3AuthInstance
    this.loginParams = options.loginParams || null
    this.modalConfig = options.modalConfig || null
  }

  async connect({ chainId }: { chainId?: number } = {}): Promise<Required<ConnectorData>> {
    try {
      this.emit('message', {
        type: 'connecting'
      })

      await this.getProvider()

      if (this.provider) this.provider.on('accountsChanged', this.onAccountsChanged)
      if (this.provider) this.provider.on('chainChanged', this.onChainChanged)

      if (!this.web3AuthInstance.connected) {
        if (isIWeb3AuthModal(this.web3AuthInstance)) {
          await this.web3AuthInstance.connect()
        } else if (this.loginParams) {
          await this.web3AuthInstance.connectTo(WALLET_ADAPTERS.OPENLOGIN, this.loginParams)
        } else {
          log.error('please provide valid loginParams when using @web3auth/no-modal')
          throw new UserRejectedRequestError(
            'please provide valid loginParams when using @web3auth/no-modal' as unknown as Error
          )
        }
      }

      const [account, connectedChainId] = await Promise.all([this.getAccount(), this.getChainId()])
      let unsupported = this.isChainUnsupported(connectedChainId)
      let id = connectedChainId
      if (chainId && connectedChainId !== chainId) {
        // try switching chain
        const chain = await this.switchChain(chainId)
        id = chain.id
        unsupported = this.isChainUnsupported(id)
      }
      return {
        account,
        chain: {
          id,
          unsupported
        }
      }
    } catch (error) {
      log.error('error while connecting', error)
      this.onDisconnect()
      throw new UserRejectedRequestError('Something went wrong' as unknown as Error)
    }
  }

  async getWalletClient({ chainId }: { chainId?: number } = {}): Promise<WalletClient> {
    const [provider, account] = await Promise.all([this.getProvider(), this.getAccount()])
    const chain = this.chains.find((x) => x.id === chainId)
    if (!provider) throw new Error('provider is required.')
    return createWalletClient({
      account,
      chain,
      transport: custom(provider)
    })
  }

  async getAccount(): Promise<Address> {
    const provider = await this.getProvider()
    if (!provider) return '0x'
    const accounts = await provider.request<unknown, string[]>({
      method: 'eth_accounts'
    })

    if (!accounts || !accounts[0]) return '0x'
    return getAddress(accounts[0])
  }

  async getProvider() {
    if (this.provider) {
      return this.provider
    }
    if (this.web3AuthInstance.status === ADAPTER_STATUS.NOT_READY) {
      if (isIWeb3AuthModal(this.web3AuthInstance)) {
        await this.web3AuthInstance.initModal({
          // @ts-ignore
          modalConfig: this.modalConfig
        })
      } else if (this.loginParams) {
        await this.web3AuthInstance.init()
      } else {
        log.error('please provide valid loginParams when using @web3auth/no-modal')
        throw new UserRejectedRequestError(
          'please provide valid loginParams when using @web3auth/no-modal' as unknown as Error
        )
      }
    }

    this.provider = this.web3AuthInstance.provider as SafeEventEmitterProvider
    return this.provider
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount()
      return !!account
    } catch {
      return false
    }
  }

  async getChainId(): Promise<number> {
    try {
      const provider = await this.getProvider()
      const chainId = await provider.request<unknown, string>({ method: 'eth_chainId' })
      log.info('chainId', chainId)
      return normalizeChainId(chainId as string)
    } catch {
      throw new Error('Chain ID is not defined')
    }
  }

  async switchChain(chainId: number) {
    try {
      const chain = this.chains.find((x) => x.id === chainId)
      if (!chain) throw new SwitchChainError(new Error('chain not found on connector.'))

      await this.web3AuthInstance.addChain({
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: `0x${chain.id.toString(16)}`,
        rpcTarget: chain.rpcUrls.default.http[0],
        displayName: chain.name,
        blockExplorer: chain.blockExplorers?.default.url[0] || '',
        ticker: chain.nativeCurrency?.symbol || 'ETH',
        tickerName: chain.nativeCurrency?.name || 'Ethereum',
        decimals: chain.nativeCurrency.decimals || 18
      })
      log.info('Chain Added: ', chain.name)
      await this.web3AuthInstance.switchChain({ chainId: `0x${chain.id.toString(16)}` })
      log.info('Chain Switched to ', chain.name)
      return chain
    } catch (error: unknown) {
      log.error('Error: Cannot change chain', error)
      throw new SwitchChainError(error as Error)
    }
  }

  async disconnect(): Promise<void> {
    await this.web3AuthInstance.logout()
    const provider = await this.getProvider()
    if (provider) {
      provider.removeListener('accountsChanged', this.onAccountsChanged)
      provider.removeListener('chainChanged', this.onChainChanged)
    }
  }

  protected onAccountsChanged = (accounts: string[]): void => {
    if (accounts.length === 0) this.emit('disconnect')
    else this.emit('change', { account: getAddress(accounts[0]) })
  }

  protected isChainUnsupported(chainId: number): boolean {
    return !this.chains.some((x) => x.id === chainId)
  }

  protected onChainChanged = (chainId: string | number): void => {
    const id = normalizeChainId(chainId)
    const unsupported = this.isChainUnsupported(id)
    log.info('chainChanged', id, unsupported)
    this.emit('change', { chain: { id, unsupported } })
  }

  protected onDisconnect(): void {
    this.emit('disconnect')
  }

  setStorage(storage: Storage): void {
    return
  }
}
