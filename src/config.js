'use strict'

import { ipcMain } from 'electron'
import Store from 'electron-store'
import env from 'env'

const store = new Store({ encryptionKey: 'providesomeobscurity' })

ipcMain.on('get-miner-api-port', (event, arg) => {
  event.returnValue = env.api_port
})

ipcMain.on('get-miner-api-refresh', (event, arg) => {
  event.returnValue = env.api_refresh
})

ipcMain.on('get-miner-api-timeout', (event, arg) => {
  event.returnValue = Number(env.api_timeout)
})

ipcMain.on('get-app-guid', (event, arg) => {
  event.returnValue = store.get('app_guid', null)
})

ipcMain.on('set-app-guid', (event, guid) => {
  store.set('app_guid', guid)
  event.returnValue = null
})

ipcMain.on('get-charity-sync-duration', (event, arg) => {
  const duration = store.get('charity_sync_duration', env.charity_sync_duration)
  event.returnValue = Number(duration)
})

ipcMain.on('get-charity-unavailable-sync-duration', (event, arg) => {
  const duration = store.get('charity_unavailable_sync_duration', env.charity_unavailable_sync_duration)
  event.returnValue = Number(duration)
})

ipcMain.on('get-charity-url', (event, arg) => {
  event.returnValue = store.get('charity_url', env.charity_url)
})

ipcMain.on('get-charity-url-timeout', (event, arg) => {
  const timeout = store.get('charity_url_timeout', env.charity_url_timeout)
  event.returnValue = Number(timeout)
})

ipcMain.on('get-charity', (event, arg) => {
  event.returnValue = store.get('charity', {})
})

ipcMain.on('set-charity', (event, charity) => {
  store.set('charity.id', charity.id)
  store.set('charity.name', charity.name)
  store.set('charity.incorporationId', charity.incorporationId)
  store.set('charity.incorporationDate', charity.incorporationDate)
  store.set('charity.phone', charity.phone)
  store.set('charity.email', charity.email)
  store.set('charity.website', charity.website)
  store.set('charity.address1', charity.address1)
  store.set('charity.address2', charity.address2)
  store.set('charity.address3', charity.address3)
  store.set('charity.country', charity.country)
  store.set('charity.desc', charity.desc)
  store.set('charity.image1', charity.image1)
  store.set('charity.image2', charity.image2)
  store.set('charity.image3', charity.image3)
  store.set('charity.isOnline', charity.isOnline)
  store.set('charity.offlineNotice', charity.offlineNotice)
  store.set('charity.wallet', charity.wallet)
  event.returnValue = null
})

ipcMain.on('delete-charity', (event, arg) => {
  store.delete('charity')
  event.returnValue = null
})
