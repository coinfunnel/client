'use strict'

import React from 'react'

export default class UnknownFailPanel extends React.Component {
  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            The server is experiencing problems, retrying in a few seconds...
          </div>
        </div>
      </div>
    )
  }
}
