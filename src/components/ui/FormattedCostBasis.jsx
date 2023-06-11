import { Typography, Tooltip } from "antd";

import FormattedNumber from "./FormattedNumber";

import "./FormattedCostBasis.css";

const { Text } = Typography;
function FormattedCostBasis({ title, costBasis, separator }) {
  return (
    <>
      <Tooltip title={"Calculated cost basis"}>
        <Text className="cost-basis-title-style">{title}</Text>
        <FormattedNumber value={costBasis} type={"CURRENCY"} />
        <Text>{separator}</Text>
      </Tooltip>
    </>
  );
}
export default FormattedCostBasis;
