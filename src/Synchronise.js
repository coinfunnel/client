'use strict'

import { ipcRenderer } from 'electron'
import request from 'request'

export default class Synchronise {
  constructor (synchronisee, charityId) {
    this.synchronisee = synchronisee

    const appGuid = ipcRenderer.sendSync('get-app-guid', {})
    
    this.charityUrl = ipcRenderer.sendSync('get-charity-url', {})
    this.charityUrl = `${this.charityUrl}/${appGuid}/${charityId}`
    this.charityUrlTimeout = ipcRenderer.sendSync('get-charity-url-timeout', {})

    this.synchId = null
    this.syncDuration = ipcRenderer.sendSync('get-charity-synch-duration', {})
    this.syncDurationRapid = ipcRenderer.sendSync('get-charity-unavailable-synch-duration', {})
  }

  getUrl () {
    console.log(this.charityUrl)
    return new Promise((resolve, reject) => {
      request(this.charityUrl, { timeout: this.charityUrlTimeout }, (err, response, body) => {
        if (err) {
          return reject(err)
        }
        return resolve({ response, body })
      })
    })
  }

  isSyncRequired (statusCode) {
    let returnVal = null
    switch (statusCode) {
      case 200: returnVal = true; break
      case 400: returnVal = false; break
      case 404: returnVal = false; break
      case 422: returnVal = true; break
      case 500:
      default: 
        returnVal = true
    }
    return returnVal
  }

  getNextSyncDuration (statusCode) {
    let duration = null
    switch (statusCode) {
      case 200:
      case 422: 
        duration = this.syncDuration
        break
      case 500:
      default:
        duration = this.syncDurationRapid
        break

    }
    return duration
  }

  getErroredSyncDuration (errorCode) {
    let duration = null
    switch (errorCode) {
      case 'ENOTFOUND': // Network is offline
      case 'ETIMEDOUT': // Website is timing out
      case 'ECONNREFUSED': // Endpoint exists but there is nothing listening on the port
      default:
        duration = this.syncDurationRapid
    }
    return duration
  }

  resynchronise (errorCode, statusCode) {
    console.log('Resyncronising')

    if (statusCode && !this.isSyncRequired(statusCode)) {
      console.log('Resync not required. Stopping.')
      return
    }
    
    let syncDuration = null
    if (statusCode) {
      syncDuration = this.getNextSyncDuration(statusCode)
    } else {
      syncDuration = this.getErroredSyncDuration(errorCode)
    }

    this.synchId = setTimeout(() => {
      this.synchronisee.sync()
    }, syncDuration)
  }

  stopSynchronise () {
    if (this.synchId) {
      clearTimeout(this.synchId)
    }
  }
}
