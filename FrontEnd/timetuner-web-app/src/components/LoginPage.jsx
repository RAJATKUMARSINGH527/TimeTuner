import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };
  
  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token in localStorage
      localStorage.getItem('token', data.token);
      localStorage.getItem('user', JSON.stringify(data.user));

      console.log('Login successful! Token generated:', data.token);  // ✅ Log token
      console.log('User data:', data.user);  // ✅ Log user data
      alert('Login successful!');
      
      // Redirect to Home page
      navigate('/');
    } catch (err) {
      alert(err.message || 'Login failed. Please try again.');
      
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-500">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white rounded-full p-2 mb-2">
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">TimeTuner</h1>
          <h2 className="text-xl font-medium text-white mt-4">Log In</h2>
        </div>
        
        {/* Login Form */}
        <div className="bg-white rounded-md p-6 shadow-md">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
        
          {/* Google Login Button */}
          <button 
            className="w-full border border-gray-300 rounded-md py-2 px-4 flex items-center justify-center mb-4"
            onClick={handleGoogleLogin}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/225px-Google_%22G%22_logo.svg.png" alt="Google logo" className="mr-2 w-5 h-5" />
            <span className="text-gray-700">Login with Google</span>
          </button>
          
          {/* OR Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-500 text-sm mb-2">EMAIL</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          
          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-gray-500 text-sm mb-2">PASSWORD</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          
          {/* Login Button */}
          <button
            onClick={handleLoginWithEmail}
            disabled={loading}
            className="w-full bg-gray-800 text-white rounded-md py-3 hover:bg-gray-700 disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Log in with Email'}
          </button>
        </div>
        
        {/* Sign Up Link */}
        <div className="text-center mt-4">
          <p className="text-white">Don't have an account?</p>
          <a href="/signup" className="text-white font-medium">Create Account</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;