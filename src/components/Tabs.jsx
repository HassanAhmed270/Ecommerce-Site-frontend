import { useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Tabs = ({
  profilePic,
  handleFileChange,
  handleChange,
  handleSubmit,
  updateUser,
  loading,
  userOrder
}) => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center mt-10">

      {/* Tabs Header */}
      <div className="flex bg-gray-200 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-6 py-2 rounded-md text-sm font-medium ${
            activeTab === "profile" ? "bg-white text-black" : "text-gray-500"
          }`}
        >
          Profile
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`px-6 py-2 rounded-md text-sm font-medium ${
            activeTab === "orders" ? "bg-white text-black" : "text-gray-500"
          }`}
        >
          Orders
        </button>
      </div>

      {/* Content */}
      <div className="bg-gray-100 p-6 mt-4 rounded-xl w-[700px] shadow-lg">

        {/* ================= PROFILE ================= */}
        {activeTab === "profile" && (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

            {/* LEFT */}
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-2xl font-semibold">Update Profile</h2>

              <img
                src={profilePic}
                alt="profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-pink-800"
              />

              <label className="cursor-pointer bg-pink-600 px-5 py-2 rounded-lg text-white font-semibold hover:bg-pink-700 flex items-center gap-2">
                {loading ? (
                  <>
                    <LuLoaderCircle className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Image"
                )}

                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            {/* RIGHT */}
            <div className="space-y-4">
              <input name="firstName" value={updateUser.firstName} onChange={handleChange} placeholder="First Name" className="w-full p-2 border rounded-lg" />
              <input name="lastName" value={updateUser.lastName} onChange={handleChange} placeholder="Last Name" className="w-full p-2 border rounded-lg" />

              <input name="email" value={updateUser.email} disabled className="w-full p-2 border rounded-lg bg-gray-200" />

              <input name="phoneNo" value={updateUser.phoneNo} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded-lg" />
              <input name="address" value={updateUser.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded-lg" />
              <input name="city" value={updateUser.city} onChange={handleChange} placeholder="City" className="w-full p-2 border rounded-lg" />
              <input name="zipCode" value={updateUser.zipCode} onChange={handleChange} placeholder="Zip Code" className="w-full p-2 border rounded-lg" />

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg text-white flex justify-center items-center gap-2 ${
                  loading ? "bg-pink-400" : "bg-pink-600 hover:bg-pink-700"
                }`}
              >
                {loading ? (
                  <>
                    <LuLoaderCircle className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>

          </form>
        )}

        {/* ================= ORDERS ================= */}
        {activeTab === "orders" && (
          <div>
            <button onClick={() => navigate(-1)}>
              <FaArrowLeft className="w-6 h-6 mb-3" />
            </button>

            <h2 className="text-lg font-semibold mb-4">My Orders</h2>

            {userOrder?.orders?.length === 0 ? (
              <p className="text-gray-600 text-xl">No Orders Found</p>
            ) : (
              <div className="space-y-6">
                {userOrder?.orders?.map((order) => (
                  <div key={order._id} className="shadow-lg rounded-2xl p-5 border">

                    {/* Header */}
                    <div className="flex justify-between mb-3">
                      <h1 className="font-semibold">
                        Order ID: <span className="text-gray-600">{order._id}</span>
                      </h1>

                      <p>
                        {order.currency} {order.amount?.toFixed?.(2)}
                      </p>
                    </div>

                    {/* User */}
                    <div className="flex justify-between mb-3">
                      <div>
                        <p>
                          <b>User:</b> {order.user?.firstName} {order.user?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{order.user?.email}</p>
                      </div>

                      <span className={`px-2 py-1 rounded text-white items-center ${
                        order.status === "Paid"
                          ? "bg-green-500"
                          : order.status === "Failed"
                          ? "bg-red-500"
                          : "bg-orange-400"
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Products */}
                    <div>
                      <h3 className="font-medium mb-2">Products:</h3>

                      <div className="space-y-2" >
                        {order.products?.map((item, i) => (
                          <div  onClick={()=>navigate(`/products/${item.productId._id}`)} key={i} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">

                            <img
                              src={item.productId?.productImg?.[0]?.url}
                              className="w-14 h-14 object-cover"
                              alt=""
                            />

                            <div className="flex-1">
                              <p className="line-clamp-1">{item.productId?.productName}</p>
                              <p className="text-sm text-gray-500">{item.productId?._id}</p>
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
        )}

      </div>
    </div>
  );
};

export default Tabs;