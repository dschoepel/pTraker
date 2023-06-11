import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
import React, { Fragment, useContext, useState } from "react";
import { UserNetWorthContext } from "../store/userNetWorth.context";
import PortfolioAssetPanel from "../ui/PortfolioAssetPanel";

const { Panel } = Collapse;

const ATemp = ({ assetSummary, portfolioKey }) => {
  const [userNetWorthContext] = useContext(UserNetWorthContext);

  const headerStyle = {
    borderLeft: "solid #8295D9",
    colorTextHeading: "var(--dk-gray-100",
    borderRadius: "0",
  };

  const headerText = (
    <span style={{ color: "var(--dk-gray-100)" }}>
      {assetSummary.length === 1
        ? `${assetSummary.length} Asset`
        : `${assetSummary.length} Assets`}
    </span>
  );

  return (
    <Collapse
      bordered={false}
      style={headerStyle}
      defaultActiveKey={"1"}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined
          rotate={isActive ? 90 : 0}
          style={{ color: "var(--dk-gray-100)" }}
        />
      )}
    >
      <Panel header={headerText} key="1">
        <PortfolioAssetPanel
          assetSummary={assetSummary}
          portfolioKey={portfolioKey}
        />
      </Panel>
    </Collapse>
  );
};
export default ATemp;
