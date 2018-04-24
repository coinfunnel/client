'use strict'

import { ipcMain } from 'electron'
import Store from 'electron-store'
import env from 'env'

const store = new Store()

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
  store.set('charity.country', charity.country)
  store.set('charity.walletAddress', charity.walletAddress)
  store.set('charity.notice', charity.notice)
  store.set('charity.isMiningAllowed', charity.isMiningAllowed)
  event.returnValue = null
})

ipcMain.on('delete-charity', (event, arg) => {
  // @todo
  // can we just use:  store.delete('charity') ?
  store.delete('charity.id')
  store.delete('charity.name')
  store.delete('charity.country')
  store.delete('charity.walletAddress')
  store.delete('charity.notice')
  store.delete('charity.isMiningAllowed')
  event.returnValue = null
})

// app_sync_duration
// app_notices[]
