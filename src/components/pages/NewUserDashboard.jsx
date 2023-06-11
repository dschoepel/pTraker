import React, { useContext, useState, useEffect, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Layout, Spin, Button, Card, Typography } from "antd";

import { RiPlayListAddLine } from "react-icons/ri";

import PortfolioService from "../services/portfolio.service";
import AuthContext from "../store/auth.context";
import { UserNetWorthContext } from "../store/userNetWorth.context";

import CreatePortfolio from "./CreatePortfolio";

import NewPortfolioSummary from "../ui/NewPortfolioSummary";
import NetworthOverview from "./NetWorthOverview";
import PortfolioTabs from "../ui/PortfolioTabs";
import NoPortfolio from "../ui/NoPortfolio";

import "./NewUserDashboard.css";
import { contentStyle } from "../ui/ContentStyle";
import BusinessNewsFeed from "../ui/BusinessNewsFeed";
import { LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import Spinner from "../ui/Spinner";

const { Content } = Layout;
// const { Text } = Typography;

function NewUserDashboard({ listChanged, setListChanged }) {
  const { portfolioId } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const [userNetWorthContext, setUserNetWorthContext] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioFound, setPortfolioFound] = useState(true);
  const [portfolioData, setPortfolioData] = useState();
  const [isAddPortfolioModalOpen, setIsAddPortfolioModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If this page is called with no parameter, need to find out if the user has one
    // or more portfolios.  If so, use the first portflolio, otherwise there are no
    // Portfolios yet for this user

    if (portfolioId === undefined) {
      PortfolioService.getUserNetWorth()
        .then((networthDetails) => {
          if (networthDetails.statusCode === 403) {
            navigate("/expiredLogin");
          }
          if (networthDetails.data.portfolioSummaries.length > 0) {
            setPortfolioFound(true);
            navigate(
              `/dashboard/${networthDetails.data.portfolioSummaries[0].portfolioId}`
            );
          } else {
            setPortfolioFound(false);
          }
        })
        .catch((error) => {
          // TODO Handle errors
          console.log("Error intializing User Dashboard: Error: ", error);
        });
    }
    let mounted = true;
    let id = portfolioId ? portfolioId : PortfolioService.getLocalPortfolioId();
    console.log("listChanged = ", listChanged.changed, "id: ", id);

    if (mounted || listChanged) {
      setIsLoading(true);
      // console.log("id: ", id);

      PortfolioService.getUserNetWorth()
        .then((networthDetails) => {
          console.log("getUserNetWorth: ", networthDetails);
          if (networthDetails.statusCode === 403) {
            console.log(
              "Error gettiing networth details: ",
              networthDetails.success,
              networthDetails.statusCode,
              networthDetails.data
            );
            navigate("/expiredLogin");
          }
          setUserNetWorthContext(networthDetails.data);
          const portfolio = networthDetails.data.portfolioSummaries.find(
            (portfolio) => portfolio.portfolioId === id
          );
          if (portfolio) {
            if (mounted && isLoggedIn) {
              setPortfolioData(portfolio);
              setPortfolioFound(true);
              // console.log("setting local id: ", id);
              PortfolioService.setLocalPortfolioId(id);
              // setListChanged(false);
            }
            console.log("found portfolio summary: ", portfolio);
          } else {
            console.log(
              "Did not find portfolio for id: ",
              id,
              portfolio?.portfolioId,
              isLoading
            );
            setPortfolioFound(false);
            // setIsLoading(false);
          }
        })
        .catch((error) => {
          setPortfolioFound(false);
          setPortfolioData(undefined);
          console.log("Something went wrong with getUserNetWorth: ", error);
        });
    }
    setIsLoading(false);
    return () => (mounted = false);
  }, [isLoading, isLoggedIn, listChanged, navigate, portfolioId]);

  function onClickCreatePortfolio() {
    console.log("create portfolio clicked");
    setIsAddPortfolioModalOpen(true);
  }

  // console.log("...", portfolioData);

  const antIcon = (
    <SyncOutlined
      style={{
        color: "var(--dk-gray-100",
        fontSize: "5rem",
        margin: "2rem 0",
      }}
      spin
    />
  );

  return (
    <UserNetWorthContext.Provider
      value={[userNetWorthContext, setUserNetWorthContext]}
    >
      <Layout
        style={{
          backgroundColor: "var(--dk-darker-bg)",
        }}
      >
        {/* <Content style={contentStyle}> */}
        {isLoading ? (
          <Layout>
            <Fragment>
              <Spin indicator={antIcon} />
              <Typography.Paragraph style={{ color: "white" }}>
                Loading ...!
              </Typography.Paragraph>
            </Fragment>
          </Layout>
        ) : (
          <Fragment>
            <Row>
              <Col span={24}>
                {userNetWorthContext ? (
                  <NetworthOverview />
                ) : (
                  <Spinner title="Loading Chart" />
                )}
              </Col>
              {/* <Col md={{ span: 12 }} sm={{ span: 19 }} xs={{ span: 0 }}>
                {userNetWorthContext ? (
                  <BusinessNewsFeed fullscreen={false} />
                ) : null}
              </Col> */}
            </Row>
            {portfolioFound ? (
              <Content>
                {portfolioData ? (
                  <Card
                    style={{ margin: "1.5rem 1.5rem", paddingLeft: "0" }}
                    className="asset-card-body"
                  >
                    {/* Adding portfolio tabs */}
                    {userNetWorthContext ? <PortfolioTabs /> : null}
                    {/* Portfolio Summary */}
                    <NewPortfolioSummary
                      portfolioId={portfolioId}
                      setListChanged={setListChanged}
                      listChanged={listChanged}
                    />
                  </Card>
                ) : (
                  <Spinner title="Loading Portfolio(s)" />
                )}
              </Content>
            ) : // <Content>
            //   <NoPortfolio setListChanged={setListChanged} />
            // </Content>
            null}
          </Fragment>
        )}
        {!portfolioFound ? (
          <NoPortfolio setListChanged={setListChanged} />
        ) : null}
        {isAddPortfolioModalOpen ? (
          <CreatePortfolio
            setIsAddPortfolioModalOpen={setIsAddPortfolioModalOpen}
            isAddPortfolioModalOpen={isAddPortfolioModalOpen}
            setListChanged={setListChanged}
          />
        ) : null}
        {/* </Content> */}
      </Layout>
    </UserNetWorthContext.Provider>
  );
}

export default NewUserDashboard;
