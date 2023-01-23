import React, { useState, createContext } from "react";

const AuthContext = createContext({
  token: "",
  email: "",
  isLoggedIn: false,
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);

  // If there is a token then the user is logged in.
  let userIsLoggedIn = !!token;

  function loginHandler(token) {
    setToken(token);
  }

  function logoutHandler() {
    setToken(null);
  }

  function emailHandler(email) {
    setEmail(email);
  }

  const contextValue = {
    token: token,
    email: email,
    isLoggedIn: userIsLoggedIn,
    aLogin: loginHandler,
    aLogout: logoutHandler,
    trackEmail: emailHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
