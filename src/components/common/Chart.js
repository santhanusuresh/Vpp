import React, { Component } from 'react';
import HighStock from 'react-highcharts/ReactHighstock.src';


class Chart extends Component {
  state = { 
    config:{}
   }

  componentDidMount(){

    const {availablePower,netInGrid}=this.props;

  const config = {
      rangeSelector: {
        selected: 1
      },
      title: {
        // text: ''
      },
      series: [
        {
        name: 'Available Power',
        data: availablePower,
        color:"#25A8A8",
        tooltip: {
          valueDecimals: 2
        }
      },
        {
        name: 'Net In Grid',
        data: netInGrid,
        color:'#B5D145',
        tooltip: {
          valueDecimals: 2
        }
      }
    ]
    };
    
    this.setState({config});

  }
  

  render() {
    const {config}=this.state;
    return (
      <HighStock config={config}></HighStock>
      );
  }
}

export default Chart;
