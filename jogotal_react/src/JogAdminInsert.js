import React from 'react';
import moment from 'moment';
import request from 'request-promise';
import update from 'react-addons-update'; // ES6

import { Alert, Col, Button, Panel, Row } from 'react-bootstrap'
import InputMoment from 'input-moment';
import FRC from 'formsy-react-components';
import Select from 'react-select'
import 'react-select/dist/react-select.css';

class JogAdminInsert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validationErrors: {},
      saving: false,
      msg: null,
      user: null,
      input_m: moment(),
      recorded: moment().format('LLLL'),
      userOptions: [],
      eventCounter: 0
    };
  }

  componentDidMount() {
    this.searchUser('');
  }

  searchUser(input) {
    const self = this;
    const requestInstance = request.defaults(this.props.RequestConfig);
    // Create a new invoice.
    return requestInstance.get(`/api/users/?search=${input}`).then( (response) => {
      const options = response.results.map( (option) => {
        return {
          'value': option.id,
          'label': `${option.username}: ${option.first_name} ${option.last_name}`
        }
      });
      self.setState({
        userOptions: options
      })
    });
  }
  loadUsers(input) {
    if (input && input.length > 0) {
      const thisCounter = ++this.state.eventCounter;
      const self = this;
      setTimeout(() => {
        if (thisCounter === this.state.eventCounter) {
          self.searchUser(input);
        }
      }, 500);
    }
  }
  submit(data) {
    const { onSave } = this.props;
    const self = this;
    const formData = update(data, {
      $merge: {
        recorded: this.state.input_m.toISOString(),
        user: this.state.user
      }
    });
    const requestInstance = request.defaults(this.props.RequestConfig);
    // Create a new jog.
    this.setState({saving: true, msg: ''});
    return requestInstance.post('/api/jogs/').form(formData).then( (response) => {
      self.setState({
        saving: false,
        validationErrors: {},
        msg: ''
      });
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

  handleTimeChange(m) {
    this.setState({
      input_m: m,
      recorded: m.format('LLLL')
    });
  }

  render() {
    const panelHeader = <h3 className="text-center">Create a Jog</h3>
    return (
      <div className='modal-content'>
        <Panel header={panelHeader} bsStyle="info">
          <FRC.Form
            onValidSubmit={this.submit.bind(this)}
            validationErrors={this.state.validationErrors}>
            <FRC.Row>
              <Col sm={3}/>
              <Col sm={9}>
                <InputMoment
                  moment={this.state.input_m}
                  onChange={this.handleTimeChange.bind(this)}
                />
              </Col>
            </FRC.Row>
            <FRC.Input
              name="recorded"
              label="Recorded"
              value={this.state.recorded}
              disabled
            />
            <FRC.Row>
              <label className="control-label col-sm-3">
                Jogger {this.state.user}
              </label>
              <Col sm={9}>
                <Select
                    name="user"
                    value={this.state.user}
                    options={this.state.userOptions}
                    onInputChange={this.loadUsers.bind(this)}
                    onChange={ selectedOption => this.setState({
                      user: selectedOption ? selectedOption.value: selectedOption
                    }) }
                    disabled={this.state.saving}
                    required
                />
              </Col>
            </FRC.Row>
            <FRC.Input
              style={{zIndex: 0}}
              name="distance"
              label="Distance"
              type="number"
              addonAfter="miles"
              disabled={this.state.saving}
              required
            />
            <FRC.Input
              style={{zIndex: 0}}
              name="duration"
              label="Duration"
              type="number"
              addonAfter="hours"
              disabled={this.state.saving}
              required
            />
            <Row>
              <Col sm={3}/>
              <Col sm={6}>
                <Button bsStyle="primary"
                  block={true}
                  formNoValidate={true}
                  type="submit"
                  disabled={ this.state.saving }>
                  {this.state.saving ? 'Saving' : 'Create'}
                </Button>
              </Col>
            </Row>
          </FRC.Form>
          {
            this.state.msg ?
              <Alert bsStyle="danger">{this.state.msg}</Alert>
              : ''
          }
        </Panel>
      </div>
    );
  }
}

export default JogAdminInsert;
