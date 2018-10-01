// @flow
import { uniqBy } from 'ramda'

export type Partner = {
  address: string,
  publicKey: string,
  blockNumber: number,
  hash: string,
}

export type PartnersStore = Partner[]

const ADD_PARTNER = 'state-partners/ADD_PARTNER'

const dedupe = (existing: Partner[], partner: Partner): Partner[] => {
  const dedupedByAddr = uniqBy((p: Partner) => p.address, [ partner ].concat(existing))
  const dedupedByHash = uniqBy((p: Partner) => p.hash, dedupedByAddr)

  return dedupedByHash
}

export const reducer = (
  state: PartnersStore = [],
  action: { type: string, partner?: Partner }
): PartnersStore => {

  switch (action.type) {
    case ADD_PARTNER: {
      const { partner } = action

      if (partner) {
        return dedupe(state.slice(), partner)
      }

      return state
    }

    default:
      return state
  }
}

export const addPartner = (partner: Partner) => ({
  type: ADD_PARTNER,
  partner,
})