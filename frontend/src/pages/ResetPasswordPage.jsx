import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/users/resetPassword/${token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password, confirmPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Password has been reset successfully!");
        setError("");

        // Redirect to login page after success
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.message || "Something went wrong");
        setMessage("");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("An unexpected error occurred. Please try again.");
      setMessage("");
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-teal-100 p-4'>
      <div className='bg-white p-8 rounded-xl shadow-2xl w-full max-w-md'>
        <h2 className='text-4xl font-extrabold text-center text-gray-800 mb-8'>
          Reset Password
        </h2>

        {message && (
          <div className='text-green-600 text-center mb-4'>{message}</div>
        )}
        {error && <div className='text-red-600 text-center mb-4'>{error}</div>}

        <form className='space-y-6' onSubmit={handleSubmit}>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-2'>
              New Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-shadow placeholder-gray-400 shadow-sm'
              placeholder='Enter your new password'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-600 mb-2'>
              Confirm New Password
            </label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-shadow placeholder-gray-400 shadow-sm'
              placeholder='Confirm your new password'
              required
            />
          </div>

          <div>
            <button
              type='submit'
              className='w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-teal-400'
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
