// @flow

export type WhisperKey = {
  keyId: ?string,
  publicKey: ?string,
  filterId: ?string,
}

const UPDATE_KEY = 'state-whisper/UPDATE_KEY'

const InitialState = {
  keyId: undefined,
  publicKey: undefined,
  filterId: undefined,
}

export const reducer = (
  state: WhisperKey = InitialState,
  action: { type: string, newKey?: WhisperKey }
): WhisperKey => {
  switch (action.type) {
    case UPDATE_KEY:
      return {
        ...state,
        ...action.newKey,
      }

    default:
      return state
  }
}

export const updateKey = (newKey: WhisperKey) => ({
  type: UPDATE_KEY,
  newKey,
})
