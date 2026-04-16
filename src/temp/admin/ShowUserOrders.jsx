import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";

const ShowUserOrders = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [userOrder, setUserOrder] = useState(null);

  const accessToken = localStorage.getItem("accessToken");

  const getUserOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/user-order/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        setUserOrder(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  return (
    <div className="p-6 pt-24 w-[600px] items-center mx-auto ">
      

      <button onClick={() => navigate(-1)}>
        <FaArrowLeft className="w-6 h-6 mb-3" />
      </button>

      <h2 className="text-2xl font-bold mb-4">User Orders</h2>

      {userOrder?.orders?.length === 0 ? (
        <p className="text-gray-600 text-xl">No Orders Found</p>
      ) : (
        <div className="space-y-6">
          {userOrder?.orders?.map((order) => (
            <div key={order._id} className="shadow-lg rounded-2xl p-5 border">

              <div className="flex justify-between mb-3">
                <h1 className="font-semibold">
                  Order ID: <span className="text-gray-600">{order._id}</span>
                </h1>

                <p>
                  {order.currency} {order.amount?.toFixed?.(2)}
                </p>
              </div>

              <div className="flex justify-between mb-3">
                <div>
                  <p>
                    <b>User:</b> {order.user?.firstName} {order.user?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{order.user?.email}</p>
                </div>

                <span className={`px-2 py-1 rounded text-white ${
                  order.status === "Paid"
                    ? "bg-green-500"
                    : order.status === "Failed"
                    ? "bg-red-500"
                    : "bg-orange-400"
                }`}>
                  {order.status}
                </span>
              </div>

              <div>
                <h3 className="font-medium mb-2">Products:</h3>

                <div className="space-y-2">
                  {order.products?.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => navigate(`/products/${item.productId?._id}`)}
                      className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg cursor-pointer"
                    >
                      <img
                        src={item.productId?.productImg?.[0]?.url}
                        className="w-14 h-14 object-cover"
                        alt=""
                      />

                      <div className="flex-1">
                        <p>{item.productId?.productName}</p>
                        <p className="text-sm text-gray-500">
                          {item.productId?._id}
                        </p>
                      </div>

                      <p className="font-medium">
                        PKR {item.productId?.productPrice} × {item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowUserOrders;