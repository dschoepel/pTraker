import React, { useState, useEffect } from "react";
import { Layout, Card, Table, Col, Row, Button } from "antd";
import { RiPlayListAddLine } from "react-icons/ri";

import PortfolioService from "../services/portfolio.service";
import { contentStyle } from "../ui/ContentStyle";
import "./UserHome.css";

import CreatePortfolio from "./CreatePortfolio";

const { Content } = Layout;
const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [portfolioChanged, setPortfolioChanged] = useState(true);
  // const { publicContent } = usePublicContent();
  // const { userPortfolios } = useGetPortfolios();
  const [userPortfolios, setUserPortfolios] = useState("");

  console.log("userHome: ", userPortfolios);
  const columns = [
    {
      title: "Name",
      dataIndex: "portfolioName",
      key: "portfolioName",
    },
    {
      title: "Description",
      dataIndex: "portfolioDescription",
      key: "portfolioDescription,",
    },
  ];

  useEffect(() => {
    if (portfolioChanged) {
      PortfolioService.getUserPortfolios().then(
        (response) => {
          const newData = response.data.map((data) => {
            return { ...data, key: data._id };
          });
          setUserPortfolios({
            success: response.success,
            statusCode: response.statusCode,
            data: newData,
          });
        },
        (error) => {
          const _content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();

          setUserPortfolios(_content);
        }
      );
      setPortfolioChanged(false);
    }
  }, [isModalOpen, portfolioChanged]);

  const onClickCreatePortfolio = () => {
    console.log("create portfolio clicked");
    // navigate("/createPortfolio");
    setIsModalOpen(true);
  };

  return (
    <Content style={contentStyle}>
      <Row className="dashboard-row">
        <Col md={{ span: 8 }} sm={{ span: 4 }} className="dashboard-heading">
          Dashboard
        </Col>
        <Col
          lg={{ span: 4, offset: 12 }}
          md={{ span: 3, offset: 10 }}
          sm={{ span: 2, offset: 6 }}
        >
          <Button
            className="dashboard-button"
            // icon={<RiPlayListAddLine className="dashboard-icon" />}
            type="primary"
            onClick={onClickCreatePortfolio}
          >
            <RiPlayListAddLine className="dashboard-icon" /> Create Portfolio
          </Button>
        </Col>
      </Row>
      {/* <Card
        className="pt-card-style"
        bordered={false}
        style={{
          width: "100%",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      > */}
      <Table
        className="portfolio-table"
        size="small"
        columns={columns}
        dataSource={userPortfolios.data}
      />
      {/* </Card> */}
      {isModalOpen ? (
        <CreatePortfolio
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          setPortfolioChanged={setPortfolioChanged}
        />
      ) : null}
    </Content>
  );
};

export default Home;
