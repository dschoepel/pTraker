import { useState } from "react";
import { Table } from "antd";

import tickerColumns from "./tickerSearchTableSettings";
import "./TickerSearchResultTable.css";

function TickerSerchResultTable({ tickerTableData, searchText }) {
  // const [listOfTickers] = useState(tickerTableData);
  const [selectionType] = useState("checkbox");

  const onChange = (selection) => {
    console.log("Slected tickers: ", selection);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === "Disabled User",
    //   // Column configuration not to be checked
    //   name: record.name,
    // }),
  };

  return (
    <Table
      rowClassName={(record, index) => {
        if (record.ticker === searchText.toUpperCase()) {
          return "table-ticker-green";
        } else {
          return "table-ticker-search";
        }
      }}
      className="table-ticker-search"
      size="small"
      dataSource={tickerTableData}
      columns={tickerColumns}
      rowSelection={{ type: selectionType, ...rowSelection }}
      onChange={onChange}
      pagination={false}
    />
  );
}

export default TickerSerchResultTable;
