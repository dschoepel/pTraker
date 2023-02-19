import { useState, Fragment } from "react";
import { Table, Button, Tooltip, Alert } from "antd";
import CheckCircleFilled from "@ant-design/icons/CheckCircleFilled";
import { BsPlusCircle } from "react-icons/bs";

// import tickerColumns from "./tickerSearchTableSettings";
import PortfolioService from "../services/portfolio.service";
import "./TickerSearchResultTable.css";

function TickerSerchResultTable({
  tickerTableData,
  searchText,
  setPortfolioChanged,
  setIsAddSymbolModalOpen,
  portfolioDetailRecord,
}) {
  // const [select, setSelect] = useState({ selectedRowKeys: [], loading: false });
  // const { selectedRowKeys, loading } = select;
  const [assetLookup] = useState(
    portfolioDetailRecord.assets.map((asset) => {
      return asset.assetSymbol;
    })
  );
  const [successful, setSuccessful] = useState(false);
  const [eMessage, setEMessage] = useState("");

  console.log("Asset Lookup table: ", assetLookup.includes("SONO"));

  // TODO Modify for changing portfolio names...
  function getErrorMsg(statusCode, message) {
    let errorMessage = "";
    switch (statusCode) {
      case "PORTFOLIO_NOT_CHANGED":
        errorMessage = `No changes were made!`;
        break;
      default:
        errorMessage = message;
    }
    return errorMessage;
  }

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
      ellipsis: true,
      key: "symbol",
    },
    {
      title: "Exchange",
      dataIndex: "exchDisp",
      key: "exchDisp",
      responsive: ["md"],
      className: "exchange",
      width: "20%",
      ellipsis: "true",
    },
    {
      title: "Action",
      key: "action",
      render: (record) =>
        assetLookup.includes(record.ticker) ? (
          <Tooltip
            title={
              record.companyName + " is already included in this portfolio!"
            }
          >
            <CheckCircleFilled style={{ fontSize: "150%" }} />
          </Tooltip>
        ) : (
          <Tooltip title="Add Symbol">
            <Button
              type="link"
              shape="circle"
              size="small"
              icon={<BsPlusCircle style={{ fontSize: "150%" }} />}
              onClick={(e) => {
                addSymbolClicked(record);
              }}
            />
          </Tooltip>
        ),
      width: 50,
    },
  ];

  const onChange = (selection) => {
    console.log("Selected tickers: ", selection);
  };

  const addSymbolClicked = (value) => {
    const { key, companyName, ticker: symbol, quoteType, exchDisp } = value;
    console.log("Add symbol clicked:", symbol);

    PortfolioService.addAssetToPortfolio(portfolioDetailRecord._id, symbol)
      .then(
        (response) => {
          console.log(
            "Response from Add Asset To Portfolio: ",
            response,
            response.success
          );
          if (response.success) {
            // Asset added, update portfolio details list & close symbol query modal
            setPortfolioChanged(true);
            setIsAddSymbolModalOpen(false);
            setSuccessful(true);
            // setIsModalOpen(false);
            // setPortfolioChanged(true);
          }
          setEMessage(getErrorMsg(response.statusCode, response.message));
          setSuccessful(response.success);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setEMessage(resMessage);
          setSuccessful(false);
        }
      )
      .catch();
  };

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: (selectedRowKeys) => {
  //     setSelect({ ...select, selectedRowKeys: selectedRowKeys });
  //     console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ");
  //     console.log("TickerTable Data: ", tickerTableData);
  //   },
  //   // getCheckboxProps: (record) => ({
  //   //   disabled: record.name === "Disabled User",
  //   //   // Column configuration not to be checked
  //   //   name: record.name,
  //   // }),
  // };

  return (
    <Fragment>
      <Table
        rowClassName={(record, index) => {
          if (record.ticker === searchText.toUpperCase()) {
            return "table-ticker-green ";
          } else {
            return "table-ticker-search";
          }
        }}
        className="table-ticker-search"
        size="small"
        dataSource={tickerTableData}
        columns={tickerColumns}
        // rowSelection={rowSelection}
        onChange={onChange}
        pagination={false}
        showHeader={false}
        // onRow={(record, index) => {
        //   return {
        //     onMouseEnter: (event) => {
        //       console.log("Mouse entered row: ", event, record);
        //     },
        //   };
        // }}
      />
      {eMessage && !successful ? (
        <Alert message={eMessage} type="error" showIcon />
      ) : null}
    </Fragment>
  );
}

export default TickerSerchResultTable;
