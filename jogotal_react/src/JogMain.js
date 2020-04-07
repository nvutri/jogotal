import React from 'react';
import request from 'request-promise'

import { Col, Row } from 'react-bootstrap'

import JogGraph from './JogGraph';
import JogTable from './JogTable';
import JogWeeklyGraph from './JogWeeklyGraph';

export default class JogMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      size: 800
    }
  }
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const self = this;
    const requestInstance = request.defaults(this.props.RequestConfig);
    return requestInstance.get(`/api/jogs/?page_size=${this.state.size}`).then( (response) => {
      self.setState({
        data: response.results,
        tableData: response.results,
        count: response.count,
      });
      return response;
    }).catch(function (err) {
      return err;
    });
  }

  filterDate(left, right) {
    const tableData = this.state.data.filter( (row) => {
      const recorded = new Date(row.recorded).getTime();
      return left <= recorded && recorded <= right;
    });
    this.setState({tableData: tableData});
    return tableData;
  }

  render() {
    return (<div>
      <Row>
        <Col sm={1}/>
        <Col sm={10}>
          <JogGraph
            RequestConfig={this.props.RequestConfig}
            data={this.state.data}
            user={this.props.user}
            filterDate={this.filterDate.bind(this)}/>
        </Col>
      </Row>
      <Row>
        <JogTable
          RequestConfig={this.props.RequestConfig}
          user={this.props.user}
          loadData={this.loadData.bind(this)}
          data={this.state.tableData}
          />
      </Row>
      <Row>
        <Col sm={1}/>
        <Col sm={10}>
          <JogWeeklyGraph
            RequestConfig={this.props.RequestConfig}
            user={this.props.user}
            filterDate={this.filterDate.bind(this)}
            loadData={this.loadData.bind(this)}
            data={this.state.data}
          />
        </Col>
      </Row>
    </div>)
  }
}
