# Shh-Chat

Proof-of-concept of bootstrapping a WebRTC connection using the [Whisper protocol](https://github.com/ethereum/wiki/wiki/Whisper) as a signalling channel


![Architecture](./WebRTC_Whisper_architecture.png | width=200)

## Using Whisper as a Signalling Channel

In order to create a direct WebRTC connection, two browsers ("Alice" and "Bob") must negotiate a session by exchanging [session descriptions](https://en.wikipedia.org/wiki/Session_Description_Protocol) over a signalling channel. In most implementations, the signalling channel is a central server that is accessible to both parties (typically a websocket or stateful-API). This central server presents a single point of failure, where an adversary can prevent Alice and Bob from initiating a WebRTC connection simply by blocking their ability to speak to the central server.

To prevent this, Alice and Bob can use the Whisper protocol to exchange signalling information. As a decentralized messaging protocol, Whisper can be used as a censorship-resistant channel that can be used to establish a WebRTC channel. Augmenting Whisper with WebRTC also augments the base protocol (designed to be low-bandwidth/high-latency), allowing actors on the Whisper network to "upgrade" to a high-bandwidth, low-latency connection.

In this PoC, we assume that Alice wishes to broadcast video to Bob, a person she does not know. To do so, she publishes her public key (PK) on the Ethereum blockchain. When Bob learns of Alice's PK, he can send her a message with his whisper PK, establishing bi-directional communication over Whisper, and creating a signalling channel to establish the WebRTC connection.

## Implementation Details

Below find an abridged description of how Alice and Bob negotiate a WebRTC connection via Whisper. Code sketches are provided; for further reference consult the source code directly.

1. Alice generates a Whisper PK and publishes to the Ethereum blockchain

```js
// Generating a new Public Key in Whisper
shh.newKeyPair().then((keyId) => Promise.all([
  shh.getPublicKey(keyId),
  shh.newMessageFilter({ privateKeyId: keyId }),
]).then(([ publicKey, filterId ]) => {
  // publicKey is Alice's PK on the Whiper protocol; can be used by others to send encrypted
  // messages to her.
  //
  // filterId is a Whisper message filter that is used to fetch messages for this PK
}))
```

```js
web3.eth.sendTransaction({
  from: '0x1111...',                     // Alice's Ethereum address
  to: '0x2222...',
  value: web3.utils.toWei('20', 'gwei'),
  data: web3.utils.toHex(publicKey),    // Alice's public key appended to transaction
  gasLimit: '50000',
})
```


2. Bob geneates and sends his own PK to Alice, encrypting the content with Alice's PK

```js
const payload = {
  myPublicKey: '0x3333333...', // Bob's PK
}

shh.post({
  ttl: 70,
  powTarget: 2.5,
  powTime: 2,
  payload: web3.utils.toHex(JSON.stringify(payload)), // Bob's serialized PK
  pubKey: '0x1111...',                                // Alice's PK (for encryption)
})
```

3. Alice/Bob begin listening for incoming Whisper messages

```js
// This code can be polled regularly to fetch new messages
shh.getFilterMessages(filterId).then((mesgs) => {
  const decodedMesgs = mesgs.map((mesg) => {
    const mesgStr = web3.utils.hexToAscii(mesg.payload)

    return JSON.parse(mesgStr)
  })

  // Use decoded messages hee
})
```

4. Alice initiates a WebRTC connection, sending an `Offer`

```js
const peerConnection = new RTCPeerConnection(config)
peerConnection.createOffer()
  .then((offer) => {
    console.log('Created offer', offer)

    return peerConnection.setLocalDescription(offer).then(() => {
      // Alice sends Bob the serialized offer via Whisper
    })
  })
```

5. Bob receives `Offer`, creates and sends an `Answer` to Alice

```js
peerConnection.setRemoteDescription(offer)
peerConnection.createAnswer()
  .then((answer) => {
    peerConnection.setLocalDescription(answer)
    // Bob sends Alice the answer via Whisper. Alice calls setRemoteDescription once she
    // receives the answer
  })
```

6. Alice/Bob exchange [ICE candidates](https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate), establishing the WebRTC connection

```js
const onIceCandidate = (iceEvt) => {
  if (iceEvt.candidate) {
    // Send candidate to the other side via Whisper
  }
}

peerConnection.onicecandidate = onIceCandidate
```

```js
// When candidate is received on the remote end over Whisper
const receiveCandidate = (candidate) => {
peerConnection.addIceCandidate(candidate)
  .then(() => console.log('Added ice candidate', candidate))
  .catch((err) => console.log('error adding ice candidate', err, candidate))
}
```


