// @flow
import React from 'react'
import Web3 from 'web3'

type StateType = {
  isLoaded: bool,
}

type PropsType = {
  children?: any,
}

class App extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props)
    this.state = { isLoaded: false }
  }

  componentWillMount() {
    console.log('componentWillMount')

    window.ethereum.enable()
    window._web3 = new Web3(window.ethereum)
    window._shh = window._web3.shh

    window._web3.eth.getCoinbase().then((coinbase) => {
      window._coinbase = coinbase
      this.setState({ isLoaded: true })
    })

    // const shh = window._web3.shh
    // window._shh = shh
    // shh.newKeyPair().then((keyId) => {
    //   console.log('newKeyPair', keyId)
    //   shh.getPublicKey(keyId).then((pubKey) => {
    //     console.log('pubKey', pubKey)
    //     window._keyId = keyId
    //     window._pubKey = pubKey

    //     shh.newMessageFilter({ privateKeyId: keyId }, (err, messages) => {
    //       console.log('RECV message', messages)
    //       console.log(JSON.stringify(messages))
    //     }).then((filterId) => console.log('FILTER ID', filterId))

    //     this.setState({ pubKey, keyId, isLoaded: true })
    //   })
    // })
  }

  props: PropsType

  render() {
    return (
      <div>
        {this.state.isLoaded && this.props.children}
      </div>
    )
  }
}

export default App