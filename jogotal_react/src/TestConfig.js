import React from 'react';
import request from 'request-promise'

const TestUser = {
  'username': 'testuser@jogotal.com',
  'password': '42b3f2e2'
};

const RequestConfig = {
  baseUrl: 'http://localhost:8000',  // Test Server.
  json: true,
  auth: TestUser
};

const MockFunction = () => {

};

const RouterContext = {
  context: {
    router: {
      history : {
          createHref: MockFunction,
          push: MockFunction,
          replace: MockFunction
      },
      route: {
        location : {}
      }
    }
  },
  childContextTypes: {router: React.PropTypes.object}
};

var LocalStorageMock = (function() {
  var store = {};
  return {
    getItem: function(key) {
      return store[key];
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    },
    removeItem: function(key) {
      delete store[key];
    }
  };
})();

module.exports = {
  TestUser,
  RequestConfig,
  RouterContext,
  LocalStorageMock
};
