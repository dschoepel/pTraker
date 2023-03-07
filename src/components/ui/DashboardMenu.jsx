import { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, Tooltip } from "antd";
import { DashboardOutlined, UploadOutlined } from "@ant-design/icons";
import { FcMoneyTransfer } from "react-icons/fc";

import AuthContext from "../store/auth.context";
import PortfolioServices from "../services/portfolio.service";
import "./DashboardMenu.css";

function getItem(label, key, icon, children, type) {
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

  useEffect(() => {
    let mounted = true;
    PortfolioServices.getUserPortfolios().then((portfolios) => {
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
        const toPortfolio = PortfolioServices.setDefaultPortfolio(
          portfolios.data,
          ""
        );
        console.log("defaultPortfolio Id", toPortfolio);
        PortfolioServices.setLocalPortfolioId(toPortfolio);
        setListChanged({ changed: false });
      }
    });

    return () => (mounted = false);
  }, [isLoggedIn, listChanged.changed, setListChanged]);

  function menuClicked(e) {
    // console.log("Menu clicked:", e);
  }

  return (
    <>
      {isLoggedIn ? (
        <Menu
          theme="dark"
          mode="inline"
          onSelect={menuClicked}
          className="side-menu"
          items={portfolioMenu}
        />
      ) : null}
    </>
  );
}

export default DashboardMenu;
