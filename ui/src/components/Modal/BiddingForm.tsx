import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Row, Col } from "antd";
import axios from "../../axios";import { toast } from "react-toastify";
import {
  useGetSkillListsQuery,
  useGetTeamListBySkillsQuery,
} from "../../redux/apis/bid-apis-slice";
import { useGetBidStatisticsQuery, useGetBiderDataQuery } from "../../redux/apis/dashboard-api-slice";

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
  const [initialData, setInitialData] = useState({});
  const [technology, setTechnologies] = useState<string[]>([]);
  const { data: skillListsData } = useGetSkillListsQuery();
  const { data: teamList } = useGetTeamListBySkillsQuery({
    skills: technology,
  });
  const {refetch: fetchDashboardCount} = useGetBidStatisticsQuery();
  const {refetch: fetchDashboardGraph} = useGetBiderDataQuery({});
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
      fetchDashboardCount();
      fetchDashboardGraph();
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
          : "Failed to add team.";
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
      setInitialData({ ...data, team: data?.team?._id });
    } catch (error) {
      setInitialData({});
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
              label="Bid Title"
              name="title"
              rules={[{ required: true, message: "Please enter bid title" }]}
            >
              <Input placeholder="Enter Bid Title" />
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
              label="Technology"
              name="technology"
              rules={[
                { required: true, message: "Please select technologies" },
              ]}
            >
              <Select
                mode="multiple"
                value={technology}
                onChange={setTechnologies}
                placeholder="Select technologies"
                style={{
                  borderColor: "#ddd",
                  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                }}
              >
                {skillListsData?.data.map((skill, inx) => (
                  <Option key={inx} value={skill}>
                    {skill}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Team"
              name="team"
              rules={[{ required: true, message: "Please select an team" }]}
            >
              <Select placeholder="Select Team">
                {teamList?.data.map((team) => (
                  <Option value={team._id} key={team._id}>
                    {team.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Job Link"
              name="bidLink"
              rules={[{ required: true, message: "Please enter job link" }]}
            >
              <Input placeholder="Enter Job Link" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Proposal Link"
              name="proposalLink"
              rules={[
                { required: true, message: "Please enter proposal link" },
              ]}
            >
              <Input placeholder="Enter Proposal Link" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Status"
              name="bidStatus"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select placeholder="Select Status">
                <Option value="Submitted">Submitted</Option>
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
