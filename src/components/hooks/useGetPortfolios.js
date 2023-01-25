import { useState, useEffect } from "react";

import PortfolioService from "../services/portfolio.service";

export default function useGetPortfolios() {
  const [userPortfolios, setUserPortfolios] = useState("");

  useEffect(() => {
    PortfolioService.getUserPortfolios().then(
      (response) => {
        const newData = response.data.map((data) => {
          return { ...data, key: data._id };
        });
        setUserPortfolios({
          success: response.success,
          statusCode: response.statusCode,
          data: newData,
        });
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setUserPortfolios(_content);
      }
    );
  }, []);
  return { userPortfolios };
}
