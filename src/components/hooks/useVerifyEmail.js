import { useEffect } from "react";

import AuthService from "../services/auth.service";

export default function useVerifyEmail(
  verificationToken,
  setSuccessMessage,
  setVerifiedEmail,
  setConfirmed,
  setEMessage,
  setConfirming
) {
  function getErrorMsg(statusCode, message) {
    let errorMessage = "";
    switch (statusCode) {
      case "EXPIRED":
        errorMessage = "E-mail Verification Token Has Expired";
        break;
      case "SIGNATURE":
        errorMessage = "Unable to decode E-mail Verification Token";
        break;
      case "MALFORMED":
        errorMessage = "Corrupted or Missing E-mail Verification Token";
        break;
      case "INVALID_USER":
        errorMessage = "E-mail Verification Token Has Invalid User Id";
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
          setVerifiedEmail(email);
          setConfirmed(true);
        } else {
          setSuccessMessage("E-mail Validation Failed");
          setVerifiedEmail(email);
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
    setVerifiedEmail,
    verificationToken,
  ]);

  return;
}
