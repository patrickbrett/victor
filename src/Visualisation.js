import React, { Component } from "react";
import {
  HorizontalGridLines,
  MarkSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from "react-vis";

class Visualisation extends Component {
  render() {
    const { data, colours, xLabel, yLabel } = this.props;

    return (
      <XYPlot width={600} height={600}>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis tickFormat={v => v + "%"} title={xLabel} />
        <YAxis tickFormat={v => v + "%"} title={yLabel} />
        <MarkSeries
          data={data[0].points}
          color={colours[0]}
        />
        <MarkSeries
          data={data[1].points}
          color={colours[1]}
        />
        <MarkSeries
          data={data[2].points}
          color={colours[2]}
        />
      </XYPlot>
    );
  }
}

export default Visualisation;
