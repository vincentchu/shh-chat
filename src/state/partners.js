// @flow
import { uniqBy, sortBy } from 'ramda'

export type Partner = {
  address: string,
  publicKey: string,
  blockNumber: number,
  hash: string,
}

export type PartnersStore = Partner[]

const ADD_PARTNERS = 'state-partners/ADD_PARTNERS'

const dedupe = (existing: Partner[], partners: Partner[]): Partner[] => {
  const dedupedByHash = uniqBy((p: Partner) => p.hash, partners.concat(existing))
  const dedupedByAddr = uniqBy(
    (p: Partner) => p.address,
    sortBy((p: Partner) => -p.blockNumber, dedupedByHash)
  )

  return dedupedByAddr
}

export const reducer = (
  state: PartnersStore = [],
  action: { type: string, partners?: Partner[] }
): PartnersStore => {

  switch (action.type) {
    case ADD_PARTNERS: {
      const { partners } = action

      if (partners) {
        return dedupe(state.slice(), partners)
      }

      return state
    }

    default:
      return state
  }
}

export const addPartners = (partners: Partner[]) => ({
  type: ADD_PARTNERS,
  partners,
})