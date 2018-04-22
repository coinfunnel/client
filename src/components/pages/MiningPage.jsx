'use strict'

import React from 'react'
import ToggleDisplay from 'react-toggle-display'
import Charity from '../../Charity'
import Synchronise from '../../Synchronise'
import Miner from '../../Miner'
import NetworkOfflinePanel from '../panels/NetworkOfflinePanel.jsx'
import WebsiteTimeoutPanel from '../panels/WebsiteTimeoutPanel.jsx'
import UnknownErrorPanel from '../panels/UnknownErrorPanel.jsx'
import UnknownFailPanel from '../panels/UnknownFailPanel.jsx'
import UpdatingPanel from '../panels/UpdatingPanel.jsx'

export default class MiningPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      charityId: '',
      name: '',
      country: '',
      isOnline: '',
      offlineNotice: '',
      image1: '',
      image2: '',
      image3: '',
      showErrNetworkOffline: false,
      showErrWebsiteTimeout: false,
      showErrUnknown: false,
      showFailCharityOffline: false,
      showFailUnknown: false,
      showSuccessMining: false,
      showSuccessUpdating: false,
      disableStartBtn: false,
      disableStopBtn: false
    }
    this.synchronise = null
    this.handleStart = this.handleStart.bind(this)
    this.handleStop = this.handleStop.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.miner = new Miner()
  }

  handleError (code) {
    if (code === 'ENOTFOUND') {
      this.setState({ 
        showSuccessUpdating: false,
        showErrNetworkOffline: true
      })
      return
    }

    if (code === 'ETIMEDOUT' || code === 'ECONNREFUSED') {
      this.setState({
        showSuccessUpdating: false,
        showErrWebsiteTimeout: true
      })
      return
    }

    // @todo - turn off sync for this?
    this.setState({
      showSuccessUpdating: false,
      showErrUnknown: true,
      showSuccessMining: true
    })
  }

  handleFail (statusCode) {
    if (statusCode === 404) {
      this.props.history.push(`/gone`)
      return
    }

    if (statusCode === 422) {
      this.setState({ 
        showSuccessUpdating: false,
        showFailCharityOffline: true
      })
      return
    }

    // @todo what to display here?
    this.setState({ 
      showSuccessUpdating: false,
      showFailUnknown: true
    })
  }

  handleStart () {
    this.setState({ 
      disableStartBtn: true,
      disableStopBtn: false
    })
    this.sync()
  }

  handleStop () {
    this.setState({ 
      disableStartBtn: false,
      disableStopBtn: true
    })
    this.synchronise.stopSynchronise()
    this.miner.stop()
  }

  handleDelete () {
    this.handleStop()
    this.props.history.push(`/delete/${this.state.charityId}`)
  }

  componentDidMount () {
    console.log('Starting synchronisation in mining page')
    this.setState({ charityId: this.props.match.params.charityId })
    this.synchronise = new Synchronise(this, this.props.match.params.charityId)
    this.handleStart()
  }

  componentWillUnmount() {
    console.log('Stopping synchronisation in mining page')
    this.handleStop()
  }

  async sync () {
    try {
      console.log('SYNCING...')
      this.setState({
        showErrNetworkOffline: false,
        showErrWebsiteTimeout: false,
        showErrUnknown: false,
        showFailCharityOffline: false,
        showFailUnknown: false,
        showSuccessMining: false,
        showSuccessUpdating: true
      })

      const resource = await this.synchronise.getUrl()
      if (resource.response.statusCode !== 200) {
        this.handleFail(resource.response.statusCode)
        this.miner.stop()
      } else {
        resource.body = resource.body ? JSON.parse(resource.body) : {}
        const charity = new Charity(resource.body)
        charity.id = this.state.charityId
        Charity.save(charity)

        this.setState({
          charityId: charity.id,
          name: charity.name,
          country: charity.country,
          isOnline: charity.isOnline,
          offlineNotice: charity.offlineNotice,
          image1: charity.image1,
          image2: charity.image2,
          image3: charity.image3,
          showSuccessUpdating: false,
          showSuccessMining: true
        })

        this.miner.start(charity.wallet)
      }
      this.synchronise.resynchronise(null, resource.response.statusCode)

    } catch (err) {
      console.log(err)
      this.handleError(err.code)
      this.miner.stop()
      this.synchronise.resynchronise(err.code || null, null)
    }
  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col">

            <div className="mining-section section">
              <h1>Mining status</h1>

              <ToggleDisplay show={this.state.showErrNetworkOffline} tag="div">
                <NetworkOfflinePanel />
              </ToggleDisplay>

              <ToggleDisplay show={this.state.showErrWebsiteTimeout} tag="div">
                <WebsiteTimeoutPanel />
              </ToggleDisplay>

              <ToggleDisplay show={this.state.showErrUnknown} tag="div">
                <UnknownErrorPanel />
              </ToggleDisplay>

              <ToggleDisplay show={this.state.showFailCharityOffline} tag="div">
                The charity is temporarily offline. We will keep trying...
                <br/>
                <button className="btn btn-primary" onClick={this.handleDelete}>Delete</button>
              </ToggleDisplay>

              <ToggleDisplay show={this.state.showFailUnknown} tag="div">
                <UnknownFailPanel />
              </ToggleDisplay>
              
              <ToggleDisplay show={this.state.showSuccessMining} tag="div">
                <div>Charity code: {this.state.charityId}</div>
                <div>Name: {this.state.name}</div>
                <div>Country: {this.state.country}</div>
                <div>{this.state.isOnline}</div>
                <div>{this.state.offlineNotice}</div>
                {this.state.image1 ? 
                  <div>
                    <img src={this.state.image1} width="200" height="150" />
                    {this.state.image2 ?
                      <img src={this.state.image2} width="200" height="150" />
                    : null}
                    {this.state.image3 ?
                      <img src={this.state.image3} width="200" height="150" />
                    : null}
                  </div>
                : null}
                <button className="btn btn-primary" disabled={this.state.disableStartBtn} onClick={this.handleStart}>Start</button>
                <button className="btn btn-primary" disabled={this.state.disableStopBtn} onClick={this.handleStop}>Stop</button>
                <button className="btn btn-primary" onClick={this.handleDelete}>Delete</button>
              </ToggleDisplay>

              <ToggleDisplay show={this.state.showSuccessUpdating} tag="div">
                <UpdatingPanel />
              </ToggleDisplay>
            </div>
            
          </div>
        </div>
      </div>
    )
  }
}
