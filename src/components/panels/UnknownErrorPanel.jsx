'use strict'

import React from 'react'

export default class UnknownErrorPanel extends React.Component {
  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            An error occurred, retrying in a few seconds...
          </div>
        </div>
      </div>
    )
  }
}
