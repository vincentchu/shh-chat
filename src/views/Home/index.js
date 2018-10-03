// @flow
import React from 'react'

import ChatPartners from './ChatPartners'
import MessageList from './MessageList'

const Jumbotron = () => (
  <div className="jumbotron" style={{ padding: '10px' }}>
    <div className="container">
      <h1 className="display-4">Shh... Chat</h1>
      <p className="lead">P2P Video Chat DApp using the Ethereum Whisper protocol and WebRTC</p>
    </div>
  </div>
)

const Home = () => (
  <div className="container-fluid">
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