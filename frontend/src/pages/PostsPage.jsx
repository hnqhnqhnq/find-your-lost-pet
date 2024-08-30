import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaUserCircle } from "react-icons/fa";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/posts", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPosts(data.data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

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

    fetchPosts();
    fetchCurrentUser();
  }, []);

  const handleProfileClick = (userId) => {
    if (currentUser && userId === currentUser._id) {
      navigate("/profile");
    } else {
      navigate(`/profile/${userId}`);
    }
  };

  const handleCreatePostClick = () => {
    navigate("/createPost");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-teal-100 flex flex-col'>
      <Navbar />
      <div className='flex-grow w-full max-w-6xl mx-auto mt-8 px-4 lg:px-0'>
        <div className='flex justify-between items-center mb-6'>
          <button
            onClick={handleCreatePostClick}
            className='bg-teal-500 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-600 transition duration-300'
          >
            Create a Post
          </button>
        </div>
        <div className='grid grid-cols-1 gap-6'>
          {posts.length === 0 ? (
            <p className='text-center text-gray-600'>No posts available.</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className='bg-white p-6 rounded-lg shadow'>
                <div className='flex items-center mb-4'>
                  {post.createdBy.photo ? (
                    <img
                      src={`http://localhost:5000${post.createdBy.photo}`}
                      alt={`${post.createdBy.firstName} ${post.createdBy.lastName}`}
                      className='w-12 h-12 rounded-full object-cover cursor-pointer'
                      onClick={() => handleProfileClick(post.createdBy._id)}
                    />
                  ) : (
                    <FaUserCircle
                      className='w-12 h-12 text-gray-400 cursor-pointer'
                      onClick={() => handleProfileClick(post.createdBy._id)}
                    />
                  )}
                  <div className='ml-4'>
                    <p className='text-lg font-semibold text-gray-800'>
                      {post.createdBy.firstName} {post.createdBy.lastName}
                    </p>
                    <p className='text-sm text-gray-500'>
                      Posted at: {new Date(post.postedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <h2 className='text-2xl font-bold text-gray-800'>
                  {post.title}
                </h2>
                <p className='text-gray-700 mt-2'>{post.content}</p>
                {post.photos && post.photos.length > 0 && (
                  <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {post.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000${photo}`}
                        alt={`Post Image ${index + 1}`}
                        className='w-full h-48 object-cover rounded-lg'
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostsPage;
