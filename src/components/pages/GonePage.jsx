'use strict'

import React from 'react'
import Charity from '../../Charity'

export default class GonePage extends React.Component {
  constructor (props) {
    super(props)
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleDelete () {
    Charity.remove()
    this.props.history.push('/add')
  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            The charity has been permanently deleted from the site
            <br/>
            <button className="btn btn-primary" onClick={this.handleDelete}>OK</button>
          </div>
        </div>
      </div>
    )
  }
}
