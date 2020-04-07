import React from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock';

export default class JogGraph extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lastDrawLocation: null,
      speed: [],
      duration: [],
      distance: [],
      dateLeft: null,
      dateRight: null
    };
    this.eventCounter = 0;
    this.EVENT_DELAY = 500;  // 500 millisec.
  }

  componentWillReceiveProps(nextProps) {
    var speed = [];
    var duration = [];
    var distance = [];
    nextProps.data.reverse().forEach( (p) => {
      const recorded = new Date(p.recorded).getTime();
      speed.push([recorded, parseFloat(p.speed)]);
      duration.push([recorded, parseFloat(p.duration)]);
      distance.push([recorded, parseFloat(p.distance)]);
    });
    this.setState({
      speed: speed,
      duration: duration,
      distance: distance
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.data.length !== this.props.data.length;
  }

  handleSelection(event) {
    if (event.target && event.target.xAxis && event.target.xAxis[0]) {
      const xAxis = event.target.xAxis[0];
      const thisCounter = ++this.eventCounter;
      const self = this;
      setTimeout(() => {
        if (thisCounter === this.eventCounter) {
          self.props.filterDate(xAxis.min, xAxis.max);
        }
      }, this.EVENT_DELAY);
    }
  }

  render() {
    const config = {
      rangeSelector: {
        selected: 1
      },
      title: {
        text: 'Jog Graph'
      },
      series: [
        {
          name: 'Speed',
          data: this.state.speed,
          tooltip: {
            valueDecimals: 1
          }
        },
        {
          name: 'Duration',
          data: this.state.duration,
          tooltip: {
            valueDecimals: 1
          }
        },
        {
          name: 'Distance',
          data: this.state.distance,
          tooltip: {
            valueDecimals: 1
          }
        }
      ],
      chart: {
        events: {
          redraw: this.handleSelection.bind(this)
        }
      }
    };
    return <ReactHighstock config={config}/>
  }
}
