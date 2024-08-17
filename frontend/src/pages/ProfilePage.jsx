import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { FaDog, FaUserCircle } from "react-icons/fa"; // Import the user icon

const ProfilePage = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/users/myProfile",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.data.user);
        } else {
          console.error("Failed to fetch profile data");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        navigate("/login");
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/signoutUser",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        navigate("/login");
      } else {
        console.error("Failed to sign out");
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-teal-100 flex flex-col'>
      <nav className='bg-white bg-opacity-50 backdrop-blur-md shadow-md py-4 px-8 flex justify-between items-center relative'>
        <div className='flex items-center'>
          <FaDog className='block lg:hidden text-teal-500 mr-2' size={30} />
          <div className='text-2xl font-bold text-gray-800 hidden lg:block'>
            Find Your Lost Pet
          </div>
        </div>
        <div className='lg:hidden'>
          <button
            onClick={() => setNavOpen(!navOpen)}
            className='focus:outline-none'
          >
            {navOpen ? (
              <FiX
                size={24}
                className='transition-transform transform rotate-180 duration-300'
              />
            ) : (
              <FiMenu
                size={24}
                className='transition-transform transform rotate-0 duration-300'
              />
            )}
          </button>
        </div>
        <ul
          className={`lg:flex lg:space-x-6 lg:static absolute top-full left-0 w-full lg:w-auto bg-white lg:bg-transparent lg:shadow-none shadow-lg lg:translate-y-0 transform transition-all duration-500 ease-in-out ${
            navOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10 pointer-events-none lg:pointer-events-auto lg:opacity-100"
          }`}
          style={{ zIndex: 1000 }}
        >
          <li className='block lg:inline-block py-2 lg:py-0 px-4 lg:px-2 text-gray-700 hover:text-teal-500 transition duration-300'>
            <Link to='/home'>Home</Link>
          </li>
          <li className='block lg:inline-block py-2 lg:py-0 px-4 lg:px-2 text-gray-700 hover:text-teal-500 transition duration-300 delay-75'>
            <Link to='/find'>Find Lost Pets</Link>
          </li>
          <li className='block lg:inline-block py-2 lg:py-0 px-4 lg:px-2 text-gray-700 hover:text-teal-500 transition duration-300 delay-150'>
            <Link to='/create'>Create a Post</Link>
          </li>
          <li className='block lg:inline-block py-2 lg:py-0 px-4 lg:px-2 text-gray-700 hover:text-teal-500 transition duration-300 delay-225'>
            <Link to='/profile'>Profile</Link>
          </li>
          <li
            className='block lg:inline-block py-2 lg:py-0 px-4 lg:px-2 text-gray-700 hover:text-teal-500 transition duration-300 delay-375 cursor-pointer'
            onClick={handleSignOut}
          >
            Sign Out
          </li>
        </ul>
      </nav>

      <div className='flex-grow flex flex-col items-center justify-center mt-12 px-4 lg:px-12 gap-8'>
        {userProfile ? (
          <div className='bg-white p-8 rounded-lg shadow-lg text-center w-full lg:w-5/12 min-h-[200px]'>
            <FaUserCircle size={128} className='mx-auto mb-4 text-teal-500' />
            <h2 className='text-3xl font-bold text-gray-800 mb-4'>Profile</h2>
            <p className='text-lg text-gray-600 mb-4'>
              <strong>First Name:</strong> {userProfile.firstName}
            </p>
            <p className='text-lg text-gray-600 mb-4'>
              <strong>Last Name:</strong> {userProfile.lastName}
            </p>
            <p className='text-lg text-gray-600 mb-4'>
              <strong>Email:</strong> {userProfile.email}
            </p>
            <button
              className='mt-4 px-6 py-2 mx-2 bg-teal-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1'
              onClick={() =>
                alert("Change Password functionality not implemented yet")
              }
            >
              Change Your Password
            </button>
            <button
              className='mt-4 px-6 py-2 mx-2 bg-teal-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1'
              onClick={() =>
                alert("Change Password functionality not implemented yet")
              }
            >
              Upload Profile Picture
            </button>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
