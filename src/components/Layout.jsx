'use strict'

import React from 'react'

export default class Layout extends React.Component {
  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col">

            <header>
              {/*<p><a href="http://electron.atom.io" className="js-external-link">Electron</a> app running on this <strong id="os"></strong> machine.</p>*/}
            </header>

            <div className="children">{this.props.children}</div>

            <footer>
            </footer>
          </div>
        </div>
      </div>
    )
  }
}
