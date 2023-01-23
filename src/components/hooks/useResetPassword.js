import { useEffect } from "react";

import AuthService from "../services/auth.service";

export default function useResetPassword(
  verificationToken,
  setSuccessMessage,
  setVerifiedPassword,
  setConfirmed,
  setEMessage,
  setConfirming
) {
  function getErrorMsg(statusCode, message) {
    let errorMessage = "";
    switch (statusCode) {
      case "EXPIRED":
        errorMessage = "Password Reset Verification Token Has Expired";
        break;
      case "SIGNATURE":
        errorMessage = "Unable to decode Password Reset Verification Token";
        break;
      case "MALFORMED":
        errorMessage = "Corrupted or Missing Password Reset Verification Token";
        break;
      case "INVALID_USER":
        errorMessage = "Password Reset Verification Token Has Invalid User Id";
        break;
      default:
        errorMessage = message;
    }
    return errorMessage;
  }

  useEffect(() => {
    AuthService.verifyEmail(verificationToken)
      .then(function (response) {
        const {
          success,
          statusCode,
          data: { email, message, errorStatus },
          data,
        } = response;
        // const { email, message, errorStatus } = data;
        console.log(email, message, success, statusCode, errorStatus, data);

        if (success) {
          setSuccessMessage(message);
          setVerifiedPassword(email);
          setConfirmed(true);
        } else {
          setSuccessMessage("Password Reset Validation Failed");
          setVerifiedPassword(email);
          setEMessage(getErrorMsg(errorStatus, message));
        }
        setConfirming(false);
      })
      .catch(function (errors) {
        console.log("Errors: ", errors);
      })
      .finally(function () {});
  }, [
    setConfirmed,
    setConfirming,
    setEMessage,
    setSuccessMessage,
    setVerifiedPassword,
    verificationToken,
  ]);

  return;
}
