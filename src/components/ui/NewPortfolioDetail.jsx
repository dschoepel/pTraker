import React, { useState, useEffect, Fragment, useContext } from "react";
import { Row, Col, Divider, Card } from "antd";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi";

import Color from "./Color";
import "./NewPortfoliDetail.css";
// import { PortfolioContext } from "../store/portfolio.context";
import { UserNetWorthContext } from "../store/userNetWorth.context";
import PortfolioService from "../services/portfolio.service";

const { Green, Red, C } = Color;

function PortfolioDetail(props) {
  const [userNetWorthContext] = useContext(UserNetWorthContext);
  const [lots, setLots] = useState([]);
  const [showLots, setShowLots] = useState(false);
  const [assetSummary, setAssetSummary] = useState([]);

  useEffect(() => {
    let id = PortfolioService.getLocalPortfolioId();
    const portfolio = userNetWorthContext.portfolioSummaries.find(
      (portfolio) => portfolio.portfolioId === id
    );
    setAssetSummary(portfolio.summary.assets);
    console.log("Portfolio detail: ", portfolio.assets);
    // setLots(portfolioContext.portfolioDetail.lots);
    // setAssetSummary(portfolioContext.portfolioAssetSummary);
  }, [userNetWorthContext.portfolioSummaries]);

  const clickedShowLot = () => {
    console.log("Clicked show lot");
    setShowLots((showLots) => !showLots);
  };

  const assetRow = assetSummary.map((asset, index) => {
    // console.log("build detail: ", assetSummary.length, index, asset);
    return (
      <Fragment key={asset.assetId}>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          key={asset.assetId}
          justify={"space-betwen"}
          className="portfolio-detail-asset-row"
        >
          <Col span={4} className="symbol">
            {asset.assetSymbol}{" "}
          </Col>
          <Col span={4}>
            {asset.assetNetWorth.toLocaleString("en-us", {
              style: "currency",
              currency: "USD",
              currencySign: "accounting",
              signDisplay: "auto",
            })}
          </Col>
          <Col span={4}>
            {asset.delayedPrice.toLocaleString("en-us", {
              style: "currency",
              currency: "USD",
            })}
          </Col>
          <Col span={4}>
            {asset.delayedChange > 0 ? (
              <Green>
                <HiArrowNarrowUp />{" "}
              </Green>
            ) : (
              <Red>
                <HiArrowNarrowDown />
              </Red>
            )}
            {asset.delayedChange > 0 ? (
              <Green>
                {asset.delayedChange.toLocaleString("en-us", {
                  style: "currency",
                  currency: "USD",
                  currencySign: "accounting",
                  signDisplay: "always",
                })}
              </Green>
            ) : (
              <Red>
                {asset.delayedChange.toLocaleString("en-us", {
                  style: "currency",
                  currency: "USD",
                  currencySign: "accounting",
                  signDisplay: "always",
                })}
              </Red>
            )}
          </Col>
          <Col span={4}>
            {asset.assetTotalBookValue.toLocaleString("en-us", {
              style: "currency",
              currency: "USD",
            })}
          </Col>
          <Col span={3}>{asset.assetQtyTotal.toLocaleString("en-us")}</Col>
          <Col span={1}>
            <CaretDownOutlined onClick={clickedShowLot} />
          </Col>
        </Row>
        <Row
          className="portfolio-detail-asset-row display-name"
          key={asset.assetId + asset.assetDisplayName}
        >
          <Col>{asset.assetDisplayName}</Col>
        </Row>
        {showLots ? (
          <Row key={asset.assetId + asset.assetDisplayName + index}>
            Showing lots
          </Row>
        ) : null}
      </Fragment>
    );
  });

  const cardHeading = (
    <Row
      key="heading"
      justify={"space-betwen"}
      className="portfolio-detail-header-assets"
      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
    >
      <Col span={4}>Symbol</Col>
      <Col span={4}>Value</Col>
      <Col span={4}>Last Price</Col>
      <Col span={4}>Last Change</Col>
      <Col span={4}>Book Value</Col>
      <Col span={3}>Qty</Col>
    </Row>
  );

  return (
    <>
      {/* <Divider
        type="horizontal"
        orientation="left"
        className="portfolio-detail-divider-horizontal"
      >
        {portfolioDetail.portfolioName}
      </Divider> */}
      <Card bordered={false} className="portfolio-detail-card">
        {cardHeading}
        {assetRow}
      </Card>
      {/* <Row justify={"space-betwen"}>
        <Col span={4}>Symbol</Col>
        <Col span={4}>Value</Col>
        <Col span={4}>Basis</Col>
        <Col span={4}>Qty</Col>
      </Row> */}
    </>
  );
}

export default PortfolioDetail;
