import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/loginUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/home");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-teal-100 p-4'>
      <div className='bg-white p-8 rounded-xl shadow-2xl w-full max-w-md'>
        <h2 className='text-4xl font-extrabold text-center text-gray-800 mb-8'>
          Welcome Back
        </h2>
        {error && <div className='text-red-600 text-center mb-4'>{error}</div>}
        <form className='space-y-6' onSubmit={handleSubmit}>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-2'>
              Email
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-shadow placeholder-gray-400 shadow-sm'
              placeholder='Enter your email'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-2'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-shadow placeholder-gray-400 shadow-sm'
              placeholder='Enter your password'
              required
            />
            <div className='text-right mt-2'>
              <a href='#' className='text-sm text-teal-600 hover:text-teal-500'>
                Forgot your password?
              </a>
            </div>
          </div>
          <div>
            <button
              type='submit'
              className='w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-teal-400'
            >
              Log In
            </button>
          </div>
        </form>
        <div className='text-center text-sm text-gray-500 mt-8'>
          <p>
            Don’t have an account?{" "}
            <a
              href='/signup'
              className='font-medium text-teal-600 hover:text-teal-500'
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
