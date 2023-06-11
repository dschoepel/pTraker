import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "antd";

import { UserNetWorthContext } from "../store/userNetWorth.context";
import PortfolioService from "../services/portfolio.service";
import NoPortfolio from "../ui/NoPortfolio";

import "./NewUserDashboardHome.css";

function NewUserDashboardHome({ listChanged, setListChanged }) {
  const [userNetWorthContext, setUserNetWorthContext] = useState();
  const [portfolioId, setPortfolioId] = useState(
    PortfolioService.getLocalPortfolioId()
  );
  const navigate = useNavigate();

  useEffect(() => {
    PortfolioService.getDefaultPortfolio()
      .then((portfolio) => {
        console.log("effect get default portfolio: ", portfolio);
        if (portfolio.data._id) {
          navigate(`/dashboard/${portfolio.data._id}`);
        }
        if (!portfolio.success) {
          console.log(
            `Status code ${portfolio.statusCode}, message: ${portfolio.data.message}`
          );
          navigate(`/expiredLogin`);
        }
      })
      .catch((error) => {
        console.log("Error fetching default portfolio! ", error);
      });
  });

  return (
    <UserNetWorthContext.Provider
      value={[userNetWorthContext, setUserNetWorthContext]}
    >
      <Layout className="user-dashboard-home">
        {!portfolioId ? <NoPortfolio setListChanged={setListChanged} /> : null}
      </Layout>
    </UserNetWorthContext.Provider>
  );
}

export default NewUserDashboardHome;
