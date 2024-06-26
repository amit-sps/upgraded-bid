import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd";
import axios from "../../axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface addUserIdInterFace {
  portal: string;
  id: string;
}

interface UserIdFormProps {
  setModal: React.Dispatch<boolean>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: any;
  userId?: string;
}

const { Option } = Select;

const UserIdForm: React.FC<UserIdFormProps> = ({
  setModal,
  refetch,
  userId,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValue, setInitialValue] = useState({});

  const handleSubmit = async (data: addUserIdInterFace) => {
    try {
      setLoading(true);
      if (userId) {
        await axios.put(`/userId/editUserIdById/${userId}`, data, {
          headers: {
            "x-access-token": `${localStorage.getItem(
              "softprodigy-bidding-token"
            )}`,
          },
        });
      } else {
        await axios.post("/userId/addUserId", data, {
          headers: {
            "x-access-token": `${localStorage.getItem(
              "softprodigy-bidding-token"
            )}`,
          },
        });
      }

      setLoading(false);
      refetch();
      setModal(false);
      toast.success("Team added successfully.", { autoClose: 1000 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setLoading(false);
      const responseData = error?.response?.data;
      if (responseData?.errors?.length) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responseData.errors.forEach((err: any) =>
          toast.error(err.msg, { autoClose: 1000 })
        );
      } else {
        const errorMessage = responseData
          ? responseData?.message
          : "Failed to add team.";
        toast.error(errorMessage, { autoClose: 1000 });
      }
    }
  };

  const fatchUserDetails = async (_id: string) => {
    try {
      const { data } = await axios.get(`/userId/getUserIdById/${_id}`, {
        headers: {
          "x-access-token": `${localStorage.getItem(
            "softprodigy-bidding-token"
          )}`,
        },
      });
      setInitialValue(data.userId[0]);
    } catch (error) {
      setInitialValue({});
    }
  };

  useEffect(() => {
    if (userId) {
      fatchUserDetails(userId);
    }
  }, []);

  return (
    <div className="w-[450px]">
      <h1 className="text-xl font-md mb-4">
        {userId ? "Update" : "Add"} Team
      </h1>
      <Form
        key={JSON.stringify(initialValue)}
        name="userIdForm"
        initialValues={initialValue}
        layout="vertical"
        onFinish={(formData) => handleSubmit(formData)}
        onFinishFailed={(errorInfo) => console.log("Failed:", errorInfo)}
      >
        <Form.Item
          label="Portal"
          name="portal"
          rules={[{ required: true, message: "Please select a portal" }]}
        >
          <Select className="w-full" placeholder="Select Portal">
            <Option value="" disabled>
              Select Portal
            </Option>
            <Option value="Upwork">Upwork</Option>
            <Option value="PPH">PPH</Option>
            <Option value="GURU">GURU</Option>
            <Option value="LinkedIn">LinkedIn</Option>
            <Option value="Email Marketing">Email Marketing</Option>
            <Option value="Appfutura">Appfutura</Option>
            <Option value="Freelancer">Freelancer</Option>
            <Option value="Codeur">Codeur</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="ID Name"
          name="id"
          rules={[{ required: true, message: "Please enter ID Name" }]}
        >
          <Input className="w-full" placeholder="Enter ID Name" />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              className="w-30 bg-blue-500 hover:bg-blue-700 text-white font-md p-4 rounded flex items-center"
              disabled={loading}
            >
              {loading ? "Adding..." : userId ? "Update" : "Add +"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserIdForm;
