import React, { Component } from 'react';
import request from 'request-promise';
import update from 'react-addons-update'; // ES6

import { RequestConfig } from './Config';

class Auth extends Component {

  /**
   * Check if the current user is a user manager.
   * @return {Boolean} [description]
   */
  isUserManager() {
    if (this.state.user && this.state.user.is_staff) {
      return true;
    }
    if (this.state.user && this.state.user.groups) {
      return this.state.user.groups.indexOf('User Manager') > -1;
    }
    return false;
  }

  authenticate(authData) {
    const requestInstance = request.defaults(RequestConfig);
    const self = this;
    return requestInstance.post('/auth/login/').form(authData).then( (res) => {
      localStorage.setItem('auth_token', res.auth_token);
      self.authUser(res.auth_token);
      return res;
    });
  }

  removeAuth() {
    const requestInstance = request.defaults(this.state.RequestConfig);
    localStorage.removeItem('auth_token');
    const self = this;
    // Cancel backend session.
    return requestInstance.post('/auth/logout/').then( (res) => {
      self.setState({
        authenticated: false,
        user: null,
        RequestConfig: RequestConfig
      });
      window.location = '/';
      return res
    });
  }

  authUser(authToken) {
    const requestConfig = update(RequestConfig, {
      headers: {
        $set: {
          'Authorization': `Token ${authToken}`
        }
      }
    });
    const requestInstance = request.defaults(requestConfig);
    const self = this;
    return requestInstance.get('/auth/me/').then( (res) => {
      self.setState({
        authenticated: true,
        user: res,
        RequestConfig: requestConfig
      });
      return res;
    });
  }

  updateUser(newUser) {
    this.setState({user: newUser});
  }

  render() {
    return <div/>
  }
}

export default Auth;
