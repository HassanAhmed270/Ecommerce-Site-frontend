import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Home from './Pages/Home';
import Login from './pages/Login';
import AddressForm from './Pages/AddressForm';
import Profile from './Pages/Profile';
import Verify from './pages/Verify';
import VerifyEmail from './pages/VerifyEmail';
import Products from './Pages/Products';
import Footer from './components/Footer';
import Dashboard from './Pages/Dashboard';
import './App.css';
import Cart from './Pages/Cart';
import AdminSales from './pages/admin/AdminSales';
import AddProduct from './Pages/admin/AddProduct';
import AdminProduct from './pages/admin/AdminProduct';
import AdminOrders from './Pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import UserInfo from './pages/admin/UserInfo';
import ShowUserOrders from './pages/admin/ShowUserOrders';
import ProtectedRoute from './components/ProtectedRoute';
import SingleProduct from './Pages/SingleProduct';
import OrderSuccess from './Pages/OrderSuccess';
import Payment from './Pages/Payment'
import { setCart } from "./redux/productSlice";
import { CartContext } from "./CartContext";
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch,useSelector } from 'react-redux';
function App() {
      const dispatch = useDispatch();
    const cart = useSelector(state => state.products.cart);

 useEffect(() => {
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }

    } catch (error) {
      console.log(error);
    }
  };

  fetchCart();
}, []);
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Navbar />
          <Home />
          <Footer />
        </>
      )
    },
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/verify',
      element: <Verify />
    },
    {
      path: '/verify/:token',
      element: <VerifyEmail />
    },
    {
      path: '/profile/:userId',
      element: (
        <ProtectedRoute>
          <>
            <Navbar />
            <Profile />
            <Footer />
          </>
        </ProtectedRoute>
      )
    },
    {
      path: '/products',

      element:<><Navbar/> <Products /></>
    },
    {
      path: '/products/:id',
      element:<><Navbar/> <SingleProduct /></>
    },
    {
      path: '/cart',
      element: <Cart />
    },
     {
      path: '/address',
      element: <AddressForm />
    },
    {
      path: '/order-success',
      element:(<OrderSuccess />)
    },
     {
      path: '/payment',
      element:(<Payment/>)
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute adminOnly={true}>
          <>
            <Navbar />
            <Dashboard />
          </>
        </ProtectedRoute>
      ),
      children: [
        { path: "sales", element: <AdminSales /> },
        { path: "add-products", element: <AddProduct /> },
        { path: "products", element: <AdminProduct /> },
        { path: "orders", element: <AdminOrders /> },
        { path: "users/orders/:userId", element: <ShowUserOrders /> },
        { path: "users", element: <AdminUsers /> },
        { path: "users/:userId", element: <UserInfo /> }
      ]
    }
  ]);

  return  <CartContext.Provider value={{ cart }}> <RouterProvider router={router}/> </CartContext.Provider>
}

export default App;