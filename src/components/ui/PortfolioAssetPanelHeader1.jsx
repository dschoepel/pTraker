import { useContext } from "react";
import { Popconfirm, Typography } from "antd";
import { BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";
import PortfolioService from "../services/portfolio.service";
import { PortfolioChangeContext } from "../store/portfolioChange.context";
import "./PortfolioAssetPanelHeader1.css";
import FormattedNumber from "./FormattedNumber";

const { Paragraph, Text } = Typography;

// The portfolio asset panel header is the header for the portfolio asset panel.
// It displays the asset symbol, asset name, asset net worth, and asset last price.
// It also displays a delete icon that allows the user to delete the asset from the
// portfolio.

function PortfolioAssetPanelHeader1({ asset, portfolioKey }) {
  const [listChanged, setListChanged] = useContext(PortfolioChangeContext);
  function handleAssetDelete(key) {
    console.log("Asset Delete Clicked: ", key, asset, portfolioKey.portfolioId);

    //Remove asset from this portfolio
    PortfolioService.removeAssetFromPortfolio(portfolioKey.portfolioId, key)
      .then((response) => {
        // response object {success, data, statusCode}
        const { success, data } = response;
        // data object {errorFlag, errorStatus, email, message}
        const { message } = data.data;
        console.log(
          "deleted asset: success, message, data ",
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
          "Something went wrong removing an asset from this portfolio: ",
          error
        );
      });
  }

  function handleCancel() {
    console.log("cancel clicked");
  }

  return (
    <div className="rtable rtable--7cols rtable--collapse">
      {/* Column 1, row 0 */}
      <h3
        style={{
          order: "0",
          fontWeight: "bold",
          color: "var(--dk-gray-200)",
        }}
        className="rtable-cell rtable-cell--symbol"
      >
        {asset.assetSymbol}
      </h3>
      {/* Column 1, row 1 */}
      <Text
        ellipsis={true}
        style={{
          order: "1",
        }}
        className="rtable-cell rtable-cell--name"
      >
        {asset.assetShortName}
      </Text>

      {/* Column 2, row 0 */}
      <div style={{ order: "0" }} className="rtable-cell rtable-cell--head">
        Net Worth
      </div>
      {/* Column 2, row 1 */}
      <div style={{ order: "1" }} className="rtable-cell rtable-cell-number">
        <FormattedNumber
          value={asset.assetNetWorth}
          type={"CURRENCY"}
          digits={2}
        />
      </div>
      {/* Column 3, row 0 */}
      <div
        style={{ order: "0" }}
        className="rtable-cell rtable-cell--head rtable-hide"
      >
        Last Price
      </div>
      {/* Column 3, row 1 */}
      <div
        style={{ order: "1" }}
        className="rtable-cell rtable-cell-number rtable-hide"
      >
        <FormattedNumber
          value={asset.delayedPrice}
          type={"CURRENCY"}
          digits={2}
        />
      </div>
      {/* Column 4, row 0 */}
      <div style={{ order: "0" }} className="rtable-cell rtable-cell--head">
        Change
      </div>
      {/* Column 4, row 1 */}
      <div style={{ order: "1" }} className="rtable-cell rtable-cell-number">
        <FormattedNumber
          value={asset.delayedChange}
          type={"CURRENCY"}
          color={true}
          digits={2}
        />
      </div>
      {/* Column 5, row 0 */}
      <div
        style={{ order: "0" }}
        className="rtable-cell rtable-cell--head rtable-hide-sm"
      >
        Book Value
      </div>
      {/* Column 5, row 1 */}
      <div
        style={{ order: "1" }}
        className="rtable-cell rtable-cell-number rtable-hide-sm"
      >
        <FormattedNumber
          value={asset.assetTotalBookValue}
          type={"CURRENCY"}
          digits={2}
        />
      </div>
      {/* Column 6, row 0 */}
      <div
        style={{ order: "0" }}
        className="rtable-cell rtable-cell--head rtable-hide-sm rtable-hide-md"
      >
        Qty
      </div>
      {/* Column 6, row 1 */}
      <div
        style={{ order: "1" }}
        className="rtable-cell rtable-cell-number rtable-hide-sm rtable-hide-md"
      >
        <FormattedNumber
          value={asset.assetQtyTotal}
          type={"NUMBER"}
          digits={2}
        />
      </div>
      {/* Column 7, row 0 */}
      <div style={{ order: "0" }} className="rtable-cell rtable-cell--head">
        Total Return
      </div>
      {/* Column 7, row 1 */}
      <div style={{ order: "1" }} className="rtable-cell rtable-cell-number">
        <FormattedNumber
          value={asset.assetTotalReturn}
          type={"CURRENCY"}
          color={true}
          digits={2}
        />
      </div>
      {/* Column 8, row 0 */}
      <div style={{ order: "0" }} className="rtable-cell rtable-cell--head">
        Action
      </div>
      {/* Column 8, row 1 */}
      <div style={{ order: "1" }} className="rtable-cell rtable-cell-icon">
        <Popconfirm
          title="Delete asset?"
          okType="primary"
          placement="left"
          color="var(--dk-gray-300)"
          onConfirm={() => {
            handleAssetDelete(asset.assetId);
          }}
          onCancel={handleCancel}
        >
          <Link className="rtable-cell rtable-cell-icon">
            <BsTrash />
          </Link>
        </Popconfirm>
      </div>
    </div>
  );
}

export default PortfolioAssetPanelHeader1;
