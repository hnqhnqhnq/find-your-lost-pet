import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";

const UserProfilePage = () => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/users/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.data.currentUser);
          setLoading(false);
        } else {
          console.error("Failed to fetch user data");
          setError("Failed to load user data.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("An error occurred while fetching user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-teal-100 flex flex-col'>
      <Navbar />
      <div className='flex-grow flex flex-col items-center justify-center mt-12 px-4 lg:px-12 gap-8'>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className='text-red-500'>{error}</div>
        ) : (
          <div className='bg-white p-8 rounded-lg shadow-lg text-center w-full lg:w-5/12 min-h-[200px]'>
            {userProfile.photo ? (
              <img
                src={`http://localhost:5000${userProfile.photo}`}
                alt='Profile'
                className='mx-auto mb-4 rounded-full'
                style={{ width: "128px", height: "128px", objectFit: "cover" }}
              />
            ) : (
              <FaUserCircle size={128} className='mx-auto mb-4 text-teal-500' />
            )}
            <p className='text-lg text-gray-600 mb-4'>
              <strong>First Name:</strong> {userProfile.firstName}
            </p>
            <p className='text-lg text-gray-600 mb-4'>
              <strong>Last Name:</strong> {userProfile.lastName}
            </p>
            <p className='text-lg text-gray-600 mb-4'>
              <strong>Email:</strong> {userProfile.email}
            </p>
            <p className='text-lg text-gray-600 mb-4'>
              <strong>Country:</strong> {userProfile.country}
            </p>
            <p className='text-lg text-gray-600 mb-4'>
              <strong>City:</strong> {userProfile.city}
            </p>
            <button className='mt-4 px-6 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1'>
              Message this User
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
