import React, { Component } from 'react';
import moment from 'moment';
import HighStock from 'react-highcharts';


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
      // rangeSelector: {
      //   enabled:false,
      //   lang:{
      //     rangeSelectorZoom:''
      //   },
      //   xAxis:{
      //     enabled:false
      //   },
      //   selected: 1,
      //   inputEnabled:false,
      //   buttonTheme:{
      //     visibility:'hidden'
      //   },
      //   labelStyle:{
      //     visibility:'hidden'
      //   }
      // },
      title: {
        text: ''
      },
      legend:{
        enabled:false
      },
      plotOptions:
      {
        line:{
          marker:{
            enabled:false
          }
        }
      },
      xAxis:[{
        // type:'category',
        categories:time,
        labels:{
          enabled:true,
          format: "{value}"
        }
      }],
      series: [
      //   {
      //   data:newTime,
      // }
      // ,
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
