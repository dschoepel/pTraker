import { Popconfirm, Typography } from "antd";
import { BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";

import "./PortfolioLotPanelHeader.css";

const { Paragraph } = Typography;

function PortfolioLotPanelHeader({ lots }) {
  return (
    <div className="ltable ltable--5cols ltable--collapse">
      {/* Column 1 */}
      <div style={{ order: "0" }} className="ltable-cell ltable-cell--head">
        {`${lots.length} Lot(s)`}
      </div>
      {/* Column 2 */}
      <div style={{ order: "0" }} className="ltable-cell ltable-cell--head">
        Date Acquired
      </div>
      {/* Column 3 */}
      <div style={{ order: "0" }} className="ltable-cell ltable-cell--head">
        Quantity
      </div>
      {/* Column 4 */}
      <div style={{ order: "0" }} className="ltable-cell ltable-cell--head">
        Price
      </div>
      {/* Column 5 */}
      <div style={{ order: "0" }} className="ltable-cell ltable-cell--head">
        Actions
      </div>
    </div>
  );
}

export default PortfolioLotPanelHeader;
