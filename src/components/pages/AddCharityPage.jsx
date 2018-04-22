'use strict'

import React from 'react'
import Synchronise from '../../Synchronise'

let prc = null

export default class AddCharityPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = { 
      charityCode: '',
      showErrNetworkOffline: false,
      showErrWebsiteTimeout: false,
      showErrUnknown: false,
      showFailValidate: false,
      showFailPermanentDeleted: false,
      showFailCharityOffline: false,
      showFailUnknown: false,
      showSuccessAdd: false,
      showSuccessUpdating: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    this.setState({
      showErrNetworkOffline: false,
      showErrWebsiteTimeout: false,
      showErrUnknown: false,
      showFailValidate: false,
      showFailPermanentDeleted: false,
      showFailCharityOffline: false,
      showFailUnknown: false,
      showSuccessAdd: true,
      showSuccessUpdating: false
    })
  }

  handleError (code) {
    if (code === 'ENOTFOUND') {
      this.setState({ 
        showSuccessUpdating: false,
        showErrNetworkOffline: true,
        showSuccessAdd: true
      })
      return
    }

    if (code === 'ETIMEDOUT' || code === 'ECONNREFUSED') {
      this.setState({
        showSuccessUpdating: false,
        showErrWebsiteTimeout: true,
        showSuccessAdd: true
      })
      return
    }

    console.log('Handling unknown error')
    this.setState({
      showSuccessUpdating: false,
      showErrUnknown: true,
      showSuccessAdd: true
    })
  }

  handleFail (statusCode) {
    if (statusCode === 400) {
      this.setState({ 
        showSuccessUpdating: false,
        showFailValidate: true,
        showSuccessAdd: true
      })
      return
    }

    if (statusCode === 404) {
      this.setState({ 
        showSuccessUpdating: false,
        showFailPermanentDeleted: true,
        showSuccessAdd: true
      })
      return
    }

    if (statusCode === 422) {
      this.setState({ 
        showSuccessUpdating: false,
        showFailCharityOffline: true,
        showSuccessAdd: true
      })
      return
    }

    console.log('Handling unknown fail')
    this.setState({ 
      showSuccessUpdating: false,
      showFailUnknown: true,
      showSuccessAdd: true
    })
  }

  updateCharityCode (evt) {
    this.setState({ charityCode: evt.target.value })
  }

  async handleSubmit () {
    if (!this.state.charityCode) {
      return
    }
    this.synchronise = new Synchronise(this, this.state.charityCode)
    await this.sync()
  }

  async sync () {
    try {
      console.log('ADD SYNCING...')
      this.setState({
        showErrNetworkOffline: false,
        showErrWebsiteTimeout: false,
        showErrUnknown: false,
        showFailValidate: false,
        showFailPermanentDeleted: false,
        showFailCharityOffline: false,
        showFailUnknown: false,
        showSuccessAdd: false,
        showSuccessUpdating: true
      })

      const resource = await this.synchronise.getUrl()
      if (resource.response.statusCode !== 200) {
        this.handleFail(resource.response.statusCode)
        return
      }
      this.props.history.push(`/mine/${this.state.charityCode}`)

    } catch (err) {
      this.handleError(err.code || null)
    }
  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col">

            <div className="add-section section">
              <h1>Add charity ID</h1>

              { this.state.showErrNetworkOffline ?
                <div>
                  You are currently offline. Please reconnect to resume mining.
                </div>
              : null }

              { this.state.showErrWebsiteTimeout ?
                <div>
                  The server timed out. Please try again.
                </div>
              : null }

              { this.state.showErrUnknown ?
                <div>
                  An error occurred. Please try again.
                </div>
              : null }

              
              { this.state.showFailValidate ?
                <div>
                  FAILED VALIDATION
                </div>
              : null }

              { this.state.showFailPermanentDeleted ?
                <div>
                  The charity has been permanently deleted from the site
                </div>
              : null }

              { this.state.showFailCharityOffline ?
                <div>
                  The charity is temporarily offline
                </div>
              : null }

              { this.state.showFailUnknown ?
                <div>
                  Something went wrong. Please try again.
                </div>
              : null }


              { this.state.showSuccessAdd ?
                <div>
                  <input
                    type="text" 
                    value={this.state.charityCode}
                    onChange={evt => this.updateCharityCode(evt)}
                  />
                  <button className="btn btn-primary" onClick={this.handleSubmit}>Add</button>
                </div>
              : null }

              { this.state.showSuccessUpdating ?
                <div>
                  UPDATING!!!!!
                </div>
              : null }
            </div>
            
          </div>
        </div>
      </div>
    )
  }
}
