'use strict'

import React from 'react'
import Charity from '../../Charity'

export default class LandingPage extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    const charity = Charity.load()
    if (!charity.id) {
      this.props.history.push('/add')
      return
    }
    this.props.history.push(`/mine/${charity.id}`)
  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            Loading...
          </div>
        </div>
      </div>
    )
  }
}
