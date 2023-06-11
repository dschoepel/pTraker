import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../store/auth.context";

function SetHomePage() {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/public");
    }
  }, [authCtx.isLoggedIn, navigate]);
}

export default SetHomePage;
