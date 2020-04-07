import React, { Component } from 'react';
import { Alert, Button, Row, Col, Panel } from 'react-bootstrap';
import { Input, Form } from 'formsy-react-components';

import request from 'request-promise';
import { RequestConfig } from './Config';

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validationErrors: {},
      msg: ''
    };
  }
  submit(data) {
    const self = this;
    this.setState({
      validationErrors: {},
      msg: ''
    });
    const requestInstance = request.defaults(RequestConfig);
    return requestInstance.post('/auth/register/').form(data).then( (response) => {
      self.props.authenticate({
        'username': data['username'],
        'password': data['password']
      }).then( (res) => {
        self.props.history.push('/');
        return res;
      }).catch( (err) => {
        self.setState({
          validationErrors: err.error,
          msg: err.error && err.error.non_field_errors ? err.error.non_field_errors : err.message
        });
        return err;
      });
      return response;
    }).catch( (err) => {
      self.setState({
        validationErrors: err.error,
        msg: err.error && err.error.non_field_errors ? err.error.non_field_errors : err.message
      });
      return err;
    });
  }
  render() {
    return (
      <Row>
        <Col sm={2}/>
        <Col sm={8}>
          <Panel header={<h3 className="text-center">Jogotal Sign Up</h3>} bsStyle="info">
            <Form
              onSubmit={this.submit.bind(this)}
              validationErrors={this.state.validationErrors}>
              <fieldset>
                <Input
                    name="username"
                    label="Email"
                    validations={{
                      isEmail: true
                    }}
                    validationErrors={{
                      isEmail: 'Please enter a valid email address'
                    }}
                    placeholder="What is your email address?"
                    required/>
                <br/>
                <Input
                    name="password"
                    label="Password"
                    type="password"
                    validations="minLength:8"
                    validationError="Your password must be at least 8 characters long."
                    placeholder="Choose a password" required/>
                <Input
                    name="re_password"
                    label="Confirm password"
                    type="password"
                    validations="equalsField:password"
                    validationErrors={{
                        equalsField: 'Passwords must match.'
                    }}
                    placeholder="Retype password"
                />
                <br/>
              </fieldset>
              {
                this.state.msg ?
                  <Alert bsStyle="danger">{this.state.msg}</Alert>
                  : ''
              }
              <fieldset>
                <Button className="btn btn-primary center-block btn-block" formNoValidate={true} type="submit">Sign Up</Button>
              </fieldset>
            </Form>
          </Panel>
        </Col>
      </Row>
    )
  }
}

export default SignUpForm
