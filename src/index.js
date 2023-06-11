import React from "react";
import { App } from "antd";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

import { AuthContextProvider } from "./components/store/auth.context";
import "./index.css";
import MyApp from "./App";
import { ConfigProvider } from "antd";
// import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
TimeAgo.addDefaultLocale(en);
root.render(
  <AuthContextProvider>
    <BrowserRouter>
      <ConfigProvider
        theme={{ token: { colorPrimary: "#161338", colorInfo: "#7c77d1" } }}
      >
        <App>
          <MyApp />
        </App>
      </ConfigProvider>
    </BrowserRouter>
  </AuthContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
