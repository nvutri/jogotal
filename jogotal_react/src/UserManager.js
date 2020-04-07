import request from 'request-promise';
import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Alert, Col, Row } from 'react-bootstrap'
import UserInsert from './UserInsert';

import './static/css/input-moment.css';
import './static/css/react-bootstrap-table.css';

class UserManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 1,
      dataTotalSize: 0,
      sizePerPage: 10,
      error: '',
    };
  }

  componentDidMount() {
    this.loadData(this.state.page, this.state.sizePerPage);
  }

  /**
   * Load remote data to fill table.
   * @return {[type]} [description]
   */
  loadData(page, sizePerPage) {
    const self = this;
    const requestInstance = request.defaults(this.props.RequestConfig);
    return requestInstance.get(`/api/users/?page=${page}&page_size=${sizePerPage}`).then(function (response) {
      self.setState({
        data: response.results,
        dataTotalSize: response.count,
        page: page,
        sizePerPage: sizePerPage
      });
      return response;
    }).catch(function (err) {
      console.log(err);
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
    return (<UserInsert
      RequestConfig={this.props.RequestConfig}
      { ... attr }
    />);
  }

  onAfterDeleteRow(rowIDs) {
    const self = this;
    const requestInstance = request.defaults(this.props.RequestConfig);
    if (rowIDs.length > 0) {
      const rowWaits = rowIDs.map( (id) => {
        return requestInstance.delete(`/api/users/${id}/`).catch(function (err) {
          console.log(err);
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
    return requestInstance.patch(`/api/users/${row.id}/`).form(data).then( (res) => {
      self.loadData(
        self.state.page,
        self.state.sizePerPage
      );
    }).catch( (err) => {
      self.setState({error: err.message});
    });
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
        <h2 className="text-center">Manage Users</h2>
        <Row>
          <Col md={2}/>
          <Col md={9}>
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
                <TableHeaderColumn dataField="username">Username</TableHeaderColumn>
                <TableHeaderColumn dataField="first_name">First Name</TableHeaderColumn>
                <TableHeaderColumn dataField="last_name">Last Name</TableHeaderColumn>
                <TableHeaderColumn dataField="date_joined" dataFormat={ this.dateFormatter } editable={false}>Joined</TableHeaderColumn>
                <TableHeaderColumn dataField="is_active" editable={{ type: 'checkbox' }}>Active</TableHeaderColumn>
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

export default UserManager;
