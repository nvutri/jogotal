// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import request from 'request-promise';
import sinon from 'sinon';

import Auth from './Auth';
import { RouterContext, TestUser } from './TestConfig';

describe('Auth', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<Auth
      history={[]}
      />, RouterContext);
  });

  it('Authenticate with Server', async () => {
    const authForm = mount(<Auth
      history={[]}
    />, RouterContext);
    var authInstance = authForm.instance();
    const authResult = await authInstance.authenticate(TestUser);
    expect(authResult.username).toBe(TestUser.username);
  });
});
