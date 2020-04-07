import React, { Component } from 'react';
import request from 'request-promise';

import { Alert, Button, Row, Col, Panel } from 'react-bootstrap'
import { Input, Form } from 'formsy-react-components';

class ForgotPassword extends Component {
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
    const requestInstance = request.defaults(this.props.RequestConfig);
    return requestInstance.post('/auth/password/reset/').form(data).then( (response) => {
      self.setState({
        saving: false,
        msg: 'Email Sent. Please check your email box and follow the instruction.',
        msgType: 'success'
      });
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
          <Panel header={<h3 className="text-center">Jogotal Forgot Password</h3>} bsStyle="info">
            <Form
              onSubmit={this.submit.bind(this)} validationErrors={this.state.validationErrors}>
              <fieldset>
                <Input
                    name="email"
                    label="Email"
                    validations={{
                      isEmail: true
                    }}
                    validationErrors={{
                      isEmail: 'Please enter a valid email address'
                    }}
                    placeholder="What is email address?"
                    disabled={this.state.saving}
                    required/>
              </fieldset>
              {
                this.state.msg ?
                  <Alert bsStyle={this.state.msgType}>{this.state.msg}</Alert>
                  : ''
              }
              <fieldset>
                <Button className="btn btn-primary center-block" formNoValidate={true} type="submit"
                  disabled={this.state.saving}>
                  {this.state.saving ? 'Sending Reset Email... Please Wait' : 'Send Reset Email'}</Button>
              </fieldset>
            </Form>
          </Panel>
        </Col>
      </Row>
    );
  }
}

export default ForgotPassword;
