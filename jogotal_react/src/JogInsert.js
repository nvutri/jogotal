import React from 'react';
import moment from 'moment';
import request from 'request-promise';

import { Alert, Col, Button, Panel, Row } from 'react-bootstrap'
import InputMoment from 'input-moment';
import FRC from 'formsy-react-components';
import update from 'react-addons-update'; // ES6

class JogInsert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validationErrors: {},
      saving: false,
      msg: null,
      input_m: moment(),
      recorded: moment().format('LLLL')
    };
  }
  submit(data) {
    const { onSave } = this.props;
    const self = this;
    const formData = update(data, {
      $merge: {
        recorded: this.state.input_m.toISOString(),
        user: this.props.user.id
      }
    });
    this.setState({
      saving: true,
      msg: ''
    });
    const requestInstance = request.defaults(this.props.RequestConfig);
    return requestInstance.post('/api/jogs/').form(formData).then( (response) => {
      self.setState({saving: false});
      onSave(response);
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
            <FRC.Input
              name="distance"
              label="Distance"
              type="number"
              addonAfter="miles"
              required
            />
            <FRC.Input
              name="duration"
              label="Duration"
              type="number"
              addonAfter="hours"
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

export default JogInsert;
