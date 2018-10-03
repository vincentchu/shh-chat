import React from 'react'
import { connect } from 'react-redux'
import Json from 'react-json-view'
import TimeAgo from 'react-timeago'

import type { Message, MessagesStore } from '../../state/messages'
import type { VideoStore } from '../../state/video'

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

type VideoProps = {
  video: MediaStream,
}

const Video = (props: VideoProps) => {
  const { video } = props

  return (
    <div className="row">
      <h4>WebRTC Video</h4>
      <video
        style={{ width: '100%', height: '80%' }}
        src={URL.createObjectURL(video)} autoPlay playsinline controls muted
      />
    </div>
  )
}

type MessageListProps = {
  messages: Message[],
  video: ?MediaStream,
}

const MessageList = (props: MessageListProps) => {
  const { messages, video } = props

  return (
    <div className="container">
      { video && <Video video={video} />}

      <div className="row">
        <h4>Messages</h4>
      </div>

      { messages.map((mesg, idx) => <MessageRow key={idx} message={mesg} />)}
    </div>
  )
}

const mapStateToProps = (state: { messages: MessagesStore, video: VideoStore }) => {
  const { messages, video } = state

  return { messages, video: video.stream }
}

export default connect(mapStateToProps)(MessageList)