'use strict'

import React from 'react'
import ToggleDisplay from 'react-toggle-display'
import Synchronise from '../../Synchronise'
import NetworkOfflinePanel from '../panels/NetworkOfflinePanel.jsx'
import WebsiteTimeoutPanel from '../panels/WebsiteTimeoutPanel.jsx'
import UnknownErrorPanel from '../panels/UnknownErrorPanel.jsx'
import CharityOfflinePanel from '../panels/CharityOfflinePanel.jsx'
import UnknownFailPanel from '../panels/UnknownFailPanel.jsx'
import UpdatingPanel from '../panels/UpdatingPanel.jsx'

let prc = null

export default class AddCharityPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = { 
      charityCode: '',
      panelErrNetworkOffline: false,
      panelErrWebsiteTimeout: false,
      panelErrUnknown: false,
      showFailValidate: false,
      panelFailPermanentDeleted: false,
      panelFailCharityOffline: false,
      panelFailUnknown: false,
      panelAddCharity: false,
      panelUpdating: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    this.setState({
      panelErrNetworkOffline: false,
      panelErrWebsiteTimeout: false,
      panelErrUnknown: false,
      showFailValidate: false,
      panelFailPermanentDeleted: false,
      panelFailCharityOffline: false,
      panelFailUnknown: false,
      panelAddCharity: true,
      panelUpdating: false
    })
  }

  handleError (code) {
    if (code === 'ENOTFOUND') {
      this.setState({ 
        panelUpdating: false,
        panelErrNetworkOffline: true,
        panelAddCharity: true
      })
      return
    }

    if (code === 'ETIMEDOUT' || code === 'ECONNREFUSED') {
      this.setState({
        panelUpdating: false,
        panelErrWebsiteTimeout: true,
        panelAddCharity: true
      })
      return
    }

    console.log('Handling unknown error')
    this.setState({
      panelUpdating: false,
      panelErrUnknown: true,
      panelAddCharity: true
    })
  }

  handleFail (statusCode) {
    if (statusCode === 400) {
      this.setState({ 
        panelUpdating: false,
        showFailValidate: true,
        panelAddCharity: true
      })
      return
    }

    if (statusCode === 404) {
      this.setState({ 
        panelUpdating: false,
        panelFailPermanentDeleted: true,
        panelAddCharity: true
      })
      return
    }

    if (statusCode === 422) {
      this.setState({ 
        panelUpdating: false,
        panelFailCharityOffline: true,
        panelAddCharity: true
      })
      return
    }

    console.log('Handling unknown fail')
    this.setState({ 
      panelUpdating: false,
      panelFailUnknown: true,
      panelAddCharity: true
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
        panelErrNetworkOffline: false,
        panelErrWebsiteTimeout: false,
        panelErrUnknown: false,
        showFailValidate: false,
        panelFailPermanentDeleted: false,
        panelFailCharityOffline: false,
        panelFailUnknown: false,
        panelAddCharity: false,
        panelUpdating: true
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
      <div>
        <ToggleDisplay show={this.state.panelErrNetworkOffline} tag="div">
          <NetworkOfflinePanel />
        </ToggleDisplay>

        <ToggleDisplay show={this.state.panelErrWebsiteTimeout} tag="div">
          <WebsiteTimeoutPanel />
        </ToggleDisplay>

        <ToggleDisplay show={this.state.panelErrUnknown} tag="div">
          <UnknownErrorPanel />
        </ToggleDisplay>

        <ToggleDisplay show={this.state.panelFailCharityOffline} tag="div">
          <CharityOfflinePanel parent={this} />
        </ToggleDisplay>

        <ToggleDisplay show={this.state.panelFailUnknown} tag="div">
          <UnknownFailPanel />
        </ToggleDisplay>

        <ToggleDisplay show={this.state.panelUpdating} tag="div">
          <UpdatingPanel />
        </ToggleDisplay>

        <ToggleDisplay show={this.state.panelAddCharity} tag="div">
          <div className="container">
            <div className="row">
              <div className="col add-section section">

                <h1>Add charity ID</h1>
                
                { this.state.showFailValidate ?
                  <div>
                    FAILED VALIDATION
                  </div>
                : null }

                { this.state.panelFailPermanentDeleted ?
                  <div>
                    The charity has been permanently deleted from the site
                  </div>
                : null }

                <div>
                  <input
                    type="text" 
                    value={this.state.charityCode}
                    onChange={evt => this.updateCharityCode(evt)}
                  />
                  <button className="btn btn-primary" onClick={this.handleSubmit}>Add</button>
                </div>
                
              </div>
            </div>
          </div>
        </ToggleDisplay>
      </div>
    )
  }
}
