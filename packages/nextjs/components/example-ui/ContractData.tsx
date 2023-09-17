import { useEffect, useRef, useState } from 'react'
import Marquee from 'react-fast-marquee'
import { useAccount } from 'wagmi'
import {
  useAnimationConfig,
  useScaffoldContract,
  useScaffoldContractRead,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber
} from '~~/hooks/scaffold-eth'

const MARQUEE_PERIOD_IN_SEC = 5

type EmailData = {
  createdAt: string
  id: string
  recipient: string
  sender: string
  status: number
}

export interface ContractDataProps {
  emailsData: { error: any; payload: null | EmailData[] }
}

export const ContractData = (props: ContractDataProps) => {
  const { emailsData } = props

  const userAccount = useAccount()
  console.log(userAccount)

  // const [emailId, setEmailId] = useState<`0x${string}`>('0x')

  // const { data: sentEmail, isLoading: isSentEmailsLoading } = useScaffoldContractRead({
  //   contractName: 'Intimail',
  //   functionName: 'emails',
  //   args: [emailId]
  // })

  // useScaffoldEventSubscriber({
  //   contractName: "Intimail",
  //   eventName: "GreetingChange",
  //   listener: logs => {
  //     logs.map(log => {
  //       const { greetingSetter, value, premium, newGreeting } = log.args;
  //       console.log("📡 GreetingChange event", greetingSetter, value, premium, newGreeting);
  //     });
  //   },
  // });

  // const {
  //   data: myGreetingChangeEvents,
  //   isLoading: isLoadingEvents,
  //   error: errorReadingEvents,
  // } = useScaffoldEventHistory({
  //   contractName: "Intimail",
  //   eventName: "GreetingChange",
  //   fromBlock: process.env.NEXT_PUBLIC_DEPLOY_BLOCK ? BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) : 0n,
  //   filters: { greetingSetter: address },
  //   blockData: true,
  // });

  // console.log("Events:", isLoadingEvents, errorReadingEvents, myGreetingChangeEvents);

  // const { data: intimail } = useScaffoldContract({ contractName: 'Intimail' })
  // console.log("Intimail: ", intimail);

  // const { showAnimation } = useAnimationConfig(sentEmails)

  // const showTransition = transitionEnabled && !!sentEmails

  return (
    <div className="flex flex-col justify-center items-center bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] py-10 px-5 sm:px-0 lg:py-auto max-w-[100vw] ">
      {emailsData &&
        emailsData.payload &&
        emailsData.payload.map((emailData, i) => {
          return (
            <div key={i} className="flex flex-col max-w-md bg-base-200 bg-opacity-70 shadow-lg px-5 py-4 w-full">
              <div>
                <strong>Email ID</strong>
                <div className="break-all">{emailData.id}</div>
              </div>
              <div className="mt-3">
                <strong>Recipient</strong>
                <div>{emailData.recipient}</div>
              </div>
              <div className="mt-3">
                <strong>Created At</strong>
                <div>{new Date(emailData.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          )
        })}
      {/* <div
        className={`flex flex-col max-w-md bg-base-200 bg-opacity-70 rounded-2xl shadow-lg px-5 py-4 w-full ${
          showAnimation ? 'animate-zoom' : ''
        }`}
      >
        <div className="flex justify-between w-full">
          <button
            className="btn btn-circle btn-ghost relative bg-center bg-[url('/assets/switch-button-on.png')] bg-no-repeat"
            onClick={() => {
              setTransitionEnabled(!transitionEnabled)
            }}
          >
            <div
              className={`absolute inset-0 bg-center bg-no-repeat bg-[url('/assets/switch-button-off.png')] transition-opacity ${
                transitionEnabled ? 'opacity-0' : 'opacity-100'
              }`}
            />
          </button>
          <div className="bg-secondary border border-primary rounded-xl flex">
            <div className="p-2 py-1 border-r border-primary flex items-end">Total count</div>
            <div className="text-4xl text-right min-w-[3rem] px-2 py-1 flex justify-end font-bai-jamjuree">
              {sentEmails?.toString() || '0'}
            </div>
          </div>
        </div>

        <div className="mt-3 border border-primary bg-neutral rounded-3xl text-secondary  overflow-hidden text-[116px] whitespace-nowrap w-full uppercase tracking-tighter font-bai-jamjuree leading-tight">
          <div className="relative overflow-x-hidden" ref={containerRef}>
            <div className="absolute -left-[9999rem]" ref={greetingRef}>
              <div className="px-4">{sentEmails ? sentEmails.length : 0}</div>
            </div>
            {new Array(3).fill('').map((_, i) => {
              const isLineRightDirection = i % 2 ? isRightDirection : !isRightDirection
              return (
                <Marquee
                  key={i}
                  direction={isLineRightDirection ? 'right' : 'left'}
                  gradient={false}
                  play={showTransition}
                  speed={marqueeSpeed}
                  className={i % 2 ? '-my-10' : ''}
                >
                  <div className="px-4">{currentGreeting || ' '}</div>
                </Marquee>
              )
            })}
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between">
          <button
            className={`btn btn-circle btn-ghost border border-primary hover:border-primary w-12 h-12 p-1 bg-neutral flex items-center ${
              isRightDirection ? 'justify-start' : 'justify-end'
            }`}
            onClick={() => {
              if (transitionEnabled) {
                setIsRightDirection(!isRightDirection)
              }
            }}
          >
            <div className="border border-primary rounded-full bg-secondary w-2 h-2" />
          </button>
          <div className="w-44 p-0.5 flex items-center bg-neutral border border-primary rounded-full">
            <div
              className="h-1.5 border border-primary rounded-full bg-secondary animate-grow"
              style={{ animationPlayState: showTransition ? 'running' : 'paused' }}
            />
          </div>
        </div>
      </div> */}
    </div>
  )
}
