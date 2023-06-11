import api from "./api";
import dayjs from "dayjs";

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
      console.log("Error found: ", error.response.status);
      console.log("Error caught getUserPortfolios: ", error);
      return {
        success: false,
        statusCode: error.response?.status,
        data: error.response.data,
      };
    });
};

const getDefaultPortfolio = () => {
  return api
    .get("/portfolio/getDefaultPortfolio")
    .then((response) => {
      console.log("getDefaultPortfolio response: ", response);
      return {
        success: true,
        statusCode: 200,
        data: response.data.defaultPortfolio,
      };
    })
    .catch((error) => {
      console.log("Error found: ", error.response.status);
      console.log("Error caught getDefaultPortfolio: ", error);
      return {
        success: false,
        statusCode: error.response.status,
        data: error.response.data,
      };
    });
};

const getUserNetWorth = () => {
  return api
    .get("/portfolio/getUserNetWorth")
    .then((response) => {
      // console.log("getUserNetworth response: ", response);
      return {
        success: true,
        statusCode: 200,
        data: response.data.netWorthDetails,
      };
    })
    .catch((error) => {
      // console.log("Error found: ", error.response.status);
      console.log("Error caught getUserPortfolios: ", error);
      return {
        success: false,
        statusCode: error.response.status,
        data: error.response.data,
      };
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
      // console.log("getQuote response: ", response);
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
      console.log("Deleting portfolio", portfolioRecord._id, response);
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

const getAssetDetail = (assetId) => {
  const url = `/portfolio/getAssetDetail?assetId=${assetId}`;
  return api
    .get(url)
    .then((response) => {
      console.log("getAssetDetail response: ", response);
      return {
        success: true,
        statusCode: 200,
        assetDetail: response.data.assetDetail,
      };
    })
    .catch((error) => {
      console.log(
        `Error fetching asset detail for asset Id ${assetId} to Portfolio. Error ${error.toJSON()}`
      );
      return {
        success: false,
        statusCode: error.response.status,
        assetDetail: error.message,
      };
    });
};

const removeAssetFromPortfolio = (portfolioId, assetId) => {
  return api
    .post("/portfolio/removePortfolioAsset", {
      portfolioId: portfolioId,
      assetId: assetId,
    })
    .then((response) => {
      return { success: true, statusCode: 201, data: response };
    })
    .catch((error) => {
      console.log("Error removing asset from Portfolio", error);
    });
};

const addLotToPortfolio = (portfolioId, assetId, lotDetail) => {
  const { qty, acquiredDate, unitPrice } = lotDetail;
  console.log(
    "Adding lot to portfolio 1: ",
    portfolioId,
    assetId,
    lotDetail.qty,
    lotDetail.unitPrice,
    dayjs(lotDetail.acquiredDate).toISOString()
  );
  return api
    .post("/portfolio/addLot", {
      lotDetail: {
        portfolioId: portfolioId,
        assetId: assetId,
        lots: [
          {
            qty: qty,
            acquiredDate: dayjs(acquiredDate).toISOString(),
            unitPrice: unitPrice,
          },
        ],
      },
    })
    .then((response) => {
      console.log(
        "Adding lot to portfolio 2: ",
        portfolioId,
        assetId,
        lotDetail.qty,
        lotDetail.unitPrice,
        dayjs(lotDetail.acquiredDate).toISOString()
      );
      return { success: true, statusCode: 201, data: response };
    })
    .catch((error) => {
      console.log("Error adding lot to Portfolio", error);
    });
};

const editLotInPortfolio = (lotId, lotDetail) => {
  const { qty, acquiredDate, unitPrice } = lotDetail;
  console.log(
    "Updating lot in portfolio Step 1: ",
    lotId,
    lotDetail.qty,
    lotDetail.unitPrice,
    dayjs(lotDetail.acquiredDate).toISOString()
  );
  return api
    .post("/portfolio/updateLot", {
      lotId: lotId,
      lot: {
        qty: qty,
        acquiredDate: dayjs(acquiredDate).toISOString(),
        unitPrice: unitPrice,
      },
    })
    .then((response) => {
      console.log(
        "Updating lot in portfolio Step 2: ",
        lotId,
        lotDetail.qty,
        lotDetail.unitPrice,
        dayjs(lotDetail.acquiredDate).toISOString()
      );
      return { success: true, statusCode: 201, data: response };
    })
    .catch((error) => {
      console.log("Error updating lot in Portfolio", error);
    });
};

const deleteLotFromPortfolio = (lotId) => {
  return api
    .post("/portfolio/deleteLot", { lotId: lotId })
    .then((response) => {
      console.log(`Deleted lot ${lotId} from Portfolio`);
      return { success: true, statusCode: 201, data: response };
    })
    .catch((error) => {
      console.log(
        "Somthing went wrong with deleting lot from portfolio: ",
        error
      );
    });
};

// TODO  Add getHistory?symbol={symbol}
const getHistory = (symbol) => {
  // console.log("starting getHistory with: ", symbol);
  const url = `/portfolio/getHistory?symbol=${symbol}`;
  return api
    .get(url)
    .then((response) => {
      // console.log("getHistory response: ", response);
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

// Get RSS News feeds (currently Yahoo finance and WSJ)
const getRSSNewsFeeds = () => {
  console.log("starting getRSSNewsFeeds");
  const url = "/portfolio/getRSSNews";
  return api
    .get(url)
    .then((response) => {
      console.log("getRSSNews response: ", response);
      return {
        success: true,
        statusCode: 200,
        newsFeed: response.data.newsFeed,
      };
    })
    .catch((error) => {
      console.log("Error caught getRSSNews: ", error);
    });
};

const sumPortfolio = async (portfolioAssetSummary) => {
  let totalNetWorth = 0;
  let gainLossTotal = 0;
  let assetBasisTotal = 0;
  let portfolioAssets = [];
  for (let i = 0; i < portfolioAssetSummary.length; i++) {
    const quote = await getQuote(portfolioAssetSummary[i].assetSymbol);
    if (quote.success) {
      totalNetWorth =
        totalNetWorth +
        quote.delayedPrice * portfolioAssetSummary[i].assetQtyTotal;
      gainLossTotal +=
        quote.delayedChange * portfolioAssetSummary[i].assetQtyTotal;
      assetBasisTotal += portfolioAssetSummary[i].assetBasisTotal;
      portfolioAssets.push({
        ...portfolioAssetSummary[i],
        displayName: quote.detail.displayName,
        lastPrice: quote.delayedPrice,
        lastChange: quote.delayedChange,
      });
    }
  }

  //TODO sort priced assets?

  return {
    totalNetWorth: totalNetWorth,
    gainLossTotal: gainLossTotal,
    assetBasisTotal: assetBasisTotal,
    portfolioAssets: portfolioAssets,
  };
};

function setDefaultPortfolio(portfolioArray, portfolioName) {
  console.log("setDefaults: ", portfolioArray, portfolioName);
  let toPortfolioId = "";
  if (portfolioArray.length > 0) {
    toPortfolioId = portfolioArray[0]._id;
    const compareName =
      portfolioName === "" ? portfolioArray[0].portfolioName : portfolioName;
    // start with first portfolio then find next closest match to deleted portfolio
    for (let i = 0; i < portfolioArray.length; i++) {
      if (portfolioArray[i].portfolioName < compareName) {
        toPortfolioId = portfolioArray[i]._id;
      }
    }
  }
  return toPortfolioId;
}

const handleListChanges = async (changeType, portfolioId, portfolioName) => {
  let action = "";
  let toPortfolioId = portfolioId;

  switch (changeType) {
    case "DELETED_PORTFOLIO":
      console.log("handling portfolio delete: ", portfolioId);
      action = "navigate";

      await api
        .get("/portfolio/getUserPortfolios")
        .then((response) => {
          return response.data.portfolioDetailArray;
        })
        .then((portfolioArray) => {
          toPortfolioId = setDefaultPortfolio(portfolioArray, portfolioName);
        })
        .catch((error) => {
          console.log("Error caught getUserPortfolios: ", error);
        });
      break;
    case "ADDED_PORTFOLIO":
      console.log("handling portfolio added: ", portfolioId);
      setLocalPortfolioId(portfolioId);
      action = "navigate";
      toPortfolioId = portfolioId;
      break;
    case "REMOVED_ASSET":
      console.log("handling portfolio asset removal: ", portfolioId);
      setLocalPortfolioId(portfolioId);
      action = "navigate";
      toPortfolioId = portfolioId;
      break;
    case "EDIT_PORTFOLIO":
      console.log("handling portfolio edit: ", portfolioId);
      break;
    case "ADDED_LOT":
      console.log("handling adding lot to portfolio: ", portfolioId);
      action = "navigate";
      break;
    case "UPATED_LOT":
      console.log("handling updating lot in portfolio: ", portfolioId);
      action = "navigate";
      break;
    case "DELETED_LOT":
      console.log("handling deleting a lot from portfolio: ", portfolioId);
      action = "navigate";
      break;
    default:
      console.log("handling unknown portfolio change: ", portfolioId);
      break;
  }
  return { action: action, to: toPortfolioId };
};

const getLocalPortfolioId = () => {
  return JSON.parse(localStorage.getItem("currentPortfolioId"));
};

const setLocalPortfolioId = (portfolioId) => {
  localStorage.setItem("currentPortfolioId", JSON.stringify(portfolioId));
};

const PortfolioService = {
  getUserPortfolios,
  getDefaultPortfolio,
  getUserNetWorth,
  getOnePortfolio,
  addUserPortfolio,
  editPortfolio,
  deletePortfolio,
  addAssetToPortfolio,
  getAssetDetail,
  removeAssetFromPortfolio,
  addLotToPortfolio,
  editLotInPortfolio,
  deleteLotFromPortfolio,
  getQuote,
  getQuotes,
  getHistory,
  sumPortfolio,
  handleListChanges,
  getLocalPortfolioId,
  setLocalPortfolioId,
  setDefaultPortfolio,
  getRSSNewsFeeds,
};

export default PortfolioService;
