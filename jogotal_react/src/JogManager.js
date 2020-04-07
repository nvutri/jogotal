import request from 'request-promise';
import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Alert, Col, Row } from 'react-bootstrap'
import Select from 'react-select'
import JogAdminInsert from './JogAdminInsert';

import './static/css/input-moment.css';
import './static/css/react-bootstrap-table.css';

class JogManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 1,
      dataTotalSize: 0,
      sizePerPage: 10,
      error: '',
      jogger: null,
      userOptions: {},
      eventCounter: 0
    };
  }

  componentDidMount() {
    this.loadData(this.state.page, this.state.sizePerPage);
    this.searchJogger('');
  }

  searchJogger(input) {
    const self = this;
    const requestInstance = request.defaults(this.props.RequestConfig);
    return requestInstance.get(`/api/users/?search=${input}`).then( (response) => {
      const options = response.results.map( (option) => {
        return {
          'value': option.id,
          'label': `${option.username}: ${option.first_name} ${option.last_name}`
        }
      });
      self.setState({
        joggerOptions: options
      });
    });
  }

  loadJoggers(input) {
    if (input && input.length > 0) {
      const self = this;
      const thisCounter = ++this.state.eventCounter;
      console.log(input);
      setTimeout(() => {
        if (thisCounter === this.state.eventCounter) {
          self.searchJogger(input);
        }
      }, 500);
    }
  }

  /**
   * Load remote data to fill table.
   * @return {[type]} [description]
   */
  loadData(page, sizePerPage) {
    const self = this;
    const requestInstance = request.defaults(this.props.RequestConfig);
    var url = `/api/jogsadmin/?page=${page}&page_size=${sizePerPage}`;
    if (this.state.jogger) {
      url = `${url}&user=${this.state.jogger}`;
    }
    return requestInstance.get(url).then(function (response) {
      self.setState({
        data: response.results,
        dataTotalSize: response.count,
        page: page,
        sizePerPage: sizePerPage
      });
      return response;
    }).catch(function (err) {
      self.setState({'msg': err.message});
    });
  }

  handlePageChange(page, sizePerPage) {
    this.loadData(page, sizePerPage);
  }

  handleSizePerPageChange(sizePerPage) {
    // When changing the size per page always navigating to the first page
    this.loadData(1, sizePerPage);
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
    return (<JogAdminInsert
      RequestConfig={this.props.RequestConfig}
      { ... attr }
    />);
  }

  onAfterDeleteRow(rowIDs) {
    const self = this;
    const requestInstance = request.defaults(this.props.RequestConfig);
    if (rowIDs.length > 0) {
      const rowWaits = rowIDs.map( (id) => {
        return requestInstance.delete(`/api/jogsadmin/${id}/`).catch(function (err) {
          self.setState({
            msg: err.error && err.error.non_field_errors ? err.error.non_field_errors : err.message
          })
        });
      });
      rowWaits[rowWaits.length - 1].then( () => {
        self.loadData(
          self.state.page,
          self.state.sizePerPage
        );
      });
      return rowWaits;
    }
  }

  onAfterInsertRow(row) {
    this.loadData(
      this.state.page,
      this.state.sizePerPage
    );
  }

  onAfterSaveCell(row, cellName, cellValue) {
    const self = this;
    this.setState({error: null});
    const requestInstance = request.defaults(this.props.RequestConfig);
    var data = {};
    data[cellName] = cellValue;
    return requestInstance.patch(`/api/jogsadmin/${row.id}/`).form(data).then( (res) => {
      self.loadData(
        self.state.page,
        self.state.sizePerPage
      );
    }).catch( (err) => {
      self.setState({error: err.message});
    });
  }

  handleJoggerSelect(selectedOption) {
    this.setState({
      jogger: selectedOption ? selectedOption.value: selectedOption
    }, () => this.loadData(1, 10));
  }

  render() {
    const options = {
      onPageChange: this.handlePageChange.bind(this),
      onSizePerPageList: this.handleSizePerPageChange.bind(this),
      page: this.state.page,
      sizePerPage: this.state.sizePerPage,
      insertModal: this.createCustomModal.bind(this),
      afterDeleteRow: this.onAfterDeleteRow.bind(this),
      afterInsertRow: this.onAfterInsertRow.bind(this)
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
        <h2 className="text-center">Manage Jogs</h2>
        <Row>
          <Col md={2}/>
          <Col md={9}>
            <Row>
              <label className="control-label col-sm-3" style={{textAlign: "right"}}>
                Select Jogger {this.state.jogger}
              </label>
              <Col md={9}>
                <Select
                    name="jogger"
                    value={this.state.jogger}
                    options={this.state.joggerOptions}
                    onInputChange={this.loadJoggers.bind(this)}
                    onChange={this.handleJoggerSelect.bind(this)}
                />
              </Col>
            </Row>
            <BootstrapTable
              cellEdit={ cellEditProp }
              insertRow={ true }
              deleteRow={ true }
              selectRow={ selectRowProp }
              data={this.state.data}
              remote={true}
              pagination={true}
              options={ options }
              fetchInfo={{dataTotalSize: this.state.dataTotalSize}}
              striped={true}
              hover={true}>
                <TableHeaderColumn dataField="id" isKey={true} hidden={true}></TableHeaderColumn>
                <TableHeaderColumn dataField="recorded" dataFormat={ this.dateFormatter } editable={false} dataSort>Date</TableHeaderColumn>
                <TableHeaderColumn dataField="full_name" editable={false}>Jogger</TableHeaderColumn>
                <TableHeaderColumn dataField="speed" editable={false}>Speed</TableHeaderColumn>
                <TableHeaderColumn dataField="distance" editable={{ type: 'number' }}>Distance</TableHeaderColumn>
                <TableHeaderColumn dataField="duration" editable={{ type: 'number' }}>Total Hours</TableHeaderColumn>
            </BootstrapTable>
            { this.state.error ?
              <Alert bsStyle="danger">
                {this.state.error}
              </Alert>:
              ''
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default JogManager;
