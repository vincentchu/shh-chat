// @flow
import React from 'react'
import { connect } from 'react-redux'

import withLoader from '../with-loader'
import { findPartners, startPollingForPartners, Bob } from '../../eth-api'

import type { Partner, PartnersStore } from '../../state/partners'

type ChatPartnersType ={
  partners: Partner[],
  dispatch: Function,
}

const displayAddr = (addr: string): string => {
  const firstPart = addr.slice(0, 8)
  const lastPart = addr.slice(-7, -1)

  return `${firstPart}...${lastPart}`
}

const PartnerRow = (props: { partner: Partner, dispatch: Function }) => {
  const { address, publicKey } = props.partner
  const isYou = address.toLowerCase() === window._coinbase

  return (
    <div className="row">
      <p>
        <b>Address:</b> { displayAddr(address) } { isYou && '(you)' }<br />
        <b>PublicKey:</b> { publicKey }
      </p>

      <button className="btn btn-primary btn-sm" disabled={isYou}>
        Start Chat
      </button>
    </div>
  )
}

const ChatPartners = (props: ChatPartnersType) => {
  const { partners, dispatch } = props

  const becomeAvailable = () => {
    const web3 = window._web3
    const txParams = {
      from: window._coinbase,
      to: Bob,
      value: web3.utils.toWei('20', 'gwei'),
      data: web3.utils.toHex(new Date().toString()),
      gasLimit: '30000',
    }

    console.log('TXparams', txParams)
    web3.eth.sendTransaction(txParams).then((foo, bar) => {
      console.log('FOO', foo, bar)
    })
  }


  return (
    <div className="container">
      <div className="row">
        <h4>Become Available</h4>
      </div>

      <div className="row" style={{ marginBottom: '20px' }}>
        <button className="btn btn-primary" onClick={becomeAvailable}>
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

      { partners.map((partner, idx) => (
        <PartnerRow key={idx} partner={partner} dispatch={dispatch} />
      )) }
    </div>
  )
}

const loader = (dispatch: Function) => {
  startPollingForPartners(dispatch)

  return findPartners(dispatch)
}

const mapStateToProps = (state: { partners: PartnersStore }) => {
  const { partners } = state

  return { partners }
}

export default connect(mapStateToProps)(withLoader(loader, ChatPartners))