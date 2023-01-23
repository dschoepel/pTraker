// import axios from "axios";
// import authHeader from "./auth-header";
import api from "./api";

// const API_URL = "http://localhost:8001/api/v1/test/";

const getPublicContent = () => {
  return api.get("/test/all");
};

const getUserBoard = () => {
  return api.get("test/user");
  // return axios.get(API_URL + "user", { headers: authHeader() });
};

const getAdminBoard = () => {
  return api.get("/test/admin");
  // return axios.get(API_URL + "admin", { headers: authHeader() });
};

const UserService = {
  getPublicContent,
  getUserBoard,
  getAdminBoard,
};

export default UserService;
