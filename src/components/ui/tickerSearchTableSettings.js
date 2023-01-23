import { Fragment } from "react";

const tickerColumns = [
  {
    title: "Ticker / Company Name",
    render: (record) => (
      <Fragment>
        {record.ticker}
        <br />
        {record.companyName}
      </Fragment>
    ),
    responsive: ["xs"],
    ellipsis: true,
  },
  {
    title: "Ticker",
    dataIndex: "ticker",
    key: "ticker",
    responsive: ["sm"],
  },
  {
    title: "Company Name",
    dataIndex: "companyName",
    key: "companyName",
    defaultSortOrder: ["ascend"],
    sorter: (a, b) => a.companyName.length - b.companyName.length,
    responsive: ["sm"],
  },
  {
    title: "Type",
    dataIndex: "quoteType",
    key: "quoteType",
    responsive: ["sm"],
  },
  {
    title: "Exchange",
    dataIndex: "exchDisp",
    key: "exchDisp",
    responsive: ["sm"],
  },
];

export default tickerColumns;
