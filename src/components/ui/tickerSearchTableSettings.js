import { Fragment } from "react";
import { Button, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

const tickerColumns = [
  {
    title: "Ticker / Company Name",
    render: (record) => (
      <Fragment>
        <span className="symbol">{record.ticker}</span>
        <br />
        <span className="company">{record.companyName}</span>
      </Fragment>
    ),
    responsive: ["sm"],
    ellipsis: true,
    key: "symbol",
  },
  {
    title: "Exchange",
    dataIndex: "exchDisp",
    key: "exchDisp",
    responsive: ["sm"],
    className: "exchange",
    width: "20%",
  },
  // {
  //   title: "Action",
  //   key: "action",
  //   render: (record) => (
  //     <Tooltip title="Add Symbol">
  //       <Button
  //         type="primary"
  //         shape="circle"
  //         size="small"
  //         icon={<PlusCircleOutlined />}
  //       />
  //     </Tooltip>
  //   ),
  //   responsive: ["sm"],
  // },
  // {
  //   title: "Ticker",
  //   dataIndex: "ticker",
  //   key: "ticker",
  //   responsive: ["sm"],
  // },
  // {
  //   title: "Company Name",
  //   dataIndex: "companyName",
  //   key: "companyName",
  //   defaultSortOrder: ["ascend"],
  //   sorter: (a, b) => a.companyName.length - b.companyName.length,
  //   responsive: ["sm"],
  // },
  // {
  //   title: "Type",
  //   dataIndex: "quoteType",
  //   key: "quoteType",
  //   responsive: ["sm"],
  // },
];

export default tickerColumns;
