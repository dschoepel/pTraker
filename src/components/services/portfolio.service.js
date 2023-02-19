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

const getOnePortfolio = (portfolioId) => {
  const url = `/portfolio/getOnePortfolio/${portfolioId}`;
  return api
    .get(url)
    .then((response) => {
      console.log("getOnePortfolio response: ", response);
      return {
        success: true,
        statusCode: 200,
        data: response.data,
      };
    })
    .catch((error) => {
      console.log("Error caught getOnePortfolio: ", error);
    });
};

const getQuote = (symbol) => {
  const url = `/portfolio/getQuote?symbol=${symbol}`;
  return api
    .get(url)
    .then((response) => {
      console.log("getQuote response: ", response);
      return {
        success: true,
        statusCode: 200,
        delayedPrice: response.data.delayedPrice,
        delayedChange: response.data.delayedChange,
        detail: response.data.quoteDetail,
      };
    })
    .catch((error) => {
      console.log("Error caught getQuote: ", error);
    });
};

const getQuotes = (searchText) => {
  const url = `/portfolio/getQuotes?searchText=${searchText}`;
  let result = [];
  return api
    .get(url)
    .then((response) => {
      console.log("getQuote response: ", response);
      result = response.data.searchResult.map((quotes, index) => ({
        key: index,
        companyName: quotes.longname ? quotes.longname : "",
        ticker: quotes.symbol,
        quoteType: quotes.quoteType,
        exchDisp: quotes.exchDisp,
        sector: quotes.sector,
        industry: quotes.industry,
      }));
      return {
        success: true,
        statusCode: 200,
        searchResult: result,
      };
    })
    .catch((error) => {
      console.log("Error caught getQuotes: ", error);
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

const addAssetToPortfolio = (portfolioId, assetToAdd) => {
  return api
    .post("/portfolio/addPortfolioAsset", {
      portfolioId: portfolioId,
      assetToAdd: assetToAdd,
    })
    .then((response) => {
      console.log("Adding asset to portfolio: ", portfolioId, assetToAdd);
      return { success: true, statusCode: 201, data: response };
    })
    .catch((error) => {
      console.log("Error adding asset to Portfolio", error);
    });
};

// TODO  Add getHistory?symbol={symbol}
const getHistory = (symbol) => {
  console.log("starting getHistory with: ", symbol);
  const url = `/portfolio/getHistory?symbol=${symbol}`;
  return api
    .get(url)
    .then((response) => {
      console.log("getHistory response: ", response);
      return {
        success: true,
        statusCode: 200,
        symbol: response.data.meta.symbol,
        historyChart: response.data.historyChart,
        baseline: response.data.meta.chartPreviousClose,
      };
    })
    .catch((error) => {
      console.log("Error caught getHistory: ", error);
    });
};

const PortfolioService = {
  getUserPortfolios,
  getOnePortfolio,
  addUserPortfolio,
  editPortfolio,
  deletePortfolio,
  addAssetToPortfolio,
  getQuote,
  getQuotes,
  getHistory,
};

export default PortfolioService;
