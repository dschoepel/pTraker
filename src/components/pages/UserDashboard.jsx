import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Layout, Typography, Spin, Button } from "antd";
import { RiPlayListAddLine } from "react-icons/ri";

import PortfolioService from "../services/portfolio.service";
import AuthContext from "../store/auth.context";

import CreatePortfolio from "./CreatePortfolio";
import PortfolioSummary from "../ui/PortfolioSummary";

import "./UserDashboard.css";
import { contentStyle } from "../ui/ContentStyle";
import { set } from "lodash";

const { Content } = Layout;
const { Paragraph, Text } = Typography;

function UserDashboard({ listChanged, setListChanged }) {
  const { portfolioId } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [portfolioFound, setPortfolioFound] = useState(false);
  const [portfolioData, setPortfolioData] = useState();
  const [isAddPortfolioModalOpen, setIsAddPortfolioModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    let id = "";
    if (!portfolioId) {
      // console.log("PortfolioId = undefined", portfolioId);
      id = PortfolioService.getLocalPortfolioId();
      // console.log("PortfolioId = undefined", id);
      // mounted = false;
    } else {
      // console.log("PortfolioId = ", portfolioId);
      id = portfolioId;
    }

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
                        style={{ color: "var(--dk-gray-100", fontSize: "2em" }}
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
          <Row className="dashboard-row" align={"top"}>
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
                      {/* {portfolioData?.portfolioDetail?.portfolioName} */}
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
                      {/* {portfolioData?.portfolioDetail?.portfolioDescription} */}
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
          </Row>
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
  );
}

export default UserDashboard;
