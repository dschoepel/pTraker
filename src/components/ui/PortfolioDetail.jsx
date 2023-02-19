import React, { useState, useEffect, Fragment, useContext } from "react";
import { Row, Col, Divider, Card } from "antd";
import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi";

import Color from "./Color";
import "./PortfoliDetail.css";
import { PortfolioContext } from "../store/portfolio.context";

const { Green, Red, C } = Color;

function PortfolioDetail({ portfolioDetail, portfolioAssetSummary }) {
  const [portfolioContext] = useContext(PortfolioContext);
  const [lots, setLots] = useState([]);
  const [assetSummary, setAssetSummary] = useState([]);

  useEffect(() => {
    console.log(
      "Portfolio detail: ",
      portfolioContext.portfolioAssetSummary,
      portfolioContext.portfolioDetail.lots
    );
    setLots(portfolioContext.portfolioDetail.lots);
    setAssetSummary(portfolioContext.portfolioAssetSummary);
  }, [
    portfolioContext.portfolioAssetSummary,
    portfolioContext.portfolioDetail.lots,
  ]);

  const assetRow = portfolioAssetSummary.map((asset, index) => {
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
            {(asset.lastPrice * asset.assetQtyTotal).toLocaleString("en-us", {
              style: "currency",
              currency: "USD",
              currencySign: "accounting",
              signDisplay: "auto",
            })}
          </Col>
          <Col span={4}>
            {asset.lastPrice.toLocaleString("en-us", {
              style: "currency",
              currency: "USD",
            })}
          </Col>
          <Col span={4}>
            {asset.lastChange > 0 ? (
              <Green>
                <HiArrowNarrowUp />{" "}
              </Green>
            ) : (
              <Red>
                <HiArrowNarrowDown />
              </Red>
            )}
            {asset.lastChange > 0 ? (
              <Green>
                {asset.lastChange.toLocaleString("en-us", {
                  style: "currency",
                  currency: "USD",
                  currencySign: "accounting",
                  signDisplay: "always",
                })}
              </Green>
            ) : (
              <Red>
                {asset.lastChange.toLocaleString("en-us", {
                  style: "currency",
                  currency: "USD",
                  currencySign: "accounting",
                  signDisplay: "always",
                })}
              </Red>
            )}
          </Col>
          <Col span={4}>
            {asset.assetBasisTotal.toLocaleString("en-us", {
              style: "currency",
              currency: "USD",
            })}
          </Col>
          <Col span={4}>{asset.assetQtyTotal.toLocaleString("en-us")}</Col>
        </Row>
        <Row
          className="portfolio-detail-asset-row display-name"
          key={asset.assetId + asset.displayName}
        >
          <Col>{asset.displayName}</Col>
        </Row>
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
      <Col span={4}>Qty</Col>
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
