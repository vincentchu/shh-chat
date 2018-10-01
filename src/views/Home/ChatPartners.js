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

const displayAddr = (addr: string): string => {
  const firstPart = addr.slice(0, 8)
  const lastPart = addr.slice(-7, -1)

  return `${firstPart}...${lastPart}`
}

const PartnerRow = (props: { partner: Partner }) => {
  const { address, publicKey } = props.partner
  const isYou = address.toLowerCase() === window._coinbase

  return (
    <div className="row">
      <p>
        Address: { displayAddr(address) } { isYou && '(you)' }<br />
        PublicKey: { publicKey }
      </p>

      <button className="btn btn-primary btn-sm" disabled={isYou}>
        Start Chat
      </button>
    </div>
  )
}

const ChatPartners = (props: ChatPartnersType) => {
  const { partners } = props

  return (
    <div className="container">
      <div className="row">
        <h4>Become Available</h4>
      </div>

      <div className="row" style={{ marginBottom: '20px' }}>
        <button className="btn btn-primary">
          Become Available
        </button>
      </div>

      <div className="row">
        <h4>Available to Chat</h4>
      </div>

      { (partners.length === 0) && (
        <div className="row">
          Forever alone ...
        </div>
      ) }

      { partners.map((partner, idx) => <PartnerRow key={idx} partner={partner} />)}
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