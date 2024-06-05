import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { useGetPortalRecordsQuery } from '../redux/apis/dashboard-api-slice';
import { Skeleton } from 'antd';

const LineChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const { data, isLoading } = useGetPortalRecordsQuery();

  useEffect(() => {
    if (isLoading || !data || !chartRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const labels = data.data.map((item: any) => item.name);
    const datasets = Object.keys(data.data[0])
      .filter(key => key !== 'name')
      .map(key => ({
        label: key,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  return (
    <div style={{ position: 'relative' }}>
      <Skeleton loading={isLoading} active>
        <canvas ref={chartRef} style={{ display: isLoading ? 'none' : 'block' }} />
      </Skeleton>
    </div>
  );
};

export default LineChart;
