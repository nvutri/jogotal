// Link.react-test.js
import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import request from 'request-promise'

import { RequestConfig, RouterContext, LocalStorageMock } from './TestConfig';
import SignUpForm from './SignUpForm';
import App from './App';

Object.defineProperty(window, 'localStorage', { value: LocalStorageMock });

describe('SignUp Form Test', async () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SignUpForm
      />, div);
  });

  it('Create a New user', async () => {
    var authForm = shallow(<App/>, RouterContext);
    var authInstance = authForm.instance();
    var signUpForm = shallow(<SignUpForm
      authenticate={authInstance.authenticate}
      history={[]}
    />, RouterContext);
    var signUpInstance = signUpForm.instance();
    const testEmail = 'testSignup' + Math.round(Math.random() * 100000) + '@yahoo.com';
    const createResult = await signUpInstance.submit({
      'username': testEmail,
      'password': 'testSignup',
      're_password': 'testSignup',
    });
    expect(createResult.errors).toBeUndefined();
    expect(createResult.username).toBe(testEmail);
  });
});
