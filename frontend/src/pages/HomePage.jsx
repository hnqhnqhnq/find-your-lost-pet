import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import {
  FaDog,
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

const HomePage = () => {
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/users/signoutUser",
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
            <Link to='/find'>Posts</Link>
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

      <div className='flex-grow flex flex-wrap items-start justify-center mt-12 px-4 lg:px-12 gap-8'>
        <div className='bg-white p-8 rounded-lg shadow-lg text-center w-full lg:w-5/12 min-h-[200px]'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>
            Welcome Back
          </h2>
          <p className='text-lg text-gray-600'>
            I'm a computer science student who loves animals. I created this
            platform to help everyone find their lost pets.
          </p>
        </div>
        <div className='bg-white p-8 rounded-lg shadow-lg text-center w-full lg:w-5/12 min-h-[200px]'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>
            Why Find Your Lost Pet?
          </h2>
          <p className='text-lg text-gray-600'>
            Pet Finder is dedicated to helping you find your lost pets. I want
            to connect pet owners with local shelters, rescue organizations, and
            fellow pet lovers to make the search process easier.
          </p>
        </div>
        <div className='bg-white p-8 rounded-lg shadow-lg text-center w-full lg:w-5/12 min-h-[200px]'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>
            Beware of Scams
          </h2>
          <p className='text-lg text-gray-600'>
            Always be cautious when communicating online. Never share personal
            information, and always meet in public places when dealing with
            strangers. Report any suspicious activity to local authorities.
          </p>
        </div>
        <div className='bg-white p-8 rounded-lg shadow-lg text-center w-full lg:w-5/12 min-h-[200px] flex flex-col justify-center'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>
            Connect with Me
          </h2>
          <div className='flex justify-center space-x-6 text-teal-500 text-2xl'>
            <a
              href='https://github.com/hnqhnqhnq'
              target='_blank'
              rel='noreferrer'
            >
              <FaGithub />
            </a>
            <a
              href='https://www.linkedin.com/in/%C5%9Ftefan-h%C3%AEncu-46508a258/'
              target='_blank'
              rel='noreferrer'
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
