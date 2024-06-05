import { useState, useEffect, ChangeEvent } from "react";
import { Table, Card, Input, Skeleton } from "antd";
import {
  SearchOutlined,
  ExportOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Bid, useGetBidListQuery } from "../redux/apis/bid-apis-slice";
import ModalLayout from "../layout/ModalLayout";
import BiddingForm from "../components/Modal/BiddingForm";
import { ToastContainer } from "react-toastify";
import axios from "../axios";
import FilterModal from "../components/Modal/FilterModal";
import { FilterInterface } from "../interfaces";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const BiddingList: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [modal, setModal] = useState<boolean>(false);
  const [bidId, setBidId] = useState<string | undefined>("");

  const [filterModal, setFilterModal] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterInterface>();
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["date"]);
  const navigate = useNavigate();

  const {
    data: bidListData,
    isLoading,
    refetch,
  } = useGetBidListQuery({
    pageCount: page,
    search: debouncedSearch,
    bidType: filter?.bidType,
    status: filter?.status,
    startDate: filter?.startDate,
    endDate: filter?.endDate,
  });

  const data: Bid[] | undefined = bidListData?.bids;

  const closeModal = () => {
    setModal(false);
    setBidId(undefined);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: any[] = [
    {
      title: "Id Used",
      dataIndex: "IdUsed",
      key: "IdUsed",
    },
    {
      title: "Bid by",
      dataIndex: "nameofbidder",
      key: "nameofbidder",
    },
    {
      title: "Job Title",
      dataIndex: "JobTitle",
      key: "JobTitle",
      ellipsis: true,
    },
    {
      title: "Dates",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => {
        const formattedDate = new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        return formattedDate;
      },
    },
    {
      title: "Connect",
      dataIndex: "connect",
      key: "connect",
      sorter: (a: Bid, b: Bid) => a.connect - b.connect,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Bid Type",
      dataIndex: "bidType",
      key: "bidType",
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      align: "center",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (value: any) => (
        <div className="flex justify-center items-center gap-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setBidId(value._id);
              setModal(true);
            }}
          >
            <FaEdit size={15} className="text-blue-600" />
          </button>
        </div>
      ),
    },
  ];

  const pagination = {
    total: bidListData?.count || 0,
    pageSize: 10,
    onChange: (pageNumber: number) => setPage(pageNumber),
    current: page,
    showSizeChanger: false,
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const exportToCSV = async () => {
    const { data } = await axios.get("/bids/getBid", {
      headers: {
        "x-access-token": `${localStorage.getItem(
          "softprodigy-bidding-token"
        )}`,
      },
    });
    const csvData = convertToCSV(data?.bids || []);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "bids.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convertToCSV = (data: any[]) => {
    const header = Object.keys(data[0]).join(",") + "\n";
    const body = data.map((row) => Object.values(row).join(",")).join("\n");
    return header + body;
  };

  // ?startDate=2024-05-01&endDate=2024-05-06

  const resetFilter = () => {
    setFilter(undefined);
    setSelectedFilters(["date"]);
  };

  return (
    <>
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

      {modal && (
        <ModalLayout
          isModalOpen={modal}
          setModal={closeModal}
          children={
            <BiddingForm bidId={bidId} setModal={setModal} refetch={refetch} />
          }
        />
      )}
      <Card title="Bidding List" className="w-full mx-auto p-2 m-4">
        <div className="mb-4 flex items-center space-x-4">
          <Input
            className="w-48 border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Search"
            prefix={<SearchOutlined />}
            value={search}
            onChange={handleSearch}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 flex items-center rounded transition duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={() => setFilterModal(true)}
          >
            <span className="flex items-center">
              <FilterOutlined className="text-xl mr-2" />
              <span className="hidden md:inline">Filter</span>
            </span>
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 flex items-center rounded transition duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={exportToCSV}
          >
            <span className="flex items-center">
              <ExportOutlined className="text-xl mr-2" />
              <span className="hidden md:inline">Export to CSV</span>
            </span>
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 flex items-center rounded transition duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={() => setModal(true)}
          >
            <span className="flex items-center">
              <PlusOutlined className="text-xl mr-2" />
              <span className="hidden md:inline">Add Bid</span>
            </span>
          </button>
        </div>

        <Skeleton active loading={isLoading}>
          {!isLoading && (
            <Table
              dataSource={data}
              columns={columns}
              pagination={pagination}
              bordered
              size="middle"
              className="shadow-md"
              onRow={(record) => ({
                onClick: () => navigate(record._id),
                className: "cursor-pointer",
              })}
            />
          )}
        </Skeleton>

        {isLoading && (
          <div className="mt-4">
            <Skeleton active paragraph={{ rows: 10 }}>
              <div className="flex w-full">
                {columns.map((_column, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-white p-3 mr-2 rounded-md border border-gray-300"
                    style={{ minWidth: `${100 / columns.length}%` }}
                  >
                    <div
                      className="h-8 bg-gray-100 mb-2 rounded-md"
                      style={{ width: "80%" }}
                    />
                    <div
                      className="h-8 bg-gray-100 mb-2 rounded-md"
                      style={{ width: "60%" }}
                    />
                    <div
                      className="h-8 bg-gray-100 rounded-md"
                      style={{ width: "40%" }}
                    />
                  </div>
                ))}
              </div>
            </Skeleton>
          </div>
        )}
      </Card>
      <ToastContainer />
    </>
  );
};

export default BiddingList;
