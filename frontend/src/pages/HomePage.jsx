import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  FaDog,
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

const HomePage = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-teal-100 flex flex-col'>
      <Navbar />
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
