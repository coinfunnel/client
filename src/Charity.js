'use strict'

import { ipcRenderer } from 'electron'

export default class Charity {
  constructor (json) {
    this.id = json.id || null
    this.name = json.name || null
    this.incorporationId = json.incorporationId || null
    this.incorporationDate = json.incorporationDate || null
    this.phone = json.phone || null
    this.email = json.email || null
    this.website = json.website || null
    this.address1 = json.address1 || null
    this.address2 = json.address2 || null
    this.address3 = json.address3 || null
    this.country = json.country || null
    this.desc = json.desc ? JSON.parse(json.desc) : null
    this.image1 = json.image1 || null
    this.image2 = json.image2 || null
    this.image3 = json.image3 || null
    this.isOnline = json.isOnline || null
    this.offlineNotice = json.offlineNotice || null
    this.wallet = json.wallet || null
  }

  getSingleLineAddress() {
    if (!this.address1) {
      return ''
    }
    if (!this.address2) {
      return this.address1
    }
    if (!this.address3) {
      return `${this.address1}, ${this.address2}`
    }
    return `${this.address1}, ${this.address2}, ${this.address3}`
  }

  static load () {
    const json = ipcRenderer.sendSync('get-charity', {})
    return new Charity(json)
  }

  static save (charity) {
    ipcRenderer.sendSync('set-charity', {
      id: charity.id,
      name: charity.name,
      incorporationId: charity.incorporationId,
      incorporationDate: charity.incorporationDate,
      phone: charity.phone,
      email: charity.email,
      website: charity.website,
      address1: charity.address1,
      address2: charity.address2,
      address3: charity.address3,
      country: charity.country,
      desc: JSON.stringify(charity.desc),
      image1: charity.image1,
      image2: charity.image2,
      image3: charity.image3,
      isOnline: charity.isOnline,
      offlineNotice: charity.offlineNotice,
      wallet: charity.wallet
    })
  }

  static remove () {
    ipcRenderer.sendSync('delete-charity', {})
  }
}
