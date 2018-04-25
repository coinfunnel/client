'use strict'

import React from 'react'

export default class CharityDetailsPanel extends React.Component {
  constructor (props) {
    super(props)
    this.handleCharityDetailsOff = this.handleCharityDetailsOff.bind(this)
  }

  handleCharityDetailsOff () {
    this.props.parent.handleCharityDetailsOff()
  }

  render () {
    return (
      <div className="container">
        <div className="row">
            <div className="col">
              <h1>Charity Details</h1>
              <div>Charity code: {this.props.charity.id}</div>
              <div>Name: {this.props.charity.name}</div>
              <div>Incorporation ID: {this.props.charity.incorporationId}</div>
              <div>Incorporation date: {this.props.charity.incorporationDate}</div>
              <div>Phone: {this.props.charity.phone}</div>
              <div>Email: {this.props.charity.email}</div>
              <div>Website: {this.props.charity.website}</div>
              <div>Address: {this.props.charity.getSingleLineAddress()}</div>
              <div>Country: {this.props.charity.country}</div>
              <div>Description: {this.props.charity.desc}</div>
              <div>{this.props.charity.isOnline}</div>
              <div>{this.props.charity.offlineNotice}</div>
              <button className="btn btn-primary" onClick={this.handleCharityDetailsOff}>OK</button>
            </div>
          </div>
      </div>
    )
  }
}
