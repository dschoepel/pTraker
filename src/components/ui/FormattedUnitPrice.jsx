import { Typography, Tooltip } from "antd";

import FormattedNumber from "./FormattedNumber";

import "./FormattedUnitPrice.css";

const { Text } = Typography;
function FormattedUnitPrice({ title, unitPrice, separator }) {
  return (
    <>
      <Tooltip title={"Unit price"}>
        <Text className="unit-price-title-style">{title}</Text>
        <FormattedNumber value={unitPrice} type={"CURRENCY"} />
        <Text>{separator}</Text>
      </Tooltip>
    </>
  );
}
export default FormattedUnitPrice;
