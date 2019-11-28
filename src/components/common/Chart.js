import React, { Component } from 'react';
import moment from 'moment';
import HighStock from 'react-highcharts/ReactHighstock.src';


class Chart extends Component {
  state = { 
    config:{}
   }

  componentDidMount(){

    const {availablePower,netInGrid,time}=this.props;
    console.log('time chart',time);
    const newTime=time.map(time=>([time,parseInt(time.split(":")[1])]));
    console.log('newTime',newTime);
  const config = {
      rangeSelector: {
        lang:{
          rangeSelectorZoom:''
        },
        selected: 1,
        inputEnabled:false,
        buttonTheme:{
          visibility:'hidden'
        },
        labelStyle:{
          visibility:'hidden'
        }
      },
      title: {
        // text: ''
      },
      xAxis:[{
        type:'category',
        categories:newTime,
        labels:{
          enabled:true,
          format: "{value}"
        }
      }],
      series: [{
        data:newTime,
      },{
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
