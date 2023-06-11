import React, { Fragment, useState } from "react";
import { Typography, Tooltip, Tree, Row } from "antd";

import PortfolioService from "../services/portfolio.service";

const { Text } = Typography;
const SYMBOL_TEXT = ["symbol", "CUSIP", "Symbol", "symbols", "Symbols"];
const QUANTITY_TEXT = ["qty", "quantity", "Quantity", "Qty"];
const DATE_TEXT = ["date", "Date"];

function FormatTreeTitle({ symbol, columns }) {
  const [rowDetail] = useState(() => {
    let rowArray = [];
    let colLimit = columns.length;

    // getSymbol(rowArray, columns, symbol)
    //   .then((res) => {
    //     console.log("Get Quote response", res);
    //     rowArray.push(`Short name: ${res.detail.shortname}`);
    //   })
    //   .catch((error) => {
    //     console.log("Error on get symbol: ", error);
    //   });
    for (let i = 0; i < colLimit; i++) {
      const foundDate = DATE_TEXT.some((item) =>
        columns[i].heading.includes(item)
      );
      if (foundDate) {
        const date = new Date(columns[i].value);
        console.log(
          "FoundDate in col: ",
          columns[i].title,
          date.toLocaleDateString("en-us", {
            // weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        );
        columns[i].value = date.toLocaleDateString("en-us", {
          // weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
      rowArray.push(`${columns[i].heading}: ${columns[i].value}`);
    }
    console.log("rowArray: ", rowArray);
    return rowArray.join(", ");
  });
  console.log("Rowdata: ", symbol, columns);

  console.log("row", rowDetail);
  const formattedTitle = (
    <Fragment>
      <Text>{rowDetail}</Text>
    </Fragment>
  );
  return formattedTitle;
}

function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

const getSymbol = (rowArray, column, symbol) => {
  const response = PortfolioService.getQuote(symbol);
  // if (response.success) {
  //   console.log("Got Quote: ", response);
  // }
  return response;
};
function getDate(rowArray, column) {}
function getQty(rowArray, column) {}
function getPrice(rowArray, column) {}

export default FormatTreeTitle;
