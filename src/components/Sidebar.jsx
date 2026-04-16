import React from 'react'
import { NavLink } from 'react-router-dom'
import { LuLayoutDashboard ,LuPackagePlus,LuPackageSearch } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
import { TbBorderStyle } from "react-icons/tb";
const Sidebar = () => {
  return (
    <div className='hidden fixed md:block border-r p-10 space-y-2 bg-pink-50 border-pink-200 h-screen w-[30vh]'>
      <div className='flex flex-col'>
          {/* Logo */}
        <div>
          <img className='w-[100px]' src="/logo.png" alt="logo" />
        </div>


      <div className='text-center pt-10 px-3 space-y-1'>

        <NavLink
          to="/dashboard/sales"
          className={({ isActive }) =>
            `text-xl flex items-center gap-2 cursor-pointer px-2 py-3 rounded-xl 
            ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"}`
          }
        >
          <LuLayoutDashboard /><span>Dashboard</span>
        </NavLink>
         <NavLink
          to="/dashboard/add-products"
          className={({ isActive }) =>
            `text-xl flex items-center gap-2 cursor-pointer px-2 py-3 rounded-xl 
            ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"}`
          }
        >
          <LuPackagePlus/><span>Add Product</span>
        </NavLink>
         <NavLink
          to="/dashboard/products"
          className={({ isActive }) =>
            `text-xl flex items-center gap-2 cursor-pointer px-2 py-3 rounded-xl 
            ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"}`
          }
        >
          <LuPackageSearch/><span>Products</span>
        </NavLink>
         <NavLink
          to="/dashboard/users"
          className={({ isActive }) =>
            `text-xl flex items-center gap-2 cursor-pointer px-2 py-3 rounded-xl 
            ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"}`
          }
        >
          <FaUsers /><span>Users</span>
        </NavLink>
        <NavLink
          to="/dashboard/orders"
          className={({ isActive }) =>
            `text-xl flex items-center gap-2 cursor-pointer px-2 py-3 rounded-xl 
            ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"}`
          }
        >
          <TbBorderStyle /><span>Orders</span>
        </NavLink>



      </div>
      </div>
    </div>
  )
}

export default Sidebar