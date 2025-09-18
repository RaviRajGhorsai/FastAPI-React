import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from 'react-router-dom';
import Blogs from './Blogs.jsx'
import LandingPage from './LandingPage.jsx';
import Signup from './auth/signup.jsx';
import Login from './auth/login.jsx';
import BlogDashboard from './components/BlogDashboard.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import OAuthCallback from './auth/auth_success.jsx';
// import AuthHandler from './auth/authHandler.jsx';

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* {/* <Route path="/auth/callback" element={<AuthHandler />} /> */}
        <Route path="/auth/success" element={<OAuthCallback />} /> 
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/dashboard" element={
                                    <ProtectedRoute>
                                        <BlogDashboard />
                                    </ProtectedRoute>
                                        } />
        
      </Routes>
    
  );
}

export default App;

