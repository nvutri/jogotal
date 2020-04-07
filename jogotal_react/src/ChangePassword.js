import React, { Component } from 'react';
import request from 'request-promise';
import { Alert, Button, Row, Col, Panel } from 'react-bootstrap'
import update from 'react-addons-update'; // ES6
import FRC from 'formsy-react-components';

class ChangePassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      validationErrors: {},
      saving: false,
      msg: null,
    };
    if (props.user) {
      this.state = update(this.state, {
        $merge: props.user
      })
    }
  }

  submit(data) {
    const self = this;
    this.setState({
      saving: true,
      validationErrors: {},
      msg: ''
    });
    const requestInstance = request.defaults(this.props.RequestConfig);
    return requestInstance.post('/auth/password/').form(data).then( (response) => {
      self.setState({
        saving: false,
        msg: '',
        validationErrors: {},
      });
      return response;
    }).catch(function (err) {
      self.setState({
        validationErrors: err.error,
        msg: err.error.non_field_errors,
        saving: false
      });
      return err;
    });
  }

  render() {
    return (
      <Row>
        <Col sm={2}/>
        <Col sm={8}>
          <Panel header={<h3 className="text-center">Create New Jogotaler</h3>} bsStyle="info">
            <FRC.Form
              onSubmit={this.submit.bind(this)}
              validationErrors={this.state.validationErrors}>
              <fieldset>
                <FRC.Input
                    name="current_password"
                    label="Current Password"
                    type="password"
                    validations="minLength:8"
                    validationError="Your password must be at least 8 characters long."
                    placeholder="Current password" required/>
                <FRC.Input
                    name="new_password"
                    label="New Password"
                    type="password"
                    validations="minLength:8"
                    validationError="Your new password must be at least 8 characters long."
                    placeholder="New password"
                    required/>
                <FRC.Input
                    name="re_new_password"
                    label="Confirm new password"
                    type="password"
                    validations="equalsField:new_password"
                    validationErrors={{
                        equalsField: 'Passwords must match.'
                    }}
                    placeholder="Retype New Password"
                    required/>
              </fieldset>
              <fieldset>
                <Button
                  className="btn btn-primary center-block btn-block"
                  formNoValidate={true}
                  type="submit"
                  disabled={this.state.saving}>
                  {this.state.saving ? 'Saving': 'Change Password'}
                </Button>
              </fieldset>
              {
                this.state.msg ?
                  <Alert bsStyle="danger">{this.state.msg}</Alert>
                  : ''
              }
            </FRC.Form>
          </Panel>
        </Col>
      </Row>
    )
  }
}

export default ChangePassword;
