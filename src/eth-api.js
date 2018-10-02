// @flow
import { flatten } from 'ramda'

import { addPartners } from './state/partners'
import { updateKey } from './state/whisper'
import { addMessages } from './state/messages'

import type { Partner } from './state/partners'
import type { WhisperKey } from './state/whisper'

export const Alice = '0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6'
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
      dispatch(addPartners(partners))

      return partners
    })
  })
}

export const startPollingForPartners = (dispatch: Function) => {
  const poller = () => findPartners(dispatch).then(() => setTimeout(poller, 5000))

  poller()
}

export const makeNewKey = (dispatch: Function): Promise<WhisperKey> => {
  const shh = window._shh

  return shh.newKeyPair().then((keyId) => Promise.all([
    shh.getPublicKey(keyId),
    shh.newMessageFilter({ privateKeyId: keyId }),
  ]).then(([ publicKey, filterId ]) => {
    const whisperKey = { keyId, publicKey, filterId }
    dispatch(updateKey(whisperKey))

    return whisperKey
  }))
}

export const pollForMessages = (filterId: string, dispatch: Function) => {
  const shh = window._web3.shh
  const poller = () => {
    shh.getFilterMessages(filterId).then((mesgs) => {
      console.log('MESSAGES', mesgs)
      dispatch(addMessages([]))

      return setTimeout(poller, 5000)
    })
  }

  poller()
}
