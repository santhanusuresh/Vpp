import React from "react";
import _ from "lodash";

function Separator(props) {
  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        
        transform: `rotate(${props.turns}turn) rotate(-115deg)`
      }}
    >
      <div style={props.style} />
    </div>
  );
}

function RadialSeparators(props) {
  const turns = 1 / props.count;
  return _.range(props.count/1.5).map(index => (
    <Separator key = {index} turns={index * turns} style={props.style} />
  ));
}

export default RadialSeparators;
