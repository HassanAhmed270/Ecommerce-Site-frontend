import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import { addAddress, deleteAddress, setCart, setSelectedAddress } from '../redux/productSlice';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from "@mui/material";
import { useCartContext } from '../CartContext';

const AddressForm = () => {

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: ""
    });

    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const [paymentMethod, setPaymentMethod] = useState("ONLINE");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart } = useCartContext();
    const length = cart?.items?.length || 0;
   
    const { addresses = [], selectedAddress = null } =
        useSelector(store => store.products || {});

    
    const [showForm, setShowForm] = useState((addresses?.length || 0) === 0);

    const subTotal = cart?.totalPrice || 0;
    const shipping = subTotal > 50 ? 0 : 10;
    const tax = Number((subTotal * 0.05).toFixed(2)) || 0;
    const total = subTotal + shipping + tax;
    useEffect(() => {
    if (length === 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setToast({
            open: true,
            message: "Cart is Empty",
            severity: "error"
        });

            navigate(-1);
    }
}, [length, navigate]);
    // INPUT CHANGE
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // SAVE ADDRESS
    const handleSave = () => {
        dispatch(addAddress(formData));
        setShowForm(false);
    };
    const emptyCart = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/cart/clear`,
                {}, // 👈 empty body
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (res.data.success) {
                dispatch(setCart(res.data.cart));
                setToast({
                    open: true,
                    message: "Emptied the Cart",
                    severity: "success"
                });
            }

        } catch (error) {
            console.log(error);
            setToast({
                open: true,
                message: "Cannot Empty Cart",
                severity: "error"
            });
        }
    }
    // PLACE ORDER (COD + ONLINE FLOW HANDLED HERE)
    const placeOrder = async () => {
        try {
            const token = localStorage.getItem("accessToken");

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/orders/create`,
                {
                    products: cart.items,
                    amount: total,
                    tax,
                    shipping,
                    currency: "PKR"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const paymentOrderId = res.data.dbOrder.paymentOrderId;

            localStorage.setItem("paymentOrderId", paymentOrderId);
            localStorage.setItem("orderAmount", total);

            setToast({
                open: true,
                message: "Order Created Successfully",
                severity: "success"
            });

            // 🔥 FLOW CONTROL
            if (paymentMethod === "ONLINE") {
                navigate("/payment");   // JazzCash flow page
            } else {
                setToast({
                    open: true,
                    message: "COD Order Confirmed (OOD Payment, Pending)",
                    severity: "success"
                });
                setTimeout(async () => {
                    await emptyCart();   // ✅ WAIT karo
                    navigate("/products");
                }, 2000);

            }

        } catch (error) {
            console.log(error);
            setToast({
                open: true,
                message: "Order creation failed",
                severity: "error"
            });
        }
    };

    return (
        <div className={`max-w-7xl mx-auto grid place-items-center p-10`}>
            <div className="grid grid-cols-2 gap-20 mt-10 w-full">

                {/* LEFT SIDE */}
                <div className="space-y-4 p-6 bg-white">

                    {/* ADDRESS FORM */}
                    {showForm ? (
                        <>
                            {["fullName", "phone", "email", "address", "city", "state", "zip", "country"].map((field) => (
                                <input
                                    key={field}
                                    name={field}
                                    placeholder={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    className='w-full bg-gray-200 p-2 rounded-lg mb-2'
                                />
                            ))}

                            <button
                                onClick={handleSave}
                                className='w-full bg-pink-600 text-white py-2 rounded-lg'
                            >
                                Save Address
                            </button>
                        </>
                    ) : (
                        <>
                            {addresses.map((addr, index) => (
                                <div
                                    key={index}
                                    onClick={() => dispatch(setSelectedAddress(index))}
                                    className={`p-4 border rounded-lg cursor-pointer mb-2 transition
                                    ${selectedAddress === index
                                            ? "border-yellow-400 bg-gray-100"
                                            : "border-gray-300"
                                        }`}
                                >
                                    <p>{addr.fullName}</p>
                                    <p>{addr.phone}</p>
                                    <p>{addr.email}</p>
                                    <p>{addr.address}</p>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(deleteAddress(index));
                                        }}
                                        className='text-red-500 text-sm'
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </>
                    )}

                    <button
                        onClick={() => setShowForm(true)}
                        className='w-full border border-pink-600 py-2 rounded-lg'
                    >
                        Add New Address
                    </button>

                    {/* PAYMENT OPTIONS GROUP */}
                    <div className="w-full flex gap-4 mt-4">

                        {/* COD */}
                        <div
                            onClick={() => setPaymentMethod("COD")}
                            className={`w-full p-3 rounded-lg cursor-pointer border transition
                            ${paymentMethod === "COD"
                                    ? "border-yellow-400 bg-gray-100"
                                    : "border-gray-300 bg-white"
                                }`}
                        >
                            <h3 className="font-semibold">Cash on Delivery</h3>
                            <p className="text-sm text-gray-500">Pay on delivery</p>
                        </div>

                        {/* ONLINE */}
                        <div
                            onClick={() => setPaymentMethod("ONLINE")}
                            className={`w-full p-3 rounded-lg cursor-pointer border transition
                            ${paymentMethod === "ONLINE"
                                    ? "border-yellow-400 bg-gray-100"
                                    : "border-gray-300 bg-white"
                                }`}
                        >
                            <h3 className="font-semibold">Online Payment</h3>
                            <p className="text-sm text-gray-500">Pay via JazzCash</p>
                        </div>

                    </div>

                    {/* CONFIRM BUTTON */}
                    <button
                        disabled={selectedAddress === null}
                        onClick={placeOrder}
                        className='w-full bg-pink-600 text-white py-2 rounded-lg mt-3'
                    >
                        Confirm Order
                    </button>

                </div>

                {/* RIGHT SIDE */}
                <div className='w-[400px]'>
                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                    <p>Total Items: {length}</p>
                    <p>Subtotal: PKR {subTotal}</p>
                    <p>Shipping: PKR {shipping}</p>
                    <p>Tax: PKR {tax}</p>

                    <hr className="my-2" />

                    <p className="font-bold">Total: PKR {total}</p>
                </div>

            </div>

            {/* TOAST */}
            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity={toast.severity} variant="filled">
                    {toast.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AddressForm;