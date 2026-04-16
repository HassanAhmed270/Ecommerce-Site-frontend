import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-[420px] bg-white rounded-2xl shadow-lg p-8 text-center">

                {/* BIG ICON */}
                <div className="flex justify-center mb-6">
                    <FaCheckCircle className="text-green-500 text-7xl animate-pulse" />
                </div>

                {/* TITLE */}
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Order Created Successfully
                </h1>

                <p className="text-gray-500 mb-6">
                    Your order has been placed. Please verify your payment to continue.
                </p>

                {/* BUTTONS */}
                <div className="space-y-3">

                    <button
                        onClick={() => navigate('/products')}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                        Continue Shopping
                    </button>

                    <button
                        onClick={() => navigate('/payment')}
                        className="w-full border border-pink-600 text-pink-600 hover:bg-pink-50 font-semibold py-2 rounded-lg transition"
                    >
                        Proceed for Payment
                    </button>

                </div>

            </div>
        </div>
    );
};

export default OrderSuccess;