import React, { useState, useEffect } from "react";
import { Line } from "@ant-design/plots";

import PortfolioService from "../services/portfolio.service";
import { Layout } from "antd";
import { max } from "lodash";

function setScale(historyChart, baseline) {
  let maxScale = 0;
  let minScale = 0;
  const foundMax = historyChart.reduce((previous, current) => {
    return current.price > previous.price ? current : previous;
  });
  if (foundMax.price < baseline) {
    maxScale = foundMax.price + (baseline - foundMax.price);
  } else {
    maxScale = foundMax.price + 0.01;
  }
  const foundMin = historyChart.reduce((previous, current) => {
    return current.price < previous.price ? current : previous;
  });
  minScale = foundMin.price - 0.01;
  if (minScale > baseline) {
    minScale = minScale - (minScale - baseline) * 1.5;
  }
  return { maxScale: maxScale, minScale: minScale };
}

const LineChart = ({ symbol }) => {
  const [data, setData] = useState([{ date: "", price: 0 }]);
  const [baseline, setBaseline] = useState(0);
  const [maxScale, setMaxScale] = useState(0);
  const [minScale, setMinScale] = useState(0);
  const [changeDirection, setChangeDirection] = useState(0); // 0=down, 1=up

  useEffect(() => {
    PortfolioService.getHistory(symbol)
      .then((response) => {
        const { success, historyChart, baseline } = response;
        setData(historyChart);
        setBaseline(baseline);
        setMaxScale(setScale(historyChart, baseline).maxScale);
        setMinScale(setScale(historyChart, baseline).minScale);
        if (historyChart.length > 1) {
          setChangeDirection(
            historyChart[historyChart.length - 1].price > baseline ? 1 : 0
          );
        } else {
          setChangeDirection(
            historyChart[historyChart.length].price > baseline ? 1 : 0
          );
        }
      })
      .catch((error) => {
        console.log("Error fetching history chart: ", error);
      });
  }, [maxScale, minScale, symbol]);

  const config = {
    data: data,
    theme: "default",
    autofit: true,
    padding: "auto",
    xField: "date",
    yField: "price",
    smooth: true,
    tooltip: false,
    xAxis: { label: null },
    yAxis: { tickCount: 0, min: minScale, max: maxScale },
    color: changeDirection === 1 ? "#52c41a" : "#ff4d4f",
    annotations: [
      // Below the median color change
      // {
      //   type: "regionFilter",
      //   start: ["min", "median"],
      //   end: ["max", "0"],
      //   color: "red",
      // },

      {
        type: "line",
        start: ["min", baseline],
        end: ["max", baseline],
        style: {
          // stroke: "#ffc107",
          stroke: changeDirection === 1 ? "#52c41a" : "#ff4d4f",
          lineDash: [2, 2],
        },
      },
    ],
  };

  return (
    <Layout
      style={{
        width: "5.0rem",
        height: "1.5em",
        backgroundColor: "var(--bk-dark-bg)",
      }}
    >
      <Line {...config} />
    </Layout>
  );
};

export default LineChart;
