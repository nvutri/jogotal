import React from 'react';
import request from 'request-promise';

import { Alert, Button, Panel } from 'react-bootstrap'
import FRC from 'formsy-react-components';

class UserInsert extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      validationErrors: {},
      saving: false,
      msg: null
    };
  }

  submit(data) {
    const { onSave } = this.props;
    const self = this;
    this.setState({
      saving: true,
      validationErrors: {},
      msg: ''
    });
    const requestInstance = request.defaults(this.props.RequestConfig);
    // Create a new invoice.
    return requestInstance.post('/api/users/').form(data).then( (response) => {
      self.setState({saving: false});
      onSave(data);
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
      <div className='modal-content'>
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
                  required/>
              <br/>
              <FRC.Input
                  name="password"
                  label="Password"
                  type="password"
                  validations="minLength:8"
                  validationError="Your password must be at least 8 characters long."
                  placeholder="Choose a password" required/>
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
                  required/>
            </fieldset>
            <fieldset>
              <Button
                className="btn btn-primary center-block btn-block"
                formNoValidate={true}
                type="submit"
                disabled={this.state.saving}>
                {this.state.saving ? 'Saving': 'Create User'}
              </Button>
            </fieldset>
            {
              this.state.msg ?
                <Alert bsStyle="danger">{this.state.msg}</Alert>
                : ''
            }
          </FRC.Form>
        </Panel>
      </div>
    );
  }
}

export default UserInsert;
