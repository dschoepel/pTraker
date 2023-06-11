import React, { useState, useEffect, useContext, Fragment } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { ConfigProvider, Layout } from "antd";

import { ImageContext } from "./components/store/image.context";

import SidebarService from "./components/services/sidebar.service";
import AuthService from "./components/services/auth.service";
import AuthContext from "./components/store/auth.context";

import TokenService from "./components/services/token.service";
import { PortfolioChangeContext } from "./components/store/portfolioChange.context";

import SideBar from "./components/ui/SideBar";
import Heading from "./components/ui/Heading";
import PublicHome from "./components/pages/PublicHome";
import UserHome from "./components/pages/UserHome";
import Login from "./components/pages/Login";
import Logout from "./components/pages/Logout";
import Register from "./components/pages/Register";
import VerifyRegistration from "./components/pages/VerifyRegistration";
import Footing from "./components/ui/Footing";
import EmailReVerification from "./components/pages/EmailReVerification";
import EmailVerification from "./components/pages/EmailVerification";
import MyProfile from "./components/pages/MyProfile";
import PasswordReset from "./components/pages/PasswordReset";
import TickerLookup from "./components/pages/TickerLookup";
import CreatePortfolio from "./components/pages/CreatePortfolio";
import UserDashboard from "./components/pages/UserDashboard";
import NewUserDashboard from "./components/pages/NewUserDashboard";
import NewUserDashboardHome from "./components/pages/NewUserDashboardHome";
import SetHomePage from "./components/ui/SetHomePage";
import BusinessNewsFeed from "./components/ui/BusinessNewsFeed";
import BusinessNews from "./components/ui/BusinessNews";
import ATemp from "./components/pages/ATemp";
import ExpiredToken from "./components/pages/ExpiredToken";
import ImportSymbols from "./components/pages/ImportSymbols";

import "./App.css";
import PortfolioService from "./components/services/portfolio.service";

const { getIsCollapsed, setIsCollapsed } = SidebarService;

const App = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [imageContext, setImageContext] = useState(
    authCtx.isLoggedIn ? TokenService.getUserProfileImage : null
  );

  const [collapsed, setCollapsed] = useState(getIsCollapsed);
  const [listChanged, setListChanged] = useState({
    changed: false,
    changeType: "",
    portfolioId: "",
    portfolioName: "",
  });

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setIsCollapsed(!collapsed);
  };

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    console.log("UseEffect App.js: ", user);

    if (user) {
      authCtx.aLogin(user.accessToken);
      setImageContext(user.profileImage);
      // navigate("/dashboard");
      // setCurrentUser(user);
      // setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
  }, [authCtx, navigate]);

  useEffect(() => {
    async function runEffect() {
      if (listChanged.changed && authCtx.isLoggedIn) {
        console.log("the list was changed...", listChanged);
        const response = await PortfolioService.handleListChanges(
          listChanged.changeType,
          listChanged.portfolioId,
          listChanged.portfolioName
        );
        console.log("handleListChange response: ", response);
        if (response.action === "navigate") {
          console.log("Navigating to: ", response.to);

          navigate(`/dashboard/${response.to}`);
        } else {
          console.log("handle list change response not correct?", response);
        }
      }
    }

    runEffect();
  }, [authCtx.isLoggedIn, listChanged, navigate]);

  return (
    <ImageContext.Provider value={[imageContext, setImageContext]}>
      <Layout hasSider="true">
        <SideBar
          collapsed={collapsed}
          listChanged={listChanged}
          setListChanged={setListChanged}
        />
        <Layout className="site-layout">
          <Heading
            toggleCollapsed={toggleCollapsed}
            collapsed={collapsed}
          ></Heading>

          <PortfolioChangeContext.Provider
            value={[listChanged, setListChanged]}
          >
            <Layout className="site-layout">
              <Routes>
                {!authCtx.isLoggedIn ? (
                  <Route path="/public" element={<PublicHome />} />
                ) : null}
                <Route path="/register" element={<Register />} />
                <Route
                  path="/verifyRegistration"
                  element={<VerifyRegistration />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/expiredLogin" element={<ExpiredToken />} />
                <Route
                  path="/news"
                  element={<BusinessNews fullscreen={true} />}
                />
                <Route path="/upload" element={<ImportSymbols />} />
                <Route
                  path="/emailReVerification"
                  element={<EmailReVerification />}
                />
                <Route
                  path="/emailVerification/:verificationToken"
                  element={<EmailVerification />}
                />
                <Route
                  path="/emailVerification"
                  element={<EmailVerification />}
                />
                <Route path="/tickerLookup" element={<TickerLookup />} />
                <Route path="/passwordReset" element={<PasswordReset />} />
                {authCtx.isLoggedIn && (
                  <Route path="/myProfile" element={<MyProfile />} />
                )}
                {authCtx.isLoggedIn && (
                  <Route
                    path="/dashboard/:portfolioId"
                    element={
                      <NewUserDashboard
                        listChanged={listChanged}
                        setListChanged={setListChanged}
                      />
                    }
                  />
                )}
                {authCtx.isLoggedIn && (
                  <Route
                    path="/dashboard"
                    element={
                      <NewUserDashboardHome
                        listChanged={listChanged}
                        setListChanged={setListChanged}
                      />
                    }
                  />
                )}
                <Route path="*" element={<SetHomePage />} />
              </Routes>
            </Layout>
          </PortfolioChangeContext.Provider>

          <Footing />
        </Layout>
      </Layout>
    </ImageContext.Provider>
  );
};
export default App;
