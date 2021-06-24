import React from 'react'
import { BrowserRouter as Router, Switch ,Redirect, Route } from 'react-router-dom'
import Login from '../Pages/Login/Login'
import InnerRoutes from './InnerRoutes'
export default function Routes() {
    return (
      <>
        <Router>
        <Switch >
        <Route exact path="/admin/" component={Login}/>
          <Route  exact path="/">
            <Redirect to='/admin/' />
          </Route>
             <InnerRoutes/>
          </Switch>
        </Router>
        </>

    )
}
