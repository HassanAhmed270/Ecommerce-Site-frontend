import React, { useState } from 'react';
import {  useDispatch } from "react-redux";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CiShoppingCart } from "react-icons/ci";
import axios from 'axios';
import { setCart } from '../redux/productSlice';
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useCartContext } from "../CartContext";
const Cart = () => {

  const accessToken = localStorage.getItem("accessToken");
 const { cart } = useCartContext();

  const dispatch = useDispatch();

  const [toastState, setToastState] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const API = `${import.meta.env.VITE_API_URL}/cart`;
  const navigate=useNavigate()
  // ✅ LOAD CART


  // ✅ UPDATE QUANTITY (inc / dec matched with backend)
  const updateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(`${API}/update`, { productId, type }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        setToastState({
          open: true,
          message: "Quantity Updated",
          severity: "success"
        });
      }
    } catch (error) {
      console.log(error); // ✅ added
      setToastState({
        open: true,
        message: "Quantity cannot be updated",
        severity: "error"
      });
    }
  };

  // ✅ REMOVE PRODUCT
  const handleRemove = async (productId) => {
  try {
    console.log("REMOVE CLICKED:", productId); // debug

    const res = await axios.delete(`${API}/remove`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      data: { productId } // ✅ ONLY here
    });

    if (res.data.success) {
      dispatch(setCart(res.data.cart));
      setToastState({
        open: true,
        message: "Product removed from cart",
        severity: "success"
      });
    }
  } catch (error) {
    console.log(error);
    setToastState({
      open: true,
      message: "Cannot remove product",
      severity: "error"
    });
  }
};

  // ✅ CALCULATIONS
  const subTotal = cart?.totalPrice || 0;
  const shipping = subTotal > 50 ? 0 : 100;
  const tax = subTotal * 0.05;
  const total = subTotal + tax + shipping;

  return (
    <div className='bg-gray-50 min-h-screen'>

      <Navbar />

      {cart?.items?.length > 0 ? (

        <div className='max-w-7xl mx-auto pt-24 px-8 flex gap-8'>

          {/* LEFT SIDE */}
          <div className='flex flex-col gap-5 flex-1'>

            <h1 className='text-2xl text-gray-800 mb-4 font-bold'>
              Shopping Cart
            </h1>

            {cart.items.map((product, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white p-4 shadow-sm rounded-md"
              >

                {/* PRODUCT */}
                <div className="flex items-center gap-4 w-[350px]">
                  <img
                    src={
                      product?.productId?.productImg?.[0]?.url || '/logo.png'
                    }
                    className="w-20 h-20 object-cover"
                    alt=""
                  />

                  <div className="w-[250px]">
                    <h1 className='font-semibold truncate'>
                      {product?.productId?.productName}
                    </h1>

                    <p className='font-semibold'>
                      PKR {product?.productId?.productPrice}
                    </p>
                  </div>
                </div>

                {/* QUANTITY */}
                <div className="flex gap-3 items-center">
                  <button
                    className='bg-pink-600 px-3 py-1 text-white'
                    onClick={() =>
                      updateQuantity(product.productId._id, "decrease")
                    }
                  >
                    -
                  </button>

                  <span>{product.quantity}</span>

                  <button
                    className='bg-pink-600 px-3 py-1 text-white'
                    onClick={() =>
                      updateQuantity(product.productId._id, "increase")
                    }
                  >
                    +
                  </button>
                </div>

                {/* PRICE */}
                <p className='w-[120px] text-right'>
                  PKR {(product?.productId?.productPrice * product.quantity).toLocaleString()}
                </p>

                {/* REMOVE */}
                <p
                  onClick={() => handleRemove(product?.productId?._id)}
                  className='flex text-red-500 items-center gap-1 cursor-pointer'
                >
                  <RiDeleteBinLine />
                  Remove
                </p>

              </div>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className='w-[350px] bg-white p-5 shadow-md rounded-lg h-fit'>

            <h1 className='font-bold text-xl mb-4'>Order Summary</h1>

            <div className='space-y-4'>

              <div className="flex justify-between">
                <span>Subtotal ({cart?.items?.length} items)</span>
                <span>PKR {subTotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>TAX (5%)</span>
                <span>PKR {tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>PKR {shipping}</span>
              </div>

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>PKR {total.toFixed(2)}</span>
              </div>

            </div>

            {/* PROMO */}
            <div className='mt-6'>

              <div className='flex gap-2'>
                <input
                  type="text"
                  placeholder='PROMO CODE'
                  className='border p-2 w-full'
                />

                <button className='border border-pink-600 text-pink-600 px-4 py-2'>
                  Apply
                </button>
              </div>

              <button onClick={()=>navigate(`/address`)} className='bg-pink-600 text-white px-4 py-2 mt-4 w-full'>
                Place Order
              </button>

              <Link to="/products">
                <button className='border border-pink-600 text-pink-600 px-4 py-2 mt-2 w-full'>
                  Continue Shopping
                </button>
              </Link>

            </div>

            {/* INFO */}
            <div className="text-sm text-gray-500 pt-4">
              <p>* Free Shipping on Orders Over 50 PKR</p>
              <p>* 30 Days Return Policy</p>
              <p>* Secure Checkout</p>
            </div>

          </div>

        </div>

      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="bg-pink-100 p-6 rounded-full">

            <CiShoppingCart className='w-16 h-16 text-pink-600 mx-auto' />

            <h2 className='mt-6 text-2xl font-bold text-gray-800'>
              Your Cart is Empty
            </h2>

            <p className='mt-2 text-gray-600'>
              Looks like you haven't added anything yet!
            </p>

            <Link to="/products">
              <button className='mt-6 bg-pink-600 text-white px-4 py-2 hover:bg-pink-700 rounded-lg'>
                Continue Shopping
              </button>
            </Link>

          </div>
        </div>
      )}

      {/* TOAST */}
      <Snackbar
        open={toastState.open}
        autoHideDuration={3000}
        onClose={() => setToastState({ ...toastState, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={toastState.severity}
          onClose={() => setToastState({ ...toastState, open: false })}
          variant="filled"
        >
          {toastState.message}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default Cart;