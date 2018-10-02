// @flow
import React from 'react'
import { connect } from 'react-redux'

import withLoader from '../with-loader'
import {
  startPollingForPartners, shhBroadcast,
  makeNewKey, pollForMessages, Bob,
} from '../../eth-api'

import type { Partner, PartnersStore } from '../../state/partners'

type ChatPartnersType = {
  partners: Partner[],
  dispatch: Function,
}

const displayAddr = (addr: string): string => {
  const firstPart = addr.slice(0, 8)
  const lastPart = addr.slice(-7, -1)

  return `${firstPart}...${lastPart}`
}

const PartnerRow = (props: { partner: Partner, dispatch: Function }) => {
  const { dispatch, partner: { address, publicKey } } = props
  const isYou = address.toLowerCase() === window._coinbase

  const onStart = () => makeNewKey(dispatch).then((key) => {
    pollForMessages(key.filterId || '', dispatch)
    window._handshaker.setCounterparty(publicKey)

    const payload = {
      timestamp: new Date().getTime(),
      messageType: 'START',
      payload: {
        publicKey: key.publicKey,
        senderAddr: window._coinbase,
      },
    }

    shhBroadcast(publicKey, payload)
  })

  return (
    <div>
      <div className="row">
        <p>
          <b>Address:</b> { displayAddr(address) } { isYou && '(you)' }<br />
          <b>PublicKey:</b> { publicKey.slice(0, 10) + '...' }
        </p>
      </div>
      <div className="row">
        <button className="btn btn-primary btn-sm" disabled={isYou} onClick={onStart}>
          Start Chat
        </button>
      </div>
    </div>
  )
}

const ChatPartners = (props: ChatPartnersType) => {
  const { partners, dispatch } = props

  const becomeAvailable = () => makeNewKey(dispatch).then((whisperKey) => {
    const web3 = window._web3
    const { publicKey, filterId } = whisperKey

    pollForMessages(filterId || '', dispatch)

    return web3.eth.sendTransaction({
      from: window._coinbase,
      to: Bob,
      value: web3.utils.toWei('20', 'gwei'),
      data: web3.utils.toHex(publicKey),
      gasLimit: '50000',
    })
  })

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

  return Promise.resolve(1)
}

const mapStateToProps = (state: { partners: PartnersStore }) => {
  const { partners } = state

  return { partners }
}

export default connect(mapStateToProps)(withLoader(loader, ChatPartners))