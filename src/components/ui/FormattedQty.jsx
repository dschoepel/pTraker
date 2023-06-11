import { Typography, Tooltip } from "antd";

import FormattedNumber from "./FormattedNumber";

import "./FormattedQty.css";

const { Text } = Typography;
function FormattedQty({ title, qty, separator }) {
  return (
    <>
      <Tooltip title={""}>
        <Text className="qty-title-style">{title}</Text>
        <FormattedNumber value={qty} type={"NUMBER"} digits={1} />
        <Text>{separator}</Text>
      </Tooltip>
    </>
  );
}
export default FormattedQty;
