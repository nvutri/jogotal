// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import request from 'request-promise';
import sinon from 'sinon';

import UserManager from './UserManager';
import { RouterContext, TestUser, RequestConfig } from './TestConfig';

describe('UserManager', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<UserManager RequestConfig={RequestConfig}/>, RouterContext);
    expect(wrapper.find('input').exists());
  });

  it('Load Value from Server', async () => {
    sinon.spy(UserManager.prototype, 'componentDidMount');
    var wrapper = mount(<UserManager RequestConfig={RequestConfig}/>, RouterContext);
    expect(UserManager.prototype.componentDidMount.calledOnce).toBe(true);
  });
});
