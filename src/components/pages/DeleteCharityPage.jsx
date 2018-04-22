'use strict'

import React from 'react'
import Charity from '../../Charity'

export default class DeleteCharityPage extends React.Component {
  constructor (props) {
    super(props)
    this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this)
    this.handleDeleteCancel = this.handleDeleteCancel.bind(this)
  }

  handleDeleteConfirm () {
    Charity.remove()
    this.props.history.push('/add')
  }

  handleDeleteCancel () {
    this.props.history.push(`/mine/${this.props.match.params.charityId}`)
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
