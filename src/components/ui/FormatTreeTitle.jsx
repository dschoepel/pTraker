import React, { Fragment, useState } from "react";
import { Typography, Tooltip, Tree, Row } from "antd";
import dayjs from "dayjs";

import FormattedDate from "./FormattedDate";
import FormattedSymbol from "./FormattedSymbol";
import FormattedUnitPrice from "./FormattedUnitPrice";
import FormattedQty from "./FormattedQty";
import FormattedCostBasis from "./FormattedCostBasis";

const { Text } = Typography;
const SYMBOL_TEXT = ["symbol", "CUSIP", "Symbol", "symbols", "Symbols"];
const QUANTITY_TEXT = ["qty", "quantity", "Quantity", "Qty"];
const DATE_TEXT = ["date", "Date"];

function formatTitle({ symbol, columns, lot, longName }) {
  let rowArray = [];
  let colLimit = columns.length;

  if ("date" in lot) {
    console.log("lot has a date: ", lot.date);
  } else {
    console.log("lot DOES NOT have a date: ");
  }
  console.log("Lot: ", lot);

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
  const rowDetail = rowArray.join(", ");

  console.log("Rowdata: ", symbol, columns);

  console.log("row", rowDetail);
  const x = (
    <Fragment>
      <Text>
        <FormattedSymbol
          title={""}
          symbolString={lot.symbol}
          symbolDescription={longName}
          separator={", "}
        />
        <FormattedUnitPrice
          title={"Price:"}
          unitPrice={lot.unitPrice}
          separator={", "}
        />
        <FormattedQty title={"Qty:"} qty={lot.qty} separator={", "} />
        <FormattedCostBasis
          title={"Basis:"}
          costBasis={lot.costBasis}
          separator={", "}
        />
        {"date" in lot ? (
          <FormattedDate
            title=""
            dateString={dayjs(lot.date).format()}
            separator={", "}
          />
        ) : null}
      </Text>
    </Fragment>
  );

  return x;
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

// function getSymbol(symbol) {}
function getDate(rowArray, column) {}
function getQty(rowArray, column) {}
function getPrice(rowArray, column) {}

const FormatTreeTitle = {
  formatTitle,
};

export default FormatTreeTitle;
