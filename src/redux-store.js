// @flow
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { createLogger } from 'redux-logger'

import { reducer as partnersReducer } from './state/partners'

const reducer = combineReducers({
  form: formReducer,
  partners: partnersReducer,
})

const logger = createLogger()
const store = createStore(reducer, applyMiddleware(logger))

export default store