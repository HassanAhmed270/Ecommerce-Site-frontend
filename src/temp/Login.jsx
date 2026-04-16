import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";
import { useDispatch } from "react-redux"
import { setUser } from "../redux/userSlice"; // adjust path if needed
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


const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const dispatch = useDispatch();

  // 🔥 Toast state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "Login success" // success | error
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
        `${import.meta.env.VITE_API_URL}/user/login"`,
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
          message: "Login Successful ✅",
          severity: "success"
        });
        if (res.data.success) {
          console.log("USER FROM API:", res.data); // debug

          dispatch(setUser(res.data.user)); // or correct path
          
          localStorage.setItem("accessToken",res.data.accessToken);
          localStorage.setItem("user", JSON.stringify(res.data.user));

          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      }

    } catch (error) {
      setToast({
        open: true,
        message: `Invalid Credentials `,
        severity: "error",
        error
      });
    } finally {
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
              Log In
            </Typography>

            <Typography variant="body2" textAlign="center" gutterBottom>
              Log in to your account to continue
            </Typography>

            <form onSubmit={handleSubmit}>

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

              <Typography variant="body2" textAlign="center">
                <Link to="/login" style={{ textDecoration: "none" }}>
                  Forgot Password?
                </Link>
              </Typography>

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

              >{loading ? <><LuLoaderCircle className="h-4 w-4 animate-spin mr-2" /></> : 'Log in'}
              </Button>
              <Typography
                variant="body2"
                textAlign="center"
                sx={{ mt: 2 }}
              >
                Dont have an account?{" "}
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  Signup
                </Link>
              </Typography>
            </form>

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


export default Login
