// @flow
import { flatten } from 'ramda'

import { addPartners } from './state/partners'
import type { Partner } from './state/partners'

export const Bob = '0x8691bf25ce4a56b15c1f99c944dc948269031801'

export const findPartners = (dispatch: Function): Promise<Partner[]> => {
  const eth = window._web3.eth

  return eth.getBlockNumber().then((blockNumber) => {
    const blockPromises = []

    for (let i = 0; i < blockNumber; i++) {
      blockPromises[i] = eth.getBlock(i, true).then((block) => {

        const txs = block.transactions.filter((tx) => tx.to.toLowerCase() === Bob)
        const partners = txs.map((tx) => ({
          address: tx.from,
          publicKey: tx.input,
          blockNumber: i,
          hash: tx.hash,
        }))

        return partners
      })
    }

    return Promise.all(blockPromises).then((partnersArr) => {
      const partners: Partner[] = flatten(partnersArr)
      console.log('PART', partners)

      dispatch(addPartners(partners))

      return partners
    })
  })
}

export const startPollingForPartners = (dispatch: Function) => {
  const poller = () => findPartners(dispatch).then(() => setTimeout(poller, 5000))

  poller()
}
