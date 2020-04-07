import React from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock';
import request from 'request-promise'

export default class JogWeeklyGraph extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      speed: [],
      duration: [],
      distance: []
    }
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const requestInstance = request.defaults(this.props.RequestConfig);
    const self = this;
    return requestInstance.get('/api/jogs/stats/').then( (response) => {
      var speed = [];
      var duration = [];
      var distance = [];
      response.reverse().forEach( (p) => {
        const recorded = new Date(p.recorded).getTime();
        speed.push([recorded, parseFloat(p.speed__avg)]);
        duration.push([recorded, parseFloat(p.duration__avg)]);
        distance.push([recorded, parseFloat(p.distance__avg)]);
      });
      self.setState({
        speed: speed,
        duration: duration,
        distance: distance
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.length !== this.props.data.length) {
      this.loadData();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.data.length !== this.props.data.length;
  }

  render() {
    const config = {
      rangeSelector: {
        selected: 1
      },
      title: {
        text: 'Jog Week Graph'
      },
      series: [
        {
          name: 'Avg Speed',
          data: this.state.speed,
          tooltip: {
            valueDecimals: 1
          }
        },
        {
          name: 'Avg Duration',
          data: this.state.duration,
          tooltip: {
            valueDecimals: 1
          }
        },
        {
          name: 'Avg Distance',
          data: this.state.distance,
          tooltip: {
            valueDecimals: 1
          }
        }
      ]
    };
    return <ReactHighstock config={config}/>
  }
}
