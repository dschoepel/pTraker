import React, { useState } from "react";
import { Col, Divider, Layout, Menu, Row, Typography, Card } from "antd";

import AuthService from "../services/auth.service";
import SettingsMenu from "../ui/SettingsMenu";
import useWindowSize from "../hooks/useWindowSize";
import ImageCard from "../ui/ImageCard";
import NameCard from "../ui/NameCard";
import EmailCard from "../ui/EmailCard";
import PasswordCard from "../ui/PasswordCard";
import { contentStyle } from "../ui/ContentStyle";
import "./MyProfile.css";

const { Content, Sider } = Layout;
const { Title } = Typography;

const BASE_URL = process.env.REACT_APP_PTRACKER_API_BASE_URL;

function MyProfile1() {
  const [showProfile, setShowProfile] = useState(true);
  const [showAccount, setShowAccount] = useState(false);
  const [user] = useState(AuthService.getCurrentUser);
  const [author, setAuthor] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [img, setImage] = useState(
    user.profileImage
      ? BASE_URL + "/images/" + user.profileImage
      : BASE_URL + "/images/defaultperson.png"
  );

  const { width } = useWindowSize();

  function setSelection(option) {
    switch (option) {
      case "1":
        setShowProfile(true);
        setShowAccount(false);
        const { profileImage } = AuthService.getCurrentUser();
        setImage(
          profileImage
            ? BASE_URL + "/images/" + profileImage
            : BASE_URL + "/images/defaultperson.png"
        );
        break;
      case "2":
        setShowAccount(true);
        setShowProfile(false);
        break;
      default:
        console.log("Invalid selection? ", option);
    }
  }

  // Highlight settings menu option currently active
  const settingsSelection = (option) => {
    console.log("Clicked key: ", option);
    setSelection(option);
  };

  return (
    <Layout className="profile-layout">
      <Divider className="profile-divider-horizontal" />
      <Layout className="settings-menu">
        <h2 className="profile-menu-title">Settings</h2>
        <SettingsMenu selectedSetting={settingsSelection}></SettingsMenu>

        {width > 400 ? (
          <Divider type="vertical" className="profile-divider-vertical" />
        ) : null}
        {showProfile ? (
          <Content>
            <Row className="settings-row" wrap="true">
              <Col flex={2} className="profile-col1">
                <h4>Profile Image</h4>
              </Col>
              <Col flex={5}>
                <ImageCard
                  title={"Upload New Image"}
                  author={author}
                  img={img}
                />
              </Col>
            </Row>
            <Row className="settings-row" wrap="true">
              <Col flex={3} className="profile-col1">
                <h4>User Name</h4>
                <p>Your full name or a nickname works best here.</p>
              </Col>
              <Col flex={7}>
                <NameCard username={author} setAuthor={setAuthor} />
              </Col>
            </Row>
          </Content>
        ) : null}
        {showAccount ? (
          <Content>
            <Row className="settings-row" wrap="true">
              <Col flex={2} className="profile-col1">
                <h4>Email</h4>
                <p>
                  This is where all notifications will be sent, including lost
                  password requests.
                </p>
              </Col>
              <Col flex={5}>
                <EmailCard
                  style={{ maxWidth: "50rem" }}
                  email={email}
                  setEmail={setEmail}
                />
              </Col>
            </Row>
            <Row className="settings-row" wrap="true">
              <Col flex={3} className="profile-col1">
                <h4>Update Password</h4>
                <p>Enter values in all fields to change your password.</p>
              </Col>
              <Col flex={7}>
                <PasswordCard />
              </Col>
            </Row>
          </Content>
        ) : null}
      </Layout>
    </Layout>
  );
}

export default MyProfile1;
