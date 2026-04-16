import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from "@mui/material";
import axios from 'axios';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { CiTrash } from "react-icons/ci";
import userLogo from "../../assets/userLogo.png";
import LoaderScreen from '../../components/LoaderScreen';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const navigate = useNavigate();

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // ✅ GET USERS
  const getAllUsers = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/all-users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        setUsers(res.data.users);
        setFilteredList(res.data.users); // ✅ important

        setToast({
          open: true,
          message: "Users fetched successfully ✅",
          severity: "success"
        });
      }

    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Users not found ❌",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // ✅ SEARCH FILTER
  useEffect(() => {
    let filtered = [...users];

    if (search.trim() !== "") {
      filtered = filtered.filter((u) =>
        u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredList(filtered);
  }, [search, users]);

  // ✅ LOADER SCREEN
  if (loading) return <LoaderScreen />;

  return (
    <div className='pl-[350px] py-24 px-4 mx-auto pr-20'>

      <h1 className="font-bold text-2xl">User Management</h1>
      <p className="text-gray-900">View and Manage Registered Users</p>

      {/* SEARCH */}
      <div className="flex relative w-[300px] mt-6">
        <div className="relative bg-white rounded-lg p-2">
          <input
            type="text"
            placeholder="Search Users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-[400px] outline-none'
          />
          <FaMagnifyingGlass className="absolute right-2 top-3" />
        </div>
      </div>

      {/* USERS LIST */}
      <div className="grid grid-cols-3 gap-7 mt-7">
        {(filteredList.length ? filteredList : users).map((user) => (
          <div className='bg-pink-100 p-5 rounded-lg' key={user._id}>

            <div className='flex flex-col gap-4'>

              {/* USER INFO */}
              <div className="flex gap-4">
                <img
                  src={user?.profilePic || userLogo}
                  alt="user"
                  className='rounded-full w-16 h-16'
                />

                <div>
                  <h3 className='text-xl'>
                    {user.firstName} {user.lastName}
                  </h3>
                  <h3 className='text-md text-gray-600'>
                    {user.email}
                  </h3>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3">

                <button
                  onClick={() => navigate(`/dashboard/users/${user._id}`)}
                  className='bg-white rounded-xl font-semibold flex gap-2 px-2 py-1'
                >
                  <MdEdit className="text-green-500 w-6 h-6" />
                  Edit
                </button>

                <button
                  onClick={() => navigate(`/dashboard/users/orders/${user._id}`)}
                  className='bg-black text-white rounded-xl flex gap-2 px-2 py-1'
                >
                  <IoEyeSharp className="text-red-500 w-6 h-6" />
                  Orders
                </button>

                {/* Optional delete */}
                {/* 
                <button
                  onClick={() => handlePreDeletion(user)}
                  className='bg-black text-white rounded-xl flex gap-2 px-2 py-1'
                >
                  <CiTrash className="text-red-500 w-6 h-6" />
                  Delete
                </button>
                */}

              </div>

            </div>
          </div>
        ))}
      </div>

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

export default AdminUsers;