import api from "./api";

const upload = (formData) => {
  return api
    .post("/file/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => {
      console.log("Upload Success Response: ", response);
      return { success: true, statusCode: 200, data: response.data };
    })
    .catch((error) => {
      console.log("File Upload Error Caught: ", error);
      const {
        status,
        data: { errorFlag, errorStatus, message, errors },
      } = error.response;
      let statusCode = status;
      let errMsg = "";
      errMsg =
        error.length > 0 ? (errMsg = errors[0]?.msg) : (errMsg = message);

      return {
        success: false,
        statusCode: statusCode,
        data: {
          message: errMsg,
          errorStatus: errorStatus,
          errorFlag: errorFlag,
        },
      };
    });
};

const FileService = {
  upload,
};

export default FileService;
