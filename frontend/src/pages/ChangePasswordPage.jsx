import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSave = async () => {
    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/users/changePassword",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword,
            password: newPassword,
            confirmPassword: confirmNewPassword,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password changed successfully.");

        await fetch("http://localhost:5000/api/v1/users/signoutUser", {
          method: "GET",
          credentials: "include",
        });

        navigate("/login");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-teal-100 flex flex-col items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg text-center w-full lg:w-5/12 min-h-[300px]'>
        <h2 className='text-2xl font-bold mb-6'>Change Your Password</h2>

        {error && <div className='text-red-600 text-center mb-4'>{error}</div>}
        {success && (
          <div className='text-green-600 text-center mb-4'>{success}</div>
        )}

        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Old Password
          </label>
          <input
            type='password'
            className='w-full px-3 py-2 border rounded-lg'
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            New Password
          </label>
          <input
            type='password'
            className='w-full px-3 py-2 border rounded-lg'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Confirm New Password
          </label>
          <input
            type='password'
            className='w-full px-3 py-2 border rounded-lg'
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        <button
          className='mt-4 px-6 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1'
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
