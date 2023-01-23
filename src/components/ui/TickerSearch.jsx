import { useState, useMemo } from "react";
import Search from "antd/lib/input/Search";
import debounce from "lodash/debounce";

import fetchStockTickerList from "../services/fetchStockTickerList.service";
import "./TickerSearch.css";

function TickerSearch({ setTickerTableData, setSearchText }) {
  const [fetching, setFetching] = useState(false);
  const [tickerSearchText, setTickerSearchText] = useState("");

  const onSearch = () => {};

  const debounceResults = useMemo(() => {
    const handleSearchChange = (event) => {
      setFetching(true);
      setTickerSearchText(event.target.value);
      setSearchText(event.target.value);
      console.log("Handlesearch change started...", event.target.value);
      // setShowTickers(true);

      if (event.target.value.length !== 0 && event.target.value !== " ") {
        fetchStockTickerList(event.target.value).then((response) => {
          setTickerTableData(response);
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
      className={"search-stocktickers"}
      placeholder="ticker search"
      allowClear
      loading={fetching}
      onSearch={onSearch}
      onChange={debounceResults}
      onBlur={onSearchBlur}
    />
  );
}

export default TickerSearch;
