import React, { useState } from "react";
import { Layout, Col } from "antd";

import TickerSearch from "../ui/TickerSearch";
import TickerSearchResultTable from "../ui/TickerSearchResultTable";

import "./TickerLookup.css";

const { Content } = Layout;

function TickerLookup() {
  const [tickerTableData, setTickerTableData] = useState([]);
  const [searchText, setSearchText] = useState("");
  return (
    <Layout>
      <Content>
        <Col>
          <TickerSearch
            setTickerTableData={setTickerTableData}
            setSearchText={setSearchText}
          />
          <TickerSearchResultTable
            tickerTableData={tickerTableData}
            searchText={searchText}
          />
        </Col>
      </Content>
    </Layout>
  );
}

export default TickerLookup;
