import React, { useState } from "react";
import { Layout, Col, Modal, Space } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import TickerSearch from "../ui/TickerSearch";
import TickerSearchResultTable from "../ui/TickerSearchResultTable";

import "./TickerLookup.css";

const { Content } = Layout;

function TickerLookup({
  isAddSymbolModalOpen,
  setIsAddSymbolModalOpen,
  setPortfolioChanged,
  portfolioDetailRecord,
}) {
  const [tickerTableData, setTickerTableData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const okText = (
    <span>
      <PlusCircleOutlined style={{ marginRight: "1rem" }} />
      Add Symbol
    </span>
  );

  const cancelClicked = () => {
    setIsAddSymbolModalOpen(false);
  };

  return (
    <Layout>
      <Content>
        <Modal
          open={isAddSymbolModalOpen}
          width="35%"
          okText={okText}
          onCancel={cancelClicked}
          footer={null}
        >
          <Space direction="vertical" size="middle">
            <TickerSearch
              setTickerTableData={setTickerTableData}
              setSearchText={setSearchText}
            />
            {tickerTableData.length > 0 ? (
              <TickerSearchResultTable
                tickerTableData={tickerTableData}
                searchText={searchText}
                setPortfolioChanged={setPortfolioChanged}
                setIsAddSymbolModalOpen={setIsAddSymbolModalOpen}
                portfolioDetailRecord={portfolioDetailRecord}
              />
            ) : null}
          </Space>
        </Modal>
      </Content>
    </Layout>
  );
}

export default TickerLookup;
