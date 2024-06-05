import axios from "../axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Skeleton, Button, Descriptions } from "antd";
import ModalLayout from "../layout/ModalLayout";
import BiddingForm from "../components/Modal/BiddingForm";
import { useGetBidListQuery } from "../redux/apis/bid-apis-slice";
import { ToastContainer } from "react-toastify";

const BidDetails = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bid, setBid] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { bidId } = useParams();
  const [modal, setModal] = useState<boolean>(false);
  const { refetch } = useGetBidListQuery({});

  const fetchBidDetails = async (bidId: string) => {
    try {
      const { data } = await axios.get(`/bids/getBidById/${bidId}`, {
        headers: {
          "x-access-token": `${localStorage.getItem(
            "softprodigy-bidding-token"
          )}`,
        },
      });
      setBid(data);
      setLoading(false); // Once data is fetched, set loading to false
    } catch (error) {
      setBid({});
      setLoading(false); // Set loading to false in case of error
    }
  };

  useEffect(() => {
    if (bidId) {
      fetchBidDetails(bidId);
    }
  }, [bidId]);

  return (
    <div className="p-4">
      {loading ? ( // Use Skeleton while data is loading
        <Skeleton active />
      ) : (
        <>
          {modal && (
            <ModalLayout
              isModalOpen={modal}
              setModal={setModal}
              children={
                <BiddingForm
                  bidId={bidId}
                  setModal={setModal}
                  refetch={() => {
                    refetch();
                    fetchBidDetails(bidId as string);
                  }}
                />
              }
            />
          )}
          <div className="flex justify-end mb-4">
            <Button
              type="primary"
              className="mr-2"
              onClick={() => setModal(true)}
            >
              <span>Edit</span>
            </Button>
            <Button>
              <Link to="/dashboard/bids" className="h-full w-full">
                Go Back
              </Link>
            </Button>
          </div>
          <Descriptions
            title="Bid Details"
            bordered
            column={1}
            layout="horizontal"
            className="bid-details shadow-xl bg-gray-100 rounded-lg p-6"
          >
            <Descriptions.Item
              label="Job Title"
              labelStyle={{ color: "#4A5568", fontWeight: "bold" }}
              className="text-gray-800"
            >
              {bid.JobTitle}
            </Descriptions.Item>
            <Descriptions.Item
              label="Proposal Link"
              labelStyle={{ color: "#4A5568", fontWeight: "bold" }}
              className="text-gray-800"
            >
              <a href={bid.URL} className="text-blue-500 hover:underline">
                {bid.URL}
              </a>
            </Descriptions.Item>
            <Descriptions.Item
              label="Id Used"
              labelStyle={{ color: "#4A5568", fontWeight: "bold" }}
              className="text-gray-800"
            >
              {bid.IdUsed}
            </Descriptions.Item>
            <Descriptions.Item
              label="Department"
              labelStyle={{ color: "#4A5568", fontWeight: "bold" }}
              className="text-gray-800"
            >
              {bid.department}
            </Descriptions.Item>
            <Descriptions.Item
              label="Job Link"
              labelStyle={{ color: "#4A5568", fontWeight: "bold" }}
              className="text-gray-800"
            >
              <a href={bid.jobLink} className="text-blue-500 hover:underline">
                {bid.jobLink}
              </a>
            </Descriptions.Item>
            <Descriptions.Item
              label="Name of Bidder"
              labelStyle={{ color: "#4A5568", fontWeight: "bold" }}
              className="text-gray-800"
            >
              {bid.nameofbidder}
            </Descriptions.Item>
            <Descriptions.Item
              label="Portal"
              labelStyle={{ color: "#4A5568", fontWeight: "bold" }}
              className="text-gray-800"
            >
              {bid.portal}
            </Descriptions.Item>
            <Descriptions.Item
              label="Status"
              labelStyle={{ color: "#4A5568", fontWeight: "bold" }}
              className="text-gray-800"
            >
              {bid.status}
            </Descriptions.Item>
            <Descriptions.Item
              label="Technology"
              labelStyle={{ color: "#4A5568", fontWeight: "bold" }}
              className="text-gray-800"
            >
              {bid.technology}
            </Descriptions.Item>
            <Descriptions.Item
              label="Bid Type"
              labelStyle={{ color: "#4A5568", fontWeight: "bold" }}
              className="text-gray-800"
            >
              {bid.bidType}
            </Descriptions.Item>
            <Descriptions.Item
              label="Date"
              labelStyle={{ color: "#4A5568", fontWeight: "bold" }}
              className="text-gray-800"
            >
              {new Date(bid.createdAt).toLocaleDateString()}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default BidDetails;
