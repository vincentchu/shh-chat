// @flow

export type VideoStore = {
  stream: ?MediaStream
}

const InitialState = { stream: undefined }

const ADD_STREAM = 'state-video/ADD_STREAM'

export const reducer = (
  state: VideoStore = InitialState,
  action: { type: string, stream: ?MediaStream }
): VideoStore => {
  switch (action.type) {
    case ADD_STREAM: {
      const { stream } = action

      if (stream && !state.stream) {
        window._stream = stream
        return { stream }
      }

      return state
    }

    default:
      return state
  }
}

export const addStream = (stream: MediaStream) => ({
  type: ADD_STREAM,
  stream,
})