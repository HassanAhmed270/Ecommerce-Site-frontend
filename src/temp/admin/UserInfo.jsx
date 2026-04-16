import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const UserInfo = () => {

  const { userId } = useParams();
  const navigate = useNavigate();

  const [updateUser, setUpdateUser] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tempRole, setTempRole] = useState("");

  // 🔹 GET USER DETAILS
  const getUserDetails = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/get-user/${userId}`
      );

      if (res.data.success) {
        setUpdateUser(res.data.user);
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserDetails();
    }
  }, [userId]);

  // 🔹 HANDLE INPUT
  const handleChange = (e) => {
    setUpdateUser({
      ...updateUser,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 HANDLE IMAGE
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile)
    });
  };

  // 🔹 ROLE CHANGE WITH CONFIRM
  const handleRoleChange = (role) => {
    if (role !== updateUser.role) {
      setTempRole(role);
      setShowConfirm(true);
    }
  };

  const confirmRoleChange = () => {
    setUpdateUser({
      ...updateUser,
      role: tempRole
    });
    setShowConfirm(false);
  };

  const cancelRoleChange = () => {
    setShowConfirm(false);
  };

  // 🔹 SUBMIT (ADMIN SAFE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const accessToken = localStorage.getItem("accessToken");

    try {
      const formData = new FormData();

      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("address", updateUser.address);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("role", updateUser.role);

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (res.data.success) {
        alert("User Updated Successfully ✅");

        // 🚫 NO dispatch here (important)
        // 🚫 NO token update

        setTimeout(() => {
          navigate(-1); // back to users page
        }, 1000);
      }

    } catch (error) {
      alert("Update Failed ❌");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='pt-20 bg-gray-100 min-h-screen max-w-7xl px-20 pl-40'>

      <div className="flex w-[600px] bg-white my-20 flex-col justify-center items-center mx-auto p-6 rounded-lg">

        {/* HEADER */}
        <div className='flex justify-between gap-10 h-14 items-center w-full'>
          <button onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          <h1 className='font-bold text-2xl'>Update User</h1>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 w-full mt-6">

          {/* LEFT SIDE */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={updateUser?.profilePic}
              alt=""
              className="w-32 h-32 rounded-full object-cover border-4 border-pink-800"
            />

            <label className="cursor-pointer bg-pink-600 px-5 py-2 rounded-lg text-white">
              {loading ? (
                <span className="flex items-center gap-2">
                  <LuLoaderCircle className="animate-spin" />
                  Uploading...
                </span>
              ) : "Upload Image"}
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-4">

            <input
              type="text"
              name="firstName"
              value={updateUser.firstName || ""}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full p-2 border rounded-lg"
            />

            <input
              type="text"
              name="lastName"
              value={updateUser.lastName || ""}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full p-2 border rounded-lg"
            />

            <input
              type="email"
              name="email"
              value={updateUser.email || ""}
              disabled
              className="w-full p-2 border rounded-lg bg-gray-200"
            />

            <input
              type="text"
              name="phoneNo"
              value={updateUser.phoneNo || ""}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-2 border rounded-lg"
            />

            <input
              type="text"
              name="address"
              value={updateUser.address || ""}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-2 border rounded-lg"
            />

            <input
              type="text"
              name="city"
              value={updateUser.city || ""}
              onChange={handleChange}
              placeholder="City"
              className="w-full p-2 border rounded-lg"
            />

            <input
              type="text"
              name="zipCode"
              value={updateUser.zipCode || ""}
              onChange={handleChange}
              placeholder="Zip Code"
              className="w-full p-2 border rounded-lg"
            />

            {/* ROLE */}
            <div>
              <p className="font-semibold mb-1">Role</p>

              <label className="mr-4">
                <input
                  type="radio"
                  checked={updateUser.role === "user"}
                  onChange={() => handleRoleChange("user")}
                /> User
              </label>

              <label>
                <input
                  type="radio"
                  checked={updateUser.role === "admin"}
                  onChange={() => handleRoleChange("admin")}
                /> Admin
              </label>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white ${
                loading ? "bg-pink-400" : "bg-pink-600 hover:bg-pink-700"
              }`}
            >
              {loading ? "Updating..." : "Update User"}
            </button>

          </div>

        </form>

        {/* CONFIRM MODAL */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg text-center">

              <h2 className="font-bold text-lg mb-2">Confirm Role Change</h2>

              <p>
                Change role to <b>{tempRole}</b>?
              </p>

              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={confirmRoleChange}
                  className="bg-green-500 text-white px-4 py-1 rounded"
                >
                  Yes
                </button>

                <button
                  onClick={cancelRoleChange}
                  className="bg-gray-400 text-white px-4 py-1 rounded"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserInfo;