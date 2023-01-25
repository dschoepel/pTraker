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
      console.log("add portfolio response: ", response);
      return {
        success: true,
        statusCode: 201,
        data: response,
      };
    })
    .catch((error) => {
      console.log("Error caught addUserPortfolio: ", error);
    });
};

const PortfolioService = { getUserPortfolios, addUserPortfolio };

export default PortfolioService;
