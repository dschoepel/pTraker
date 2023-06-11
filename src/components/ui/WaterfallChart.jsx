import React, { useContext } from "react";
import { Waterfall } from "@ant-design/plots";
import { Layout, Card } from "antd";
import { UserNetWorthContext } from "../store/userNetWorth.context";
import NetWorthTitle from "./NetWorthTitle";
import NetWorthSummary from "./NetWorthSummary";

import "./WaterFallChart.css";

function WaterfallChart() {
  const [userNetWorthContext] = useContext(UserNetWorthContext);

  const { portfolioSummaries } = userNetWorthContext;
  const chartData = portfolioSummaries.map((portfolio) => {
    let chartProperties = {
      portfolioName: portfolio.portfolioName,
      netWorth: portfolio.summary.portfolioNetWorth,
    };
    return chartProperties;
  });

  // const cardTitle = <NetWorthTitle />;
  const cardTitle = (
    <NetWorthSummary
      title={"Total"}
      data={{
        netWorth: userNetWorthContext.userSummary.userNetWorth,
        daysChange: userNetWorthContext.userSummary.userDaysChange,
        totalBookValue: userNetWorthContext.userSummary.userTotalBookValue,
        totalReturn: userNetWorthContext.userSummary.userTotalReturn,
      }}
    />
  );

  const config = {
    data: chartData,
    xField: "portfolioName",
    yField: "netWorth",
    limitInPlot: true,
    appendPadding: [15, 0, 0, 0],
    xAxis: {
      title: {
        text: "PORTFOLIOS",
        style: { fill: "#6b7280", fontWeight: "bold" },
      },
    },
    yAxis: {
      title: {
        text: "Net Worth (thousands)",
        style: { fill: "#6b7280", fontWeight: "bold" },
      },
    },
    theme: "default",
    color: ({ netWorth, portfolioName }) => {
      if (portfolioName === "Total") {
        return "#3b3871";
      }
      return netWorth > 0 ? "#73d13d" : "#ff4d4f";
    },
    legend: {
      layout: "horizontal",
      position: "top-left",
      custom: true,
      items: [
        {
          name: "Positive",
          value: "increase",
          marker: {
            symbol: "square",
            style: { r: 5, fill: "#73d13d" },
          },
        },
        {
          name: "Negative",
          value: "decrease",
          marker: {
            symbol: "square",
            style: { r: 5, fill: "#ff4d4f" },
          },
        },
        {
          name: "Total",
          value: "total",
          marker: {
            symbol: "square",
            style: { r: 5, fill: "#3b3871" },
          },
        },
      ],
    },
    meta: {
      portfolioName: { alias: "Portfolio" },
      netWorth: {
        alias: "Net Worth",
        formatter: (value) =>
          Intl.NumberFormat("en-us", {
            style: "currency",
            currency: "USD",
            currencySign: "accounting",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }).format(value / 1000) + "K",
      },
    },

    label: {
      style: {
        fontSize: 12,
        fill: "#d1d5db",
      },
      position: "top",
      layout: [{ portfolioName: "interval-adjust-position" }],
    },
    total: {
      label: "Total",
      style: { fill: "#3b3871" },
    },
  };
  return (
    <Card
      title={cardTitle}
      size="small"
      bordered={true}
      className="user-networth-chart"
      style={{ margin: "1.5rem" }}
    >
      <Layout
        style={{
          // width: "45.5rem",
          // height: "45.5rem",
          backgroundColor: "var(--bk-darker-bg)",
        }}
      >
        <Waterfall {...config} />
      </Layout>
    </Card>
  );
}

export default WaterfallChart;
