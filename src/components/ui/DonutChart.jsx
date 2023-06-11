import React, { useContext } from "react";
import { Pie } from "@ant-design/plots";
import { Layout, Card } from "antd";
import { UserNetWorthContext } from "../store/userNetWorth.context";
import NetWorthTitle from "./NetWorthTitle";
import NetWorthSummary from "./NetWorthSummary";

import "./DonutChart.css";

function DonutChart() {
  const [userNetWorthContext] = useContext(UserNetWorthContext);
  const { portfolioSummaries } = userNetWorthContext;

  // const chartTitle = <NetWorthTitle size="small" />;
  const chartTitle = (
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

  const chartData = portfolioSummaries.map((portfolio) => {
    let chartProperties = {
      portfolioName: portfolio.portfolioName,
      value: Math.round(portfolio.summary.portfolioNetWorth / 1000),
    };
    return chartProperties;
  });

  function css(property) {
    const element = document.getElementsByClassName(
      "user-networth-chart-pie"
    )[0];
    // const computedFont = css(element, "font-family");
    return window.getComputedStyle(element, null).getPropertyValue(property);
  }

  function getTextSize(text, font) {
    const element = document.createElement("canvas");
    const ctx = element.getContext("2d");
    ctx.font = font;
    let textSize = {
      width: ctx.measureText(text).width,
      height: parseInt(ctx.font),
    };
    return textSize;
  }

  function renderStatistic(containerWidth, text, style) {
    const { width: textWidth, height: textHeight } = getTextSize(
      text,
      `${style.fontSize}px ${css("font-family")}`
    );
    const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

    let scale = 0.7;

    if (containerWidth < textWidth) {
      scale = Math.min(
        Math.sqrt(
          Math.abs(
            Math.pow(R, 2) /
              (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))
          )
        ),
        1
      );
    }
    const textStyleStr = `width:${containerWidth}px;`;
    return `<div style="${textStyleStr};font-size:${scale}em;line-height:${
      scale < 1 ? 1 : "inherit"
    };">${text}</div>`;
  }

  const config = {
    data: chartData,
    colorField: "portfolioName",
    angleField: "value",
    limitInPlot: true,
    theme: "default",
    appendPadding: 20,
    radius: 1,
    innerRadius: 0.5,

    meta: {
      value: {
        formatter: (value) =>
          Intl.NumberFormat("en-us", {
            style: "currency",
            currency: "USD",
            currencySign: "accounting",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }).format(value),
      },
    },
    legend: {
      layout: "vertical",
      position: "left",
      offsetX: -5,
      itemWidth: 75,
    },
    label: {
      type: "inner",
      offset: "-50%",
      style: {
        textAlign: "center",
      },
      rotate: 125,
      formatter: ({ value }) => {
        const text = Intl.NumberFormat("en-us", {
          style: "currency",
          currency: "USD",
          currencySign: "accounting",
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        }).format(value);
        return text;
      },
    },
    statistic: {
      title: {
        style: { color: "var(--dk-gray-400)" },

        offsetY: -5,
        customHtml: (container, view, datum) => {
          const { width, height } = container.getBoundingClientRect();
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
          const text = datum ? datum.portfolioName : "Total";
          return renderStatistic(d, text, {
            fontSize: 20,
          });
        },
      },
      content: {
        offsetY: -5,
        style: {
          // fontSize: "24px",
          color: "var(--dk-gray-200)",
        },
        customHtml: (container, view, datum, data) => {
          const { width, height } = container.getBoundingClientRect();
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
          const temp = datum
            ? datum.value
            : data.reduce((r, d) => r + d.value, 0);
          let text = `${Intl.NumberFormat("en-us", {
            style: "currency",
            currency: "USD",
            currencySign: "accounting",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }).format(temp)}`;

          return renderStatistic(d, text, {
            fontSize: 24,
          });
        },
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
      {
        type: "pie-statistic-active",
      },
    ],
  };
  return (
    <Card
      title={chartTitle}
      size="small"
      bordered={true}
      className="user-networth-chart-pie"
      style={{ margin: "1.5rem" }}
    >
      <Layout
        style={{
          width: "22.5rem",
          height: "15.5rem",
          backgroundColor: "var(--bk-darker-bg)",
        }}
      >
        <Pie {...config} />
      </Layout>
    </Card>
  );
}

export default DonutChart;
