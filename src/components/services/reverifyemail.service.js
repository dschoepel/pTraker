import AuthService from "../services/auth.service";

const reVerifyEmail = (
  email,
  setEmailSent,
  setErrorMessage,
  setHasErrors,
  setIsVerified
) => {
  AuthService.reVerifyEmail(email).then(function (response) {
    const { success, data, statusCode } = response;
    const { errorFlag, errorStatus } = data;
    var eMessage = data.message;
    console.log(
      "Response: ",
      success,
      eMessage,
      errorFlag,
      errorStatus,
      statusCode
    );
    setErrorMessage(eMessage);
    setEmailSent(success);
    if (!success) {
      setIsVerified(false);
      if (errorStatus === "EMAIL_IS_VERIFIED") {
        setIsVerified(true);
      }
      setHasErrors(true);
    }
  });
  return;
};

const ReVerifyEmail = {
  reVerifyEmail,
};

export default ReVerifyEmail;
