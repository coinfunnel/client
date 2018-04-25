'use strict'

import React from 'react'
import ToggleDisplay from 'react-toggle-display'
import Charity from '../../Charity'
import Synchronise from '../../Synchronise'
import Miner from '../../Miner'

import MiningDetailsPanel from '../panels/MiningDetailsPanel.jsx'
import CharityDetailsPanel from '../panels/CharityDetailsPanel.jsx'
import DeleteCharityPanel from '../panels/DeleteCharityPanel.jsx'
import UpdatingPanel from '../panels/UpdatingPanel.jsx'
import NetworkOfflinePanel from '../panels/NetworkOfflinePanel.jsx'
import WebsiteTimeoutPanel from '../panels/WebsiteTimeoutPanel.jsx'
import CharityOfflinePanel from '../panels/CharityOfflinePanel.jsx'
import UnknownFailPanel from '../panels/UnknownFailPanel.jsx'
import UnknownErrorPanel from '../panels/UnknownErrorPanel.jsx'

export default class MiningPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      charity: new Charity({}),
      miningInfo: {
        hashRateTotal60Sec: 'Please wait',
        totalHashes: 'Please wait',
        threadCount: 'Please wait'
      },
      msgMinerUnexpectedTerm: false,
      panelDeleteCharity: false,
      panelCharityDetails: false,
      panelErrNetworkOffline: false,
      panelErrWebsiteTimeout: false,
      panelErrUnknown: false,
      panelFailCharityOffline: false,
      panelFailUnknown: false,
      panelActiveMining: false,
      panelMiningStatistics: false,
      panelUpdating: false,
      disableStartBtn: false,
      disableStopBtn: false
    }
    this.synchronise = null
    
    this.handleStart = this.handleStart.bind(this)
    this.handleStop = this.handleStop.bind(this)
    this.handleCharityDetails = this.handleCharityDetails.bind(this)
    this.handleCharityDetailsOff = this.handleCharityDetailsOff.bind(this)
    this.handleMiningStats = this.handleMiningStats.bind(this)
    this.handleMiningStatsOff = this.handleMiningStatsOff.bind(this)
    this.handleDeleteChallenge = this.handleDeleteChallenge.bind(this)
    this.handleDeleteChallengeOff = this.handleDeleteChallengeOff.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.miner = new Miner(this)
  }

  notifyMiningStateUpdate (miningInfo) {
    this.setState({
      miningInfo: {
        hashRateTotal60Sec: miningInfo.hashRateTotal60Sec,
        totalHashes: miningInfo.totalHashes,
        threadCount: miningInfo.threadCount
      }
    })
  }

  /**
   * Called by the miner process when it is terminated unexpectedly.
   */
  notifyUnexpectedTermination () {
    this.handleStop()
    this.setState({
      msgMinerUnexpectedTerm: true
    })
  }

  handleError (code) {
    if (code === 'ENOTFOUND') {
      this.setState({ 
        panelUpdating: false,
        panelErrNetworkOffline: true
      })
      return
    }

    if (code === 'ETIMEDOUT' || code === 'ECONNREFUSED') {
      this.setState({
        panelUpdating: false,
        panelErrWebsiteTimeout: true
      })
      return
    }

    // @todo - turn off sync for this?
    this.setState({
      panelUpdating: false,
      panelErrUnknown: true,
      panelActiveMining: true
    })
  }

  handleFail (statusCode) {
    if (statusCode === 404) {
      this.props.history.push(`/gone`)
      return
    }

    if (statusCode === 422) {
      this.setState({ 
        panelUpdating: false,
        panelFailCharityOffline: true
      })
      return
    }

    // @todo what to display here?
    this.setState({ 
      panelUpdating: false,
      panelFailUnknown: true
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

  handleCharityDetails () {
    this.setState({ 
      panelActiveMining: false,
      panelCharityDetails: true
    })
  }

  handleCharityDetailsOff () {
    this.setState({ 
      panelActiveMining: true,
      panelCharityDetails: false
    })
  }

  handleMiningStats () {
    this.setState({ 
      panelActiveMining: false,
      panelMiningStatistics: true
    })
  }

  handleMiningStatsOff () {
    this.setState({ 
      panelActiveMining: true,
      panelMiningStatistics: false
    })
  }

  handleDelete () {
    this.handleStop()
    Charity.remove()
    this.props.history.push('/add')
  }

  handleDeleteChallenge () {
    this.setState({
      panelActiveMining: false,
      panelDeleteCharity: true
    })
  }

  handleDeleteChallengeOff () {
    this.setState({ 
      panelActiveMining: true,
      panelDeleteCharity: false
    })
  }

  componentDidMount () {
    console.log('Starting synchronisation in mining page')
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
        msgMinerUnexpectedTerm: false,
        panelCharityDetails: false,
        panelErrNetworkOffline: false,
        panelErrWebsiteTimeout: false,
        panelErrUnknown: false,
        panelFailCharityOffline: false,
        panelFailUnknown: false,
        panelActiveMining: false,
        panelMiningStatistics: false,
        panelUpdating: true
      })

      const resource = await this.synchronise.getUrl()
      if (resource.response.statusCode !== 200) {
        this.handleFail(resource.response.statusCode)
        this.miner.stop()
      } else {
        resource.body = resource.body ? JSON.parse(resource.body) : {}
        const charity = new Charity(resource.body)
        Charity.save(charity)

        // Wallet changes will require a miner restart.
        let isWalletChanged = true
        if (this.state.charity) {
          if (this.state.charity.wallet === charity.wallet) {
            isWalletChanged = false
          }
        }

        this.setState({
          charity: charity,
          panelUpdating: false,
          panelActiveMining: true
        })

        // Update the miner.
        if (this.miner.isRunning() && !isWalletChanged) {
          return
        }
        if (this.miner.isRunning()) {
          this.miner.stop()
        }
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
      <div>
        <ToggleDisplay show={this.state.panelUpdating} tag="div">
          <UpdatingPanel />
        </ToggleDisplay>

        <ToggleDisplay show={this.state.panelDeleteCharity} tag="div">
          <DeleteCharityPanel parent={this} />
        </ToggleDisplay>

        <ToggleDisplay show={this.state.panelCharityDetails} tag="div">
          <CharityDetailsPanel parent={this} charity={this.state.charity} />
        </ToggleDisplay>

        <ToggleDisplay show={this.state.panelMiningStatistics} tag="div">
          <MiningDetailsPanel parent={this} miningInfo={this.state.miningInfo} />
        </ToggleDisplay>

        <ToggleDisplay show={this.state.panelErrNetworkOffline} tag="div">
          <NetworkOfflinePanel />
        </ToggleDisplay>

        <ToggleDisplay show={this.state.panelErrWebsiteTimeout} tag="div">
          <WebsiteTimeoutPanel />
        </ToggleDisplay>

        <ToggleDisplay show={this.state.panelFailCharityOffline} tag="div">
          <CharityOfflinePanel parent={this} />
        </ToggleDisplay>

        <ToggleDisplay show={this.state.panelErrUnknown} tag="div">
          <UnknownErrorPanel />
        </ToggleDisplay>

        <ToggleDisplay show={this.state.panelFailUnknown} tag="div">
          <UnknownFailPanel />
        </ToggleDisplay>
        

        <ToggleDisplay show={this.state.panelActiveMining} tag="div">
          <div className="container">
            <div className="row">
              <div className="col mining-section section">
                
                <div className="error-message">
                  <ToggleDisplay show={this.state.msgMinerUnexpectedTerm} tag="div">
                    The mining process either crashed or was termined by the OS.
                    Please click start to attempt to resume mining.
                  </ToggleDisplay>
                </div>

                {this.state.charity.image1 ?
                  <div>
                    <img src={this.state.charity.image1} width="200" height="150" />
                    {this.state.image2 ?
                      <img src={this.state.charity.image2} width="200" height="150" />
                    : null}
                    {this.state.image3 ?
                      <img src={this.state.charity.image3} width="200" height="150" />
                    : null}
                  </div>
                : null}

                <button className="btn btn-primary" disabled={this.state.disableStartBtn} onClick={this.handleStart}>Start mining</button>
                <button className="btn btn-primary" disabled={this.state.disableStopBtn} onClick={this.handleStop}>Stop mining</button>
                <button className="btn btn-primary" onClick={this.handleCharityDetails}>Charity info</button>
                <button className="btn btn-primary" onClick={this.handleMiningStats}>Mining stats</button>
                <button className="btn btn-primary" onClick={this.handleDeleteChallenge}>Delete charity</button>
              </div>
            </div>
          </div>
        </ToggleDisplay>
      </div>
    )
  }
}
