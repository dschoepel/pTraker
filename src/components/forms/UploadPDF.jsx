import React, { Fragment, useState } from "react";
import { Upload, Alert, App, notification } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import Spinner from "../ui/Spinner";

import "./UploadPDF.css";

const { Dragger } = Upload;

function UploadPDF({ setCurrent, setPdfDetails, setPdfFileName }) {
  const { message } = App.useApp();
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
      duration: 0,
      placement: "top",
    });
  };
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState({ message: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);

  const formattedErrMessage = (message) => {
    return (
      <>
        <span>
          The uploaded pdf must have at least one table with asset symbols. The
          file "
        </span>
        <span style={{ fontWeight: "bold" }}>{message}</span>
        <span>" did not have any symbols...</span>
      </>
    );
  };

  const props = {
    name: "file",
    maxCount: 1,
    multiple: false,
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf";
      if (!isPDF) {
        message.error(`${file.name} is not a pdf file!`);
        return isPDF || Upload.LIST_IGNORE;
      }
    },
    action: "http://192.168.10.156:8005/api/v1/file/pdf",
    onChange(info) {
      const { status } = info.file;
      if (status !== "removed") {
        setIsLoading(true);
      }

      if (status !== "uploading") {
        console.log("Error flag: ", info.file.response.errorFlag);
      } else {
        console.log("uploading ", info.file.percent);
      }

      if (status === "done") {
        setPdfFileName(info.file.name);
        console.log("Error flag: ", info.file.response.errorFlag);
        if (!info.file.response.errorFlag) {
          const results = Object.values(
            info.file.response.pdfDetails.reduce((obj, item) => {
              obj[item.table] = obj[item.table] || { st: item.table, count: 0 };
              obj[item.table].count++;
              return obj;
            }, {})
          );
          console.log(
            `Number of tables is ${results.length}: `,
            info.file.response.pdfDetails
          );
          setIsLoading(false);
          console.log("Result of extract: ", info.file.response);

          message.success(
            `${info.file.name} file uploaded successfully.  ${info.file.response.message}.`
          );
          setPdfDetails(info.file.response.pdfDetails);
          console.log("Pdf Filename = ", info.file.name);
          // setPdfFileName(info.file.name);
          setCurrent(1);
        } else {
        }
        // setIsLoading(false);
        // console.log("Result of extract: ", info.file.response);
        // message.success(`${info.file.name} file uploaded successfully.`);
        // setPdfDetails(info.file.response.pdfDetails);
        // setCurrent(1);
      } else if (status === "error") {
        setIsLoading(false);
        setHasError(info.file.response.errorFlag);
        setErrorInfo({ message: `${info.file.response.message}` });
        openNotification(
          "error",
          `${info.file.response.message}`,
          formattedErrMessage(info.file.name)
        );
        // message.error(`${info.file.name} file upload failed.`);
      }
    },
    progress: {
      display: "hide",
      strokeColor: {
        "0%": "#9b98da",
        "100%": "#328e0c",
      },
      // strokeWidth: 8,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    onRemove(e) {
      setHasError(false);
    },
  };

  // function onAlertClose() {
  //   setHasError(false);
  // }

  return (
    <Fragment>
      {contextHolder}
      {/* {hasError ? (
        <Alert
          closeable
          onClose={onAlertClose}
          showIcon
          banner
          type="error"
          message={errorInfo.message}
        ></Alert>
      ) : null} */}
      <Dragger {...props}>
        <p className="ant-upload-drag-icon ">
          <FilePdfOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag PDF file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Financial statement including table of symbols/assets in account.
        </p>
      </Dragger>
      {isLoading ? <Spinner title={"Analyzing uploaded file..."} /> : null}
    </Fragment>
  );
}

export default UploadPDF;
