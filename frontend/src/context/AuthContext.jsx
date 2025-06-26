import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({
  currentUser: null,
  isAuthenticated: false,
  loading: true,
  login: () => Promise.resolve(),
  logout: () => {},
  register: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    currentUser: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    loading: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      verifyToken();
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.token]);

  const verifyToken = useCallback(async () => {
    try {
      const res = await axios.get('https://hotel-databae-managment.onrender.com');
      setState(prev => ({
        ...prev,
        currentUser: res.data.user,
        isAuthenticated: true,
        loading: false,
      }));
    } catch (err) {
      logout();
    }
  }, []);

  const register = async (formData) => {
    try {
      const res = await axios.post('https://hotel-databae-managment.onrender.com', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return res.data;
    } catch (err) {
      const error = err.response?.data?.error || 
                   err.response?.data?.message || 
                   'Registration failed';
      throw new Error(error);
    }
  };

  const login = async (formData) => {
    try {
      const res = await axios.post('https://hotel-databae-managment.onrender.com', formData);
      localStorage.setItem('token', res.data.token);
      setState(prev => ({
        ...prev,
        token: res.data.token,
        currentUser: res.data.user,
        isAuthenticated: true,
      }));
      return res.data.user;
    } catch (err) {
      const error = err.response?.data?.error || 
                   err.response?.data?.message || 
                   'Login failed';
      throw new Error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setState({
      currentUser: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: state.currentUser,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        register,
        login,
        logout,
      }}
    >
      {!state.loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
