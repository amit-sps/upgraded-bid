import React, { useEffect, useState } from "react";
import {
  Table,
  Switch,
  Input,
  Tag,
  Card,
  notification,
  Button,
  Modal,
  Form,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  UserInterface,
  useGetAllUsersQuery,
} from "../redux/apis/users-apis-slice";
import axios from "../axios";
import { toast } from "react-toastify";

const UserLists: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<UserInterface[]>([]);
  const { data, refetch } = useGetAllUsersQuery();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const sendInvite = async () => {
    form.validateFields().then(async (values) => {
      try {
        const { data } = await axios.post("/auth/send-invite", {
          email: values.email,
        });
        notification.success({ message: data.message, duration: 1 });
        setIsModalVisible(false);
        form.resetFields();
      } catch (error: any) {
        const responseData = error?.response?.data;
        console.log(error?.response);
        if (responseData?.errors?.length) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          responseData.errors.forEach((err: any) =>
            toast.error(err.msg, { autoClose: 1000 })
          );
        } else {
          const errorMessage = responseData
            ? responseData?.message
            : "Invalid credentials.";
          toast.error(errorMessage, { autoClose: 1000 });
        }
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filteredData: UserInterface[] = data?.data?.length
      ? data.data.filter(
          (user) =>
            user?.username?.toLowerCase().includes(value) ||
            user?.name?.toLowerCase().includes(value) ||
            user?.role?.toLowerCase().includes(value) ||
            (user?.isEmailVerified ? "verified" : "unverified").includes(
              value
            ) ||
            user?.skills?.some((skill) =>
              skill.toLowerCase().includes(value)
            ) ||
            user?.email?.toLowerCase().includes(value)
        )
      : [];

    setFilteredUsers(filteredData);
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      className: "uppercase",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Email Verified",
      dataIndex: "isEmailVerified",
      key: "isEmailVerified",
      render: (isEmailVerified: boolean) => (
        <Tag color={isEmailVerified ? "green" : "red"}>
          {isEmailVerified ? "Verified" : "Unverified"}
        </Tag>
      ),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: UserInterface) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleActive(record._id)}
        />
      ),
    },
    {
      title: "Skills",
      dataIndex: "skills",
      key: "skills",
      render: (skills: string[]) => (
        <>
          {skills.length > 0
            ? skills.map((skill, index) => (
                <Tag color="blue" key={index}>
                  {skill}
                </Tag>
              ))
            : "N/A"}
        </>
      ),
    },
  ];

  const handleToggleActive = async (userId: string) => {
    try {
      const { data } = await axios.put(
        `/users/toggle/status/${userId}`,
        {},
        {
          headers: {
            "x-access-token": `${localStorage.getItem(
              "softprodigy-bidding-token"
            )}`,
          },
        }
      );

      notification.success({ message: data?.message });
      refetch();
    } catch (error: any) {
      notification.error({ message: error?.response?.data?.message });
    }
  };

  useEffect(() => {
    const usersListData: UserInterface[] = data?.data || [];
    setFilteredUsers(usersListData);
  }, [data]);

  return (
    <Card title="User Lists" className="w-full mx-auto m-4">
      <div className="flex">
        <Button className="ml-auto" onClick={showModal}>
          Invite User +
        </Button>
      </div>
      <div className="container mx-auto px-4 py-4 shadow-md">
        <div className="relative mb-4">
          <Input
            placeholder="Search by username, name, role, email, or skills"
            value={searchText}
            onChange={handleSearch}
            className="p-2 border rounded w-full pl-10"
          />
          <SearchOutlined className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
        </div>
        <Table
          dataSource={filteredUsers}
          columns={columns}
          pagination={{ pageSize: 10 }}
          rowKey="_id"
          size="small"
        />
      </div>

      <Modal
        title="Invite User"
        visible={isModalVisible}
        onOk={sendInvite}
        onCancel={handleCancel}
        okText="Invite"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" name="invite_user">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input the email!",
              },
              {
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserLists;
