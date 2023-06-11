import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi";
import "./FormattedNumber.css";
import Color from "./Color";
import { Fragment } from "react";

const { Green, Red } = Color;

function FormattedNumber({ value, title, type, changeArrow, color, digits }) {
  const CURRENCY = "CURRENCY";
  const NUMBER = "NUMBER";
  // console.log("Digits = ", digits);
  const DIGITS = digits !== undefined ? digits : 2;
  const NBR = (
    <Fragment>
      {Intl.NumberFormat("en-us", {
        maximumFractionDigits: DIGITS,
        minimumFractionDigits: DIGITS,
      }).format(value)}
    </Fragment>
  );

  const CUR_FANCY = (
    <Fragment>
      {Intl.NumberFormat("en-us", {
        style: "currency",
        currency: "USD",
        currencySign: "accounting",
        signDisplay: "always",
        maximumFractionDigits: DIGITS,
        minimumFractionDigits: DIGITS,
      }).format(value)}
    </Fragment>
  );

  const CUR_PLAIN = (
    <Fragment>
      {Intl.NumberFormat("en-us", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: DIGITS,
        minimumFractionDigits: DIGITS,
      }).format(value)}
    </Fragment>
  );

  const COLOR = color ? (
    <Fragment>
      {value >= 0 ? <Green>{CUR_FANCY}</Green> : <Red>{CUR_FANCY}</Red>}
    </Fragment>
  ) : (
    false
  );

  const CHANGE_ARROW = changeArrow ? (
    <Fragment>
      {value > 0 ? (
        <Green>
          <HiArrowNarrowUp />{" "}
        </Green>
      ) : (
        <Red>
          <HiArrowNarrowDown />
        </Red>
      )}
    </Fragment>
  ) : null;

  return (
    <>
      {type === CURRENCY ? (
        <>
          <span className="currency-title-style">{title}</span>
          <span>{CHANGE_ARROW}</span>
          <span>{color ? COLOR : CUR_PLAIN}</span>
        </>
      ) : null}
      {type === NUMBER ? (
        <>
          <span className="currency-title-style">{title}</span>
          <span>{CHANGE_ARROW}</span>
          <span>{NBR}</span>
        </>
      ) : null}
    </>
  );
}

export default FormattedNumber;
