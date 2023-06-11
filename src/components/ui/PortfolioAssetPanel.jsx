import { Fragment } from "react";
import { Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import PortfolioAssetPanelHeader1 from "./PortfolioAssetPanelHeader1";
import PortfolioAssetPanelHeader from "./PortfolioAssetPanelHeader";
import PortfolioLotPanel from "./PortfolioLotPanel";
import "./PortfolioAssetPanel.css";
const { Panel } = Collapse;

// The portfolio asset panel is a panel that displays the portfolio
// asset summary and the portfolio lots.  The portfolio asset summary is
// a summary of the portfolio lots.  The portfolio lots are the individual
// lots that make up the portfolio asset summary.

function PortfolioAssetPanel({ assetSummary, portfolioKey }) {
  // Build array of asset panels to display
  const assetPanels = assetSummary.map((asset, index) => {
    return (
      <Panel
        className="asset-panel"
        header={
          <PortfolioAssetPanelHeader1
            asset={asset}
            portfolioKey={portfolioKey}
          />
        }
        key={asset.assetId}
      >
        <span className="asset-panel-detail">
          <PortfolioLotPanel
            lots={assetSummary[index].lots}
            asset={assetSummary[index]}
            portfolioKey={portfolioKey}
          />
        </span>
      </Panel>
    );
  });

  const onChange = (key) => {
    console.log("Asset panel change key: ", key, portfolioKey);
  };

  return (
    <Fragment>
      {assetSummary ? (
        <Collapse
          bordered={false}
          // defaultActiveKey={portfolioKey}
          // onChange={onChange}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined
              rotate={isActive ? 90 : 0}
              style={{ color: "var(--dk-gray-100)" }}
            />
          )}
        >
          {assetPanels}
        </Collapse>
      ) : null}
    </Fragment>
  );
}

export default PortfolioAssetPanel;
