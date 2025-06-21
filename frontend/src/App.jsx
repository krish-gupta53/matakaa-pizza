import React from 'react'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes, Navigate } from 'react-router-dom'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import MyOrders from './pages/MyOrders/MyOrders'
import Login from './pages/Login/Login'
import Admin from './pages/Admin/Admin'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify/Verify'
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Set up token in axios headers if it exists
const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['token'] = token;
}

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (requireAdmin && userRole !== 'admin') {
        return <Navigate to="/login" />;
    }

    if (!requireAdmin && userRole === 'admin') {
        return <Navigate to="/admin" />;
    }

    return children;
};

const App = () => {
    return (
        <>
            <ToastContainer/>
            <div className='app'>
                <Routes>
                    {/* Auth Route */}
                    <Route path='/' element={<Login />}/>
                    <Route path='/login' element={<Login />}/>
                    
                    {/* Admin Routes */}
                    <Route path='/admin/*' element={
                        <ProtectedRoute requireAdmin={true}>
                            <Admin />
                        </ProtectedRoute>
                    }/>

                    {/* Customer Routes */}
                    <Route path='/home' element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <Home />
                                <Footer />
                            </>
                        </ProtectedRoute>
                    }/>
                    <Route path='/cart' element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <Cart />
                                <Footer />
                            </>
                        </ProtectedRoute>
                    }/>
                    <Route path='/order' element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <PlaceOrder />
                                <Footer />
                            </>
                        </ProtectedRoute>
                    }/>
                    <Route path='/myorders' element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <MyOrders />
                                <Footer />
                            </>
                        </ProtectedRoute>
                    }/>
                    <Route path='/verify' element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <Verify />
                                <Footer />
                            </>
                        </ProtectedRoute>
                    }/>
                </Routes>
            </div>
        </>
    )
}

export default App
