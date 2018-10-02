// @flow

export type MessagesStore = string[]

const ADD_MESSAGES = 'state-messages/ADD_MESSAGES'

export const reducer = (
  state: MessagesStore = [],
  action: { type: string, messages?: string[] }
): MessagesStore => {
  switch (action.type) {
    case ADD_MESSAGES:
      return state.slice().concat(action.messages || [])
    default:
      return state
  }
}

export const addMessages = (messages: string[]) => ({
  type: ADD_MESSAGES,
  messages,
})