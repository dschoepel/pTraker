import api from "./api";

const getUserPortfolios = () => {
  return api
    .get("/portfolio/getUserPortfolios")
    .then((response) => {
      console.log("getUserPortfolios response: ", response);
      return {
        success: true,
        statusCode: 200,
        data: response.data.portfolioDetailArray,
      };
    })
    .catch((error) => {
      console.log("Error caught getUserPortfolios: ", error);
    });
};

const addUserPortfolio = (portfolioName, portfolioDescription, assets) => {
  return api
    .post("/portfolio/addPortfolio", {
      portfolioName: portfolioName,
      portfolioDescription: portfolioDescription,
      assets: assets,
    })
    .then((response) => {
      return {
        success: true,
        statusCode: 201,
        data: response,
      };
    })
    .catch(function (error) {
      console.log("Error caught addUserPortfolio: ", error);

      return {
        success: error.response.data.success,
        errorFlag: error.response.data.errorFlag,
        statusCode: error.response.data.errorStatus,
        message: error.response.data.message,
      };
    });
};

const editPortfolio = (portfolioName, portfolioDescription, portfolioId) => {
  return api
    .post("/portfolio/updatePortfolio", {
      portfolioName: portfolioName,
      portfolioDescription: portfolioDescription,
      portfolioId: portfolioId,
    })
    .then((response) => {
      console.log("Updated portfolio", portfolioName, portfolioId);
      return { success: true, statusCode: 201, data: response };
    })
    .catch((error) => {
      console.log("Error caught editPortfolio: ", error);
    });
};

const deletePortfolio = (portfolioRecord) => {
  return api
    .post("/portfolio/deletePortfolio", { portfolioId: portfolioRecord._id })
    .then((response) => {
      console.log(
        "Deleting portfolio",
        portfolioRecord.portfolioName,
        portfolioRecord._id
      );
      return { success: true, statusCode: 201, data: response };
    })
    .catch((error) => {
      console.log("Error caught deletePortfolio: ", error);
    });
};

const PortfolioService = {
  getUserPortfolios,
  addUserPortfolio,
  editPortfolio,
  deletePortfolio,
};

export default PortfolioService;
