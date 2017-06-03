import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import configStore from '../store/configStore';
import routes from '../routes';

const store = configStore();

export default class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <Router routes={routes} history={browserHistory} />
      </Provider>
    );
  }
}

App.PropTypes = {
  store: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
  browserHistory: PropTypes.object.isRequired
};
