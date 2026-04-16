import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const AdminSales = () => {

  const [states, setStates] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    salesByDate: []
  });

  const accessToken = localStorage.getItem("accessToken");

  // 🔥 FETCH SALES DATA
  const fetchStates = async () => {
    try {
      console.log("🔥 Fetching sales data...");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/sales`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      console.log("📊 API RESPONSE:", res.data);

      if (res.data.success) {
        setStates({
          totalUsers: res.data.totalUsers || 0,
          totalProducts: res.data.totalProducts || 0,
          totalOrders: res.data.totalOrders || 0,
          totalSales: res.data.totalSales || 0,
          salesByDate: res.data.sales || []
        });

        console.log("✅ STATE UPDATED SUCCESSFULLY");
      }

    } catch (error) {
      console.log("❌ ERROR FETCHING SALES:", error);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  return (
    <div className="pt-24 pl-[350px] bg-gray-100 min-h-screen px-6">

      {/* 📊 STATS CARDS */}
      <div className="grid grid-cols-4 gap-6">

        <div className="bg-pink-300 rounded-lg p-6 shadow">
          <h1 className="text-lg font-semibold">Total Users</h1>
          <div className="mt-2 text-2xl font-bold">
            {states.totalUsers}
          </div>
        </div>

        <div className="bg-pink-300 rounded-lg p-6 shadow">
          <h1 className="text-lg font-semibold">Total Products</h1>
          <div className="mt-2 text-2xl font-bold">
            {states.totalProducts}
          </div>
        </div>

        <div className="bg-pink-300 rounded-lg p-6 shadow">
          <h1 className="text-lg font-semibold">Total Orders</h1>
          <div className="mt-2 text-2xl font-bold">
            {states.totalOrders}
          </div>
        </div>

        <div className="bg-pink-300 rounded-lg p-6 shadow">
          <h1 className="text-lg font-semibold">Total Sales</h1>
          <div className="mt-2 text-2xl font-bold">
            PKR {states.totalSales}
          </div>
        </div>

      </div>

      {/* 📈 CHART SECTION */}
      <div className="mt-10">

        <h1 className="text-xl font-bold mb-4">
          Sales (Last 30 Days)
        </h1>

        <div className="h-[320px] bg-white p-4 rounded-lg shadow">

          <ResponsiveContainer width="100%" height="100%">

            <AreaChart data={states.salesByDate}>

              {/* X AXIS */}
              <XAxis dataKey="date" />

              {/* Y AXIS */}
              <YAxis />

              {/* TOOLTIP */}
              <Tooltip />

              {/* AREA GRAPH */}
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#F472B6"
                fill="#F472B6"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
};

export default AdminSales;