import { Fragment } from "react";
import { Collapse, List, Space } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import PortfolioLotPanelHeader from "./PortfolioLotPanelHeader";
import LotDetailTable from "./LotDetailTable";
import "./PortfolioLotPanel.css";
import FormattedNumber from "./FormattedNumber";
import FormattedDate from "./FormattedDate";
const { Panel } = Collapse;

function PortfolioLotPanel({ lots, asset, portfolioKey }) {
  const lotPanelHeader = <PortfolioLotPanelHeader lots={lots} />;
  console.log("LotPanel Asset: ", asset);

  const onChange = (key) => {
    console.log("Asset panel change key: ", key);
  };

  const listData = lots.map((lot, index) => {
    return (
      <div>
        <Space style={{ color: "var(--dk-gray-300)" }}>
          <span>{<FormattedDate dateString={lot.lotAcquiredDate} />}</span>
          <span>
            {<FormattedNumber value={lot.lotQty} type={"NUMBER"} digits={2} />}
          </span>
          <span>
            {
              <FormattedNumber
                value={lot.lotUnitPrice}
                type={"NUMBER"}
                digits={2}
              />
            }
          </span>
        </Space>
      </div>
    );
  });

  return (
    <Fragment>
      {lots ? (
        <div className="lot-list">
          <LotDetailTable
            lotArray={lots.map((lot) => ({ ...lot, key: lot.lotId }))}
            portfolioKey={portfolioKey}
            assetId={asset.assetId}
            lastPrice={asset.delayedPrice}
          />
          {/* <PortfolioLotPanelHeader lots={lots} /> */}
          {/* <List
            // className="lot-list"
            dataSource={listData}
            renderItem={(item) => (
              <List.Item className="lot-list-item">{item}</List.Item>
            )}
          /> */}
        </div>
      ) : null}
    </Fragment>
  );
}

export default PortfolioLotPanel;
