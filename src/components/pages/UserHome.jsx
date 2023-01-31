import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

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
} from "antd";
import { RiPlayListAddLine } from "react-icons/ri";
import { BsTrash } from "react-icons/bs";

import PortfolioService from "../services/portfolio.service";
import { contentStyle } from "../ui/ContentStyle";
import "./UserHome.css";

import CreatePortfolio from "./CreatePortfolio";
import { CodepenOutlined, EditOutlined } from "@ant-design/icons";
import EditPortfolio from "./EditPortfolio";
import PortfolioSelect from "../ui/PortfolioSelect";
import PortfolioSummary from "./PortfolioSummary";

const { Content } = Layout;

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
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

  console.log(
    "userHome: ",
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

  useEffect(() => {
    console.log("portfolioChanged", portfolioChanged);
  }, [portfolioChanged]);

  useEffect(() => {
    if (portfolioChanged) {
      setIsLoading(false);
      PortfolioService.getUserPortfolios().then(
        (response) => {
          setUserPortfolios(
            response.data.map((data) => {
              return { ...data, key: data._id };
            })
          );
          // TODO Handle deleted portfolio if it was selected
          if (response.data.length > 0) {
            const portfolio = response.data.find(
              (item) => item._id === recordToEdit._id
            );
            if (portfolio) {
              if (recordToEdit.portfolioName !== portfolio.portfolioName) {
                setSelectedPortfolio({
                  label: portfolio.portfolioName,
                  value: response.data[0]._id,
                });
                setShowSelect(true);
              }
            } else {
              setSelectedPortfolio({
                label: response.data[0].portfolioName,
                value: response.data[0]._id,
              });
              setShowSelect(true);
            }
          } else {
            // No portfolios for this user account
            setShowSelect(false);
            setSelectedPortfolio({ value: "", label: "" });
          }
        },
        (error) => {
          const _content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();

          setUserPortfolios(_content);
        }
      );
      console.log(
        "selected Portfolio: ",
        selectedPortfolio,
        "userPortfolios: ",
        userPortfolios
      );
      setPortfolioChanged(false);
    }
  }, [portfolioChanged, recordToEdit, selectedPortfolio, userPortfolios]);

  const onClickCreatePortfolio = () => {
    console.log("create portfolio clicked");
    // navigate("/createPortfolio");
    setIsModalOpen(true);
  };

  console.log("Selected portfolio: ", selectedPortfolio, userPortfolios);

  // Render Content
  return (
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
              {showSelect ? (
                <div>
                  <PortfolioSelect
                    userPortfolios={userPortfolios}
                    setSelectedPortfolio={setSelectedPortfolio}
                    selectedPortfolio={selectedPortfolio}
                    defaultValue={selectedPortfolio}
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
          {showSelect ? (
            <Table
              className="portfolio-table"
              size="small"
              columns={columns}
              dataSource={userPortfolios}
            />
          ) : null}
          {showSelect ? (
            <PortfolioSummary
              portfolioId={selectedPortfolio.value}
              portfolios={userPortfolios}
            />
          ) : null}

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
        </div>
      )}
    </Content>
  );
};

export default Home;
