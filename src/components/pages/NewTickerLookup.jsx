import React, { useState } from "react";
import { Layout, Col, Modal, Space } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import NewTickerSearch from "../ui/NewTickerSearch";
import NewTickerSearchResultTable from "../ui/NewTickerSearchResultTable";

import "./NewTickerLookup.css";

const { Content } = Layout;

function NewTickerLookup({
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

  console.log("Ticker lookup:", portfolioDetailRecord);
  return (
    <Layout>
      <Content>
        <Modal
          open={isAddSymbolModalOpen}
          okText={okText}
          onCancel={cancelClicked}
          footer={null}
        >
          <Space direction="vertical" size="middle">
            <NewTickerSearch
              setTickerTableData={setTickerTableData}
              setSearchText={setSearchText}
            />
            {tickerTableData.length > 0 ? (
              <NewTickerSearchResultTable
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

export default NewTickerLookup;
