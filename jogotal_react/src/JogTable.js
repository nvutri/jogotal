import request from 'request-promise'
import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Alert, Col, Row } from 'react-bootstrap'
import JogInsert from './JogInsert';

import './static/css/input-moment.css';
import './static/css/react-bootstrap-table.css';

class JogTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: '',
      distance: null,
      duration: null,
      speed: null
    };
  }

  dateFormatter(cell, row) {
    const options = {
        weekday: "short", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit"
    };
    const d = new Date(cell);
    return d.toLocaleDateString("en-US", options);
  }

  createCustomModal(onModalClose, onSave, columns, validateState, ignoreEditable) {
    const attr = {
      onModalClose, onSave, columns, validateState, ignoreEditable
    };
    return (
      <JogInsert
        RequestConfig={this.props.RequestConfig}
        user={this.props.user}
        { ... attr }/>
    );
  }

  onAfterDeleteRow(rowIDs) {
    const self = this;
    const requestInstance = request.defaults(this.props.RequestConfig);
    if (rowIDs.length > 0) {
      const rowWaits = rowIDs.map( (id) => {
        return requestInstance.delete(`/api/jogs/${id}/`).catch(function (err) {
          self.setState({msg: err.message ? err.message : err});
        });
      });
      rowWaits[0].then( () => {
        self.props.loadData();
      });
      return rowWaits;
    }
  }

  onAfterInsertRow(row) {
    return this.props.loadData();
  }

  onAfterSaveCell(row, cellName, cellValue) {
    const self = this;
    this.setState({error: null});
    const requestInstance = request.defaults(this.props.RequestConfig);
    var data = {};
    data[cellName] = cellValue;
    return requestInstance.patch(`/api/jogs/${row.id}/`).form(data).then( (res) => {
      self.props.loadData();
      return res;
    }).catch( (err) => {
      self.setState({error: err.message});
    });
  }

  render() {
    const options = {
      insertModal: this.createCustomModal.bind(this),
      afterDeleteRow: this.onAfterDeleteRow.bind(this),
      afterInsertRow: this.onAfterInsertRow.bind(this),
      defaultSortName: 'recorded',
      defaultSortOrder: 'desc'
    };
    const cellEditProp = {
      afterSaveCell: this.onAfterSaveCell.bind(this),
      blurToSave: true,
      mode: 'dbclick'
    };
    const selectRowProp = {
      mode: 'checkbox'
    };
    return (
      <div>
        <h2 className="text-center">Jogs</h2>
        <Row>
          <Col md={1}/>
          <Col md={10}>
            <BootstrapTable
              cellEdit={ cellEditProp }
              insertRow={ true }
              deleteRow={ true }
              selectRow={ selectRowProp }
              data={ this.props.data }
              options={ options }
              striped={ true }
              pagination= { true }
              hover={ true }>
                <TableHeaderColumn dataField="id" isKey={true} hidden={true}></TableHeaderColumn>
                <TableHeaderColumn dataField="recorded" dataFormat={ this.dateFormatter } editable={false} dataSort>Date</TableHeaderColumn>
                <TableHeaderColumn dataField="speed" editable={ false }>Speed</TableHeaderColumn>
                <TableHeaderColumn dataField="distance" editable={{ type: 'number' }}>Distance</TableHeaderColumn>
                <TableHeaderColumn dataField="duration" editable={{ type: 'number' }}>Total Hours</TableHeaderColumn>
            </BootstrapTable>
            { this.state.error ?
              <Alert bsStyle="danger">
                { this.state.msg }
              </Alert>:
              ''
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default JogTable;
