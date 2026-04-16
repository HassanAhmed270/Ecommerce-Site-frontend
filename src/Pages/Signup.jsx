import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";
import axios from "axios";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  // 🔥 Toast state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" // success | error
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (res.data.success) {
        setToast({
          open: true,
          message: "Signup Successful ✅",
          severity: "success"
        });

        setTimeout(() => {
          navigate("/verify");
        }, 1500);
      }

    } catch (error) {
      setToast({
        open: true,
        message: `User already exist ${error.message}`,
        severity: "error"
      });
    }finally{
      setLoading(false)
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
        <Card sx={{ width: 420, padding: 3, boxShadow: 5 }}>
          <CardContent>

            <Typography variant="h5" textAlign="center" gutterBottom>
              Signup
            </Typography>

            <Typography variant="body2" textAlign="center" gutterBottom>
              Create your account to continue
            </Typography>

            <form onSubmit={handleSubmit}>

              <TextField
                label="First Name"
                name="firstName"
                fullWidth
                margin="normal"
                value={formData.firstName}
                onChange={handleChange}
                required
              />

              <TextField
                label="Last Name"
                name="lastName"
                fullWidth
                margin="normal"
                value={formData.lastName}
                onChange={handleChange}
                required
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.2,
                  backgroundColor: "black",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#333"
                  }
                }}

              >{loading? <><LuLoaderCircle className="h-4 w-4 animate-spin mr-2"/></>:'Create Account'}
              </Button>
            </form>

            <Typography
              variant="body2"
              textAlign="center"
              sx={{ mt: 2 }}
            >
              Already have an account?{" "}
              <Link to="/login" style={{ textDecoration: "none" }}>
                Login
              </Link>
            </Typography>

          </CardContent>
        </Card>
      </Box>

      {/* 🔥 Toast Snackbar */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Signup;