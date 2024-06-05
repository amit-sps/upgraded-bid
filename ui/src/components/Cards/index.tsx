import CardLayout from "../../layout/CardLayout";
import { useGetBidStatisticsQuery } from "../../redux/apis/dashboard-api-slice";

const Cards = () => {
  const { data } = useGetBidStatisticsQuery();

  const getLastMonthDates = () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthStart = lastMonth.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const lastMonthEnd = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth() + 1,
      0
    ).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return { start: lastMonthStart, end: lastMonthEnd };
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const lastMonthDates = getLastMonthDates();

  return (
    <div className="cards-container grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 p-6 bg-white rounded-md">
      <CardLayout
        child={<p className="leading-relaxed text-xs">Total Bidding</p>}
        count={(data && data.totalCountBid && data?.totalCountBid) || 0}
      />
      <CardLayout
        child={
          <>
            <p className="leading-relaxed text-xs">
              Total Bidding (Current Day)
            </p>
            <p className="leading-relaxed text-xs">{currentDate}</p>
          </>
        }
        count={(data && data.countToday && data?.countToday) || 0}
      />
      <CardLayout
        child={
          <>
            <p className="leading-relaxed text-xs">Total Bidding (Last Week)</p>
            <p className="leading-relaxed text-xs"></p>
          </>
        }
        count={(data && data.countWeek && data?.countWeek) || 0}
      />
      <CardLayout
        child={
          <>
            <p className="leading-relaxed text-xs">
              Total Bidding (Last Month)
            </p>
            <p className="leading-relaxed text-xs">
              {lastMonthDates.start} to {lastMonthDates.end}
            </p>
          </>
        }
        count={(data && data.lastMonthBidCount && data?.lastMonthBidCount) || 0}
      />
      <CardLayout
        child={
          <>
            <p className="leading-relaxed text-xs">
              Total Bidding (This Month)
            </p>
            <p className="leading-relaxed text-xs"></p>
          </>
        }
        count={
          (data && data.currentMonthBidCount && data?.currentMonthBidCount) || 0
        }
      />
    </div>
  );
};

export default Cards;
