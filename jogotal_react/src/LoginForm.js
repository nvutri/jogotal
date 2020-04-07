import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Alert, Button, Row, Col, Panel } from 'react-bootstrap'
import { Input, Form } from 'formsy-react-components';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validationErrors: {}
    };
  }
  handleLogIn(authData) {
    const self = this;
    this.props.authenticate(authData).then( (response) => {
      self.props.history.push('/');
    }).catch( (err) => {
      self.setState({
        validationErrors: err.error,
        msg: err.error && err.error.non_field_errors ? err.error.non_field_errors : ''
      });
    });
  }
  render() {
    return (
      <Row>
        <Col sm={2}/>
        <Col sm={8}>
          <Panel header={<h3 className="text-center">Jogotal Login</h3>} bsStyle="info">
            <Form
              onSubmit={this.handleLogIn.bind(this)} validationErrors={this.state.validationErrors}>
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
                    placeholder="What is email address?"
                    required/>
                <br/>
                <Input
                    name="password"
                    label="Password"
                    type="password"
                    validations="minLength:8"
                    validationError="Your password must be at least 8 characters long."
                    placeholder="Choose a password" required/>
              </fieldset>
              {
                this.state.msg ?
                  <Alert bsStyle="danger">{this.state.msg}</Alert>
                  : ''
              }
              <fieldset>
                <Button className="btn btn-primary center-block" formNoValidate={true} type="submit">Login</Button>
              </fieldset>
              <br/>
              <LinkContainer to='/forgotpwd/'>
                <a href="">Forgot Password?</a>
              </LinkContainer>
            </Form>
          </Panel>
        </Col>
      </Row>
    );
  }
}

export default LoginForm;
