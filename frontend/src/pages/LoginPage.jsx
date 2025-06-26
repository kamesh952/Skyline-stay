import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
  Slide,
  Zoom,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Hotel as HotelIcon,
} from "@mui/icons-material";
import { cardStyle, formStyle } from "../styles";

// Floating animation keyframes
const floatingAnimation = {
  '@keyframes floating': {
    '0%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-20px)' },
    '100%': { transform: 'translateY(0px)' },
  },
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
    '100%': { transform: 'scale(1)' },
  },
  '@keyframes slideIn': {
    '0%': { transform: 'translateX(-100%)', opacity: 0 },
    '100%': { transform: 'translateX(0)', opacity: 1 },
  },
  '@keyframes fadeInUp': {
    '0%': { transform: 'translateY(30px)', opacity: 0 },
    '100%': { transform: 'translateY(0)', opacity: 1 },
  },
};

// Animated background shapes
const BackgroundShapes = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: 0,
    }}
  >
    {/* Floating circles */}
    {[...Array(6)].map((_, i) => (
      <Box
        key={i}
        sx={{
          position: 'absolute',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: `floating ${3 + i * 0.5}s ease-in-out infinite`,
          animationDelay: `${i * 0.5}s`,
          width: `${60 + i * 20}px`,
          height: `${60 + i * 20}px`,
          top: `${Math.random() * 80}%`,
          left: `${Math.random() * 80}%`,
        }}
      />
    ))}
    
    {/* Geometric shapes */}
    <Box
      sx={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '80px',
        height: '80px',
        background: 'rgba(255, 255, 255, 0.05)',
        transform: 'rotate(45deg)',
        animation: 'pulse 4s ease-in-out infinite',
      }}
    />
    
    <Box
      sx={{
        position: 'absolute',
        bottom: '20%',
        left: '15%',
        width: '0',
        height: '0',
        borderLeft: '40px solid transparent',
        borderRight: '40px solid transparent',
        borderBottom: '70px solid rgba(255, 255, 255, 0.05)',
        animation: 'floating 6s ease-in-out infinite',
        animationDelay: '2s',
      }}
    />
  </Box>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  // Trigger mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      // The useEffect will handle the redirect when currentUser updates
    } catch (err) {
      let errorMessage = "Login failed";
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        }
      }
      
      setError(errorMessage);
      
      // Clear password field on authentication errors
      if (errorMessage.toLowerCase().includes("password")) {
        setPassword("");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)",
        position: 'relative',
        ...floatingAnimation,
      }}
    >
      <BackgroundShapes />
      
      <Zoom in={mounted} timeout={800}>
        <Paper 
          sx={{
            ...cardStyle,
            position: 'relative',
            zIndex: 1,
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.95)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            },
          }} 
          elevation={12}
        >
          <Fade in={mounted} timeout={1000}>
            <Box>
              <Slide direction="down" in={mounted} timeout={600}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                  <HotelIcon sx={{ fontSize: 40, color: '#4361ee', mr: 2 }} />
                  <Typography 
                    variant="h4" 
                    align="center" 
                    sx={{ 
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #4361ee, #3f37c9)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Hotel Management
                  </Typography>
                </Box>
              </Slide>

              <Slide direction="up" in={mounted} timeout={800}>
                <Typography 
                  variant="h6" 
                  align="center" 
                  sx={{ 
                    mb: 3,
                    color: '#666',
                    fontWeight: 300,
                  }}
                >
                  Welcome back! Please sign in to your account
                </Typography>
              </Slide>

              {error && (
                <Slide direction="left" in={!!error} timeout={400}>
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 2,
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        fontSize: '1.2rem',
                      },
                    }}
                  >
                    {error}
                  </Alert>
                </Slide>
              )}

              <Fade in={mounted} timeout={1200}>
                <Box component="form" onSubmit={handleSubmit} sx={formStyle}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    autoFocus={error.toLowerCase().includes("password")}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    margin="normal"
                    autoComplete="username"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#4361ee' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(67, 97, 238, 0.15)',
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(67, 97, 238, 0.25)',
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    margin="normal"
                    error={error.toLowerCase().includes("password")}
                    helperText={error.toLowerCase().includes("password") ? error : ""}
                    autoComplete="current-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#4361ee' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                            sx={{
                              color: '#4361ee',
                              '&:hover': {
                                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                              },
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(67, 97, 238, 0.15)',
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(67, 97, 238, 0.25)',
                        },
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{
                      mt: 3,
                      mb: 2,
                      borderRadius: 2,
                      py: 1.5,
                      background: 'linear-gradient(45deg, #4361ee, #3f37c9)',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #3f37c9, #4361ee)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(67, 97, 238, 0.3)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <Typography 
                    variant="body2" 
                    align="center" 
                    sx={{ 
                      color: '#666',
                      '& a': {
                        color: '#4361ee',
                        textDecoration: 'none',
                        fontWeight: 500,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          color: '#3f37c9',
                          textDecoration: 'underline',
                        },
                      },
                    }}
                  >
                    Don't have an account?{" "}
                    <Link href="/register" underline="hover">
                      Create one here
                    </Link>
                  </Typography>
                </Box>
              </Fade>
            </Box>
          </Fade>
        </Paper>
      </Zoom>
    </Box>
  );
}