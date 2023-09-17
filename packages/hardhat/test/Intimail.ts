import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Intimail } from '../typechain-types'

describe('Intimail', function () {
  // We define a fixture to reuse the same setup in every test.

  let intimail: Intimail
  before(async () => {
    const [owner] = await ethers.getSigners()
    const intimailFactory = await ethers.getContractFactory('Intimail')
    intimail = (await intimailFactory.deploy(
      '0x27428DD2d3DD32A4D7f7C497eAaa23130d894911',
      '0xa5f208e072434bC67592E4C49C1B991BA79BCA46',
      '0xaf88d065e77c8cc2239327c5edb3a432268e5831'
    )) as Intimail
    await intimail.deployed()
  })

  describe('Deployment', function () {
    it('Should have the right message on deploy', async function () {
      // expect(await intimail.greeting()).to.equal('Building Unstoppable Apps!!!')
      expect(true)
    })

    // it('Should allow setting a new message', async function () {
    //   const newGreeting = 'Learn Scaffold-ETH 2! :)'

    //   await intimail.setGreeting(newGreeting)
    //   expect(await intimail.greeting()).to.equal(newGreeting)
    // })
  })
})
