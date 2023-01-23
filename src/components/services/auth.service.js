// import axios from "axios";
import { message } from "antd";
import api from "./api";
import TokenService from "./token.service";

// const API_URL = "http://localhost:8001/api/v1/auth/";

const register = (username, email, password, passwordConfirmation) => {
  return api
    .post("/auth/signup", {
      username,
      email,
      password,
      passwordConfirmation,
    })
    .then((response) => {
      return { success: true, statusCode: 200, data: response.data };
    })
    .catch((error) => {
      console.log("Error Caught: ", error);
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

const login = (email, password) => {
  return api
    .post("/auth/signin", {
      email: email,
      password: password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        TokenService.setUser(response.data);
        // localStorage.setItem("user", JSON.stringify(response.data));
      }
      return { success: true, statusCode: 200, data: response.data };
    })
    .catch(function (error) {
      let errMsg = "";
      let statusCode = 0;
      let responseData = {};
      // Check for connection error, set status to 500 and capture reason for error
      console.log("Error Caught: ", error);
      if (error.code === "ERR_NETWORK") {
        statusCode = 500;
        responseData = {
          message: `System error contacting pTracker API! Report this message ("${error.message}") to support for assistance...`,
        };
      } else {
        const { status, data } = error.response;
        statusCode = status;
        responseData = data;
      }
      console.log("Login error: ", statusCode, responseData);
      if (statusCode === 500) {
        console.log("Status: ", statusCode, responseData);
        errMsg = responseData.message;
      } else if (statusCode === 422) {
        console.log(
          responseData?.errors[0],
          "Status: ",
          statusCode,
          responseData.errorStatus
        );
        errMsg = error.response.data?.errors[0].msg;
      } else {
        errMsg = error.response.data.message;
        console.log(error.response.data.message);
      }
      return {
        success: false,
        statusCode: statusCode,
        data: {
          message: errMsg,
          errorStatus: responseData.errorStatus,
          errorFlag: responseData.errorFlag,
        },
      };
    });
};

const logout = () => {
  const user = getCurrentUser();
  if (user) {
    const { email } = user;
    console.log(email);
    api
      .post("/auth/signout", {
        email: email,
      })
      .then(function (response) {
        console.log("Logout Response: ", response);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        // Remove user detail from local storage when logging out
        try {
          TokenService.removeUser();
          // localStorage.removeItem("user");
        } catch (err) {
          console.log(err);
        }
      });
  }
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const updateProfile = (formData) => {
  // Valid formData key names
  const E_MAIL = "email";
  const USER_NAME = "username";
  const FILE = "file";
  const user = getCurrentUser();

  // All three keys need to be provided when sending update request.  If a key is missing,
  // use the user's current values from local storage for the missing key.
  if (!formData.has(E_MAIL)) {
    formData.append(E_MAIL, user.email);
  }

  if (!formData.has(USER_NAME)) {
    formData.append(USER_NAME, user.username);
  }

  if (!formData.has(FILE)) {
    formData.append(FILE, user.profileImage);
  }

  return api
    .patch("/auth/updateProfile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => {
      console.log("Upload Success Response: ", response);
      return { success: true, statusCode: 200, data: response.data };
    })
    .catch((error) => {
      console.log("Profile update Error Caught: ", error);
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

const verifyEmail = async (token) => {
  try {
    const response = await api.patch("/auth/verifyEmail/" + token);
    if (response.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return { success: true, statusCode: 200, data: response.data };
  } catch (error) {
    let errMsg = { message: "", errorStatus: "" };
    let statusCode = 0;
    let responseData = {};
    // Check for connection error, set status to 500 and capture reason for error
    console.log("Error Caught: ", error);
    if (error.code === "ERR_NETWORK") {
      statusCode = 500;
      responseData = {
        message: `System error contacting pTracker API! Report this message ("${error.message}") to support for assistance...`,
      };
    } else {
      const { status, data: data_1 } = error.response;
      statusCode = status;
      responseData = data_1;
    }
    console.log("E-mail Verify Error ", statusCode, responseData);
    if (statusCode === 500) {
      console.log("Status: ", statusCode, responseData);
      errMsg = {
        message: responseData.message,
        errorStatus: responseData.errorStatus,
        email: responseData.email,
      };
    } else if (statusCode === 422) {
      console.log(
        responseData?.errors[0],
        "Status: ",
        statusCode,
        "Error Status: ",
        responseData.errorStatus
      );
      errMsg = {
        message: error.response.data?.errors[0].msg,
        errorStatus: responseData.errorStatus,
      };
    } else {
      errMsg = {
        message: error.response.data.message,
        errorStatus: responseData.errorStatus,
        email: responseData.email,
      };
      console.log(
        error.response.data.message,
        responseData.errorStatus,
        responseData.email
      );
    }
    return { success: false, statusCode: statusCode, data: errMsg };
  }
};

const reVerifyEmail = (email) => {
  return api
    .post("/auth/reVerifyEmail", {
      email: email,
    })
    .then((response) => {
      return { success: true, statusCode: 200, data: response.data };
    })
    .catch(function (error) {
      let errMsg = "";
      let statusCode = 0;
      let responseData = {};
      // Check for connection error, set status to 500 and capture reason for error
      console.log("Error Caught: ", error);
      if (error.code === "ERR_NETWORK") {
        statusCode = 500;
        responseData = {
          message: `System error contacting pTracker API! Report this message ("${error.message}") to support for assistance...`,
        };
      } else {
        const { status, data } = error.response;
        statusCode = status;
        responseData = data;
      }
      console.log("ReVerify Email Error: ", statusCode, responseData);
      if (statusCode === 500) {
        console.log("Status: ", statusCode, responseData);
        errMsg = responseData.message;
      } else {
        errMsg = error.response.data.message;
        console.log(error.response.data.message);
      }
      return {
        success: false,
        statusCode: statusCode,
        data: {
          message: errMsg,
          errorStatus: responseData.errorStatus,
          errorFlag: responseData.errorFlag,
        },
      };
    });
};

const requestPasswordReset = (email) => {
  return api
    .post("/auth/requestPasswordReset", {
      email: email,
    })
    .then((response) => {
      return { success: true, statusCode: 200, data: response.data };
    })
    .catch(function (error) {
      let errMsg = "";
      let statusCode = 0;
      let responseData = {};
      // Check for connection error, set status to 500 and capture reason for error
      console.log("Error Caught: ", error);
      if (error.code === "ERR_NETWORK") {
        statusCode = 500;
        responseData = {
          message: `System error contacting pTracker API! Report this message ("${error.message}") to support for assistance...`,
        };
      } else {
        const { status, data } = error.response;
        statusCode = status;
        responseData = data;
      }
      console.log("Password Reset Request error: ", statusCode, responseData);
      if (statusCode === 500) {
        console.log("Status: ", statusCode, responseData);
        errMsg = responseData.message;
      } else if (statusCode === 422) {
        console.log(
          responseData?.errors[0],
          "Status: ",
          statusCode,
          responseData.errorStatus
        );
        errMsg = error.response.data?.errors[0].msg;
      } else {
        errMsg = error.response.data.message;
        console.log(error.response.data.message);
      }
      return {
        success: false,
        statusCode: statusCode,
        data: {
          message: errMsg,
          errorStatus: responseData.errorStatus,
          errorFlag: responseData.errorFlag,
        },
      };
    });
};

//
// Reset Password
//
const resetPassword = (userId, token, password, passwordConfirmation) => {
  return api
    .post("/auth/resetPassword", {
      userId: userId,
      token: token,
      password: password,
      passwordConfirmation: passwordConfirmation,
    })
    .then((response) => {
      return { success: true, statusCode: 200, data: response.data };
    })
    .catch((error) => {
      // handle 500, 422, 400 error codes
      let errMsg = "";
      let statusCode = 0;
      let responseData = {};
      if (error.code === "ERR_NETWORK") {
        statusCode = 500;
        responseData = {
          message: `System error contacting pTracker API! Report this message ("${error.message}") to support for assistance...`,
        };
      } else {
        const { status, data } = error.response;
        statusCode = status;
        responseData = data;
      }
      console.log("resetPassword error: ", statusCode, responseData);
      if (statusCode === 500) {
        console.log("Status: ", statusCode, responseData);
        errMsg = responseData.message;
      } else if (statusCode === 422) {
        console.log(
          responseData?.errors[0],
          "Status: ",
          statusCode,
          responseData.errorStatus
        );
        errMsg = error.response.data?.errors[0].msg;
      } else {
        errMsg = error.response.data.message;
        console.log(error.response.data.message);
      }
      return {
        success: false,
        statusCode: statusCode,
        data: {
          message: errMsg,
          errorStatus: responseData.errorStatus,
          errorFlag: responseData.errorFlag,
        },
      };
    });
};

//
// Reset Password
//
const changePassword = (currentPassword, newPassword, confirmPassword) => {
  return api
    .patch("/auth/changePassword", {
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    })
    .then((response) => {
      return { success: true, statusCode: 200, data: response.data };
    })
    .catch((error) => {
      // handle 500, 422 error codes
      let errMsg = "";
      let statusCode = 0;
      let responseData = {};
      if (error.code === "ERR_NETWORK") {
        statusCode = 500;
        responseData = {
          message: `System error contacting pTracker API! Report this message ("${error.message}") to support for assistance...`,
        };
      } else {
        const { status, data } = error.response;
        statusCode = status;
        responseData = data;
      }
      console.log("resetPassword error: ", statusCode, responseData);
      if (statusCode === 500) {
        console.log("Status: ", statusCode, responseData);
        errMsg = responseData.message;
      } else if (statusCode === 422) {
        console.log(
          responseData?.errors[0],
          "Status: ",
          statusCode,
          responseData.errorStatus
        );
        errMsg = error.response.data?.errors[0].msg;
      } else {
        errMsg = error.response.data.message;
        console.log(error.response.data.message);
      }
      return {
        success: false,
        statusCode: statusCode,
        data: {
          message: errMsg,
          errorStatus: responseData.errorStatus,
          errorFlag: responseData.errorFlag,
        },
      };
    });
};

// Handle situation where refresh token expired, token cannot be refreshed, use must log in again
const expiredLogin = () => {
  let content = "";
  logout();

  message.loading({
    content: "Resetting login...",
    duration: 5,
    style: { marginTop: "15vh" },
  });
  // setExpired(true);
  content = `"Keep me logged in" has expired, re-directing to the login page!`;
  setTimeout(() => {
    window.location.replace("/login");
  }, 3000);
  return content;
};
const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  verifyEmail,
  reVerifyEmail,
  requestPasswordReset,
  resetPassword,
  changePassword,
  expiredLogin,
  updateProfile,
};

export default AuthService;
