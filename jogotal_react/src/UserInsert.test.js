// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import request from 'request-promise';
import sinon from 'sinon';

import UserInsert from './UserInsert';
import { RouterContext, TestUser, RequestConfig } from './TestConfig';

describe('UserInsert', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<UserInsert
      history={[]}
    />, RouterContext);
    expect(wrapper.find('input').exists());
  });

  it('Create a User', async () => {
    var insertForm = shallow(<UserInsert
      onSave={ (data) => {} }
      history={[]}
      RequestConfig={RequestConfig}
    />, RouterContext);
    var insertInstance = insertForm.instance();
    const testEmail = 'testSignup' + Math.round(Math.random() * 100000) + '@yahoo.com';
    const createResult = await insertInstance.submit({
      'email': testEmail,
      'username': testEmail,
      'password': 'testSignup',
      'first_name': 'First Name',
      'last_name': 'Last Name'
    });
    expect(createResult.errors).toBeUndefined();
    expect(createResult.email).toBe(testEmail);
  });
});
