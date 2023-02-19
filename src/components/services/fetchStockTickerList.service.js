async function fetchStockTickerList(searchText) {
  console.log("fetching tickers", searchText);

  const proxyUrl = `https://as.schoepels.com/https://query1.finance.yahoo.com/v1/finance/search?q=${searchText}`;

  return await fetch(proxyUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log(
          `Server error: [${response.status}] [${response.statusText}] [${response.url}]`
        );
      }
    })
    .then((response) =>
      response.quotes.map((quotes, index) => ({
        key: index,
        companyName: quotes.longname ? quotes.longname : "",
        ticker: quotes.symbol,
        quoteType: quotes.quoteType,
        exchDisp: quotes.exchDisp,
        sector: quotes.sector,
        industry: quotes.industry,
      }))
    );
}

export default fetchStockTickerList;
