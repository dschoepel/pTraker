import { Typography, Tooltip } from "antd";
import "./FormattedSymbol.css";

const { Text } = Typography;
function FormattedSymbol({
  title,
  symbolString,
  symbolDescription,
  separator,
}) {
  return (
    <>
      <Tooltip
        title={
          "Click on this row to see data extracted from the PDF for this symbol"
        }
      >
        <Text className="symbol-title-style">{title}</Text>
        <Text className="formatted-symbol-style" ellipsis={true}>
          {symbolString}{" "}
        </Text>
        <Text>{` - ${symbolDescription}`}</Text>
        <Text>{separator}</Text>
      </Tooltip>
    </>
  );
}
export default FormattedSymbol;
