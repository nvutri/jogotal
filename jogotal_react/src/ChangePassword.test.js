// Link.react-test.js
import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import request from 'request-promise'

import { RequestConfig, RouterContext, TestUser } from './TestConfig';
import Password from './Password';
import App from './App';

describe('SignUp Form Test', async () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Password
      />, div);
  });

  it('Change Password', async () => {
    var passwordForm = shallow(<Password
      history={[]}
    />, RouterContext);
    var passwordInstance = passwordForm.instance();
    const createResult = await passwordInstance.submit({
      'current_password': TestUser.password,
      'new_password': TestUser.password,
      're_new_password': TestUser.password,
    });
  });
});
