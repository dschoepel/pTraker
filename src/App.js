import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { ConfigProvider, Layout } from "antd";

import { ImageContext } from "./components/store/image.context";

import SidebarService from "./components/services/sidebar.service";
import AuthService from "./components/services/auth.service";
import AuthContext from "./components/store/auth.context";

import TokenService from "./components/services/token.service";

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
      // setCurrentUser(user);
      // setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
  }, [authCtx]);

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

          <Layout className="site-layout">
            <Routes>
              {!authCtx.isLoggedIn ? (
                <Route path="/" element={<PublicHome />} />
              ) : null}
              {/* {authCtx.isLoggedIn ? (
                <Route
                  path="/dashboard/"
                  element={
                    <UserDashboard
                      listChanged={listChanged}
                      setListChanged={setListChanged}
                    />
                  }
                  // loader={async () => {
                  //   const userPortfolios =
                  //     await PortfolioService.getUserPortfolios();
                  //   return userPortfolios.data;
                  // }}
                />
              ) : null} */}
              <Route path="/register" element={<Register />} />
              <Route
                path="/verifyRegistration"
                element={<VerifyRegistration />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
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
                  path="/dashboard"
                  element={
                    <UserDashboard
                      listChanged={listChanged}
                      setListChanged={setListChanged}
                    />
                  }
                />
              )}
              {authCtx.isLoggedIn && (
                <Route
                  path="/dashboard/:portfolioId"
                  element={
                    <UserDashboard
                      listChanged={listChanged}
                      setListChanged={setListChanged}
                    />
                  }
                />
              )}
              <Route path="*" element={<PublicHome />} />
            </Routes>
          </Layout>

          <Footing />
        </Layout>
      </Layout>
    </ImageContext.Provider>
  );
};
export default App;
