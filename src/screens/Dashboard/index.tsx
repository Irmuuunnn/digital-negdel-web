import { useEffect, useState, useCallback } from "react";
import { Typography } from "antd";
import { Skeleton } from "@/components/ui/skeleton";
// import { BarChart } from '@mui/x-charts/BarChart';
// import { PieChart } from '@mui/x-charts/PieChart';

interface TotalAmount {
  data: number;
}

const DashboardScreen = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [totalTopup, setTotalTopup] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const ApiUrl = import.meta.env.VITE_API_URL;

  const fetchTotalPayment = useCallback(async () => {
    try {
      const response = await fetch(`${ApiUrl}/dashboard/total-amount?type=pay`);
      const data: TotalAmount = await response.json();
      setTotalPayment(Number(data.data) || 0);
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching total payment amount");
    }
  }, [ApiUrl]);

  const fetchTotalTopup = useCallback(async () => {
    try {
      const response = await fetch(`${ApiUrl}/dashboard/total-amount?type=topup`);
      const data: TotalAmount = await response.json();
      setTotalTopup(Number(data.data) || 0);
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching total topup amount");
    }
  }, [ApiUrl]);

  const fetchTotalUsers = useCallback(async () => {
    try {
      const response = await fetch(`${ApiUrl}/users?offset=0&page=1`);
      const data = await response.json();
      if (data.status) {
        setTotalUsers(data.row_count || 0);
      } else {
        setError("Failed to fetch total users");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching total users");
    }
  }, [ApiUrl]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([fetchTotalPayment(), fetchTotalTopup(), fetchTotalUsers()]);
    } catch (e) {
      console.error(e);
      setError("An error occurred while fetching dashboard data");
    } finally {
      setLoading(false);
    }
  }, [fetchTotalPayment, fetchTotalTopup, fetchTotalUsers]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (error) return <Typography.Text type="danger">{error}</Typography.Text>;

  return (
    <div className=" w-full h-full">
    <div className="p-6 flex gap-4">
      {/* Total Topup */}
      <div className="bg-white border shadow-xl rounded-xl  w-full relative overflow-hidden">
        <div className="p-5 flex flex-col gap-2">
          <span className="text-black text-lg">💵 Total Topups</span>
          {loading ? (
            <Skeleton className="h-6 w-full shimmer" />
          ) : (
            <span className="font-semibold text-2xl ">
              {totalTopup.toLocaleString()} $
            </span>
          )}
        </div>
        <div className="w-full bg-green-500 h-1 absolute bottom-1 -mb-1"></div>

      </div>

      {/* Total Payment */}
      <div className="bg-white border shadow-xl rounded-xl  w-full relative overflow-hidden">
        <div className="p-5 flex flex-col gap-2">
          <span className="text-black text-lg">💰 Total Payments</span>
          {loading ? (
            <Skeleton className="h-6 w-full shimmer" />
          ) : (
            <span className=" font-semibold text-2xl ">
              {totalPayment.toLocaleString()} ₮
            </span>
          )} 
        </div>
        <div className="w-full bg-red-500 h-1 absolute bottom-1 -mb-1"></div>
      </div>

      {/* Total Users */}
      <div className="bg-white border shadow-xl rounded-xl   w-full relative overflow-hidden">
        <div className="p-5 flex flex-col gap-2">
          <span className="text-black text-lg">👥 Total Users</span>
          {loading ? (
            <Skeleton className="h-6 w-full shimmer" />
          ) : (
            <span className="font-semibold text-2xl ">
              {totalUsers.toLocaleString()}
            </span>
          )}
        </div>
        <div className="w-full bg-blue-800 h-1 absolute bottom-1 -mb-1"></div>
      </div>
    </div>
    {/* <BarChart
      series={[
        { data: [35, 44, 24, 34] },
        { data: [51, 6, 49, 30] },
        { data: [15, 25, 30, 50] },
        { data: [60, 50, 15, 25] },
      ]}
      height={290}
      xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'] }]}
    />
      <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'series A' },
            { id: 1, value: 15, label: 'series B' },
            { id: 2, value: 20, label: 'series C' },
          ],
        },
      ]}
      width={200}
      height={200}
    /> */}
    </div>
    
  );
};

export default DashboardScreen;
