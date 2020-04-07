// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import request from 'request-promise';
import sinon from 'sinon';

import JogTable from './JogTable';
import Auth from './Auth';
import { RouterContext, TestUser, RequestConfig } from './TestConfig';

describe('JogTable', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<JogTable RequestConfig={RequestConfig}/>, RouterContext);
    expect(wrapper.find('input').exists());
  });

  it('Load Value from Server', async () => {
    sinon.spy(JogTable.prototype, 'componentDidMount');
    var wrapper = mount(<JogTable RequestConfig={RequestConfig}/>, RouterContext);
    expect(JogTable.prototype.componentDidMount.calledOnce).toBe(true);
  });
});
