// @flow

export type Message = {
  timestamp: number,
  messageType: string,
  payload: Object,
}

export type MessagesStore = Message[]

const ADD_MESSAGES = 'state-messages/ADD_MESSAGES'

const InitialState = [
  // {
  //   timestamp: new Date().getTime(),
  //   messageType: 'START',
  //   payload: { foo: 'bar', baz: 'bif' },
  // },
]

export const reducer = (
  state: MessagesStore = InitialState,
  action: { type: string, messages?: Message[] }
): MessagesStore => {
  switch (action.type) {
    case ADD_MESSAGES:
      return state.slice().concat(action.messages || [])
    default:
      return state
  }
}

export const addMessages = (messages: Message[]) => ({
  type: ADD_MESSAGES,
  messages,
})