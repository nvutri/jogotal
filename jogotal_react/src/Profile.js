import React, { Component } from 'react';
import request from 'request-promise';
import { Alert, Button, Row, Col, Panel } from 'react-bootstrap'
import update from 'react-addons-update'; // ES6
import FRC from 'formsy-react-components';

class Profile extends Component {

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
    return requestInstance.patch('/auth/me/').form(data).then( (response) => {
      self.props.updateUser(response)
      self.setState({
        saving: false,
        validationErrors: {},
        msg: ''
      })
      return response;
    }).catch(function (err) {
      self.setState({
        validationErrors: err.error,
        msg: err.message,
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
                    name="username"
                    label="Email"
                    validations={{
                      isEmail: true
                    }}
                    validationErrors={{
                      isEmail: 'Please enter a valid email address'
                    }}
                    placeholder="What is your email address?"
                    value={this.state.username}
                    disabled/>
                <br/>
                <FRC.Input
                    name="first_name"
                    label="First Name"
                    validations={{
                      minLength: 2
                    }}
                    validationErrors={{
                      minLength: 'Please enter more than 2 characters.'
                    }}
                    placeholder="What is your first name?"
                    value={this.state.first_name}
                    required/>
                <br/>
                <FRC.Input
                    name="last_name"
                    label="Last Name"
                    validations={{
                      minLength: 2
                    }}
                    validationErrors={{
                      minLength: 'Please enter more than 2 characters.'
                    }}
                    placeholder="What is your last name?"
                    value={this.state.last_name}
                    required/>
              </fieldset>
              <fieldset>
                <Button
                  className="btn btn-primary center-block btn-block"
                  formNoValidate={true}
                  type="submit"
                  disabled={this.state.saving}>
                  {this.state.saving ? 'Saving': 'Update Profile'}
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

export default Profile;
