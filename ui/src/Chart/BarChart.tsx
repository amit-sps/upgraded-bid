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

  const labels = bidderData?.data.map((bidder) => bidder.nameOfBidder) || [];
  const totalNumberOfBid =
    bidderData?.data.map((bidder) => bidder.totalNumberOfBid) || [];
  const totalNumberOfResources =
    bidderData?.data.map((bidder) => bidder.totalNumberOfResources) || [];

  const adjustData = (data: any) => {
    return data.every((value: any) => value === 0) ? data.map(() => 0.1) : data;
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Bids",
        data: adjustData(totalNumberOfBid),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(255, 255, 0, 0.8)",
        borderWidth: 1,
      },
      {
        label: "Resources",
        data: adjustData(totalNumberOfResources),
        backgroundColor: "rgba(0, 255, 255, 0.8)",
        borderColor: "rgba(255, 255, 0, 0.8)",
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
        min: 0,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Team Graph",
        font: {
          size: 20,
        },
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
        <FiFilter
          onClick={() => setFilterModal(true)}
          color="rgba(54, 162, 235, 0.8)"
          className="cursor-pointer ml-auto"
          size={25}
        />
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
