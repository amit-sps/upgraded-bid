import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Row, Col } from "antd";
import axios from "../../axios";
import { UserIdInterface } from "../../redux/apis/userid-apis-slice";
import { toast } from "react-toastify";

const { Option } = Select;

interface BiddingFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: any;
  bidId?: string;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const BiddingForm: React.FC<BiddingFormProps> = ({
  bidId,
  setModal,
  refetch,
}) => {
  const [userIds, setUserIds] = useState<UserIdInterface[]>([]);
  const [initialData, setInitialData] = useState({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (formData: any) => {
    try {
      if (bidId) {
        await axios.put(`/bids/editBidById/${bidId}`, formData, {
          headers: {
            "x-access-token": `${localStorage.getItem(
              "softprodigy-bidding-token"
            )}`,
          },
        });
      } else {
        await axios.post("/bids/addBid", formData, {
          headers: {
            "x-access-token": `${localStorage.getItem(
              "softprodigy-bidding-token"
            )}`,
          },
        });
      }

      setModal(false);
      refetch();
      toast.success(`Bid ${bidId ? "updated" : "added"} successfully.`, {
        autoClose: 1000,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      const responseData = error?.response?.data;
      if (responseData?.errors?.length) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responseData.errors.forEach((err: any) =>
          toast.error(err.msg, { autoClose: 1000 })
        );
      } else {
        const errorMessage = responseData
          ? responseData?.message
          : "Failed to add User ID.";
        toast.error(errorMessage, { autoClose: 1000 });
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const fetchBidById = async (bidId: string) => {
    try {
      const { data } = await axios.get(`/bids/getBidById/${bidId}`, {
        headers: {
          "x-access-token": `${localStorage.getItem(
            "softprodigy-bidding-token"
          )}`,
        },
      });
      data.portal && fetchUserIdsByPortal(data.portal);
      setInitialData({ ...data, IdUsed: data?.idUsedForBid });
    } catch (error) {
      setInitialData({});
    }
  };

  const fetchUserIdsByPortal = async (portal: string) => {
    try {
      const {
        data: { userId },
      } = await axios.get(`/userId/getByPortal/${portal}`, {
        headers: {
          "x-access-token": `${localStorage.getItem(
            "softprodigy-bidding-token"
          )}`,
        },
      });
      setUserIds(userId);
    } catch (err) {
      console.log(err);
      setUserIds([]);
    }
  };

  useEffect(() => {
    if (bidId) {
      fetchBidById(bidId);
    }
  }, []);

  return (
    <div className="w-[600px] ">
      <h1 className="text-xl font-md mb-4">
        {" "}
        {bidId ? "Edit" : "Add"} Bidding
      </h1>
      <Form
        key={JSON.stringify(initialData)}
        name="addBiddingForm"
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={initialData}
        layout="vertical"
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Job Title"
              name="JobTitle"
              rules={[{ required: true, message: "Please enter job title" }]}
            >
              <Input placeholder="Enter Job Title" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Portal"
              name="portal"
              rules={[{ required: true, message: "Please select a portal" }]}
            >
              <Select
                placeholder="Select Portal"
                onChange={(value) => fetchUserIdsByPortal(value)}
              >
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
          </Col>
          <Col span={12}>
            <Form.Item
              label="Id Used"
              name="IdUsed"
              rules={[{ required: true, message: "Please select an ID used" }]}
            >
              <Select placeholder="Select ID Used">
                {userIds.map((ids) => (
                  <Option value={ids._id} key={ids._id}>
                    {ids.id}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Bid Type"
              name="bidType"
              rules={[{ required: true, message: "Please select a bid type" }]}
            >
              <Select placeholder="Select Bid Type">
                <Option value="Bid">Bid</Option>
                <Option value="Invite">Invite</Option>
                <Option value="Email Marketing">Email Marketing</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Job Link"
              name="jobLink"
              rules={[{ required: true, message: "Please enter job link" }]}
            >
              <Input placeholder="Enter Job Link" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Proposal Link"
              name="URL"
              rules={[
                { required: true, message: "Please enter proposal link" },
              ]}
            >
              <Input placeholder="Enter Proposal Link" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Technology"
              name="technology"
              rules={[{ required: true, message: "Please enter technology" }]}
            >
              <Input placeholder="Enter Technology" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Department"
              name="department"
              rules={[
                { required: true, message: "Please select a department" },
              ]}
            >
              <Select placeholder="Select Department">
                <Option value="OST">OST</Option>
                <Option value="BED">BED</Option>
                <Option value="JST">JST</Option>
                <Option value="SI">SI</Option>
                <Option value="MSS">MSS</Option>
                <Option value="SDM">SDM</Option>
                <Option value="MED">MED</Option>
                <Option value="LAMP">LAMP</Option>
                <Option value="DTX">DTX</Option>
                <Option value="DevOps">DevOps</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select placeholder="Select Status">
                <Option value="Job Submitted">Job Submitted</Option>
                {bidId && (
                  <>
                    {" "}
                    <Option value="Response Received">Response Received</Option>
                    <Option value="Scrapped">Scrapped</Option>
                    <Option value="Converted">Converted</Option>
                  </>
                )}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Connects"
              name="connect"
              rules={[
                { required: true, message: "Please enter number of connects" },
              ]}
            >
              <Input type="number" placeholder="Enter Connects" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              className="w-30 bg-blue-500 hover:bg-blue-700 text-white p-4 rounded flex items-center"
            >
              {bidId ? "Update Bid" : "Add Bid +"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BiddingForm;
