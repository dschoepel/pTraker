import { Row, Col, Typography } from "antd";

import FormattedNumber from "./FormattedNumber";

import "./PortfolioAssetPanelHeader.css";

function PortfolioAssetPanelHeader({ asset }) {
  const headSymbolStyle = {
    color: "var(--dk-gray-200)",
    fontWeight: "500",
    fontSize: "1.5rem",
  };
  const headTxtStyle = {
    color: "var(--dk-gray-300)",
    fontWeight: "500",
    textAlign: "right",
    fontSize: "1.2rem",
  };
  const nameTxtStyle = {
    color: "var(--dk-gray-600)",
    fontWeight: "500",
    fontSize: "1.2rem",
  };
  const nbrTxtStyle = {
    color: "var(--dk-gray-400)",
    fontWeight: "500",
    textAlign: "right",
    fontSize: "1.2rem",
  };

  console.log("Asset Header data: ", asset);
  return (
    <Row align={"bottom"} gutter={10} justify={"space-between"}>
      {/* <Col flex={"0 1 100px"}> */}
      <Col md={4}>
        <Typography.Text style={headSymbolStyle}>
          {asset.assetSymbol}
        </Typography.Text>
        <Typography.Paragraph
          style={nameTxtStyle}
          italic={true}
          ellipsis={true}
        >
          {asset.assetShortName}
        </Typography.Paragraph>
      </Col>
      <Col md={3}>
        <Typography.Paragraph style={headTxtStyle}>
          Net Worth
        </Typography.Paragraph>
        <Typography.Paragraph style={nbrTxtStyle}>
          {
            <FormattedNumber
              value={asset.assetNetWorth}
              type={"CURRENCY"}
              digits={2}
            />
          }
        </Typography.Paragraph>
      </Col>
      <Col md={3} xs={0}>
        <Typography.Paragraph style={headTxtStyle}>
          Last Price
        </Typography.Paragraph>
        <Typography.Paragraph style={nbrTxtStyle}>
          {
            <FormattedNumber
              value={asset.delayedPrice}
              type={"CURRENCY"}
              digits={2}
            />
          }
        </Typography.Paragraph>
      </Col>
      <Col md={3} xs={0}>
        <Typography.Paragraph style={headTxtStyle}>Change</Typography.Paragraph>
        <Typography.Paragraph style={nbrTxtStyle}>
          {
            <FormattedNumber
              value={asset.assetDaysChange}
              type={"CURRENCY"}
              changeArrow={true}
              color={true}
              digits={2}
            />
          }
        </Typography.Paragraph>
      </Col>
      <Col md={3} sm={0} xs={0}>
        <Typography.Paragraph style={headTxtStyle}>
          Book Value
        </Typography.Paragraph>
        <Typography.Paragraph style={nbrTxtStyle}>
          {
            <FormattedNumber
              value={asset.assetTotalBookValue}
              type={"CURRENCY"}
              digits={2}
            />
          }
        </Typography.Paragraph>
      </Col>
      <Col md={2} sm={0} xs={0}>
        <Typography.Paragraph style={headTxtStyle}>Qty</Typography.Paragraph>
        <Typography.Paragraph style={nbrTxtStyle}>
          {
            <FormattedNumber
              value={asset.assetQtyTotal}
              type={"NUMBER"}
              digits={0}
            />
          }
        </Typography.Paragraph>
      </Col>
      <Col md={3}>
        <Typography.Paragraph style={headTxtStyle}>Return</Typography.Paragraph>

        <Typography.Paragraph style={nbrTxtStyle}>
          {
            <FormattedNumber
              value={asset.assetTotalReturn}
              type={"CURRENCY"}
              color={true}
              digits={2}
            />
          }
        </Typography.Paragraph>
      </Col>
    </Row>
  );
}

export default PortfolioAssetPanelHeader;
