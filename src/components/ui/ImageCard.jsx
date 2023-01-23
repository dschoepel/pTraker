import React, { useState, useContext } from "react";

import { ImageContext } from "../store/image.context";
import AuthService from "../services/auth.service";
import TokenService from "../services/token.service";
import ImgCrop from "antd-img-crop";

import {
  Upload,
  Button,
  Progress,
  message,
  Typography,
  Row,
  Col,
  Card,
  Image,
} from "antd";
import "./ImageCard.css";

const BASE_URL = process.env.REACT_APP_PTRACKER_API_BASE_URL;

function ImageCard(props) {
  const [imageContext, setImageContext] = useContext(ImageContext);
  console.log("Imagecard renered");

  const [image, setImage] = useState(
    props.img ? props.img : BASE_URL + "/images/defaultperson.png"
  );
  const [status, setStatus] = useState("done");
  const [progress, setProgress] = useState(0);

  const { Paragraph } = Typography;

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleOnChange = ({ file, fileList, event }) => {
    console.log(file, fileList, event);
  };

  const uploadProps = {
    multiple: false,
    action: "/auth/updateProfile",
    listType: "image",
    headers: { "Content-Type": "multipart/form-data" },
    status: { status },
    showUploadList: false,
    onStart(file) {
      console.log("onStart", file, file.name);
      setStatus("loading");
    },
    onSuccess(res, file, fileList, data) {
      console.log("onSuccess", fileList, "Rest of Parms", res, file.name, data);
      message.success("A new profile image was uploaded to your account!", 3);
      TokenService.updateLocalProfileImage(res?.imageChanged?.newValue);
      setImageContext(res?.imageChanged?.newValue);
      console.log("ImageContext", imageContext);
      setStatus("done");
    },
    onError(err) {
      console.log("onError", err);
      setStatus("error");
    },
    onProgress({ percent }, file) {
      console.log("onProgress", `${percent}%`, file.name);
      setStatus("loading");
      setProgress(percent);
    },

    customRequest({
      action,
      data,
      file,
      filename,
      headers,
      onError,
      onProgress,
      onSuccess,
    }) {
      // EXAMPLE: post form-data with 'axios'
      // eslint-disable-next-line no-undef
      const formData = new FormData();
      if (data) {
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key]);
        });
      }

      formData.append("file", file);

      AuthService.updateProfile(formData)
        .then(({ data: response }) => {
          console.log("updateProile Response: ", response);
          onSuccess(response, file);
          getBase64(formData.get("file"), (url) => {
            setImage(url);
            console.log("SetImage: ", url);
            // setImageContext(url);
          });
        })
        .catch(onError);
      return {
        abort() {
          console.log("upload progress is aborted.");
        },
      };
    },
  };

  return (
    <>
      <Card
        bordered={false}
        hoverable={true}
        // headStyle={{ fontFamily: "Montserrat" }}
        className="card-grid"
      >
        <Row gutter={4} align="bottom">
          <Col flex={1}>
            {/* <img className="g-images" src={image} alt="avatar" /> */}
            {progress > 0 ? (
              <Progress
                className="progress-bar"
                percent={progress}
                size="small"
                strokeColor={{ from: "#108ee9", to: "#87d068" }}
              />
            ) : null}
            <ImgCrop aspect={600 / 600}>
              <Upload {...uploadProps} onChange={handleOnChange}>
                <img className="g-image" src={image} alt="avatar" />
                {/* <Button
                  size="small"
                  type="primary"
                  shape="round"
                  style={{
                    fontSize: "1vmax",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    marginLeft: "0",
                    marginTop: "1rem",
                  }}
                >
                  Choose File
                </Button> */}
              </Upload>
            </ImgCrop>
          </Col>
          <Col flex={3} className="image-instructions">
            <Paragraph
              className="image-instructions-title"
              style={{
                fontSize: "2vw",
                fontWeight: "bold",
                wordBreak: "break-word",
                // marginLeft: "1rem",
                // marginBottom: "1rem",
                margin: "1rem 1rem 1rem 1rem",
              }}
            >
              {props.title}
            </Paragraph>
            <p>Click on the image to change it.</p>
            <p>Ideal dimensions are 500 x 500.</p>
            <p>Maximum file size is 5mb.</p>
            <h5>For {props.author}</h5>
          </Col>
        </Row>
      </Card>
    </>
  );
}
export default ImageCard;
