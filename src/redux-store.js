// @flow
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { createLogger } from 'redux-logger'

import { reducer as partnersReducer } from './state/partners'
import { reducer as whisperReducer } from './state/whisper'
import { reducer as messagesReducer } from './state/messages'
import { reducer as videoReducer } from './state/video'

const reducer = combineReducers({
  form: formReducer,
  partners: partnersReducer,
  messages: messagesReducer,
  whisper: whisperReducer,
  video: videoReducer,
})

const logger = createLogger()
const store = createStore(reducer, applyMiddleware(logger))

export default store