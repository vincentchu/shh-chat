// @flow
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import store from './redux-store'
import App from './views/App'
import Home from './views/Home'

const rootElem = document.getElementById('root')

if (rootElem) {
  render(
    <Provider store={store}>
      <App>
        <Router>
          <Switch>
            <Route path="/" component={Home} exact />
          </Switch>
        </Router>
      </App>
    </Provider>,
    rootElem
  )
}

