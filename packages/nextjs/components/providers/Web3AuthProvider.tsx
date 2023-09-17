import { getPublicCompressed } from '@toruslabs/eccrypto'
import {
  ADAPTER_EVENTS,
  CONNECTED_EVENT_DATA,
  SafeEventEmitterProvider,
  UserInfo,
} from '@web3auth/base'
import { Web3Auth } from '@web3auth/modal'
// import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { LOGIN_MODAL_EVENTS } from '@web3auth/ui'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { initModalConfig, openloginAdapterInstance, web3AuthConfig } from '~~/components/wagmi'

// import {
//   initModalConfig,
//   openloginAdapterConfig,
//   web3AuthConfig,
// } from '@/config/web3auth'
// import { useAppDispatch, useAppSelector } from '@/hooks'
// import { useGetUserQuery } from '@/services/user'
// import { setUserJwtToken } from '@/slices/app'
// import { selectUserData } from '@/slices/user'
// import { UserProfile } from '@/types'

export enum Web3AuthStatus {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ERRORED = 'ERRORED',
  UNINITIATED = 'UNINITIATED',
}

export type Web3AuthExtendedUser = Partial<UserInfo> & { appPubkey: string }

export type Web3AuthProviderData = {
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  // userProfile: UserProfile | undefined
  // normal web3auth stuff
  web3auth: Web3Auth | undefined
  provider: SafeEventEmitterProvider | undefined
  providerData: CONNECTED_EVENT_DATA | undefined
  user: Web3AuthExtendedUser | undefined
  status: Web3AuthStatus | undefined
  onSuccessfulLogin: (
    web3auth: Web3Auth,
    data: CONNECTED_EVENT_DATA,
    user: any,
  ) => void
  login: () => void
  logout: () => void
}

export const Web3AuthProviderContext =
  React.createContext<Web3AuthProviderData>({
    isLoading: true,
    isFetching: true,
    isError: false,
    // userProfile: undefined,
    // normal web3auth stuff
    web3auth: undefined,
    provider: undefined,
    providerData: undefined,
    user: undefined,
    status: Web3AuthStatus.UNINITIATED,
    onSuccessfulLogin: (
      web3auth: Web3Auth,
      data: CONNECTED_EVENT_DATA,
      user: Web3AuthExtendedUser,
    ) => {},
    login: () => {},
    logout: () => {},
  })

export default function Web3AuthProvider({
  children,
}: React.PropsWithChildren) {
  // const dispatch = useAppDispatch()
  // const userData = useAppSelector(selectUserData)

  const [provider, setProvider] = useState<
    SafeEventEmitterProvider | undefined
  >(undefined)
  const [user, setUser] = useState<Web3AuthExtendedUser | undefined>(undefined)
  const [providerData, setProviderData] = useState<
    CONNECTED_EVENT_DATA | undefined
  >(undefined)
  const [web3auth, setWeb3Auth] = useState<Web3Auth | undefined>(undefined)
  const [status, setStatus] = useState<Web3AuthStatus>(
    Web3AuthStatus.UNINITIATED,
  )

  // const {
  //   data: fetchedUserData,
  //   error: fetchErrorUserData,
  //   isLoading: isUserDataLoading,
  //   isFetching: isUserDataFetching,
  //   isError: isUserDataError,
  // } = useGetUserQuery(user?.appPubkey || '', {
  //   skip: !user || !user.appPubkey,
  //   refetchOnMountOrArgChange: true,
  // })

  const onSuccessfulLogin = useCallback(
    (
      web3auth: Web3Auth,
      data: CONNECTED_EVENT_DATA,
      user: Web3AuthExtendedUser,
    ) => {
      setProviderData(data)
      web3auth.connect().then(async (provider) => {
        setProvider(provider || undefined)
        // console.log(user)

        // dispatch(setUserJwtToken(user.idToken || ''))

        // Grab app pubkey
        let pubkey = ''
        if (web3auth.provider) {
          const privKey: any = await web3auth.provider.request({
            method: 'eth_private_key',
          })
          pubkey = getPublicCompressed(
            Buffer.from(privKey.padStart(64, '0'), 'hex'),
          ).toString('hex')
        }

        setUser({
          ...user,
          appPubkey: pubkey, // without 0x prefix
        })
      })
    },
    [],
  )

  const login = useCallback(() => {
    // console.log(web3auth)
    if (!web3auth) return
    web3auth
      .connect()
      .then((data) => {
        console.log('Login successful!')
        console.log(data)
      })
      .catch((err) => {
        console.error('Login failed!')
        console.error(err)
      })
  }, [web3auth])

  const logout = useCallback(() => {
    if (!web3auth) return
    web3auth
      .logout()
      .then(() => {
        console.log('Logout successful!')
        // dispatch(setUserJwtToken(''))
      })
      .catch((err) => {
        console.error('Logout failed!')
        console.error(err)
      })
  }, [web3auth])

  //
  // Subscribe to Web3Auth auth events
  //
  const subscribeAuthEvents = useCallback(
    (web3auth: Web3Auth) => {
      if (!web3auth) return

      web3auth.on(ADAPTER_EVENTS.CONNECTED, (data: CONNECTED_EVENT_DATA) => {
        // console.log('Yeah!, you are successfully logged in', data)
        console.log('connected')
        setStatus(Web3AuthStatus.CONNECTED)

        // Call `onSuccessfulLogin` with the fetched user info on successful authentication
        web3auth
          .getUserInfo()
          .then((user) =>
            onSuccessfulLogin(web3auth, data, { ...user, appPubkey: '' }),
          )
      })

      web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
        console.log('connecting')
        setStatus(Web3AuthStatus.CONNECTING)
      })

      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log('disconnected')
        setStatus(Web3AuthStatus.DISCONNECTED)
        setUser(undefined)
        setProvider(undefined)
        // dispatch(setUserJwtToken(''))
      })

      web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
        setStatus(Web3AuthStatus.ERRORED)
        console.log('some error or user have cancelled login request', error)
      })

      web3auth.on(LOGIN_MODAL_EVENTS.MODAL_VISIBILITY, (isVisible) => {
        // console.log('modal visibility', isVisible)
      })
    },
    [onSuccessfulLogin],
  )

  //
  // Initialize Web3Auth
  //
  useEffect(() => {
    // console.log(web3AuthConfig)
    if (!web3AuthConfig || !web3AuthConfig.clientId) return

    console.log(web3AuthConfig)
    const newWeb3auth = new Web3Auth(web3AuthConfig)
    newWeb3auth.configureAdapter(openloginAdapterInstance())

    // Overwrite to the newest Web3Auth data
    setWeb3Auth(newWeb3auth)
    subscribeAuthEvents(newWeb3auth)

    newWeb3auth.initModal(initModalConfig).catch((err) => {
      console.error(err)
    })
  }, [subscribeAuthEvents])

  //
  // Create Web3Auth context
  //
  const ctx: Web3AuthProviderData = useMemo(() => {
    const base = {
      web3auth,
      provider,
      providerData,
      user,
      status,
      onSuccessfulLogin,
      login,
      logout,
    }

    // console.log('isUserDataLoading', isUserDataLoading)
    // console.log('isUserDataFetching', isUserDataFetching)
    // console.log('isUserDataError', isUserDataError)

    // if (!isUserDataLoading && !isUserDataFetching) {
    //   if (user && !isUserDataError && !!fetchedUserData) {
    //     return {
    //       ...base,
    //       userProfile: userData.profile,
    //       isLoading: false,
    //       isFetching: false,
    //       isError: false,
    //     }
    //   }
    //   return {
    //     ...base,
    //     userProfile: undefined,
    //     isLoading: false,
    //     isFetching: false,
    //     isError: true,
    //   }
    // }

    // return {
    //   ...base,
    //   userProfile: undefined,
    //   isLoading: false,
    //   isFetching: false,
    //   isError: false,
    // }

    return {
      ...base,
      userProfile: undefined,
      isLoading: true,
      isFetching: true,
      isError: false,
    }
  }, [
    login,
    logout,
    onSuccessfulLogin,
    provider,
    providerData,
    status,
    user,
    web3auth,
    // non-web3Auth stuff
    // userData,
    // fetchedUserData,
    // isUserDataLoading,
    // isUserDataFetching,
    // isUserDataError,
  ])

  return (
    <Web3AuthProviderContext.Provider value={ctx}>
      {children}
    </Web3AuthProviderContext.Provider>
  )
}

export const Web3AuthConsumer = Web3AuthProviderContext.Consumer
