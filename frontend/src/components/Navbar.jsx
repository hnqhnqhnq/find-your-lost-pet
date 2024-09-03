import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { FaDog, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/users/myProfile",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.data.user);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/users/search?q=${searchTerm}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        setSearchResults(data.data.users);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  const handleProfileClick = (userId) => {
    if (currentUser && userId === currentUser._id) {
      navigate("/profile");
    } else {
      navigate(`/profile/${userId}`);
    }
  };

  return (
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
        <li className='block lg:inline-block py-2 my-2 lg:py-0 px-4 lg:px-2 text-gray-700 hover:text-teal-500 transition duration-300'>
          <Link to='/home'>Home</Link>
        </li>
        <li className='block lg:inline-block py-2 my-2 lg:py-0 px-4 lg:px-2 text-gray-700 hover:text-teal-500 transition duration-300 delay-75'>
          <Link to='/posts'>Posts</Link>
        </li>
        <li className='block lg:inline-block py-2 my-2 lg:py-0 px-4 lg:px-2 text-gray-700 hover:text-teal-500 transition duration-300 delay-225'>
          <Link to='/profile'>Profile</Link>
        </li>
        <li className='block lg:inline-block py-2 my-2 lg:py-0 px-4 lg:px-2 text-gray-700 hover:text-teal-500 transition duration-300 delay-225'>
          <Link to='/messages'>Messages</Link>
        </li>
        <li
          className='block lg:inline-block py-2 my-2 lg:py-0 px-4 lg:px-2 text-gray-700 hover:text-teal-500 transition duration-300 delay-375 cursor-pointer'
          onClick={handleSignOut}
        >
          Sign Out
        </li>
        <li className='block lg:inline-block py-2 my-1 lg:py-0 px-4 lg:px-2'>
          <form onSubmit={handleSearch} className='flex items-center'>
            <input
              type='text'
              placeholder='Search users...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='px-2 py-1 border border-gray-300 rounded-lg'
            />
            <button
              type='submit'
              className='ml-2 px-3 py-1 bg-teal-500 text-white rounded-lg'
            >
              Search
            </button>
          </form>
          {searchResults.length > 0 && (
            <ul className='absolute bg-white shadow-lg rounded-lg mt-2 w-full max-h-60 overflow-auto'>
              {searchResults.map((user) => (
                <li
                  key={user._id}
                  className='p-2 border-b hover:bg-teal-100 cursor-pointer flex items-center'
                  onClick={() => handleProfileClick(user._id)}
                >
                  {user.photo ? (
                    <img
                      src={`http://localhost:5000${user.photo}`}
                      alt='Profile'
                      className='w-8 h-8 rounded-full mr-2'
                    />
                  ) : (
                    <FaUserCircle className='w-8 h-8 text-teal-500 mr-2' />
                  )}
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
