import { useState, useEffect, ChangeEvent } from "react";
import { Table, Card, Input, Skeleton, Drawer, } from "antd";
import {
  SearchOutlined,
  ExportOutlined,
  FilterOutlined,
  PlusOutlined,
  EyeOutlined,
  TeamOutlined,
  UserOutlined,
  CodeOutlined,
  LinkOutlined,
  EditOutlined
} from "@ant-design/icons";
import { Bid, useGetBidListQuery } from "../redux/apis/bid-apis-slice";
import ModalLayout from "../layout/ModalLayout";
import BiddingForm from "../components/Modal/BiddingForm";
import { ToastContainer } from "react-toastify";
import axios from "../axios";
import FilterModal from "../components/Modal/FilterModal";
import { FilterInterface } from "../interfaces";
import * as XLSX from 'xlsx';

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
  const [viewDrawerVisible, setViewDrawerVisible] = useState<boolean>(false); // State for view drawer
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null); // State to store selected bid details

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

  const columns: any = [
    {
      title: "Team Selected",
      dataIndex: ["team", "name"],
      key: "team.name",
    },
    {
      title: "Bidder",
      dataIndex: ["bidder", "name"],
      key: "bidder.name",
    },
    {
      title: "Job Title",
      dataIndex: "title",
      key: "title",
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
      title: "Connects",
      dataIndex: "connect",
      key: "connect",
      sorter: (a: Bid, b: Bid) => a.connect - b.connect,
    },
    {
      title: "Portal",
      dataIndex: "portal",
      key: "portal",
    },
    {
      title: "Status",
      dataIndex: "bidStatus",
      key: "bidStatus",
    },
    {
      title: "Bid Link",
      dataIndex: "bidLink",
      key: "bidLink",
      align:"center",
      render: ((value:string)=>(<a href={value}><LinkOutlined style={{ fontSize: "15px", color: "#1890ff" }} /></a>))
    },
    {
      title: "Proposal Link",
      dataIndex: "proposalLink",
      align: "center",
      key: "proposalLink",
      render: ((value:string)=>(<a href={value}><LinkOutlined style={{ fontSize: "15px", color: "#1890ff" }} /></a>))
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      align: "center",
      render: (value: Bid) => (
        <div className="flex justify-center  gap-4">
          
          <button
            onClick={() => {
              setSelectedBid(value);
              setViewDrawerVisible(true);
            }}
          >
            <EyeOutlined style={{ fontSize: "18px", color: "#1890ff" }} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setBidId(value._id);
              setModal(true);
            }}
          >
            <EditOutlined style={{ fontSize: "18px", color: "#1890ff" }} />
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

  const exportToExcel = async () => {
    const { data } = await axios.get("/bids/getBid", {
      headers: {
        "x-access-token": `${localStorage.getItem("softprodigy-bidding-token")}`,
      },
    });
  
    const bids: Bid[] = data?.bids || [];
  
    const worksheetData = [
      [
        "Bid ID", "Connect", "Title", "Portal", "Bid Status", "Technology", "Created At", "Updated At",
        "Team ID", "Team Name", "Team Username", "Team Email", "Team Skills",
        "Bidder ID", "Bidder Name", "Bidder Username", "Bidder Email",
        "Bid Link", "Proposal Link"
      ],
      ...bids.map(bid => [
        bid._id,
        bid.connect,
        bid.title,
        bid.portal,
        bid.bidStatus,
        bid.technology.join(", "),
        bid.createdAt,
        bid.updatedAt,
        bid.team._id,
        bid.team.name,
        bid.team.username,
        bid.team.email,
        bid.team.skills.join(", "),
        bid.bidder._id,
        bid.bidder.name,
        bid.bidder.username,
        bid.bidder.email,
        bid.bidLink,
        bid.proposalLink
      ])
    ];
  
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F81BD" } },
      alignment: { vertical: "center", horizontal: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    };
    for (let i = 0; i < worksheetData[0].length; i++) {
      const cellAddress = XLSX.utils.encode_cell({ c: i, r: 0 });
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = headerStyle;
      }
    }
  
    const dataRowStyle = {
      alignment: { vertical: "center", horizontal: "left", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    };
    for (let r = 1; r < worksheetData.length; r++) {
      for (let c = 0; c < worksheetData[r].length; c++) {
        const cellAddress = XLSX.utils.encode_cell({ c, r });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            ...dataRowStyle,
            fill: { fgColor: { rgb: r % 2 === 0 ? "F2F2F2" : "FFFFFF" } } // Alternating row colors
          };
        }
      }
    }
  
    const colWidths = [
      { wpx: 100 }, { wpx: 80 }, { wpx: 200 }, { wpx: 100 }, { wpx: 100 },
      { wpx: 150 }, { wpx: 150 }, { wpx: 150 }, { wpx: 100 }, { wpx: 150 },
      { wpx: 150 }, { wpx: 200 }, { wpx: 150 }, { wpx: 100 }, { wpx: 150 },
      { wpx: 150 }, { wpx: 150 }, { wpx: 200 }, { wpx: 200 }
    ];
    worksheet["!cols"] = colWidths;
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bids");
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "bids.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


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

      <Drawer
        title="Bid Details"
        placement="right"
        width={400}
        onClose={() => setViewDrawerVisible(false)}
        visible={viewDrawerVisible}
      >
        {selectedBid && (
          <div className="p-4 space-y-4">
            {/* Bid Information */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <EyeOutlined className="text-blue-500 mr-2" />
                Bid Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Connect:</p>
                  <p>{selectedBid.connect}</p>
                </div>
                <div>
                  <p className="font-semibold">Bid Status:</p>
                  <p>{selectedBid.bidStatus}</p>
                </div>
                <div>
                  <p className="font-semibold">Portal:</p>
                  <p>{selectedBid.portal}</p>
                </div>
                <div>
                  <p className="font-semibold">Created At:</p>
                  <p>
                    {new Date(selectedBid.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Updated At:</p>
                  <p>
                    {new Date(selectedBid.updatedAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Team Information */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <TeamOutlined className="text-blue-500 mr-2" />
                Team Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Name:</p>
                  <p>{selectedBid.team.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Username:</p>
                  <p>{selectedBid.team.username}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{selectedBid.team.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Skills:</p>
                  <p>{selectedBid.team.skills.join(", ")}</p>
                </div>
              </div>
            </div>

            {/* Bidder Information */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <UserOutlined className="text-blue-500 mr-2" />
                Bidder Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Name:</p>
                  <p>{selectedBid.bidder.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Username:</p>
                  <p>{selectedBid.bidder.username}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{selectedBid.bidder.email}</p>
                </div>
              </div>
            </div>

            {/* Technology Used */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <CodeOutlined className="text-blue-500 mr-2" />
                Technology Used
              </h2>
              <div className="flex flex-wrap gap-2">
                {selectedBid.technology.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

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
            onClick={exportToExcel}
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
            />
          )}
        </Skeleton>

        {isLoading && (
          <div className="mt-4">
            <Skeleton active paragraph={{ rows: 10 }}>
              <div className="flex w-full">
                {columns.map((_column: any, index: any) => (
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
