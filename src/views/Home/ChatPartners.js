// @flow
import React from 'react'
import { connect } from 'react-redux'

import withLoader from '../with-loader'
import { addPartner } from '../../state/partners'

import type { Partner, PartnersStore } from '../../state/partners'

const Bob = '0x8691bf25ce4a56b15c1f99c944dc948269031801'

type ChatPartnersType ={
  partners: Partner[],
}

const PartnerRow = (props: { partner: Partner }) => {
  const { partner } = props

  return (
    <li>
      { partner.address }
    </li>
  )
}

const ChatPartners = (props: ChatPartnersType) => {
  const { partners } = props

  return (
    <div className="container">
      <div className="row">
        <h4>Available to Chat</h4>
      </div>

      <div className="row">
        { partners.map((partner, idx) => <PartnerRow key={idx} partner={partner} />)}
      </div>
    </div>
  )
}

const loader = (dispatch: Function) => {
  const eth = window._web3.eth

  return eth.getBlockNumber().then((blockNumber) => {
    for (let i = 0; i < blockNumber; i++) {
      eth.getBlock(i, true).then((block) => {
        block.transactions.forEach((tx) => {
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

const mapStateToProps = (state: { partners: PartnersStore }) => {
  const { partners } = state

  return { partners }
}

export default connect(mapStateToProps)(withLoader(loader, ChatPartners))