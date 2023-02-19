function getDate(timestamp) {}

async function fetchStockTickerHistory(symbol) {
  console.log("fetching stock history", symbol);

  const proxyUrl = `https://as.schoepels.com/https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?metrics=high&interval=1d&range=3mo`;

  return await fetch(proxyUrl).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      console.log(
        `Server error: [${response.status}] [${response.statusText}] [${response.url}]`
      );
    }
  });
  // .then(
  //   (response) => {
  //     console.log("...", response.chart);
  //   }
  //   // response.chart.result[0].map((resultData, index) => ({
  //   //   key: index,
  //   //   symbol: resultData.meta.symbol,
  //   //   currency: resultData.meta.currency,
  //   //   timeStamp: resultData.timeStamp.toISOString(),
  //   //   priceClose: resultData.indicators.quote[0].close,
  //   //   priceHigh: resultData.indicators.quote[0].high,
  //   //   priceLow: resultData.indicators.quote[0].low,
  //   // }))
  // );
}

export default fetchStockTickerHistory;
