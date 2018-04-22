'use strict'

import { ipcRenderer } from 'electron'

export default class Charity {
  constructor (json) {
    this.id = json.id || null
    this.name = json.name || null
    this.country = json.country || null
    this.isOnline = json.isOnline || null
    this.offlineNotice = json.offlineNotice || null
    this.wallet = json.wallet || null
    this.image1 = json.image1 || null
    this.image2 = json.image2 || null
    this.image3 = json.image3 || null
  }

  static load () {
    const json = ipcRenderer.sendSync('get-charity', {})
    return new Charity(json)
  }

  static save (charity) {
    ipcRenderer.sendSync('set-charity', {
      id: charity.id,
      name: charity.name,
      country: charity.country,
      isOnline: charity.isOnline,
      offlineNotice: charity.offlineNotice,
      wallet: charity.wallet
    })
  }

  static remove () {
    ipcRenderer.sendSync('delete-charity', {})
  }
}
