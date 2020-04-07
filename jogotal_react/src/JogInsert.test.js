// Link.react-test.js
import React from 'react';
import moment from 'moment';
import { mount, shallow } from 'enzyme';
import request from 'request-promise';
import sinon from 'sinon';

import JogInsert from './JogInsert';
import Auth from './Auth';
import { RouterContext, TestUser, RequestConfig } from './TestConfig';

describe('JogInsert', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<JogInsert
      history={[]}
      RequestConfig={RequestConfig}
    />, RouterContext);
    expect(wrapper.find('input').exists());
  });

  it('Create a Jog', async () => {
    var insertForm = shallow(<JogInsert
      onSave={ (data) => {} }
      user={{id: 8}}
      history={[]}
      RequestConfig={RequestConfig}
    />, RouterContext);
    var insertInstance = insertForm.instance();
    const testEmail = 'testSignup' + Math.round(Math.random() * 100000) + '@yahoo.com';
    const createResult = await insertInstance.submit({
      'recorded': moment().toISOString(),
      'distance': Math.round(Math.random() * 50),
      'duration': Math.round(Math.random() * 10)
    });
    expect(createResult.errors).toBeUndefined();
    expect(createResult.id).toBeGreaterThan(0);
    expect(createResult.user).toBe(8);
  });
});
