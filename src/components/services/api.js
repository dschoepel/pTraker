import axios from "axios";

import TokenService from "./token.service";

const BASE_URL = process.env.REACT_APP_PTRACKER_API_BASE_URL;

const instance = axios.create({
  baseURL: BASE_URL + "/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    console.log("intercept.req: ", error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (originalConfig.url !== "/auth/signin" && err.response) {
      // Access token is expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const rs = await instance.post("/auth/refreshToken", {
            refreshToken: TokenService.getLocalRefreshToken(),
          });
          const { accessToken } = rs.data;
          TokenService.updateLocalAccessToken(accessToken);
          originalConfig.headers = {
            ...originalConfig.headers,
            Authorization: "Bearer " + accessToken,
          };
          return instance(originalConfig);
        } catch (_error) {
          const {
            response: {
              status,
              data: { message },
            },
          } = _error;
          console.log("intercept.res: ", status, message);
          if (status === 403) {
            console.log("Error 403 found");
          }
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
