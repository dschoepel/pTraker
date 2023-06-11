import { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, Tooltip, Button } from "antd";
import { DashboardOutlined, UploadOutlined } from "@ant-design/icons";
import { FcMoneyTransfer } from "react-icons/fc";
import { RiPlayListAddLine } from "react-icons/ri";

import AuthContext from "../store/auth.context";
import PortfolioService from "../services/portfolio.service";
import CreatePortfolio from "../pages/CreatePortfolio";
import "./DashboardMenu.css";
import _ from "lodash";

function getItem(label, key, icon, type, children) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

function DashboardMenu({ listChanged, setListChanged }) {
  const [portfolioMenu, setPortfolioMenu] = useState([
    { key: "p1", label: "Portfolios" },
  ]);
  const { isLoggedIn } = useContext(AuthContext);
  const [isAddPortfolioModalOpen, setIsAddPortfolioModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    PortfolioService.getUserPortfolios().then((portfolios) => {
      if ((mounted && isLoggedIn) || listChanged.changed) {
        const menuItems = [
          getItem(
            "Portfolios",
            "p1",
            <FcMoneyTransfer />,
            portfolios?.data.map((item) =>
              getItem(
                <Tooltip title={item.portfolioDescription} placement="rightTop">
                  <Link to={`/dashboard/${item._id}`}>
                    {item.portfolioName}
                  </Link>
                </Tooltip>,
                item._id
              )
            )
          ),
        ];
        setPortfolioMenu(menuItems);
        console.log("portfolios... ", portfolios);
        const toPortfolio = PortfolioService.setDefaultPortfolio(
          portfolios.data,
          ""
        );
        console.log("defaultPortfolio Id", toPortfolio);
        PortfolioService.setLocalPortfolioId(toPortfolio);
        setListChanged({ changed: false });
      }
    });

    return () => (mounted = false);
  }, [isLoggedIn, listChanged.changed, setListChanged]);

  const menuItem = [
    getItem("Add Portfolio", "add_portfolio", <RiPlayListAddLine />),
  ];

  function menuClicked({ key, keyPath, selectedKeys, domEvent }) {
    console.log("Menu clicked:", key, keyPath, selectedKeys, domEvent);
    setIsAddPortfolioModalOpen(true);
  }

  return (
    <>
      {isLoggedIn ? (
        <Menu
          theme="dark"
          mode="inline"
          onClick={menuClicked}
          className="side-menu"
          items={menuItem}
        />
      ) : // <div>
      //   <FcMoneyTransfer style={{ marginLeft: "2rem" }} />
      // <Button type="link" onClick={menuClicked}>
      //   Add Portfolio
      // </Button>
      // </div>
      null}
      {isAddPortfolioModalOpen ? (
        <CreatePortfolio
          setIsAddPortfolioModalOpen={setIsAddPortfolioModalOpen}
          isAddPortfolioModalOpen={isAddPortfolioModalOpen}
          setListChanged={setListChanged}
        />
      ) : null}
    </>
  );
}

export default DashboardMenu;
