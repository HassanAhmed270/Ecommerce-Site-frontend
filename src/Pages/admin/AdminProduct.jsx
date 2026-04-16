import React, { useEffect, useState } from 'react';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useSelector, useDispatch } from 'react-redux';
import { MdEdit } from "react-icons/md";
import { CiTrash } from "react-icons/ci";
import axios from "axios";
import { setProducts } from '../../redux/productSlice';
import { LuLoaderCircle } from "react-icons/lu";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert
} from "@mui/material";

import ImageUpload from '../../components/ImageUpload';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const AdminProduct = () => {
  const dispatch = useDispatch();
  const products = useSelector((store) => store.products.products);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const [displayOrder, setDisplayOrder] = useState("lowToHigh");
  const [priceRange] = useState([0, 999999]);

  const [filteredList, setFilteredList] = useState([]);

  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    brand: "",
    category: "",
    productDescription: "",
    productImg: []
  });

  // ================= FILTER LOGIC =================
  useEffect(() => {
    if (!products || products.length === 0) return;

    let filtered = [...products];

    // SEARCH
    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // PRICE FILTER
    filtered = filtered.filter(
      (p) =>
        p.productPrice >= priceRange[0] &&
        p.productPrice <= priceRange[1]
    );

    // SORT
    if (displayOrder === "lowToHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice);
    } else if (displayOrder === "highToLow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice);
    }

    setFilteredList(filtered);
  }, [search, displayOrder, priceRange, products]);

  // ================= HANDLERS =================

  const handleSortChange = (e) => {
    setFilter(e.target.value);
    setDisplayOrder(e.target.value);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      productName: product.productName,
      productPrice: product.productPrice,
      brand: product.brand,
      category: product.category,
      productDescription: product.productDescription,
      productImg: product.productImg
    });
    setOpen(true);
  };

  const handlePreDeletion = (product) => {
    setSelectedProduct(product);
    setConfirmOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    setLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/product/update/${selectedProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        const updated = products.map((p) =>
          p._id === selectedProduct._id ? res.data.product : p
        );

        dispatch(setProducts(updated));
        setOpen(false);

        setToast({
          open: true,
          message: "Product updated successfully ✅",
          severity: "success"
        });
      }

    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Update failed ❌",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    setLoading(true);

    try {
      if (!selectedProduct) return;

      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}//product/delete/${selectedProduct._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        const updated = products.filter(
          (p) => p._id !== selectedProduct._id
        );

        dispatch(setProducts(updated));

        setToast({
          open: true,
          message: "Product deleted successfully 🗑️",
          severity: "success"
        });

        setConfirmOpen(false);
        setSelectedProduct(null);
      }

    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Deletion failed ❌",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className='pl-[350px] py-20 pr-20 flex flex-col min-h-screen gap-3 bg-gray-100'>

      {/* SEARCH + SORT */}
      <div className="flex justify-between mt-6 items-center">

        <div className="relative bg-white rounded-lg p-2">
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-[400px] outline-none'
          />
          <FaMagnifyingGlass className="absolute right-2 top-3" />
        </div>

        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <Select
              value={filter}
              onChange={handleSortChange}
              displayEmpty
            >
              <MenuItem value="">Sort By Price</MenuItem>
              <MenuItem value="lowToHigh">Low → High</MenuItem>
              <MenuItem value="highToLow">High → Low</MenuItem>
            </Select>
          </FormControl>
        </Box>

      </div>

      {/* PRODUCTS */}
      {filteredList.map((product, index) => (
        <div key={index} className='px-4 bg-gray-50 py-3 rounded'>
          <div className="flex items-center justify-between">

            <div className="flex gap-2 items-center">
              <img
                src={product.productImg?.[0]?.url}
                className='w-20 h-20 object-cover'
              />
              <h1 className='font-bold text-gray-700'>
                {product.productName || "No Name"}
              </h1>
            </div>

            <h1 className='font-semibold'>
              PKR {product.productPrice}
            </h1>

            <div className="flex gap-3">
              <MdEdit
                className="text-green-500 cursor-pointer"
                onClick={() => handleEdit(product)}
              />
              <CiTrash
                className="text-red-500 cursor-pointer"
                onClick={() => handlePreDeletion(product)}
              />
            </div>

          </div>
        </div>
      ))}

      {/* EDIT DIALOG */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Edit Product</DialogTitle>

        <DialogContent className="flex flex-col gap-3 mt-2">

          <TextField
            label="Product Name"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Price"
            name="productPrice"
            value={formData.productPrice}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Description"
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />

          <ImageUpload formData={formData} setFormData={setFormData} />

        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>

          <Button variant="contained" onClick={handleUpdate}>
            {loading ? <LuLoaderCircle className="animate-spin" /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRM */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Are you sure?</DialogTitle>

        <DialogContent>
          This action cannot be undone.
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>No</Button>

          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
          >
            {loading ? <LuLoaderCircle className="animate-spin" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

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

export default AdminProduct;