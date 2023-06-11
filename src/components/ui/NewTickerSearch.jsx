import { useState, useMemo, useRef, useEffect } from "react";
import Search from "antd/lib/input/Search";
import debounce from "lodash/debounce";

import fetchStockTickerList from "../services/fetchStockTickerList.service";
import PortfolioService from "../services/portfolio.service";
import "./NewTickerSearch.css";
import Modal from "antd/es/modal/Modal";

function NewTickerSearch({ setTickerTableData, setSearchText }) {
  const [fetching, setFetching] = useState(false);
  const [tickerSearchText, setTickerSearchText] = useState("");

  const searchInput = useRef(null);

  const onSearch = () => {};

  useEffect(() => {
    if (searchInput.current) {
      searchInput.current.focus();
    }
  }, [searchInput]);

  const debounceResults = useMemo(() => {
    const handleSearchChange = (event) => {
      setFetching(true);
      setTickerSearchText(event.target.value);
      setSearchText(event.target.value);
      console.log("Handlesearch change started...", event.target.value);
      // setShowTickers(true);

      if (event.target.value.length !== 0 && event.target.value !== " ") {
        PortfolioService.getQuotes(event.target.value).then((response) => {
          console.log("getQuotes: ", response.searchResult);
          setTickerTableData(response.searchResult);
        });
      } else {
        setTickerTableData([]);

        console.log("Value changed to null blank search text!");
      }
      setFetching(false);
    };
    return debounce(handleSearchChange, 1000);
  }, [setSearchText, setTickerTableData]);

  const onSearchBlur = () => {
    setFetching(false);
  };

  return (
    <Search
      enterButton={true}
      className={"search-stocktickers"}
      placeholder="ticker search"
      allowClear={false}
      loading={fetching}
      onSearch={onSearch}
      onChange={debounceResults}
      onBlur={onSearchBlur}
      ref={searchInput}
      style={{ width: "90%" }}
      size="large"
    />
  );
}

export default NewTickerSearch;
