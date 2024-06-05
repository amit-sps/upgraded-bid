import { useState } from "react";
import { Table, Card, Button, Skeleton } from "antd";
import { useGetBidTableQuery } from "../../redux/apis/dashboard-api-slice";

const BidTable = () => {
  const { data: userTableData, isLoading } = useGetBidTableQuery();

  const data = userTableData?.userBids?.map((bid) => bid);

  const columns = [
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Today Bids",
      dataIndex: "todayBids",
      key: "todayBids",
    },
    {
      title: "Yesterday Bids",
      dataIndex: "yesturdayBids",
      key: "yesturdayBids",
      render: (amount: number) => `${amount}`,
    },
    {
      title: "Converted Bids",
      dataIndex: "convertedBids",
      key: "convertedBids",
    },
    {
      title: "Submitted Bids",
      dataIndex: "submittedBids",
      key: "submittedBids",
    },
    {
      title: "Total Bids",
      dataIndex: "totalBids",
      key: "totalBids",
    },
  ];

  const [page, setPage] = useState<number>(1);

  const pagination = {
    total: data ? data.length : 0,
    pageSize: 10,
    onChange: (pageNumber: number) => setPage(pageNumber),
    current: page,
    showSizeChanger: false,
  };

  const exportToCSV = () => {
    const csvData = convertToCSV(data || []);
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

  return (
    <Card title="Bidding Table">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
        }}
      >
        <Button onClick={exportToCSV}>Export to CSV</Button>
      </div>
      {isLoading ? (
        <Skeleton active />
      ) : (
        <Table
          dataSource={data}
          columns={columns}
          pagination={pagination}
          bordered
          size="middle"
        />
      )}
    </Card>
  );
};

export default BidTable;
