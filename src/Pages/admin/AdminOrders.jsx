import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from "@mui/material";
import axios from 'axios';
import { FaMagnifyingGlass } from "react-icons/fa6";
import userLogo from "../../assets/userLogo.png";
import LoaderScreen from '../../components/LoaderScreen';

const AdminOrders = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const getAllOrders = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(
       `${import.meta.env.VITE_API_URL}/orders/all-orders`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        setOrders(res.data.orders);

        setToast({
          open: true,
          message: "Orders fetched successfully ✅",
          severity: "success"
        });
      }

    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "No Orders found ❌",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  // ✅ SEARCH
  const filtered = orders.filter((order) => {
    const text = search.toLowerCase();

    return (
      order.user?.firstName?.toLowerCase().includes(text) ||
      order.user?.lastName?.toLowerCase().includes(text) ||
      order.user?.email?.toLowerCase().includes(text) ||
      order._id?.toLowerCase().includes(text) ||
      order.status?.toLowerCase().includes(text) ||
      String(order.amount)?.includes(text) ||
      order.products?.some(p =>
        p.productId?.productName?.toLowerCase().includes(text)
      )
    );
  });

  // ✅ GROUPING
  const pendingOrders = filtered.filter(o => o.status === "Pending");
  const failedOrders = filtered.filter(o => o.status === "Failed");
  const paidOrders = filtered.filter(o => o.status === "Paid");

  // ✅ TABLE RENDER
  const renderTable = (list, title) => (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      {list.length === 0 ? (
        <p className="text-gray-500">No {title} Orders</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">

          {/* HEADER */}
          <div className="grid grid-cols-6 bg-gray-200 p-3 font-semibold text-sm">
            <span>User</span>
            <span>Email</span>
            <span>Order ID</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Products</span>
          </div>

          {/* ROWS */}
          {list.map((order) => (
            <div
              key={order._id}
              className="grid grid-cols-6 items-center p-3 border-b text-sm hover:bg-gray-50"
            >

              {/* USER */}
              <div className="flex items-center gap-2">
                <img
                  src={order.user?.profilePic || userLogo}
                  className="w-8 h-8 rounded-full"
                />
                <span>
                  {order.user?.firstName} {order.user?.lastName}
                </span>
              </div>

              {/* EMAIL */}
              <span className="text-gray-600">
                {order.user?.email}
              </span>

              {/* ORDER ID */}
              <span className="truncate">
                {order._id}
              </span>

              {/* AMOUNT */}
              <span>
                {order.currency} {order.amount}
              </span>

              {/* STATUS */}
              <span className={`px-2 py-1 rounded text-white text-xs w-fit ${
                order.status === "Paid"
                  ? "bg-green-500"
                  : order.status === "Failed"
                  ? "bg-red-500"
                  : "bg-orange-400"
              }`}>
                {order.status}
              </span>

              {/* PRODUCTS */}
              <span className="line-clamp-1">
                {order.products?.map(p => p.productId?.productName).join(", ")}
              </span>

            </div>
          ))}

        </div>
      )}
    </div>
  );

  if (loading) return <LoaderScreen />;

  return (
    <div className="pt-26 px-8 w-[70%] md:w-[55%] mx-auto">

      <h1 className="mt-4 text-3xl font-bold">Orders Management</h1>

      {/* SEARCH */}
      <div className="relative w-[300px] mt-6">
        <input
          type="text"
          placeholder="Search Orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        <FaMagnifyingGlass className="absolute right-2 top-3" />
      </div>

      {/* TABLE SECTIONS */}
      {renderTable(pendingOrders, "Pending")}
      {renderTable(failedOrders, "Failed")}
      {renderTable(paidOrders, "Paid / Completed")}

      {/* TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() => setToast({ ...toast, open: false })}
        >
          {toast.message}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default AdminOrders;