import React, { useState, useEffect, useContext } from "react";
import { Link, useLoaderData } from "react-router-dom";

import {
  Layout,
  Card,
  Table,
  Col,
  Row,
  Button,
  message,
  Popconfirm,
  Space,
  Divider,
  Spin,
  Select,
  Typography,
} from "antd";
import { RiPlayListAddLine } from "react-icons/ri";
import { BsTrash } from "react-icons/bs";

import { PortfolioContext } from "../store/portfolio.context";
import PortfolioService from "../services/portfolio.service";
import { contentStyle } from "../ui/ContentStyle";
import "./UserHome.css";
import Color from "../ui/Color";

import CreatePortfolio from "./CreatePortfolio";
import { CodepenOutlined, EditOutlined } from "@ant-design/icons";
import EditPortfolio from "./EditPortfolio";
import PortfolioSelect from "../ui/PortfolioSelect";
import PortfolioSummary from "./PortfolioSummary";
import LineChart from "../ui/PChart";
import PortfolioSummaryCard from "../ui/PortfolioSummaryCard";

const { Content } = Layout;
const { Text, Paragraph } = Typography;
const { Red, Green, C } = Color;

const UserHome = () => {
  // const userStuff = useLoaderData();

  const [portfolioContext, setPortfolioContext] = useState({});
  const [testUserPortfolios, setTestUserPortfolios] = useState([]);
  const [testAssetSummary, setTestAssetSummary] = useState([]);
  const [quote, setQuote] = useState({
    price: 0,
    change: 0,
    longName: "",
    symbol: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditPortfolioModalOpen, setIsEditPortfolioModalOpen] =
    useState(false);
  const [recordToEdit, setRecordToEdit] = useState({});
  const [selectedPortfolio, setSelectedPortfolio] = useState({
    value: "",
    label: "",
  });
  const [savedPortfolioName, setSavedPortfolioName] = useState("");
  const [showSelect, setShowSelect] = useState(false);

  const [portfolioChanged, setPortfolioChanged] = useState(true);
  // const { publicContent } = usePublicContent();
  // const { userPortfolios } = useGetPortfolios();
  const [userPortfolios, setUserPortfolios] = useState([]);
  const [showSummaryCard, setShowSummaryCard] = useState(false);

  const handlePortfolioEdit = (portfolioRecordToEdit) => {
    console.log("Edit portfolio clicked...", portfolioRecordToEdit);
    setRecordToEdit(portfolioRecordToEdit);
    setIsEditPortfolioModalOpen(true);
    setSavedPortfolioName(portfolioRecordToEdit.portfolioName);
  };

  const handlePortfolioDelete = (portfolioRecordToDelete) => {
    PortfolioService.deletePortfolio(portfolioRecordToDelete)
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

  // console.log("User Stuff: ", userStuff);
  console.log(
    "1 userHome: ",
    userPortfolios,
    userPortfolios.length > 0 ? "true" : "false"
  );

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
    {
      title: "Action",
      align: "center",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <span>
          <Space size="large">
            <Link onClick={() => handlePortfolioEdit(record)}>
              <EditOutlined />
            </Link>
            <Popconfirm
              title="
      Delete portfolio?"
              okType="primary"
              placement="left"
              color="var(--dk-gray-300)"
              // onCancel={cancelDelete}
              onConfirm={() => handlePortfolioDelete(record)}
            >
              <Link>
                <BsTrash />
              </Link>
            </Popconfirm>
          </Space>
        </span>
      ),
    },
  ];

  // Get Quotes

  // useEffect(() => {
  //   console.log("portfolioChanged", portfolioChanged);
  //   if (portfolioChanged) {
  //     let quote = "KMB";
  //     PortfolioService.getQuote(quote)
  //       .then((response) => {
  //         console.log("Quote: ", response);
  //         setQuote({
  //           price: response.delayedPrice,
  //           change: response.delayedChange,
  //           longName: response.detail.longName,
  //           symbol: response.detail.symbol,
  //         });
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // }, [portfolioChanged]);

  // useEffect(() => {
  //   console.log("Starting getPortfolios...");

  //   const getPortfolios = () => {
  //     PortfolioService.getUserPortfolios()
  //       .then((response) => {
  //         setUserPortfolios(
  //           response.data.map((portfolio) => {
  //             return { ...portfolio, key: portfolio._id };
  //           })
  //         );

  //         setSelectedPortfolio(
  //           response.data.length > 0
  //             ? {
  //                 label: response.data[0].portfolioName,
  //                 value: response.data[0]._id,
  //               }
  //             : { label: "", value: "" }
  //         );

  //         setPortfolioContext(
  //           response.data.length > 0
  //             ? {
  //                 label: response.data[0].portfolioName,
  //                 value: response.data[0]._id,
  //                 // assetSummary: oneData.assetSummary,
  //                 // totalBasis: oneData.totalBasis,
  //                 recordToEdit: response.data.portfolioDetail,
  //                 portfolios: response.data.map((portfolio) => {
  //                   return {
  //                     ...portfolio,
  //                     key: portfolio._id,
  //                   };
  //                 }),
  //               }
  //             : { label: "", value: "", portfolios: [] }
  //         );
  //         return;
  //       })
  //       .catch((error) => {
  //         console.log("Error Fetching users portfolios: ", error);
  //       });
  //   };

  //   setIsLoading(true);
  //   getPortfolios();

  //   // setShowSelect(userPortfolios.length > 0);
  //   // setSelectedPortfolio(
  //   //   userPortfolios.length > 0
  //   //     ? {
  //   //         label: userPortfolios[0].portfolioName,
  //   //         value: userPortfolios[0]._id,
  //   //       }
  //   //     : { label: "", value: "" }
  //   // );
  //   setIsLoading(false);
  // }, []);

  useEffect(() => {
    setIsLoading(true);
    getPortfolios();
    setIsLoading(false);
  }, []);

  const getPortfolios = () => {
    PortfolioService.getUserPortfolios()
      .then((response) => {
        setTestUserPortfolios(response.data);
        setUserPortfolios(
          response.data.map((portfolio) => {
            return { ...portfolio, key: portfolio._id };
          })
        );
        if (response.data.length > 0) {
          setTestAssetSummary(() => {
            PortfolioService.getOnePortfolio(response.data[0]._id)
              .then((res) => {
                console.log("portfolio data: ", response.data);
                setTestAssetSummary(res.data.portfolioAssetSummary);
                console.log("get one P: ", res);
                setPortfolioContext({
                  label: res.data.portfolioDetail.portfolioName,
                  value: res.data.portfolioDetail._id,
                  ...res.data,
                });
              })
              .catch((error) =>
                console.log("Error fetching user portfolios: ", error)
              );
          });
        } else {
          setTestAssetSummary([]);
        }
      })
      .catch((error) => console.log("Error fetching user portfolios: ", error));
  };

  // useEffect(() => {
  //   getAssetSummary();
  // }, []);

  // const getAssetSummary = () => {
  //   if (testUserPortfolios.length > 0) {
  //     PortfolioService.getOnePortfolio(testUserPortfolios.portfolios[0]._id)
  //       .then((response) => {
  //         setTestAssetSummary(response.data.getAssetSummary);
  //       })
  //       .catch((error) =>
  //         console.log("Error fetching user portfolios: ", error)
  //       );
  //   }
  // };

  // useEffect(() => {
  //   if (portfolioChanged) {
  //     PortfolioService.getUserPortfolios().then(
  //       (response) => {
  //         setUserPortfolios(
  //           response.data.map((data) => {
  //             return { ...data, key: data._id };
  //           })
  //         );
  //         // TODO Handle deleted portfolio if it was selected
  //         console.log("response data length: ", response.data.length);
  //         if (response.data.length > 0) {
  //           const portfolio = response.data.find(
  //             (item) => item._id === recordToEdit._id
  //           );
  //           if (portfolio) {
  //             console.log(
  //               "if portfolio: ",
  //               recordToEdit.portfolioName,
  //               portfolio.portfolioName
  //             );
  //             if (recordToEdit.portfolioName !== portfolio.portfolioName) {
  //               setSelectedPortfolio({
  //                 label: portfolio.portfolioName,
  //                 value: response.data[0]._id,
  //               });
  //               setPortfolioContext({
  //                 label: portfolio.portfolioName,
  //                 value: response.data[0]._id,
  //               });
  //               setShowSelect(true);
  //             }
  //           } else {
  //             setSelectedPortfolio({
  //               label: response.data[0].portfolioName,
  //               value: response.data[0]._id,
  //             });
  //             setPortfolioContext({
  //               label: response.data[0].portfolioName,
  //               value: response.data[0]._id,
  //             });
  //             setShowSelect(true);
  //           }
  //         } else {
  //           // No portfolios for this user account
  //           setShowSelect(false);
  //           setSelectedPortfolio({ value: "", label: "" });
  //         }
  //       },
  //       (error) => {
  //         const _content =
  //           (error.response && error.response.data) ||
  //           error.message ||
  //           error.toString();

  //         setUserPortfolios(_content);
  //       }
  //     );
  //     console.log(
  //       "selected Portfolio: ",
  //       selectedPortfolio,
  //       "userPortfolios: ",
  //       userPortfolios
  //     );
  //     setPortfolioChanged(false);
  //   }
  // }, [portfolioChanged, recordToEdit, selectedPortfolio, userPortfolios]);

  const onClickCreatePortfolio = () => {
    console.log("create portfolio clicked");
    // navigate("/createPortfolio");
    setIsModalOpen(true);
  };

  console.log("2 Selected portfolio: ", portfolioContext);

  // Render Content
  return (
    <PortfolioContext.Provider value={[portfolioContext, setPortfolioContext]}>
      <Content style={contentStyle}>
        {isLoading ? (
          <Spin size="large" tip="Loading" />
        ) : (
          <div>
            <Row className="dashboard-row">
              <Col
                md={{ span: 8 }}
                sm={{ span: 4 }}
                className="dashboard-heading"
              >
                {userPortfolios.length > 0 ? (
                  <div>
                    <PortfolioSelect
                      userPortfolios={userPortfolios}
                      setSelectedPortfolio={setSelectedPortfolio}
                      selectedPortfolio={portfolioContext}
                      defaultValue={portfolioContext}
                      setPortfolioChanged={setPortfolioChanged}
                    />
                  </div>
                ) : null}
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
                  <RiPlayListAddLine className="dashboard-icon" /> Create
                  Portfolio
                </Button>
              </Col>
            </Row>
            {userPortfolios.length > 0 ? (
              <PortfolioSummaryCard
                portfolioId={selectedPortfolio.value}
                setPortfolioChanged={setPortfolioChanged}
              />
            ) : null}
            {/* {showSelect ? (
            <PortfolioDetail portfolioDetail={recordToEdit} />
          ) : null} */}
            {/* {showSelect ? (
            <Table
              className="portfolio-table"
              size="small"
              columns={columns}
              dataSource={userPortfolios}
            />
          ) : null} */}

            {isModalOpen ? (
              <CreatePortfolio
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                setPortfolioChanged={setPortfolioChanged}
              />
            ) : null}

            {isEditPortfolioModalOpen ? (
              <EditPortfolio
                record={recordToEdit}
                setIsModalOpen={setIsEditPortfolioModalOpen}
                isModalOpen={isEditPortfolioModalOpen}
                setPortfolioChanged={setPortfolioChanged}
              />
            ) : null}

            <Paragraph
              style={{
                color: "var(--dk-gray-200)",
                fontSize: "250%",
                marginBottom: 0,
              }}
            >
              {quote.symbol !== "" ? <LineChart symbol={quote.symbol} /> : null}
              Quote for {quote.symbol}:{" "}
              <Green>
                {quote.price.toLocaleString("en-Us", {
                  style: "currency",
                  currency: "USD",
                })}{" "}
              </Green>
              <C change={quote.change}>{quote.change.toFixed(2)} </C>
            </Paragraph>
            <Paragraph style={{ fontSize: "175%", color: "var(--dk-gray-400" }}>
              {quote.longName}
            </Paragraph>
          </div>
        )}
      </Content>
    </PortfolioContext.Provider>
  );
};

export default UserHome;
