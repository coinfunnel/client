'use strict'

import { spawn } from 'child_process'
import { ipcRenderer } from 'electron'
import { remote } from 'electron'
import env from 'env'
import jetpack from 'fs-jetpack'
import path from 'path'
import request from 'request'

export default class Miner {
  constructor (notifier) {
    this.notifier = notifier
    this.prc = null
    this.walletAddress = null
   
    const appDir = jetpack.cwd(remote.app.getAppPath())
    if (env.name === "development") {
      this.cmd = path.join(appDir.cwd(), 'miner', 'xmrig.exe')
    } else {
      this.cmd = path.join(appDir.cwd(), '..', 'miner', 'xmrig.exe')
    }

    const apiPort = ipcRenderer.sendSync('get-miner-api-port', {})
    const apiRefresh = ipcRenderer.sendSync('get-miner-api-refresh', {})
    const apiTimeout = ipcRenderer.sendSync('get-miner-api-timeout', {})

    this.isPermittedTermination = false
    this.miningInfo = null
    this.miningInfoRefreshId = null
    this.miningInfoRefreshDuration = apiRefresh
    this.miningInfoRefreshTimeout = apiTimeout
    this.miningApiEndpoint = `http://127.0.0.1:${apiPort}`
  }

  refreshMiningInfo () {
    console.log('Query the http mining server...')

    // Check if mining has been stopped and somehow this method was recalled
    // by a timeout that was not cleared.
    if (!this.prc) {
      return
    }

    request(this.miningApiEndpoint, { timeout: this.miningInfoRefreshTimeout }, (err, res, body) => {
      if (err || res.statusCode !== 200) {
        console.log('Error:' + (err) ? err.code : 'None')
        console.log('Status code:' + (res && res.statusCode) ? res.statusCode : 'None')
      }

      if (Object.keys(body).length) {
        const payload = JSON.parse(body)
        this.miningInfo = {
          hashRateTotal3Sec: payload.hashrate.total[0],
          hashRateTotal60Sec: payload.hashrate.total[1],
          hashRateTotal15Min: payload.hashrate.total[2],
          totalHashes: payload.results.hashes_total,
          threadCount: payload.hashrate.threads.length
        }
      }

      this.miningInfoRefreshId = setTimeout(() => {
        this.refreshMiningInfo()
      }, this.miningInfoRefreshDuration)
    })
  }

  start (walletAddress) {
    // Ignore if the miner is already running
    if (this.prc) {
      return
    }

    this.isPermittedTermination = false
    this.walletAddress = walletAddress
    this.prc = spawn(this.cmd, [`--user="${this.walletAddress}"`])
    this.prc.stdout.setEncoding('utf8')

    this.prc.stdout.on('data', (data) => {
      const str = data.toString()
      const lines = str.split(/(\r?\n)/g)
      console.log(lines.join(""))
    })

    this.prc.on('close', (code) => {
      console.log('Process exit code ' + code)
      if (this.isPermittedTermination) {
        return
      }
      this.reset()

      // Notify the consumer of this class that mining has stopped
      // either because the miner process has crashed, or has been
      // terminated by the user or by the OS.
      this.notifier.notifyUnexpectedTermination()
    })

    this.miningInfoRefreshId = setTimeout(() => {
      this.refreshMiningInfo()
    }, 5000)
  }

  isRunning () {
    return this.prc ? true : false
  }

  stop () {
    console.log('Formally killing mining process')
    this.isPermittedTermination = true
    if (this.prc) {
      this.prc.kill()
    }
    this.reset()
  }

  reset () {
    this.prc = null
    this.walletAddress = null
    if (this.miningInfoRefreshId) {
      clearTimeout(this.miningInfoRefreshId)
    }
  }

  // @todo
  // Use this method to display the current hashrate on the screen
  // Pass either the miner, or this method, or the return from this
  // method to the Stats page for display.
  getMiningInfo () {
    if (!this.miningInfo) {
      return {}
    }
    return {
      hashRate: this.miningInfo.hashRate
    }
  }
}
