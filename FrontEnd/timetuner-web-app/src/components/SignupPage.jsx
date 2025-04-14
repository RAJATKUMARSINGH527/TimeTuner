import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Enhanced validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: formData.name,
          email: formData.email, 
          password: formData.password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Account created successfully!");
      console.log("Account created successfully!", data.user);
      
      // Redirect to login page
      navigate("/login");
      
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-500">
      <div className="w-full max-w-md p-6">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white rounded-full p-3 mb-2 shadow-md">
            <svg
              className="w-8 h-8 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">TimeTuner</h1>
          <h2 className="text-xl font-medium text-white mt-2">
            Create Your Account
          </h2>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Google Signup Button */}
          <button
            className="w-full border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center mb-6 hover:bg-gray-50 transition-colors"
            onClick={handleGoogleSignup}
            type="button"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-700 font-medium">
              Sign up with Google
            </span>
          </button>

          {/* OR Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm font-medium">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleSignup}>
            {/* Name Input */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor="name"
              >
                NAME
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            {/* Email Input */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor="email"
              >
                EMAIL
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor="password"
              >
                PASSWORD
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>

            {/* Confirm Password Input */}
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor="confirmPassword"
              >
                CONFIRM PASSWORD
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white rounded-md py-3 font-medium hover:bg-red-600 disabled:bg-red-300 transition-colors"
            >
              {loading ? "Creating Account..." : "Signup with Email"}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-white mb-1">Already have an account?</p>
          <a
            href="/login"
            className="text-white font-medium underline hover:text-red-100 transition-colors"
          >
            Log in
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
