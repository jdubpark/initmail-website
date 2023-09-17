import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { getTokenViaImpersonation } from '../scripts/impersonate'

/**
 * Deploys a contract named "Intimail" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployIntimail: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts()
  const { deploy, getNetworkName } = hre.deployments

  const networkName = getNetworkName()
  console.log('Network to deploy:', networkName)

  // Optimism
  // relayer: IWormholeRelayer(0x27428DD2d3DD32A4D7f7C497eAaa23130d894911),
  // tokenBridge: ITokenBridge(0x1D68124e65faFC907325e3EDbF8c4d84499DAa8b),
  // wormhole: IWormhole(0xEe91C335eab126dF5fDB3797EA9d6aD93aeC9722)
  // USDC.e: 0x7f5c764cbc14f9669b88837ca1490cca17c31607

  // Arbitrum
  // relayer: IWormholeRelayer(0x27428DD2d3DD32A4D7f7C497eAaa23130d894911),
  // tokenBridge: ITokenBridge(0x0b2402144Bb366A632D14B83F244D2e0e21bD39c),
  // wormhole: IWormhole(0xa5f208e072434bC67592E4C49C1B991BA79BCA46)
  // USDC: 0xaf88d065e77c8cc2239327c5edb3a432268e5831

  const addresses: Record<string, Record<string, string>> = {
    optimism: {
      relayer: '0x27428DD2d3DD32A4D7f7C497eAaa23130d894911',
      wormhole: '0xEe91C335eab126dF5fDB3797EA9d6aD93aeC9722',
      usdc: '0x7f5c764cbc14f9669b88837ca1490cca17c31607' // USDC.e
    },
    arbitrum: {
      relayer: '0x27428DD2d3DD32A4D7f7C497eAaa23130d894911',
      wormhole: '0xa5f208e072434bC67592E4C49C1B991BA79BCA46',
      usdc: '0xaf88d065e77c8cc2239327c5edb3a432268e5831' // USDC native
    }
  }

  addresses.localhost = addresses.arbitrum

  await deploy('Intimail', {
    from: deployer,
    // Contract constructor arguments
    args: [addresses[networkName].relayer, addresses[networkName].wormhole, addresses[networkName].usdc],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true
  })

  // Get the deployed contract
  const intimail = await hre.ethers.getContract('Intimail', deployer)
  console.log(intimail.address)

  if (networkName == 'localhost') {
    // 	0x3dd1d15b3c78d6acfd75a254e857cbe5b9ff0af2 holds a lot of USDC on Arbitrum
    await getTokenViaImpersonation(
      '0x3dd1d15b3c78d6acfd75a254e857cbe5b9ff0af2',
      intimail.address,
      addresses[networkName].usdc,
      100_000
    )
  }
}

export default deployIntimail

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags Intimail
deployIntimail.tags = ['Intimail']
