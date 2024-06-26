import { useState, useEffect, ChangeEvent } from "react";
import { Table, Card, Input, Skeleton } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import {
  UserIdInterface,
  useGetUserIdListQuery,
} from "../redux/apis/userid-apis-slice";
import ModalLayout from "../layout/ModalLayout";
import UserIdForm from "../components/Modal/UserIdForm";
import { ToastContainer } from "react-toastify";
import Confirmation from "../components/Dialog/Confirmation";
import axios from "../axios";
import { FaEdit, FaTrash } from "react-icons/fa";

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

const UserIdList: React.FC = () => {
  const [userIdData, setUserIdData] = useState<UserIdInterface[]>([]);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [modal, setModal] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | undefined>("");

  const { data: userIdListData, isLoading, refetch } = useGetUserIdListQuery();

  const data: UserIdInterface[] | undefined = userIdListData?.data;

  const closeModal = () => {
    setModal(false);
    setUserId(undefined);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: any[] = [
    {
      title: "#",
      dataIndex: "",
      key: "index",
      align: "center",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, _record: any, index: number) => index + 1,
      width: "50px",
    },
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Portal",
      dataIndex: "portal",
      key: "portal",
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      align: "center",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (value: any) => (
        <div className="flex justify-center items-center gap-6">
          <FaEdit
            size={15}
            className="cursor-pointer text-blue-600"
            onClick={() => {
              setUserId(value._id);
              setModal(true);
            }}
          />
          <FaTrash
            size={15}
            className="cursor-pointer text-red-600"
            onClick={() =>
              Confirmation(
                {
                  onConfirmation: () => deleteUserId(value._id),
                  message: "User id deleted.",
                },
                refetch
              )
            }
          />
        </div>
      ),
      width: "150px",
    },
  ];

  const deleteUserId = async (_id: string) => {
    try {
      await axios.delete(`/userId/deleteUserId/${_id}`, {
        headers: {
          "x-access-token": `${localStorage.getItem(
            "softprodigy-bidding-token"
          )}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (data) {
      setUserIdData(
        data.filter((fl: UserIdInterface) =>
          fl.id.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      );
    }
  }, [debouncedSearch, data]);

  return (
    <>
      {modal && (
        <ModalLayout
          isModalOpen={modal}
          setModal={closeModal}
          children={
            <UserIdForm setModal={setModal} refetch={refetch} userId={userId} />
          }
        />
      )}
      <Card title="Team List" className="w-full  mx-auto p-2 m-4">
        <div className="mb-4 flex items-center space-x-4">
          <Input
            className="w-48 border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Search"
            prefix={<SearchOutlined />}
            value={search}
            onChange={handleSearch}
          />
          <button
            onClick={() => setModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 flex items-center rounded transition duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <span className="flex items-center">
              <PlusOutlined className="text-xl mr-2" />
              <span className="hidden md:inline">Add Team</span>
            </span>
          </button>
        </div>

        <Skeleton active loading={isLoading}>
          <Table
            dataSource={userIdData}
            columns={columns}
            bordered
            size="middle"
            className="shadow-md"
            tableLayout="fixed"
          />
        </Skeleton>
      </Card>
      <ToastContainer />
    </>
  );
};

export default UserIdList;
