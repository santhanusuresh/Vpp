import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/login/Login';
import Events from './components/events/Events';
import Fleet from './components/fleet/Fleet';
import EditEvent from './components/edit-event/EditEvent';
import store from './store/store';
import PrivateRoute from './components/common/PrivateRoute';
import PageNotFound from './components/pageNotFound/PageNotFound';

const App = () => {

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute exact path="/events" component={Events} />
          <PrivateRoute exact path="/edit-event" component={EditEvent} />
          <PrivateRoute exact path="/fleet" component={Fleet} />
          <Route exact path="/login" component={Login} />
          <Route component={PageNotFound} />
        </Switch>
      </Router>
    </Provider>
  )
}

export default App

