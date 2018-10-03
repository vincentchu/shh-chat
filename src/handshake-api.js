// @flow
import { shhBroadcast } from './eth-api'
import type { Message } from './state/messages'

const GoogleStun = 'stun:stun.l.google.com:19302'
const GoogleIceConfig = { iceServers: [ { urls: GoogleStun } ] }



class HandshakeApi {
  peerConnection: RTCPeerConnection
  dispatch: ?Function
  counterpartyKey: ?string
  iceCandidates: RTCIceCandidate[]
  shhReady: boolean

  rtcDataChannel: RTCDataChannel

  constructor() {
    this.shhReady = false
    this.peerConnection = new RTCPeerConnection(GoogleIceConfig)
    this.iceCandidates = []
    this.peerConnection.onicecandidate = this.onIceCandidate.bind(this)
    this.rtcDataChannel = this.peerConnection.createDataChannel('data')

    this.peerConnection.ontrack = (evt) => {
      console.log('Got remote stream', evt.streams)
    }
  }

  setCounterparty(key: string) {
    this.counterpartyKey = key
  }

  shh(payload: Object) {
    shhBroadcast(this.counterpartyKey || '', payload)
  }

  onIceCandidate(iceEvt: RTCPeerConnectionIceEvent) {
    console.log('onIceCandidate: Received candidate', iceEvt.candidate, this.iceCandidates)

    if (iceEvt.candidate) {
      if (this.shhReady) {
        this.shh({
          timestamp: new Date().getTime(),
          messageType: 'CANDIDATE',
          payload: { data: JSON.stringify(iceEvt.candidate) },
        })

      } else {
        this.iceCandidates.push(iceEvt.candidate)
      }
    }
  }

  getStream(): Promise<void> {
    if (navigator.mediaDevices) {
      return navigator.mediaDevices.getUserMedia({ audio: false, video: true })
        .then((stream) => {
          console.log('GotStream', stream)
          stream.getTracks().forEach((track) => {
            console.log('Adding track', track)
            this.peerConnection.addTrack(track)
          })
        })
    }

    return Promise.resolve()
  }

  startHandshake(mesg: Message) {
    this.setCounterparty(mesg.payload.publicKey)

    this.getStream().then(() => {
      this.peerConnection.createOffer()
        .then((offer) => {
          console.log('Created offer', offer)

          return this.peerConnection.setLocalDescription(offer).then(() => {
            console.log('Sending to friend')
            this.shh({
              timestamp: new Date().getTime(),
              messageType: 'OFFER',
              payload: { data: JSON.stringify(offer) },
            })
          })
        })
    })
  }

  receiveOffer(mesg: Message) {
    this.shhReady = true
    const offer: RTCSessionDescriptionInit = JSON.parse(mesg.payload.data)
    console.log('Got offer', offer)

    this.peerConnection.setRemoteDescription(offer)
    this.peerConnection.createAnswer()
      .then((answer) => {
        console.log('handleOffer: Setting local/remote description and sending answer')
        this.peerConnection.setLocalDescription(answer)

        this.shh({
          timestamp: new Date().getTime(),
          messageType: 'ANSWER',
          payload: { data: JSON.stringify(answer) },
        })

        this.iceCandidates.forEach((candidate) => {
          this.shh({
            timestamp: new Date().getTime(),
            messageType: 'CANDIDATE',
            payload: { data: JSON.stringify(candidate) },
          })
        })
      })
  }

  receiveAnswer(mesg: Message) {
    this.shhReady = true
    const answer: RTCSessionDescriptionInit = JSON.parse(mesg.payload.data)
    console.log('Got answer', answer)

    this.peerConnection.setRemoteDescription(answer)
    this.iceCandidates.forEach((candidate) => {
      this.shh({
        timestamp: new Date().getTime(),
        messageType: 'CANDIDATE',
        payload: { data: JSON.stringify(candidate) },
      })
    })
  }

  receiveCandidate(mesg: Message) {
    const candidate: RTCIceCandidate = JSON.parse(mesg.payload.data)

    console.log('Got Candidate', candidate)
    this.peerConnection.addIceCandidate(candidate)
      .then(() => console.log('Added ice candidate', candidate))
      .catch((err) => console.log('error adding ice candidate', err, candidate))
  }

  accept(messages: Message[], dispatch: Function) {
    this.dispatch = dispatch

    messages.forEach((mesg) => {
      switch (mesg.messageType) {
        case 'START':
          return this.startHandshake(mesg)
        case 'OFFER':
          return this.receiveOffer(mesg)
        case 'ANSWER':
          return this.receiveAnswer(mesg)
        case 'CANDIDATE':
          return this.receiveCandidate(mesg)
      }
    })
  }
}


export default HandshakeApi