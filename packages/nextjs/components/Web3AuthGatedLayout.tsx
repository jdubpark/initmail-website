import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
// import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useAccount } from 'wagmi'

// import { LoadingScreen } from '~~/components'
import { Web3AuthProviderData, Web3AuthStatus } from '~~/components/providers'
import { useWeb3Auth } from '~~/hooks'

function isWeb3UserFetched(ctx: Web3AuthProviderData) {
  return !!ctx.user && !!ctx.provider
}

export function Web3AuthGatedLayout({ children }: React.PropsWithChildren) {
  const web3Auth = useWeb3Auth()
  const router = useRouter()

  // const userAccount = useAccount()

  // const queryClient = useQueryClient()
  // const postProfile = useMutation(
  //   (postProfileData: { name: string; address: string; handle: string; userId: string }) => {
  //     return axios.post('https://initmail-server.fly.dev/user/profile', postProfileData)
  //   },
  //   {
  //     onSuccess: () => {
  //       // Invalidate and refetch
  //       // queryClient.invalidateQueries('todos')
  //     }
  //   }
  // )

  // const [postData, { loading, error }] = useMutation(async () => {
  //   const response = await fetch('https://example.com/api/posts', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       title: 'My new post',
  //       body: 'This is my new post.',
  //     }),
  //   });

  //   if (response.status === 201) {
  //     return {
  //       data: await response.json(),
  //     };
  //   } else {
  //     throw new Error(response.statusText);
  //   }
  // });

  // const {
  //   data: fetchedUserData,
  //   error: fetchErrorUserData,
  //   isLoading: isUserDataLoading,
  //   isFetching: isUserDataFetching,
  //   isError: isUserDataError,
  //   error: userDataError,
  //   refetch: refetchUserData,
  // } = useGetUserQuery(web3Auth.user?.appPubkey || '', {
  //   skip: !web3Auth.user?.appPubkey,
  // })

  const isUninitiated = web3Auth.status === Web3AuthStatus.UNINITIATED
  const isConnecting = web3Auth.status === Web3AuthStatus.CONNECTING
  const isConnected = web3Auth.status === Web3AuthStatus.CONNECTED

  useEffect(() => {
    if (isConnected && isWeb3UserFetched(web3Auth)) {
      if (!web3Auth.isLoading && !web3Auth.isFetching && web3Auth.isError) {
        // if (router.pathname !== '/intro') {
        //   router.push({ pathname: '/intro', query: router.query })
        //   return
        // }
      }

      if (!web3Auth.isLoading && !web3Auth.isFetching && !web3Auth.isError) {
        // if (!!web3Auth) {
        //   if (router.pathname !== '/') {
        //     router.replace({ pathname: '/', query: router.query })
        //     return
        //   }
        // } else {
        //   if (router.pathname !== '/intro') {
        //     router.replace({ pathname: '/intro', query: router.query })
        //     return
        //   }
        // }
      }
    }

    if (!web3Auth.isLoading && !web3Auth.isFetching && !isWeb3UserFetched(web3Auth)) {
      // if (router.pathname !== '/auth') {
      //   router.replace({ pathname: '/auth', query: router.query })
      //   // const t = setTimeout(() => router.reload(), 2000)
      //   // return () => clearTimeout(t)
      // }
    }
  }, [isConnected, web3Auth])

  // useEffect(() => {
  //   if (!web3Auth || !web3Auth.user || web3Auth.user.email === '') return
  //   if (!userAccount || !userAccount.address) return

  //   const userEmail = web3Auth.user.email as string

  //   // TODO: custom handler
  //   const userHandle = userEmail.split('@')[0]
  //   if (!userHandle) return

  //   console.log('handle', userHandle)

  //   // postProfile.mutate({
  //   //   name: web3Auth.user.name || '',
  //   //   address: userAccount.address,
  //   //   handle: userHandle,
  //   //   userId: userEmail
  //   // })
  // }, [web3Auth, userAccount])

  console.log(web3Auth)
  // if (web3Auth.isLoading || web3Auth.isFetching || !isWeb3UserFetched(web3Auth)) {
  // return <LoadingScreen />
  // return <h5>Loading...</h5>
  // }

  if (!isWeb3UserFetched(web3Auth)) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '100px 10px', textAlign: 'center' }}>
        <button
          onClick={web3Auth.login}
          style={{ padding: '12px 20px', borderRadius: '10px', border: '1px solid #aaa' }}
        >
          Login
        </button>
      </div>
    )
  }

  return <>{children}</>
}
