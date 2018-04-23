'use strict'

import React from 'react'

export default class DeleteCharityPanel extends React.Component {
  constructor (props) {
    super(props)
    this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this)
    this.handleDeleteCancel = this.handleDeleteCancel.bind(this)
  }

  handleDeleteConfirm () {
    this.props.parent.handleDelete()
  }

  handleDeleteCancel () {
    this.props.parent.handleDeleteChallengeOff()
  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div>DO YOU REALLY WANT TO DELETE?</div>
            <button className="btn btn-primary" onClick={this.handleDeleteConfirm}>Yes</button>
            <button className="btn btn-primary" onClick={this.handleDeleteCancel}>No</button>
          </div>
        </div>
      </div>
    )
  }
}
