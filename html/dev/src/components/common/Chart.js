import React, { Component } from "react";
import { Chart } from "chart.js";

class ChartJS extends Component {
  state = {};

  componentDidMount() {
    const canvas = this.refs.canvas;

    const chart = new Chart(canvas, {
      type: "line",
      data: {
        labels: this.props.time,
        datasets: [
          {
            data: this.props.availablePower,
            label: "",
            pointRadius:0,
            borderColor: "#25A8A8",
            fill: false
          },
          {
            data: this.props.netInGrid,
            pointRadius:0,
            label: "",
            borderColor: "#B5D145",
            fill: false
          }
        ]
      },
      
      options: {
      scales:{
        xAxes: [{
           ticks: {
              fontColor: "#828282",
              fontFamily:'Gotham Rounded Medium'
           }
        }],
        yAxes: [{
           ticks: {
              fontColor: "#828282",
              // beginAtZero: true,
              // maxTicksLimit: 5,
              // stepSize: Math.ceil(250 / 5),
              // max: 250
              fontFamily:'Gotham Rounded Medium'
           }
        }]
     },
        title: {
          display: false,
          text: "World population per region (in millions)"
        },
        legend: {
          display: false
        },
      }
    });
  }

  render() {
    return <canvas ref="canvas"></canvas>;
  }
}

export default ChartJS;
