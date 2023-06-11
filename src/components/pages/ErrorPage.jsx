import { useRouteError, useNavigate } from "react-router-dom";
import { Layout, Result, Button } from "antd";

import Logo from "../ui/Logo";

import { contentStyle } from "../ui/ContentStyle";
import "./ErrorPage.css";

const { Content } = Layout;

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "An error occurred!";
  let message = "Something went wrong???";

  if (error.status === 500) {
    message = error.data.message;
  }

  if (error.status === 404) {
    title = "Not found!";
    message = "Could not find resource or page.";
  }

  function homeButtonClicked() {
    navigate("/");
  }

  return (
    <>
      {/* <MainNavigation /> */}
      <Content style={contentStyle}>
        <Logo />
        <Result
          status={error.status}
          title={<h1 style={{ color: "var(--dk-gray-100)" }}>{title}</h1>}
          subTitle={<h2 style={{ color: "var(--dk-gray-300)" }}>{message}</h2>}
          extra={
            <Button onClick={homeButtonClicked} type="primary">
              Back Home
            </Button>
          }
        ></Result>
        {/* <h1>{title}</h1>
        <p>{message}</p> */}
      </Content>
    </>
  );
}

export default ErrorPage;
