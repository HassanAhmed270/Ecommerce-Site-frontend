import React,{useState} from 'react'
import { Link} from 'react-router-dom'
import { CiShoppingCart } from "react-icons/ci";
import { Button } from '@mui/material';
import { LuLoaderCircle } from "react-icons/lu";
import axios from 'axios';
import { setUser } from "../redux/userSlice"; // adjust path if needed
import { useDispatch,useSelector } from "react-redux"
import { toast } from 'react-toastify';
import { useCartContext } from "../CartContext";
const Navbar = () => {

  const user = useSelector(store => store.user.user)
  const admin=user?.role ==="admin"? true :false
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem('accessToken');
  const { cart } = useCartContext();
  const handleLogout = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/logout`,
        {},
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(null));
        localStorage.removeItem('accessToken'); // important

        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    } 
  };

  return (
    <header className='bg-pink-50 fixed w-full border border-pink-200'>
      <div className='max-w-7xl mx-auto flex justify-between items-center py-3 px-4'>

        {/* Logo */}
        <div>
          <img className='w-[100px]' src="/logo.png" alt="logo" />
        </div>

        {/* Nav */}
        <nav className='flex gap-6 items-center'>

          <ul className="flex gap-7 text-lg font-semibold">
            <Link to="/"><li>Home</li></Link>
            <Link to="/products"><li>Products</li></Link>

            {user && (
              <li>
                <Link to={`/profile/${user?._id}`}>
                  Hello, {user?.firstName}
                </Link>
              </li>
            )}
            {admin && (
              <li>
                <Link to={`/dashboard`}>
                 Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* Cart */}
          <Link to="/cart" className='relative text-2xl'>
            <CiShoppingCart />
            <span className="bg-pink-500 text-white rounded-full absolute -top-3 -right-4 px-2 text-sm">
              {cart?.items?.length || 0}
              
            </span>
          </Link>
          {/* Auth Button */}
          {user ? (
            <Button
              onClick={handleLogout}
              variant="contained"
              sx={{
                py: 1,
                px: 2,
                backgroundColor: "#db2777",
                "&:hover": { backgroundColor: "#be185d" }
              }}
            >
              {loading ? (
                <LuLoaderCircle className="animate-spin mr-2" />
              ) : (
                "Logout"
              )}
            </Button>
          ) : (
            <Link to="/login">
              <Button
                variant="contained"
                sx={{
                  py: 1,
                  px: 2,
                  backgroundColor: "#db2777",
                  "&:hover": { backgroundColor: "#be185d" }
                }}
              >
                Login
              </Button>
            </Link>
          )}

        </nav>
      </div>
    </header>
  )
}

export default Navbar;