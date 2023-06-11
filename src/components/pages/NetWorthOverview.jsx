import { Fragment, useContext } from "react";
import { Row, Col, Card, Typography, Grid } from "antd";

import { UserNetWorthContext } from "../store/userNetWorth.context";
import WaterfallChart from "../ui/WaterfallChart";
import DonutChart from "../ui/DonutChart";
// import NetWorthSummary from "../ui/NetWorthSummary";

import "./NetWorthOverview.css";
// import FormattedNumber from "../ui/FormattedNumber";

const { useBreakpoint } = Grid;
// const { Paragraph } = Typography;

function NetworthOverview(data) {
  const [userNetWorthContext] = useContext(UserNetWorthContext);
  // const [delayed, setDelayed] = useState(true);

  // useEffect(() => {
  //   console.log("starting delay");
  //   const timeout = setTimeout(() => setDelayed(false), delay);
  //   return () => clearTimeout(timeout);
  // }, [delay]);

  console.log("userNetworthContext: ", userNetWorthContext);
  // Breakpoints xs, sm, md, lg, xl
  const { xs } = useBreakpoint();
  // console.log("Screens xs, sm, md, lg, xl: ", xs, sm, md, lg, xl);
  return (
    <Fragment>
      {xs ? <DonutChart /> : <WaterfallChart />}
      {/* <NetWorthSummary
        title={"Total"}
        data={{
          netWorth: userNetWorthContext.userSummary.userNetWorth,
          daysChange: userNetWorthContext.userSummary.userDaysChange,
          totalBookValue: userNetWorthContext.userSummary.userTotalBookValue,
          totalReturn: userNetWorthContext.userSummary.userTotalReturn,
        }}
      /> */}
    </Fragment>
  );
}
export default NetworthOverview;
