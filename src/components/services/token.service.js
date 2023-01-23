const getLocalRefreshToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.refreshToken;
};

const getLocalAccessToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.accessToken;
};

const updateLocalAccessToken = (token) => {
  let user = JSON.parse(localStorage.getItem("user"));
  user.accessToken = token;
  localStorage.setItem("user", JSON.stringify(user));
};

const updateLocalProfileImage = (profileImage) => {
  let user = JSON.parse(localStorage.getItem("user"));
  user.profileImage = profileImage;
  localStorage.setItem("user", JSON.stringify(user));
};

const updateLocalUsername = (username) => {
  let user = JSON.parse(localStorage.getItem("user"));
  user.username = username;
  localStorage.setItem("user", JSON.stringify(user));
};

const updateLocalEmail = (email) => {
  let user = JSON.parse(localStorage.getItem("user"));
  user.email = email;
  localStorage.setItem("user", JSON.stringify(user));
};

const getUserProfileImage = () => {
  const { profileImage } = JSON.parse(localStorage.getItem("user"));
  return profileImage;
};

const getUserName = () => {
  const userInfo = localStorage.getItem("user");
  var userName = "";
  if (userInfo) {
    const { username } = JSON.parse(localStorage.getItem("user"));
    userName = username;
    console.log("UserInfo: ", userInfo);
  }
  return userName;
};
const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const setUser = (user) => {
  console.log(JSON.stringify(user));
  localStorage.setItem("user", JSON.stringify(user));
};

const removeUser = () => {
  localStorage.removeItem("user");
};

const TokenService = {
  getLocalRefreshToken,
  getLocalAccessToken,
  updateLocalAccessToken,
  updateLocalProfileImage,
  updateLocalUsername,
  updateLocalEmail,
  getUserProfileImage,
  getUser,
  getUserName,
  setUser,
  removeUser,
};

export default TokenService;
