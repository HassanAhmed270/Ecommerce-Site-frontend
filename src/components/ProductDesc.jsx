import React, { useState } from 'react'
import { CiShoppingCart } from "react-icons/ci";
import { Snackbar, Alert } from "@mui/material";
import axios from 'axios';
import { setCart } from '../redux/productSlice';
import { useDispatch } from 'react-redux';

const ProductDesc = ({ product }) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
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
                `${import.meta.env.VITE_API_URL}/cartadd/`,
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
    return <>
        <div className='flex flex-col gap-4 '>
            <h1 className='font-bold text-4xl text-gray-900'>{product.prodcutName}</h1>
            <p className='text-gray-700'>{product.category}|{product.brand}</p>
            <h2 className='text-pink-600 font-bold text-2xl'>{product.productPrice}</h2>
            <p className='line-clamp-12 text-muted-foreground'>{product.productDescription}</p>
            <div className="flex gap-2 items-center w-[200px]">
                <p className='text-gray-700'>Quantity</p>
                <input type="number" className="w-14 " defaultValue={1} />
            </div>
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
    </>
}

export default ProductDesc
