import { ArrowSmallRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useCallback, useState } from 'react'
import BigNumber from 'bn.js'

import { CopyIcon } from '~~/components/example-ui/assets/CopyIcon'
import { DiamondIcon } from '~~/components/example-ui/assets/DiamondIcon'
import { HareIcon } from '~~/components/example-ui/assets/HareIcon'
import { useScaffoldContractWrite } from '~~/hooks/scaffold-eth'

export type ContractInteractionProps = {
  emailsData: any[]
}

export const ContractInteraction = () => {
  // const [visible, setVisible] = useState(true)
  const [emailId, setEmailId] = useState<`0x${string}`>('0x')
  const [amountUsdc, setAmountUsdc] = useState('')

  // const { writeAsync, isLoading } = useScaffoldContractWrite({
  //   contractName: 'Intimail',
  //   functionName: 'setGreeting',
  //   args: [newGreeting],
  //   value: '0.01',
  //   onBlockConfirmation: (txnReceipt) => {
  //     console.log('📦 Transaction blockHash', txnReceipt.blockHash)
  //   }
  // })

  const payForEmail = useScaffoldContractWrite({
    contractName: 'Intimail',
    functionName: 'payForEmail',
    // b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
    args: [emailId, BigInt(new BigNumber(amountUsdc).mul(new BigNumber(10 ** 6)).toString())]
  })

  const handlePayEmail = useCallback(async () => {
    try {
      await payForEmail.writeAsync()
    } catch (err) {
      console.log(err)
    }
  }, [payForEmail])

  return (
    <div className="flex bg-base-300 relative pb-10">
      <DiamondIcon className="absolute top-24" />
      <CopyIcon className="absolute bottom-0 left-36" />
      <HareIcon className="absolute right-0 bottom-24" />
      <div className="flex flex-col w-full mx-5 sm:mx-8 2xl:mx-20">
        {/* <div className={`mt-10 flex gap-2 ${visible ? '' : 'invisible'} max-w-2xl`}>
          <div className="flex gap-5 bg-base-200 bg-opacity-80 z-0 p-7 rounded-2xl shadow-lg">
            <span className="text-3xl">👋🏻</span>
            <div>
              <div>
                In this page you can see how some of our <strong>hooks & components</strong> work, and how you can bring
                them to life with your own design! Have fun and try it out!
              </div>
            </div>
          </div>
          <button
            className="btn btn-circle btn-ghost h-6 w-6 bg-base-200 bg-opacity-80 z-0 min-h-0 drop-shadow-md"
            onClick={() => setVisible(false)}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div> */}

        <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
          <span className="text-2xl sm:text-4xl text-black">Pay for Email</span>

          <div className="mt-8 flex flex-col items-start sm:items-center gap-2 sm:gap-5">
            <input
              type="text"
              placeholder="Email ID"
              className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-sm placeholder-white"
              onChange={(e) => setEmailId(`0x${e.target.value}`)}
            />
            <input
              type="text"
              placeholder="Amount of USDC"
              className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg placeholder-white"
              onChange={(e) => setAmountUsdc(e.target.value)}
            />
            <div className="flex rounded-full border border-primary p-1 flex-shrink-0 w-full">
              <div className="flex rounded-full border-2 border-primary p-1 w-full">
                <button
                  className="btn btn-primary rounded-full capitalize font-normal font-white w-full flex items-center gap-1 hover:gap-2 transition-all tracking-widest"
                  onClick={handlePayEmail}
                  disabled={payForEmail.isLoading}
                >
                  {payForEmail.isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      Pay <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 items-start">
            <span className="text-sm leading-tight">Price:</span>
            <div className="badge badge-warning">Gas</div>
          </div>
        </div>
      </div>
    </div>
  )
}
