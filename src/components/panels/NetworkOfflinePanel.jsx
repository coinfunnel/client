'use strict'

import React from 'react'

export default class NetworkOfflinePanel extends React.Component {
  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            You are currently offline. Please reconnect to resume mining.
          </div>
        </div>
      </div>
    )
  }
}
