import React from 'react'
import { connect } from 'react-redux'
import Json from 'react-json-view'
import TimeAgo from 'react-timeago'

import type { Message, MessagesStore } from '../../state/messages'

type MessageRowProps = {
  message: Message,
}

const MessageRow = (props: MessageRowProps) => {
  const { message } = props
  return (
    <div className="row">
      <div className="col-2">
        <TimeAgo date={new Date(message.timestamp)} />
      </div>
      <div className="col-10" style={{ overflow: 'hidden' }}>
        <Json src={message} name={false} />
      </div>
    </div>
  )
}

type MessageListProps = {
  messages: Message[],
}

const MessageList = (props: MessageListProps) => {
  const { messages } = props

  return (
    <div className="container">
      <div className="row">
        <h4>Messages</h4>
      </div>

      { messages.map((mesg, idx) => <MessageRow key={idx} message={mesg} />)}
    </div>
  )
}

const mapStateToProps = (state: { messages: MessagesStore }) => {
  const { messages } = state

  return { messages }
}

export default connect(mapStateToProps)(MessageList)