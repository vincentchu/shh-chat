// @flow

export type Partner = {
  address: string,
  publicKey: string,
}

export type PartnersStore = Partner[]

const ADD_PARTNER = 'state-partners/ADD_PARTNER'

export const reducer = (
  state: PartnersStore = [],
  action: { type: string, partner?: Partner }
): PartnersStore => {

  switch (action.type) {
    case ADD_PARTNER: {
      const { partner } = action

      if (partner) {
        return state.slice().concat(partner)
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