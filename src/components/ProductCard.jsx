import React, { useState } from 'react'
import { CiShoppingCart } from "react-icons/ci";
import { Snackbar, Alert } from "@mui/material";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setCart } from '../redux/productSlice';
import { useDispatch } from 'react-redux';

const ProductCard = ({ product }) => {
    const { productName, productImg, productPrice } = product;
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const [loading, setLoading] = useState(false);

    const [toastState, setToastState] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const accessToken = localStorage.getItem('accessToken');

    const addToCart = async (productId) => {
        try {
            setLoading(true);

            const res = await axios.post(
                `http://localhost:3000/api/v1/cart/add/`,
                { productId },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            if (res.data.success) {
                setToastState({
                    open: true,
                    message: "Product added to cart",
                    severity: "success"
                });

                dispatch(setCart(res.data.cart));
            }

        } catch (error) {
            console.log(error);

            setToastState({
                open: true,
                message: error.response?.data?.message || "Something went wrong",
                severity: "error"
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='shadow-lg rounded-lg overflow-hidden h-max border border-gray-300'>
            
            <div className='w-full h-full aspect-square overflow-hidden'
              onClick={()=>navigate(`/products/${product._id}`)}>
                <img
                    src={productImg[0].url}
                    alt=""
                    className='w-full transition-transform duration-300 hover:scale-105'
                />
            </div>

            <div className="px-2 space-y-1">
                <h1 className='font-semibold h-12 line-clamp-2'>{productName}</h1>
                <h2 className='font-semibold'>PKR {productPrice}</h2>

                <button
                    disabled={loading}
                    onClick={() => addToCart(product._id)}
                    className='bg-pink-600 hover:bg-pink-700 transition mb-3 w-full px-3 py-2 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50'
                >
                    <CiShoppingCart className='w-6 h-6' />
                    <span>{loading ? "Adding..." : "Add to Cart"}</span>
                </button>
            </div>

            {/* ✅ Snackbar */}
            <Snackbar
                open={toastState.open}
                autoHideDuration={3000}
                onClose={() => setToastState({ ...toastState, open: false })}
            >
                <Alert
                    severity={toastState.severity}
                    onClose={() => setToastState({ ...toastState, open: false })}
                >
                    {toastState.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ProductCard;