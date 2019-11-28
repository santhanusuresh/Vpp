// import React, { Component } from "react";
// import { Chart } from "chart.js";

// class ChartJS extends Component {
//   state = {};

//   componentDidMount() {
//     const canvas = this.refs.canvas;

//     const chart = new Chart(canvas, {
//       type: "line",
  
//       data: {
//         labels: this.props.time,
//         datasets: [
//           {
//             data: this.props.availablePower,
//             label: "",
//             pointRadius:0,
//             borderColor: "#25A8A8",
//             fill: false
//           },
//           {
//             data: this.props.netInGrid,
//             pointRadius:0,
//             label: "",
//             borderColor: "#B5D145",
//             fill: false
//           }
//         ]
//       },
      
//       options: {
//         tooltips: {
//           callbacks: {
//               labelColor: function(tooltipItem, chart) {
//                   return {
//                       borderColor: 'rgb(255, 0, 0)',
//                       backgroundColor: 'rgb(255, 0, 0)'
//                   };
//               },
//               labelTextColor: function(tooltipItem, chart) {
//                   return '#543453';
//               }
//           }
//       },
//       scales:{
//         xAxes: [{
//            ticks: {
//               fontColor: "#828282",
//               fontFamily:'Gotham Rounded Medium'
//            }
//         }],
//         yAxes: [{
//            ticks: {
//               fontColor: "#828282",
//               // beginAtZero: true,
//               // maxTicksLimit: 5,
//               // stepSize: Math.ceil(250 / 5),
//               // max: 250
//               fontFamily:'Gotham Rounded Medium'
//            }
//         }]
//      },
//         title: {
//           display: false,
//           text: "World population per region (in millions)"
//         },
//         legend: {
//           display: false
//         },
//       }
//     });
//   }

//   render() {
//     return <canvas ref="canvas"></canvas>;
//   }
// }

// export default ChartJS;
// import React from 'react'
// import { Chart } from 'react-charts'
 
// export default function ChartJS() {
//   const data = React.useMemo(
//     () => [
//       {
//         label: 'Series 1',
//         data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
//       },
//       {
//         label: 'Series 2',
//         data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
//       }
//     ],
//     []
//   )
 
//   const axes = React.useMemo(
//     () => [
//       { primary: true, type: 'linear', position: 'bottom' },
//       { type: 'linear', position: 'left' }
//     ],
//     []
//   )
 
  
//    return <div
//       style={{
//         width: '100%',
//         height: '100%'
//       }}
//     >
//       <Chart data={data} axes={axes} />
//     </div>
  

// }

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
      xAxis:{
        type:'category',
        categories:time,
        labels:{
          enabled:true,
          formatter: function() {console.log('this.value',this.value) }
        }
      },
      series: [{
        data:time,
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
