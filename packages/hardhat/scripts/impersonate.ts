import { ethers } from 'hardhat'

import erc20Abi from './erc20.abi.json'

export async function getTokenViaImpersonation(
  impersonateAddress: string,
  recipientAddress: string,
  tokenAddress: string,
  tokenAmount: number
) {
  await ethers.provider.send('hardhat_impersonateAccount', [impersonateAddress])
  const impersonated = await ethers.getSigner(impersonateAddress)

  const token = (await ethers.getContractAt(erc20Abi, tokenAddress)).connect(impersonated)
  // console.log('impersonated', impersonated)
  // console.log('tokenAddress', token)

  try {
    const code = await ethers.provider.getCode(tokenAddress)
    if (code !== '0x') {
      // console.log('is code')
    } else {
      console.log('is not code')
    }
  } catch (error) {
    console.log('is not code, error')
  }

  const tx = await token.transfer(
    recipientAddress,
    ethers.utils.parseUnits(String(tokenAmount), 6),
    {
      gasLimit: 300_000
    }
  )
  const receipt = await tx.wait()
  console.log('receipt', receipt)
}
