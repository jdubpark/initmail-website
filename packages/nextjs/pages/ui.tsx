import axios from 'axios'
import type { NextPage } from 'next'
import { useQuery } from 'react-query'

import { MetaHeader } from '~~/components/MetaHeader'
import { ContractData } from '~~/components/example-ui/ContractData'
import { ContractInteraction } from '~~/components/example-ui/ContractInteraction'
import { useWeb3Auth } from '~~/hooks'

const ExampleUI: NextPage = () => {
  const web3Auth = useWeb3Auth()
  console.log(web3Auth.user)

  const {
    isLoading,
    error,
    data: emailsData
  } = useQuery('emailData', async () => {
    const response = await axios.get('https://initmail-server.fly.dev/emails', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + web3Auth.user?.idToken
      },
      params: {
        appPubkey: web3Auth.user?.appPubkey
      }
    })
    return response.data
  })

  return (
    <>
      <MetaHeader
        title="Initmail UI | Scaffold-ETH 2"
        description="Initmail UI created with 🏗 Scaffold-ETH 2, showcasing some of its features."
      >
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="grid lg:grid-cols-2 flex-grow">
        <ContractInteraction />
        <ContractData emailsData={emailsData} />
      </div>
    </>
  )
}

export default ExampleUI
