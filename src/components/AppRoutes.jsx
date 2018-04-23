'use strict'

import React from 'react'
import { MemoryRouter, Route, Switch } from 'react-router-dom'
import Layout from './Layout.jsx'
import LandingPage from './pages/LandingPage.jsx'
import AddCharityPage from './pages/AddCharityPage.jsx'
import MiningPage from './pages/MiningPage.jsx'
import GonePage from './pages/GonePage.jsx'

export default class AppRoutes extends React.Component {
  render() {
    return (
      <MemoryRouter>
        <Layout>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/add" component={AddCharityPage} />
            <Route exact path="/mine/:charityId" component={MiningPage} />
            <Route exact path="/gone" component={GonePage} />
          </Switch>
        </Layout>
      </MemoryRouter>
    )
  }
}
