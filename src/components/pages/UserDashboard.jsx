import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Layout, Typography, Spin, Button, Card } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { RiPlayListAddLine } from "react-icons/ri";

import PortfolioService from "../services/portfolio.service";
import { UserNetWorthContext } from "../store/userNetWorth.context";
import AuthContext from "../store/auth.context";

import CreatePortfolio from "./CreatePortfolio";
import PortfolioSummary from "../ui/PortfolioSummary";
import BusinessNewsFeed from "../ui/BusinessNewsFeed";

import "./UserDashboard.css";
import { contentStyle } from "../ui/ContentStyle";
import { set } from "lodash";

const { Content } = Layout;
const { Paragraph, Text } = Typography;

function UserDashboard({ listChanged, setListChanged }) {
  const { portfolioId } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const [userNetWorthContext, setUserNetWorthContext] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [portfolioFound, setPortfolioFound] = useState(false);
  const [portfolioData, setPortfolioData] = useState();
  const [isAddPortfolioModalOpen, setIsAddPortfolioModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    let id = portfolioId ? portfolioId : PortfolioService.getLocalPortfolioId();
    console.log("listChanged = ", listChanged, "id: ", id);

    if (mounted || listChanged) {
      // console.log("id: ", id);
      PortfolioService.getOnePortfolio(id)
        .then((portfolio) => {
          console.log("Get one Portfolio: ", portfolio);
          if (mounted && isLoggedIn) {
            setPortfolioData(portfolio.data);
            setPortfolioFound(true);
            // console.log("setting local id: ", id);
            PortfolioService.setLocalPortfolioId(id);
            // setListChanged(false);
          }
        })
        .catch((error) => {
          setPortfolioFound(false);
          console.log("Something went wrong with getOnePortfolio: ", error);
        });
    }
    return () => (mounted = false);
  }, [isLoggedIn, listChanged, portfolioId]);

  function onClickCreatePortfolio() {
    console.log("create portfolio clicked");
    setIsAddPortfolioModalOpen(true);
  }

  console.log("...", portfolioData?.portfolioDetail);

  return (
    <UserNetWorthContext.Provider
      value={[userNetWorthContext, setUserNetWorthContext]}
    >
      <Content style={contentStyle}>
        {isLoading ? <Spin size="large" tip="Loading" /> : null}

        {portfolioFound ? (
          <Content>
            <Row className="dashboard-row" align={"top"}>
              <Col
                md={{ span: 10 }}
                sm={{ span: 6 }}
                className="dashboard-heading"
              >
                <div>
                  {portfolioData ? (
                    <Row align={"middle"}>
                      <Col span={16}>
                        <Text
                          ellipsis={true}
                          style={{
                            color: "var(--dk-gray-100",
                            fontSize: "2em",
                          }}
                        >
                          {portfolioData?.portfolioDetail?.portfolioName}
                        </Text>
                      </Col>
                      <Col span={16}>
                        <Text
                          style={{
                            color: "var(--dk-gray-500",
                            fontSize: ".75em",
                            fontStyle: "italic",
                          }}
                        >
                          {portfolioData?.portfolioDetail?.portfolioDescription}
                        </Text>
                      </Col>
                    </Row>
                  ) : null}
                </div>
              </Col>
              <Col
                lg={{ span: 4, offset: 10 }}
                md={{ span: 3, offset: 8 }}
                sm={{ span: 2, offset: 4 }}
              >
                <Button
                  className="dashboard-button"
                  type="primary"
                  onClick={onClickCreatePortfolio}
                >
                  <RiPlayListAddLine className="dashboard-icon" /> Create
                  Portfolio
                </Button>
              </Col>
            </Row>
            {portfolioData?.portfolioDetail ? (
              <PortfolioSummary
                portfolioData={portfolioData}
                setListChanged={setListChanged}
                listChanged={listChanged}
              />
            ) : null}
          </Content>
        ) : null}
        {!portfolioFound ? (
          <Content>
            <Card
              hoverable={false}
              size="small"
              bordered={false}
              className="portfolio-summary-card-empty"
            >
              <Row
                justify="space-around"
                className="portfolio-summary-card-empty-row"
              >
                Click the "Create Portfolio" button below to start defining your
                first porfolio and begin tracking your assets.
              </Row>
              <Row justify="space-around">
                <Button
                  className="dashboard-button"
                  type="primary"
                  onClick={onClickCreatePortfolio}
                >
                  <RiPlayListAddLine className="dashboard-icon" /> Create
                  Portfolio
                </Button>
              </Row>
            </Card>
            {/* <Row className="dashboard-row" align={"top"}>
            <Col
              md={{ span: 10 }}
              sm={{ span: 6 }}
              className="dashboard-heading"
            >
              <div>
                <Row align={"middle"}>
                  <Col span={16}>
                    <Text
                      ellipsis={true}
                      style={{ color: "var(--dk-gray-100", fontSize: "2em" }}
                    >
                      Column 1
                     
                    </Text>
                  </Col>
                  <Col span={16}>
                    <Text
                      style={{
                        color: "var(--dk-gray-500",
                        fontSize: ".75em",
                        fontStyle: "italic",
                      }}
                    >
                      Column 2
                     
                    </Text>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col
              lg={{ span: 4, offset: 10 }}
              md={{ span: 3, offset: 8 }}
              sm={{ span: 2, offset: 4 }}
            >
              <Button
                className="dashboard-button"
                type="primary"
                onClick={onClickCreatePortfolio}
              >
                <RiPlayListAddLine className="dashboard-icon" /> Create
                Portfolio
              </Button>
            </Col>
          </Row> */}
          </Content>
        ) : null}
        {isAddPortfolioModalOpen ? (
          <CreatePortfolio
            setIsAddPortfolioModalOpen={setIsAddPortfolioModalOpen}
            isAddPortfolioModalOpen={isAddPortfolioModalOpen}
            setListChanged={setListChanged}
          />
        ) : null}
      </Content>
    </UserNetWorthContext.Provider>
  );
}

export default UserDashboard;
