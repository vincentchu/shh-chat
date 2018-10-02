// @flow
import React from 'react'
import Web3 from 'web3'

import HandshakeApi from '../handshake-api'

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
    window._handshaker = new HandshakeApi()

    window._web3.eth.getCoinbase().then((coinbase) => {
      window._coinbase = coinbase
      window._web3.eth.getBlockNumber().then((blockNum) => {
        window._initBlockNumber = blockNum

        this.setState({ isLoaded: true })
      })
    })
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