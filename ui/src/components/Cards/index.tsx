import CardLayout from "../../layout/CardLayout";
import { useGetBidStatisticsQuery } from "../../redux/apis/dashboard-api-slice";

const Cards = () => {
  const { data } = useGetBidStatisticsQuery();


  return (
    <div className="cards-container grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-10 p-6 bg-white rounded-md">
      <CardLayout
        child={<p className="leading-relaxed text-xs">Total Bids</p>}
        count={(data && data.data.totalBidding && data?.data.totalBidding) || 0}
      />
      <CardLayout
        child={
          <>
            <p className="leading-relaxed text-xs">Today Bids</p>
          </>
        }
        count={(data && data.data.todayBidding && data?.data.todayBidding) || 0}
      />
       <CardLayout
        child={
          <>
            <p className="leading-relaxed text-xs">Responded Bids</p>
            <p className="leading-relaxed text-xs"></p>
          </>
        }
        count={(data && data.data.respondedBid && data?.data.respondedBid) || 0}
      />
      <CardLayout
        child={
          <>
            <p className="leading-relaxed text-xs">Scrapped Bids</p>
            <p className="leading-relaxed text-xs"></p>
          </>
        }
        count={(data && data.data.scrappedBid && data?.data.scrappedBid) || 0}
      />
      <CardLayout
        child={
          <>
            <p className="leading-relaxed text-xs">Converted Bids</p>
          </>
        }
        count={(data && data.data.convertedBid && data?.data.convertedBid) || 0}
      />
      <CardLayout
        child={
          <>
            <p className="leading-relaxed text-xs">Total Resources</p>
            <p className="leading-relaxed text-xs"></p>
          </>
        }
        count={
          (data && data.data.totalResources && data?.data.totalResources) || 0
        }
      />
      <CardLayout
        child={
          <>
            <p className="leading-relaxed text-xs">Your Resources</p>
            <p className="leading-relaxed text-xs"></p>
          </>
        }
        count={
          (data && data.data.yourResources && data?.data.yourResources) || 0
        }
      />
    </div>
  );
};

export default Cards;
