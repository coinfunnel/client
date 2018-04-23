'use strict'

import React from 'react'

export default class CharityOfflinePanel extends React.Component {
  constructor (props) {
    super(props)
    this.handleDelete = this.handleDelete.bind(this)
  }
  handleDelete () {
    this.props.parent.handleDelete()
  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h1>Mining status</h1>
            <p>The charity is temporarily offline. We will keep trying...</p>
            <button className="btn btn-primary" onClick={this.handleDelete}>Delete</button>
          </div>
        </div>
      </div>
    )
  }
}
