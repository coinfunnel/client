'use strict'

import React from 'react'

export default class WebsiteTimeoutPanel extends React.Component {
  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            The server is timing out, retrying in a few seconds...
          </div>
        </div>
      </div>
    )
  }
}
