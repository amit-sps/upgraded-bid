import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useGetBiderDataQuery } from "../redux/apis/dashboard-api-slice";
import { FiFilter } from "react-icons/fi";
import ModalLayout from "../layout/ModalLayout";
import FilterModal from "../components/Modal/FilterModal";
import { useState } from "react";
import { FilterInterface } from "../interfaces";
ChartJS.register(...registerables);

const BarChart = () => {
  const [filterModal, setFilterModal] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterInterface>();
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["date"]);
  const { data: bidderData } = useGetBiderDataQuery({
    bidType: filter?.bidType,
    status: filter?.status,
    startDate: filter?.startDate,
    endDate: filter?.endDate,
  });

  const labels = bidderData?.Bid.map((bidder) => bidder.nameofbidder);
  const totalBidNo = bidderData?.Bid.map((bidder) => bidder.totalBidNo);

  const gradientColors = [
    "rgba(255, 99, 132, 0.8)",
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 206, 86, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 159, 64, 0.8)",
    "rgba(255, 0, 0, 0.8)",
    "rgba(0, 255, 0, 0.8)",
    "rgba(0, 0, 255, 0.8)",
    "rgba(255, 255, 0, 0.8)",
    "rgba(255, 0, 255, 0.8)",
    "rgba(0, 255, 255, 0.8)",
    "rgba(128, 128, 128, 0.8)",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "User List",
        data: totalBidNo,
        backgroundColor: gradientColors,
        borderColor: gradientColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const resetFilter = () => {
    setFilter(undefined);
    setSelectedFilters(["date"]);
  };

  return (
    <div className="w-full flex justify-center items-center">

       {filterModal && (
        <ModalLayout
          isModalOpen={filterModal}
          setModal={setFilterModal}
          children={
            <FilterModal
              setFilter={setFilter}
              filter={filter}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              resetFilter={resetFilter}
              setModal={setFilterModal}
            />
          }
        />
      )}
      <div style={{ width: "100%", height: "390px" }}>
        <FiFilter onClick={()=> setFilterModal(true)} color="rgba(54, 162, 235, 0.8)" className="cursor-pointer ml-auto" size={25}/>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
