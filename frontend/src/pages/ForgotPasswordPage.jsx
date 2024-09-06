import React, { useState } from "react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // To handle green or red messages

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/users/forgotPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message);
        setError("");
      } else {
        setIsSuccess(false);
        setError(data.message || "Something went wrong");
        setMessage("");
      }
    } catch (error) {
      console.error("Error during password reset request:", error);
      setIsSuccess(false);
      setError("An unexpected error occurred. Please try again later.");
      setMessage("");
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-teal-100 p-4'>
      <div className='bg-white p-8 rounded-xl shadow-2xl w-full max-w-md'>
        <h2 className='text-4xl font-extrabold text-center text-gray-800 mb-8'>
          Forgot Password
        </h2>
        {message && (
          <div
            className={`text-center mb-4 ${
              isSuccess ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
        {error && (
          <div
            className={`text-center mb-4 ${
              isSuccess ? "text-green-600" : "text-red-600"
            }`}
          >
            {error}
          </div>
        )}
        <form className='space-y-6' onSubmit={handleSubmit}>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-2'>
              Enter your email
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
            <button
              type='submit'
              className='w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-teal-400'
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
