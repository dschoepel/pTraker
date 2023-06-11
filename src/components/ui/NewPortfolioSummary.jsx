import React, { useState, useEffect, Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Space,
  Popconfirm,
  message,
  Button,
  Typography,
} from "antd";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { BsTrash } from "react-icons/bs";
import { TbMinusVertical } from "react-icons/tb";

import PortfolioService from "../services/portfolio.service";

import { UserNetWorthContext } from "../store/userNetWorth.context";
import NewPortfolioHeading from "./NewPortfolioHeading";
import EditPortfolio from "../pages/EditPortfolio";
import PortfolioDetailTable from "./PortfolioDetailTable";
import NewTickerLookup from "../pages/NewTickerLookup";
import NetWorthSummary from "./NetWorthSummary";
import FormattedNumber from "../ui/FormattedNumber";
import Spinner from "../ui/Spinner";

import "./NewPortfolioSummary.css";
// import Color from "./Color";

// const { Green, Red } = Color;
const { Paragraph } = Typography;

function NewPortfolioSummary({ portfolioId, setListChanged, listChanged }) {
  const [userNetWorthContext] = useContext(UserNetWorthContext);

  const [portfolioDetail, setPortfolioDetail] = useState();
  const [isEditPortfolioModalOpen, setIsEditPortfolioModalOpen] =
    useState(false);
  const [isAddSymbolModalOpen, setIsAddSymbolModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    console.log("Port Summary is loading", isLoading);
    let id = portfolioId ? portfolioId : PortfolioService.getLocalPortfolioId();
    let mounted = true;
    console.log("Portfolio Id passed: ", portfolioId, id);
    const portfolio = userNetWorthContext.portfolioSummaries.find(
      (portfolio) => portfolio.portfolioId === id
    );
    console.log(
      "SummaryCard input data:",
      portfolio,
      userNetWorthContext,
      listChanged
    );
    setPortfolioDetail(portfolio);
    setIsLoading(false);
    // Get quotes for each of the portfolios assets and calculate current value
    if (
      (portfolio?.summary.assets.length > 0 && mounted) ||
      listChanged.changed
    ) {
      console.log("show detail is true");
      // setShowDetail(true);
    } else {
      console.log("show detail is false");
    }

    return () => (mounted = false);
  }, [isLoading, listChanged, portfolioId, userNetWorthContext]);

  function handlePortfolioEdit() {
    console.log("Edit portfolio clicked...", portfolioDetail);
    setIsEditPortfolioModalOpen(true);
  }
  function handlePortfolioDelete() {
    console.log("portfolio delete clicked", portfolioDetail.portfolioId);
    const portfolioRecord = { _id: portfolioDetail.portfolioId };

    PortfolioService.deletePortfolio(portfolioRecord)
      .then((response) => {
        message.success(
          `The Portfolio called "${response.data.data.deletedPortfolio.portfolioName}" was deleted!`
        );
        setListChanged({
          changed: true,
          changeType: "DELETED_PORTFOLIO",
          portfolioId: portfolioId,
          portfolioName: portfolioDetail.portfolioName,
        });
        // setSelectedPortfolio("");
      })
      .catch((error) => {
        console.log("Error deleting portfolio: ", error);
      });
  }
  function addSymbolClicked() {
    console.log("portfolio add symbol clicked");
    setIsAddSymbolModalOpen(true);
  }

  console.log("asset Summary: ", portfolioDetail?.summary?.assets);

  return (
    <Fragment>
      {isLoading ? <Spinner /> : null}
      {!isLoading ? (
        <Card
          hoverable={false}
          size="small"
          bordered={false}
          className="portfolio-summary-card"
        >
          <NewPortfolioHeading
            portfolioName={portfolioDetail?.portfolioName}
            portfolioDescription={portfolioDetail?.portfolioDescription}
          />
          <Fragment>
            <Row
              justify={"space-between"}
              className="portfolio-summary-card-row"
              key={"detail"}
            >
              <Col className="portfolio-summary-card-net-worth">
                <Paragraph className="portfolio-summary-card-heading">
                  Portfolio Net Worth
                </Paragraph>
                <FormattedNumber
                  value={portfolioDetail?.summary.portfolioNetWorth}
                  type="CURRENCY"
                  digits={2}
                />
              </Col>
              <Col>
                <Paragraph className="portfolio-summary-card-heading">
                  Day's Gain
                </Paragraph>
                <FormattedNumber
                  value={portfolioDetail?.summary.portfolioDaysChange}
                  type="CURRENCY"
                  color={true}
                  digits={2}
                />
              </Col>
              <Col>
                <Paragraph className="portfolio-summary-card-heading">
                  Book Value
                </Paragraph>
                <FormattedNumber
                  value={portfolioDetail?.summary.portfolioTotalBookValue}
                  type="CURRENCY"
                  digits={2}
                />
              </Col>
              <Col>
                <Paragraph className="portfolio-summary-card-heading">
                  Total Return
                </Paragraph>
                <FormattedNumber
                  value={portfolioDetail?.summary.portfolioTotalReturn}
                  type="CURRENCY"
                  color={true}
                  digits={2}
                />
              </Col>
              <Col>
                <Paragraph className="portfolio-summary-card-heading">
                  Action
                </Paragraph>
                <span>
                  <Space size="small">
                    <Link onClick={() => handlePortfolioEdit()}>
                      <EditOutlined />
                    </Link>
                    <TbMinusVertical />
                    <Popconfirm
                      title="Delete portfolio?"
                      okType="primary"
                      placement="left"
                      color="var(--dk-gray-300)"
                      onConfirm={() => handlePortfolioDelete("xxxxx")}
                    >
                      <Link>
                        <BsTrash />
                      </Link>
                    </Popconfirm>
                  </Space>
                </span>
              </Col>
            </Row>
          </Fragment>
          {/* // ) : null} */}
          {portfolioDetail?.summary.assets?.length > 0 ? (
            <Fragment
            // hoverable={false}
            // size="small"
            // bordered={false}
            // className="portfolio-summary-card-detail"
            >
              <Row justify={"start"}>
                {/* <Col span={17}></Col> */}
                <Col span={5}>
                  <Button
                    style={{ margin: "1rem 0" }}
                    icon={<PlusCircleOutlined />}
                    type="primary"
                    // style={{ color: "var(--dk-gray-200)", fontSize: "115%" }}
                    onClick={addSymbolClicked}
                  >
                    Add Symbol
                  </Button>
                </Col>
              </Row>
              {/* <PortfolioChangeContext.Provider
              value={[listChanged, setListChanged]}
            > */}
              <PortfolioDetailTable
                portfolioId={portfolioId}
                assetSummaries={portfolioDetail?.summary?.assets}
              />
            </Fragment>
          ) : (
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
                Your portfolio asset list is empty. Add one or more symbols to
                start defining your porfolio asset details.
              </Row>
              <Row justify="space-around">
                <Button type="primary" onClick={addSymbolClicked}>
                  <PlusCircleOutlined />
                  Add Symbol
                </Button>
              </Row>
            </Card>
          )}
        </Card>
      ) : null}

      {isEditPortfolioModalOpen ? (
        <EditPortfolio
          record={portfolioDetail}
          setIsModalOpen={setIsEditPortfolioModalOpen}
          isModalOpen={isEditPortfolioModalOpen}
          setPortfolioChanged={setListChanged}
        />
      ) : null}
      {isAddSymbolModalOpen ? (
        <NewTickerLookup
          setIsAddSymbolModalOpen={setIsAddSymbolModalOpen}
          isAddSymbolModalOpen={isAddSymbolModalOpen}
          setPortfolioChanged={setListChanged}
          portfolioDetailRecord={portfolioDetail}
        />
      ) : null}
    </Fragment>
  );
}

export default NewPortfolioSummary;
