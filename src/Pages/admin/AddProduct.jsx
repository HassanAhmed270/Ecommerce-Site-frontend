import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { LuLoaderCircle } from "react-icons/lu";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import ImageUpload from '../../components/ImageUpload';

import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert
} from "@mui/material";

import { setProducts } from '../../redux/productSlice';

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    brand: "",
    productDescription: "",
    category: "",
    productImg: [] // ✅ IMPORTANT
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // ✅ handle text fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 validation
    if (!formData.productImg || formData.productImg.length === 0) {
      setToast({
        open: true,
        message: "At least one image is required ❌",
        severity: "error"
      });
      return;
    }

    setLoading(true);

    const accessToken = localStorage.getItem("accessToken");

    try {
      const data = new FormData();

      data.append("productName", formData.productName);
      data.append("productPrice", formData.productPrice);
      data.append("brand", formData.brand);
      data.append("productDescription", formData.productDescription);
      data.append("category", formData.category);

      // ✅ use images from formData
      formData.productImg.forEach((img) => {
        data.append("file", img);
      });

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/product/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        dispatch(setProducts([...(products || []), res.data.product]));

        setToast({
          open: true,
          message: "Product Added ✅",
          severity: "success"
        });

        setTimeout(() => {
          navigate("/products");
        }, 1500);
      }

    } catch (error) {
      console.log(error);

      setToast({
        open: true,
        message: error.response?.data?.message || "Error occurred",
        severity: "error"
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ background: "#f5f5f5" }}
      >
        <Card sx={{ width: 500, padding: 3, boxShadow: 5 }}>
          <CardContent>

            <Typography variant="h5" textAlign="center">
              Add Product
            </Typography>

            <form onSubmit={handleSubmit}>

              <TextField
                label="Product Name"
                name="productName"
                fullWidth
                margin="normal"
                value={formData.productName}
                onChange={handleChange}
                required
              />

              <TextField
                label="Price"
                name="productPrice"
                type="number"
                fullWidth
                margin="normal"
                value={formData.productPrice}
                onChange={handleChange}
                required
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <TextField
                  label="Brand"
                  name="brand"
                  fullWidth
                  margin="normal"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />

                <TextField
                  label="Category"
                  name="category"
                  fullWidth
                  margin="normal"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <textarea
                name="productDescription"
                placeholder="Description"
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "10px"
                }}
                rows={3}
                value={formData.productDescription}
                onChange={handleChange}
              />

              {/* ✅ Image Upload */}
              <ImageUpload
                formData={formData}
                setFormData={setFormData}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.2,
                  backgroundColor: "#c00b93",
                  "&:hover": { backgroundColor: "#940871" }
                }}
              >
                {loading ? (
                  <LuLoaderCircle className="animate-spin" />
                ) : (
                  "Add Product"
                )}
              </Button>

            </form>

          </CardContent>
        </Card>
      </Box>

      {/* Toast */}
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
    </>
  );
};

export default AddProduct;