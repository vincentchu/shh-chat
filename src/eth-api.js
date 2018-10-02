// @flow
import { addPartner } from './state/partners'

export const Bob = '0x8691bf25ce4a56b15c1f99c944dc948269031801'

export const findPartners = (dispatch: Function): Promise<void> => {
  const eth = window._web3.eth

  return eth.getBlockNumber().then((blockNumber) => {
    for (let i = 0; i < blockNumber; i++) {
      eth.getBlock(i, true).then((block) => {
        block.transactions.forEach((tx) => {
          console.log('TX', tx)
          if (tx.to.toLowerCase() === Bob) {
            dispatch(addPartner({
              address: tx.from,
              publicKey: tx.input,
              blockNumber: i,
              hash: tx.hash,
            }))
          }
        })
      })
    }
  })
}

export const startPollingForPartners = (dispatch: Function) => {
  const poller = () => findPartners(dispatch).then(() => setTimeout(poller, 5000))

  poller()
}
