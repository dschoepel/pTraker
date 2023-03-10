import React, {
  useState,
  useEffect,
  Fragment,
  useContext,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Space, Popconfirm, message, Button } from "antd";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { BsTrash } from "react-icons/bs";
import { TbMinusVertical } from "react-icons/tb";

import { PortfolioContext } from "../store/portfolio.context";

import PortfolioService from "../services/portfolio.service";
import EditPortfolio from "../pages/EditPortfolio";
import PortfolioDetail from "./PortfolioDetail";
import TickerLookup from "../pages/TickerLookup";
import "./PortfolioSummaryCard.css";
import Color from "./Color";

const { Green, Red } = Color;

function PortfolioSummaryCard({ portfolioId, setPortfolioChanged }) {
  const [portfolioContext, setPortfolioContext] = useContext(PortfolioContext);
  const [totalBasis, setTotalBasis] = useState(0);
  const [netWorth, setNetWorth] = useState(0);
  const [gainLoss, setGainLoss] = useState(0);
  const [assetSummary, setAssetSummary] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [isEditPortfolioModalOpen, setIsEditPortfolioModalOpen] =
    useState(false);
  const [recordToEdit, setRecordToEdit] = useState({});
  const [savedPortfolioName, setSavedPortfolioName] = useState("");
  const [portfolioAssetDetail, setPortolioAssetDetail] = useState([]);
  const [isAddSymbolModalOpen, setIsAddSymbolModalOpen] = useState(false);

  const pricedAssets = useRef([]);

  console.log("Context is: ", portfolioContext);

  // Get Portfolio net worth...

  useEffect(() => {
    let totalNetWorth = 0;
    let gainLossTotal = 0;
    let portfolioAssets = [];
    console.log(
      "portfoilo context summary card: ",
      portfolioContext,
      portfolioContext.label
    );
    setRecordToEdit(portfolioContext.portfolioDetail);
    if (portfolioContext.label) {
      if (portfolioContext.portfolioAssetSummary.length > 0) {
        portfolioContext.portfolioAssetSummary.forEach(async function (asset) {
          const quote = await PortfolioService.getQuote(asset.assetSymbol);
          // console.log("Quote: ", quote);
          if (quote.success) {
            totalNetWorth += quote.delayedPrice * asset.assetQtyTotal;
            gainLossTotal += quote.delayedChange * asset.assetQtyTotal;
            // console.log("for each...", totalNetWorth, asset);
            portfolioAssets.push({
              ...asset,
              displayName: quote.detail.displayName,
              lastPrice: quote.delayedPrice,
              lastChange: quote.delayedChange,
            });
            setNetWorth(totalNetWorth);
            setGainLoss(gainLossTotal);

            pricedAssets.current = [...portfolioAssets].sort((a, b) => {
              if (a.assetSymbol > b.assetSymbol) {
                return 1;
              }
              if (a.assetSymbol < b.assetSymbol) {
                return -1;
              }
              return 0;
            });

            pricedAssets.current.map((asset, index) => {
              return portfolioContext.portfolioAssetSummary.splice(
                index,
                1,
                asset
              );
            });
            portfolioAssets.map((asset, index) => {
              return portfolioContext.portfolioAssetSummary.splice(
                index,
                1,
                asset
              );
            });
            // setPortolioAssetDetail(portfolioAssets);
            setPortolioAssetDetail(pricedAssets.current);
            console.log("PricedAssets", pricedAssets.current);
            console.log(portfolioContext.portfolioAssetSummary);
          }
        });
        setShowDetail(true);
      } else {
        setShowDetail(false);
      }
    } else {
      setShowDetail(false);
      setNetWorth(0);
      setGainLoss(0);
    }
  }, [portfolioContext]);

  const handlePortfolioEdit = () => {
    console.log("Edit portfolio clicked...", recordToEdit);
    setRecordToEdit(recordToEdit);
    setIsEditPortfolioModalOpen(true);
    setSavedPortfolioName(recordToEdit.portfolioName);
  };

  const handlePortfolioDelete = () => {
    PortfolioService.deletePortfolio(recordToEdit)
      .then((response) => {
        message.success(
          `The Portfolio called "${response.data.data.deletedPortfolio.portfolioName}" was deleted!`
        );
        setPortfolioChanged(true);
        // setSelectedPortfolio("");
      })
      .catch((error) => {
        console.log("Error deleting: ", error);
      });
  };

  const addSymbolClicked = () => {
    console.log("Add symbol clicked");
    setIsAddSymbolModalOpen(true);
  };

  return (
    <Fragment>
      <Row>
        <Card
          hoverable={false}
          size="small"
          bordered={false}
          className="portfolio-summary-card"
          // title={
          //   <Typography.Title level={4}>
          //     {recordToEdit.portfolioName}
          //   </Typography.Title>
          // }
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
                    // onCancel={cancelDelete}
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

              <PortfolioDetail
                portfolioDetail={recordToEdit}
                portfolioAssetSummary={portfolioAssetDetail}
              />
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
      </Row>

      {isEditPortfolioModalOpen ? (
        <EditPortfolio
          record={recordToEdit}
          setIsModalOpen={setIsEditPortfolioModalOpen}
          isModalOpen={isEditPortfolioModalOpen}
          setPortfolioChanged={setPortfolioChanged}
        />
      ) : null}
      {isAddSymbolModalOpen ? (
        <TickerLookup
          setIsAddSymbolModalOpen={setIsAddSymbolModalOpen}
          isAddSymbolModalOpen={isAddSymbolModalOpen}
          setPortfolioChanged={setPortfolioChanged}
          portfolioDetailRecord={recordToEdit}
        />
      ) : null}
    </Fragment>
  );
}

export default PortfolioSummaryCard;
