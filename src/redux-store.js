// @flow
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { createLogger } from 'redux-logger'

const reducer = combineReducers({ form: formReducer })

const logger = createLogger()
const store = createStore(reducer, applyMiddleware(logger))

export default store