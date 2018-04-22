'use strict'

import "./stylesheets/main.css"

// Small helpers you might want to keep
import "./helpers/context_menu.js"
import "./helpers/external_links.js"

import { remote, ipcRenderer } from "electron"
import env from "env"
import jetpack from "fs-jetpack"
import React from 'react'
import ReactDOM from 'react-dom'
import AppRoutes from './components/AppRoutes.jsx'
const uuidv3 = require('uuid/v3')

const app = remote.app
const appDir = jetpack.cwd(app.getAppPath())

// Holy crap! This is browser window with HTML and stuff, but I can read
// files from disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read("package.json", "json");

const osMap = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux"
};

/*
document.querySelector("#app").style.display = "block";
document.querySelector("#greet").innerHTML = 'Hello world!'
document.querySelector("#os").innerHTML = osMap[process.platform];
document.querySelector("#author").innerHTML = manifest.author;
document.querySelector("#env").innerHTML = env.name;
document.querySelector("#electron-version").innerHTML =
  process.versions.electron;
*/

// If this is the first run of the app then create a guid to uniqely
// identify the app on the server.
const guid = ipcRenderer.sendSync('get-app-guid', {})
if (!guid) {
  ipcRenderer.sendSync('set-app-guid', uuidv3(env.domain, uuidv3.DNS))
}

window.onload = () => {
  ReactDOM.render(<AppRoutes/>, document.getElementById('root'))
}
