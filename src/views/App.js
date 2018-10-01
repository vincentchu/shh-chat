// @flow
import React from 'react'
import Web3 from 'web3'

type StateType = {
  isLoaded: bool,
  keyId: ?string,
  pubKey: ?string,
}

type PropsType = {
  children?: any,
}

class App extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props)
    this.state = {
      isLoaded: true,
      keyId: undefined,
      pubKey: undefined,
    }
  }

  componentWillMount() {
    console.log('componentWillMount')
    window.ethereum.enable()
    window._web3 = new Web3(window.ethereum)

    // const host = (window.location.search === '') ? 'http://localhost:8101' : 'http://localhost:8102'
    // console.log('USING HOST:', host)
    // window._web3 = new Web3(new Web3.providers.HttpProvider(host))

    const shh = window._web3.shh
    window._shh = shh
    shh.newKeyPair().then((keyId) => {
      console.log('newKeyPair', keyId)
      shh.getPublicKey(keyId).then((pubKey) => {
        console.log('pubKey', pubKey)
        window._keyId = keyId
        window._pubKey = pubKey

        shh.newMessageFilter({ privateKeyId: keyId }, (err, messages) => {
          console.log('RECV message', messages)
          console.log(JSON.stringify(messages))
        }).then((filterId) => console.log('FILTER ID', filterId))

        this.setState({ pubKey, keyId, isLoaded: true })
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