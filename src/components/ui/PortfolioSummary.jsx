import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Space, Popconfirm, message, Button } from "antd";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { BsTrash } from "react-icons/bs";
import { TbMinusVertical } from "react-icons/tb";

import PortfolioService from "../services/portfolio.service";
import EditPortfolio from "../pages/EditPortfolio";
import PortfolioDetail from "./PortfolioDetail";

import "./PortfolioSummary.css";
import Color from "./Color";

const { Green, Red } = Color;

function PortfolioSummary({
  portfolioData,
  portfolioData: { portfolioDetail, portfolioAssetSummary, portfolioCostBasis },
  setListChanged,
  listChanged,
}) {
  const [totalBasis, setTotalBasis] = useState(0);
  const [netWorth, setNetWorth] = useState(0);
  const [gainLoss, setGainLoss] = useState(0);
  const [isEditPortfolioModalOpen, setIsEditPortfolioModalOpen] =
    useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [assetSummary, setAssetSummary] = useState([]);

  useEffect(() => {
    let portfolioAssets = [];
    let mounted = true;
    console.log("SummaryCard input data:", portfolioData, listChanged);
    // Get quotes for each of the portfolios assets and calculate current value
    if (
      (portfolioData?.portfolioAssetSummary.length > 0 && mounted) ||
      listChanged.changed
    ) {
      PortfolioService.sumPortfolio(portfolioAssetSummary).then(
        (summaryData) => {
          const {
            totalNetWorth,
            gainLossTotal,
            assetBasisTotal,
            portfolioAssets,
          } = summaryData;
          console.log("summaryData:", summaryData);
          setNetWorth(totalNetWorth);
          setGainLoss(gainLossTotal);
          setTotalBasis(assetBasisTotal);
          setAssetSummary(portfolioAssets);
        }
      );

      setShowDetail(true);
    } else {
      setShowDetail(false);
    }
    // setAssetSummary(portfolioAssets);
    // console.log("portfolioAssets: ", portfolioAssets);
    return () => (mounted = false);
  }, [listChanged, portfolioAssetSummary, portfolioData]);

  function handlePortfolioEdit() {
    console.log("Edit portfolio clicked...");
    setIsEditPortfolioModalOpen(true);
  }
  function handlePortfolioDelete() {
    console.log("portfolio delete clicked", portfolioDetail._id);
    PortfolioService.deletePortfolio(portfolioDetail)
      .then((response) => {
        message.success(
          `The Portfolio called "${response.data.data.deletedPortfolio.portfolioName}" was deleted!`
        );
        setListChanged({
          changed: true,
          changeType: "DELETED_PORTFOLIO",
          portfolioId: portfolioDetail._id,
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
  }

  console.log("asset Summary: ", assetSummary);

  return (
    <Fragment>
      <Card
        hoverable={false}
        size="small"
        bordered={false}
        className="portfolio-summary-card"
      >
        {/* First row */}
        <Row
          justify={"space-betwen"}
          className="portfolio-summary-card-heading"
          key={"heading"}
        >
          <Col span={8}>Total Net Worth</Col>
          <Col span={4}>Day's Gain</Col>
          <Col span={4}>Book Value</Col>
          <Col span={4}>Total Return</Col>
          <Col span={4}>Action</Col>
        </Row>
        {/* Second row */}
        <Row
          justify={"space-between"}
          className="portfolio-summary-card-row"
          key={"detail"}
        >
          <Col span={8} className="portfolio-summary-card-net-worth">
            {`USD${netWorth.toLocaleString("en-us", {
              style: "currency",
              currency: "USD",
            })}`}
          </Col>
          <Col span={4}>
            {gainLoss >= 0 ? (
              <Green>
                {gainLoss.toLocaleString("en-us", {
                  style: "currency",
                  currency: "USD",
                  currencySign: "accounting",
                  signDisplay: "always",
                })}
              </Green>
            ) : (
              <Red>
                {gainLoss.toLocaleString("en-us", {
                  style: "currency",
                  currency: "USD",
                  currencySign: "accounting",
                  signDisplay: "always",
                })}
              </Red>
            )}
          </Col>
          <Col span={4}>
            {totalBasis.toLocaleString("en-us", {
              style: "currency",
              currency: "USD",
            })}
          </Col>
          <Col span={4}>
            {netWorth - totalBasis >= 0 ? (
              <Green>
                {(netWorth - totalBasis).toLocaleString("en-us", {
                  style: "currency",
                  currency: "USD",
                  currencySign: "accounting",
                  signDisplay: "always",
                })}
              </Green>
            ) : (
              <Red>
                {(netWorth - totalBasis).toLocaleString("en-us", {
                  style: "currency",
                  currency: "USD",
                  currencySign: "accounting",
                  signDisplay: "always",
                })}
              </Red>
            )}
          </Col>
          <Col span={4}>
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
                  onConfirm={() => handlePortfolioDelete()}
                >
                  <Link>
                    <BsTrash />
                  </Link>
                </Popconfirm>
              </Space>
            </span>
          </Col>
        </Row>
        {showDetail ? (
          <Card
            hoverable={false}
            size="small"
            bordered={false}
            className="portfolio-summary-card-detail"
          >
            <Row justify={"end"}>
              <Col span={17}></Col>
              <Col span={5}>
                <Button
                  icon={<PlusCircleOutlined />}
                  type="primary"
                  // style={{ color: "var(--dk-gray-200)", fontSize: "115%" }}
                  onClick={addSymbolClicked}
                >
                  Add Symbol
                </Button>
              </Col>
            </Row>

            {/* <PortfolioDetail
              portfolioDetail={props.portfolioData.portfolioDetail}
              portfolioAssetSummary={props.portfolioData.portfolioAssetSummary}
            /> */}
          </Card>
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
              Your portfolio list is empty. Add one or more symbols to start
              building your porfolio details.
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
      {isEditPortfolioModalOpen ? (
        <EditPortfolio
          record={portfolioData}
          setIsModalOpen={setIsEditPortfolioModalOpen}
          isModalOpen={isEditPortfolioModalOpen}
          setPortfolioChanged={setListChanged}
        />
      ) : null}
    </Fragment>
  );
}

export default PortfolioSummary;
