import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { useGetPortalRecordsQuery } from '../redux/apis/dashboard-api-slice';
import { Skeleton } from 'antd';

const LineChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const { data, isLoading } = useGetPortalRecordsQuery();

  useEffect(() => {
    if (isLoading || !data || !chartRef.current) return;

    const labels = data.data.map((item: any) => item.name);
    const datasets = Object.keys(data.data[0])
      .filter(key => key !== 'name')
      .map(key => ({
        label: key,
        data: data.data.map((item: any) => item[key] as number),
      }));

    const chart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets,
      },
    });

    return () => {
      chart.destroy();
    };
  }, [data, isLoading]);

  // Define styles using Tailwind CSS classes
  const messageStyle = "text-center p-4 text-gray-500";

  // Show message if data is empty
  if (!isLoading && (!data || data.data.length === 0)) {
    return <div className={messageStyle}>No data available for chart</div>;
  }

  return (
    <div className="relative">
      <Skeleton loading={isLoading} active>
        {data && data.data.length > 0 && (
          <canvas ref={chartRef} className="block" style={{ display: isLoading ? 'none' : 'block' }} />
        )}
      </Skeleton>
    </div>
  );
};

export default LineChart;
