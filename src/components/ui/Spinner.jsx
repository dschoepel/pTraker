import { Row, Col, Spin, Typography } from "antd";
import { SyncOutlined } from "@ant-design/icons";

function Spinner({ title }) {
  const spinTitle = title ? title : "Loading ...";
  const antIcon = (
    <SyncOutlined
      style={{
        color: "var(--dk-gray-100)",
        fontSize: "5rem",
        margin: "2rem 0",
      }}
      spin
    />
  );
  return (
    <Row justify={"space-around"}>
      <Col>
        <Spin indicator={antIcon} />
        <Typography.Text style={{ color: "white", marginLeft: "1rem" }}>
          {spinTitle}
        </Typography.Text>
      </Col>
    </Row>
  );
}

export default Spinner;
