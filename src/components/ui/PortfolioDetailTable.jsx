import React, { useState, useEffect, Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import { Card, Table, Tooltip, Space, Popconfirm, Layout } from "antd";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { BsTrash } from "react-icons/bs";

import "./PortfolioDetailTable.css";

import { UserNetWorthContext } from "../store/userNetWorth.context";
import { PortfolioChangeContext } from "../store/portfolioChange.context";
import PChart from "./PChart";
import PortfolioService from "../services/portfolio.service";
import LotDetailTable from "./LotDetailTable";
import FormattedNumber from "./FormattedNumber";
import ATemp from "../pages/ATemp";

function PortfolioDetailTable(props) {
  const [userNetWorthContext] = useContext(UserNetWorthContext);
  const [listChanged, setListChanged] = useContext(PortfolioChangeContext);
  const [portfolioKey, setPortfolioKey] = useState({});
  const [assetSummary, setAssetSummary] = useState([]);
  console.log("props", props);

  useEffect(() => {
    let id = props.portfolioId
      ? props.portfolioId
      : PortfolioService.getLocalPortfolioId();
    const portfolio = userNetWorthContext.portfolioSummaries.find(
      (portfolio) => portfolio.portfolioId === id
    );
    // console.log(
    //   "id, portfolio, networthCtx: ",
    //   id,
    //   portfolio,
    //   userNetWorthContext
    // );
    setAssetSummary(portfolio?.summary?.assets);
    setPortfolioKey({
      portfolioId: portfolio?.portfolioId,
      userId: userNetWorthContext.userId,
    });
    console.log("Portfolio detail: ", portfolio?.summary.assets);
  }, [
    props.portfolioId,
    userNetWorthContext.portfolioSummaries,
    userNetWorthContext.userId,
  ]);

  const handlePortfolioDelete = (assetId, record) => {
    console.log(
      "Asset Delete clicked: ",
      assetId,
      record,
      portfolioKey.portfolioId
    );

    //add removed portfolio asset to portfolio services
    PortfolioService.removeAssetFromPortfolio(portfolioKey.portfolioId, assetId)
      .then((response) => {
        // response object {success, data, statusCode}
        const { success, data } = response;
        // data object {errorFlag, errorStatus, email, message}
        const { message } = data.data;
        console.log(
          "deleted lot: success, message, data ",
          success,
          message,
          data
        );
        if (success) {
          setListChanged({
            changed: true,
            changeType: "REMOVED_ASSET",
            portfolioId: portfolioKey.portfolioId,
          });
          console.log("portfolioContext - list changed?: ", listChanged);
        }
      })
      .catch((error) => {
        console.log(
          "Something went wrong removing an asset from the portfolio: ",
          error
        );
      });
  };

  const assetData = [];
  for (let i = 0; i < assetSummary.length; ++i) {
    const {
      assetId,
      assetSymbol,
      assetDisplayName,
      assetNetWorth,
      assetQtyTotal,
      assetTotalBookValue,
      assetTotalReturn,
      delayedChange,
      delayedPrice,
      lots,
    } = assetSummary[i];

    const xchildren = [];
    for (let lotIndex = 0; lotIndex < lots.length; lotIndex++) {
      const {
        lotId,
        lotQty,
        lotCostBasis,
        lotAssetSymbol,
        lotUnitPrice,
        lotNetWorth,
        lotTotalReturn,
        lotAcquiredDate,
        delayedChange,
        delayedPrice,
      } = lots[lotIndex];

      xchildren.push({
        key: lotId,
        lotQty: lotQty,
        lotCostBasis: lotCostBasis,
        lotAssetSymbol: lotAssetSymbol,
        lotUnitPrice: lotUnitPrice,
        lotNetWorth: lotNetWorth,
        lotTotalReturn: lotTotalReturn,
        lotAcquiredDate: lotAcquiredDate,
        lotDelayedChange: delayedChange,
        lotDelayedPrice: delayedPrice,
        assetId: assetId,
        portfolioKey: portfolioKey,
      });
    }

    assetData.push({
      key: assetId,
      symbol: { symbol: assetSymbol, displayName: assetDisplayName },
      assetValue: assetNetWorth,
      lastPrice: delayedPrice,
      lastChange: delayedChange,
      bookValue: assetTotalBookValue,
      qty: assetQtyTotal,
      return: assetTotalReturn,
      lotCount: xchildren.length,
      xchildren: xchildren,
    });
  }

  // Lot Detail Table...
  const expandedRowRender = (record) => {
    console.log("expanded Row Render:", record);

    return (
      <LotDetailTable
        lotArray={record.xchildren}
        portfolioKey={portfolioKey}
        assetId={record.key}
        lastPrice={record.lastPrice ? record.lastPrice : 0}
      />
    );
  };
  console.log("assetData: ", assetData);

  // Asset Detail Table
  const columns = [
    {
      title: "Asset",
      dataIndex: "symbol",
      key: "symbol",
      // width: "15%",
      className: "port-table-asset-row",
      render: (value) => {
        return (
          <span>
            <span style={{ color: "var(--dk-gray-900)", fontWeight: "bold" }}>
              {value.symbol}
            </span>
            <p
              style={{
                color: "var(--dk-gray-500)",
                fontStyle: "italic",
                fontWeight: "bold",
                fontSize: "80%",
              }}
            >
              {value.displayName}
            </p>
          </span>
        );
      },
    },
    {
      title: "Value",
      dataIndex: "assetValue",
      key: "assetValue",
      ellipsis: true,
      // width: "12%",
      className: "port-table-asset-row",
      render: (value, row, index) => {
        return <FormattedNumber value={value} type="CURRENCY" digits={2} />;
      },
    },
    {
      title: "Last Price",
      dataIndex: "lastPrice",
      key: "lastPrice",
      // width: "10%",
      responsive: ["md"],
      className: "port-table-asset-row",
      render: (value) => {
        return (
          <FormattedNumber
            value={value}
            type="CURRENCY"
            changeArrow={false}
            digits={2}
          />
        );
      },
    },
    {
      title: "Chg",
      dataIndex: "lastChange",
      key: "lastChange",
      // width: "10%",
      className: "port-table-asset-row",
      responsive: ["md"],
      render: (value) => {
        return (
          <FormattedNumber
            value={value}
            type="CURRENCY"
            color={true}
            digits={2}
          />
        );
      },
    },
    {
      title: "Book Value",
      dataIndex: "bookValue",
      key: "bookValue",
      ellipsis: true,
      // width: "12%",
      responsive: ["md"],
      className: "port-table-asset-row",
      render: (value) => {
        return <FormattedNumber value={value} type="CURRENCY" digits={2} />;
      },
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      // width: "9%",
      responsive: ["md"],
      className: "port-table-asset-row",
      render: (value) => {
        return <FormattedNumber value={value} type="NUMBER" digits={0} />;
      },
    },
    {
      title: "Return",
      dataIndex: "return",
      key: "return",
      ellipsis: true,
      responsive: ["lg"],
      className: "port-table-asset-row",
      // width: "15%",
      render: (value) => {
        return (
          <FormattedNumber
            value={value}
            type="CURRENCY"
            color={true}
            digits={2}
          />
        );
      },
    },
    {
      title: "Chart",
      dataIndex: "lastChange",
      key: "lastChange",
      // width: "15%",
      className: "port-table-asset-row",
      responsive: ["md"],
      render: (value, record) => {
        return <PChart symbol={record.symbol.symbol} />;
      },
    },
    {
      title: "Lots",
      dataIndex: "lotCount",
      key: "lotCount",
      // width: "10%",
      responsive: ["sm"],
      className: "port-table-asset-row",
      align: "center",
      render: (value) => {
        return value > 0 ? (
          <FormattedNumber value={value} type="NUMBER" digits={0} />
        ) : null;
      },
    },
    {
      title: "Action",
      dataIndex: "key",
      key: "key",
      // width: "10%",
      className: "port-table-asset-row",
      render: (value, record) => {
        // console.log("value, record: ", value, record);
        // const editable = isEditing(record);
        // console.log("editable value - ", editable);
        return (
          <Fragment>
            {/* <Space size="small"> */}
            <Popconfirm
              title="Delete asset?"
              okType="primary"
              placement="left"
              color="var(--dk-gray-300)"
              onConfirm={() => handlePortfolioDelete(value, record)}
            >
              <Link className="port-table-asset-row">
                {/* Remove */}
                <BsTrash />
              </Link>
            </Popconfirm>
            {/* </Space> */}
          </Fragment>
        );
      },
    },
  ];

  return (
    <>
      <ATemp assetSummary={assetSummary} portfolioKey={portfolioKey}>
        {/* <Table
          size="medium"
          columns={columns}
          dataSource={assetData}
          bordered={true}
          tableLayout="fixed"
          expandable={{
            rowExpandable: (record) => record.xchildren.length >= 0,
            expandedRowRender,
            expandIcon: ({ expanded, onExpand, record }) => {
              if (record.xchildren.length >= 0) {
                // setShowLots(true);
                return expanded ? (
                  <CaretUpOutlined onClick={(e) => onExpand(record, e)} />
                ) : (
                  <Tooltip title="View/Add/Modify Lots">
                    <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
                  </Tooltip>
                );
              } else {
              }
            },
          }}
        /> */}
      </ATemp>
    </>
  );
}

export default PortfolioDetailTable;
