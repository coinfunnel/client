'use strict'

import React from 'react'

export default class MiningDetailsPanel extends React.Component {
  constructor (props) {
    super(props)
    this.handleMiningStatsOff = this.handleMiningStatsOff.bind(this)
  }

  handleMiningStatsOff () {
    this.props.parent.handleMiningStatsOff()
  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h1>Mining Statistics</h1>
            <div>Hash rate (number of guesses per second): {this.props.miningInfo.hashRateTotal60Sec}</div>
            <div>Total hashes (total guesses): {this.props.miningInfo.totalHashes}</div>
            <div>Number of CPU cores used: {this.props.miningInfo.threadCount}</div>
            <button className="btn btn-primary" onClick={this.handleMiningStatsOff}>OK</button>
          </div>
        </div>
      </div>
    )
  }
}
