'use strict'

import { spawn } from 'child_process'
import { remote } from 'electron'
import env from 'env'
import jetpack from 'fs-jetpack'
import path from 'path'

export default class Miner {
  constructor () {
    this.prc = null
    this.walletAddress = null
   
    const appDir = jetpack.cwd(remote.app.getAppPath())
    if (env.name === "development") {
      this.cmd = path.join(appDir.cwd(), 'miner', 'xmrig.exe')
    } else {
      this.cmd = path.join(appDir.cwd(), '..', 'miner', 'xmrig.exe')
    }
  }

  /*
  // const path = 'C:\\Users\\Administrator\\Downloads\\xmrig-2.6.0-beta2-gcc-win64\\'
  // const binary = `${path}xmrig.exe`
  // const config = `${path}config.json`
  // this.prc = spawn(binary,  ['--user', this.walletAddress])
  */
  start (walletAddress) {
    if (this.prc && this.walletAddress === walletAddress) {
      console.log('Process already started for this wallet')
      return
    }

    if (this.prc) {
      this.stop()
    }

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
      this.prc = null
      this.walletAddress = null
    })
  }

  stop () {
    console.log('Killing process')
    if (this.prc) {
      this.prc.kill()
      this.prc = null
      this.walletAddress = null
    }
  }
}
