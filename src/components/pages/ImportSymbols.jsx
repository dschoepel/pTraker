import React, { useState } from "react";
import { Layout, Typography, Steps, theme, Button, message, Card } from "antd";

import UploadPDF from "../forms/UploadPDF";
import SymbolTree from "../ui/SymbolTree";

import { contentStyle } from "../ui/ContentStyle";
import "./ImportSymbols.css";

const { Content } = Layout;
const { Title } = Typography;

function ImportSymbols() {
  const [current, setCurrent] = useState(0);
  const [pdfDetails, setPdfDetails] = useState([]);
  const [pdfFileName, setPdfFileName] = useState("");
  const token = theme.useToken();

  const steps = [
    {
      title: "Upload",
      content: (
        <UploadPDF
          setCurrent={setCurrent}
          setPdfDetails={setPdfDetails}
          setPdfFileName={setPdfFileName}
        />
      ),
    },
    {
      title: "Symbols Found",
      content: (
        <SymbolTree
          setCurrent={setCurrent}
          tableDetails={pdfDetails}
          pdfFileName={pdfFileName}
        />
      ),
    },
    { title: "Add to Portfolio", content: "Select Portfolio and Update" },
  ];
  function next() {
    console.log("current before next: ", current);

    setCurrent(current + 1);
  }
  function prev() {
    if (current === 0) {
      setPdfDetails("");
    }
    console.log("current before previous: ", current);
    setCurrent(current - 1);
  }
  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  const contentStyle = {
    lineHeight: "100px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
    marginLeft: 16,
    width: "98%",
  };
  console.log("current: ", current, pdfDetails, pdfFileName);

  return (
    <Card style={contentStyle}>
      <Steps
        className="pt-import-steps"
        current={current}
        items={items}
        direction="horizontal"
      />
      {/* {(steps[current].content = 1 ? <UploadPDF /> : null)} */}
      <div className="pt-import-steps-content" style={contentStyle}>
        {steps[current].content}
      </div>
      <div style={{ marginTop: 24, color: "var(--dk-gray-300)" }}>
        {current > 0 && (
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
        {current < steps.length - 1 && current > 0 ? (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        ) : null}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )}
      </div>
    </Card>
  );
}

export default ImportSymbols;
