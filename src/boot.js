// @flow
import React from 'react'
import { render } from 'react-dom'

import App from './views/App'

const rootElem = document.getElementById('root')

if (rootElem) {
  render(
    <App />,
    rootElem
  )
}

