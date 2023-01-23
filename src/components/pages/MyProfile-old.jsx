import React, { useState } from "react";
import { Layout, Col, Row, Typography } from "antd";
import ImageCard from "../ui/ImageCard";
import NameCard from "../ui/NameCard";
import EmailCard from "../ui/EmailCard";
import PasswordCard from "../ui/PasswordCard";
import SettingsMenu from "../ui/SettingsMenu";
import AuthService from "../services/auth.service";

import "./MyProfile-old.css";

const BASE_URL = process.env.REACT_APP_PTRACKER_API_BASE_URL;

const { Paragraph } = Typography;

function MyProfile(props) {
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

  const settingsSelection = (option) => {
    console.log("Clicked key: ", option);
    setSelection(option);
  };

  return (
    <Layout className="profile-container">
      <Row align="top" justify="space-between">
        <Col>
          <Row>
            <h1
              style={{
                fontSize: "175%",
                color: "var(--dk-gray-100)",
                margin: "1rem",
                // fontFamily: "Monserrat, sans-serif",
              }}
            >
              Settings
            </h1>
          </Row>
          <Row>
            <SettingsMenu selectedSetting={settingsSelection} />
          </Row>
        </Col>
        <Col>
          <Row>
            {showProfile ? (
              <h3
                style={{
                  fontSize: "125%",
                  color: "var(--dk-gray-100)",
                  // fontFamily: "Monserrat, sans-serif",
                  margin: "2rem 1rem 0rem 1rem",
                }}
              >
                Profile Image
              </h3>
            ) : null}
            {showAccount ? (
              <>
                <h3
                  level={3}
                  style={{
                    fontSize: "125%",
                    color: "var(--dk-gray-100)",
                    // fontFamily: "Monserrat, sans-serif",
                    margin: "2rem 1rem 0rem 1rem",
                  }}
                >
                  Email
                </h3>
              </>
            ) : null}
          </Row>
          <Row>
            {showProfile ? (
              <ImageCard title={"Upload New Image"} author={author} img={img} />
            ) : null}
            {showAccount ? (
              <Paragraph
                style={{
                  maxWidth: "40rem",
                  margin: "0.5rem 1rem",
                  color: "var(--dk-gray-100)",
                }}
              >
                This is where all notifications will be sent, including lost
                password requests.
              </Paragraph>
            ) : null}
          </Row>
          <Row>
            {showProfile ? (
              <h3
                style={{
                  fontSize: "125%",
                  color: "var(--dk-gray-100)",
                  // fontFamily: "Monserrat, sans-serif",
                  margin: "2rem 1rem 0rem 1rem",
                }}
              >
                User Name
              </h3>
            ) : null}

            {showAccount ? (
              <EmailCard
                style={{ maxWidth: "50rem" }}
                email={email}
                setEmail={setEmail}
              />
            ) : null}
          </Row>
          <Row>
            {showProfile ? (
              <NameCard username={author} setAuthor={setAuthor} />
            ) : null}
            {showAccount ? (
              <h3
                style={{
                  fontSize: "125%",
                  color: "var(--dk-gray-100)",
                  // fontFamily: "Monserrat, sans-serif",
                  margin: "2rem 1rem 0rem 1rem",
                }}
              >
                Update Password
              </h3>
            ) : null}
          </Row>
          <Row>
            {showAccount ? (
              <Paragraph
                style={{
                  maxWidth: "50rem",
                  margin: "0.5rem 1rem",
                  color: "var(--dk-gray-100)",
                }}
              >
                Enter all fields to change your password.
              </Paragraph>
            ) : null}
          </Row>
          <Row>{showAccount ? <PasswordCard></PasswordCard> : null}</Row>
        </Col>
      </Row>
    </Layout>
  );
}

export default MyProfile;
