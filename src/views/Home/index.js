// @flow
import React from 'react'

import ChatPartners from './ChatPartners'
import MessageList from './MessageList'

const Jumbotron = () => (
  <div className="jumbotron">
    <div className="container">
      <h1 className="display-4">Shh... Chat</h1>
      <p className="lead">Secure, p2p chat DApp using the Ethereum Whisper protocol</p>
    </div>
  </div>
)

const Home = () => (
  <div className="container">
    <Jumbotron />

    <div className="row">
      <div className="col-8">
        <MessageList />
      </div>
      <div className="col-4">
        <ChatPartners />
      </div>
    </div>
  </div>
)

export default Home