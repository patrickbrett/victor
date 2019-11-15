import React, { Component } from "react";
import "./App.css";
import Papa from 'papaparse'
import breastCancerDataPath from "./data/breast_cancer.csv"

import Visualisation from "./Visualisation";

const Datasets = [
  {
    fieldLabels: ["Sugar %", "Flour %", "Butter %", "Eggs %", "Milk %"],
    classificationLabels: ["Cupcake", "Muffin"],
    dataPoints: [
      [[17, 44, 11, 11, 17], 0],
      [[20, 40, 13, 13, 13], 0],
      [[24, 24, 24, 27, 0], 0],
      [[27, 55, 0, 18, 0], 0],
      [[19, 44, 13, 13, 13], 0],
      [[33, 42, 0, 8, 17], 0],
      [[23, 38, 17, 11, 11], 0],
      [[31, 69, 0, 0, 0], 0],
      [[13, 53, 0, 7, 27], 1],
      [[12, 36, 5, 32, 16], 1],
      [[0, 60, 0, 10, 30], 1],
      [[17, 51, 0, 13, 19], 1],
      [[9, 57, 6, 5, 24], 1],
      [[23, 51, 0, 11, 15], 1],
      [[18, 59, 0, 6, 18], 1],
      [[9, 56, 0, 7, 28], 1],
      [[19, 50, 0, 6, 25], 1]
    ],
    predictPoints: [[33, 42, 0, 8, 17], [0, 60, 0, 8, 17], [18, 5, 0, 8, 17]],
    labelsInUse: [1, 1, 1, 1, 1],
    visualisationLabels: {
      x: 0,
      y: 3
    }
  }
];

const colours = ["#5abee8", "#78d175", "#ed4c94"];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      predictedValues: [],
      dataset: Datasets[0]
    };
  }

  componentDidMount() {
    Papa.parse(breastCancerDataPath, {
      download: true,
      dynamicTyping: true,
      complete: results => {
        console.log("Finished", results.data)
      }
    })
  }

  runSvm = () => {
    const { dataPoints, predictPoints, labelsInUse } = this.state.dataset;

    // TODO: improve time complexity / efficiency
    const train_data = dataPoints.map(dataPoint => [
      dataPoint[0].filter((v, index) => labelsInUse[index]),
      dataPoint[1]
    ]);
    const test_data = predictPoints.map(dataPoint =>
      dataPoint.filter((v, index) => labelsInUse[index])
    );

    fetch(`http://localhost:5000`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        train_data,
        test_data
      })
    }).then(res => {
      res.json().then(json => {
        this.setState({ predictedValues: json });
      });
    });
  };

  changeClassification = index => {
    const datasetNew = { ...this.state.dataset };
    const { dataPoints, classificationLabels } = datasetNew;
    const classificationsCount = classificationLabels.length;

    const dataPoint = [...dataPoints[index]];
    dataPoint[1] = (dataPoint[1] + 1) % classificationsCount; // cycle through classification labels

    const dataPointsNew = [...dataPoints];
    dataPointsNew[index] = dataPoint;

    datasetNew.dataPoints = dataPointsNew;
    this.setState({ dataset: datasetNew });
  };

  toggleLabelInUse = labelIndex => {
    const newDataset = { ...this.state.dataset };
    const labelsInUse = [...newDataset.labelsInUse];
    labelsInUse[labelIndex] = !labelsInUse[labelIndex];

    newDataset.labelsInUse = labelsInUse;

    this.setState({ dataset: newDataset });
  };

  updateAxisLabel = (e, axis) => {
    const { value } = e.target

    const newDataset = { ...this.state.dataset };
    const visualisationLabels = { ...newDataset.visualisationLabels };
    console.log("before", visualisationLabels)
    visualisationLabels[axis] = value
    console.log("after", visualisationLabels)

    newDataset.visualisationLabels = visualisationLabels;

    this.setState({ dataset: newDataset });
  }

  render() {
    const { dataset, predictedValues } = this.state;

    const visualisationData = dataset.classificationLabels
      .map((label, labelIndex) => ({
        label,
        points: dataset.dataPoints
          .filter(dataPoint => dataPoint[1] === labelIndex)
          .map(dataPoint => ({
            x: dataPoint[0][dataset.visualisationLabels.x],
            y: dataPoint[0][dataset.visualisationLabels.y]
          }))
      }))
      .concat([
        {
          label: "?",
          points: dataset.predictPoints.map(predictPoint => ({
            x: predictPoint[dataset.visualisationLabels.x],
            y: predictPoint[dataset.visualisationLabels.y]
          }))
        }
      ]);

    console.log(visualisationData)

    const visualisation = (
      <Visualisation
        data={visualisationData}
        xLabel={dataset.fieldLabels[dataset.visualisationLabels.x]}
        yLabel={dataset.fieldLabels[dataset.visualisationLabels.y]}
        colours={colours}
      />
    )

    return (
      <div>
        <h1>Victor</h1>
        <h2>Support Vector Machines engine & simulator</h2>
        <div className={`container dataset`}>
          <h1>Dataset</h1>
          <div className={`table-heading`}>
            {dataset.fieldLabels.map((label, labelIndex) => (
              <div className={`data-label`}>
                {label}
                <input
                  type={`checkbox`}
                  onChange={() => this.toggleLabelInUse(labelIndex)}
                  checked={dataset.labelsInUse[labelIndex]}
                />
              </div>
            ))}
            <div className={`data-label`}>Classification</div>
          </div>
          <div className={`table-content`}>
            {dataset.dataPoints.map((dataPoint, index) => {
              const [labelValues, classificationIndex] = dataPoint;

              return (
                <div className={`data-point`}>
                  {labelValues.map((field, fieldIndex) => (
                    <div
                      className={
                        `data-field` +
                        (dataset.labelsInUse[fieldIndex] ? `` : ` not-in-use`)
                      }
                    >
                      {field}
                    </div>
                  ))}
                  <div
                    className={"data-field"}
                    onClick={() => this.changeClassification(index)}
                  >
                    <div
                      className={`classification-inner`}
                      style={{ background: colours[classificationIndex] }}
                    >
                      {dataset.classificationLabels[classificationIndex]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={`container classification`}>
          <h1>
            Predict{" "}
            <button className={`run-prediction`} onClick={this.runSvm}>
              Run Predictions
            </button>
          </h1>
          <div className={`table-heading`}>
            {dataset.fieldLabels.concat("Classification").map(label => (
              <div className={`data-label`}>{label}</div>
            ))}
          </div>
          <div className={`table-content`}>
            {dataset.predictPoints.map((predictPoint, index) => {
              return (
                <div className={`data-point`}>
                  {predictPoint.map((field, fieldIndex) => (
                    <div
                      className={
                        `data-field` +
                        (dataset.labelsInUse[fieldIndex] ? `` : ` not-in-use`)
                      }
                    >
                      {field}
                    </div>
                  ))}
                  <div className={`data-field`}>
                    <div
                      className={`classification-inner`}
                      style={{ background: colours[predictedValues[index]] }}
                    >
                      {predictedValues.length > index
                        ? dataset.classificationLabels[predictedValues[index]]
                        : "?"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={`container visualisation`}>
          <h1>Visualisation</h1>
          {
            ["x", "y"].map(axis => {
              const otherAxis = axis === "x" ? "y" : "x"

              return (<p>{axis.toUpperCase()} axis:
                <select value={dataset.visualisationLabels[axis]} onChange={e => this.updateAxisLabel(e, axis)}>
                  {dataset.fieldLabels.map((label, index) => (
                      <option value={index} disabled={dataset.visualisationLabels[otherAxis] === index}>{label}</option>
                  ))}
                </select>
              </p>
            )})
          }
          {visualisation}
        </div>
      </div>
    );
  }
}

export default App;
