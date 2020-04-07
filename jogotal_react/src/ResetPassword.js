import React, { Component } from 'react';
import request from 'request-promise';
import update from 'react-addons-update'; // ES6

import { Alert, Button, Row, Col, Panel } from 'react-bootstrap'
import FRC from 'formsy-react-components';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validationErrors: {},
      saving: false,
      msg: '',
      msgType: 'danger'
    };
  }
  submit(data) {
    const self = this;
    self.setState({
      saving: true,
      msg: ''
    });
    const formData = update(data, {
      $merge: {
        uid: this.props.match.params.uid,
        token: this.props.match.params.token
      }
    })
    const requestInstance = request.defaults(this.props.RequestConfig);
    return requestInstance.post('/auth/password/reset/confirm/').form(formData).then( (response) => {
      self.setState({
        saving: false,
        msg: 'New Password Confirmed. Moving to Login Page in 1 second.',
        msgType: 'success'
      });
      setTimeout(function() {
        self.props.history.push('/login/');
      }, 1000)
    }).catch( (err) => {
      self.setState({
        saving: false,
        validationErrors: err.error,
        msg: err.error ? err.error.non_field_errors : 'Email Failed to Send',
        msgType: 'danger'
      });
    });
  }
  render() {
    return (
      <Row>
        <Col sm={2}/>
        <Col sm={8}>
          <Panel header={<h3 className="text-center">Jogotal Reset Password</h3>} bsStyle="info">
            <FRC.Form
              onSubmit={this.submit.bind(this)} validationErrors={this.state.validationErrors}>
              <fieldset>
                <FRC.Input
                    name="new_password"
                    label="New Password"
                    type="password"
                    validations="minLength:8"
                    validationError="Your new password must be at least 8 characters long."
                    placeholder="New password" required/>
                <FRC.Input
                    name="re_new_password"
                    label="Confirm new password"
                    type="password"
                    validations="equalsField:new_password"
                    validationErrors={{
                        equalsField: 'Passwords must match.'
                    }}
                    placeholder="Retype New Password" required/>
              </fieldset>
              {
                this.state.msg ?
                  <Alert bsStyle={this.state.msgType}>{this.state.msg}</Alert>
                  : ''
              }
              <fieldset>
                <Button className="btn btn-primary center-block" formNoValidate={true} type="submit"
                  disabled={this.state.saving}>
                  {this.state.saving ? 'Updating New Password' : 'Confirm New Password'}</Button>
              </fieldset>
            </FRC.Form>
          </Panel>
        </Col>
      </Row>
    );
  }
}

export default ResetPassword;
