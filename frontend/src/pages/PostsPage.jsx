import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaUserCircle, FaCommentAlt } from "react-icons/fa";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [commentsVisible, setCommentsVisible] = useState({});
  const [commentText, setCommentText] = useState({});
  const navigate = useNavigate();
  const commentRefs = useRef({});

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

  const toggleComments = (postId) => {
    setCommentsVisible((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const fetchComments = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/posts/${postId}/comments`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      setPosts((prevState) =>
        prevState.map((post) =>
          post._id === postId ? { ...post, comments: data.data.comments } : post
        )
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleCommentsClick = (postId) => {
    toggleComments(postId);
    if (!commentsVisible[postId]) {
      fetchComments(postId);

      setTimeout(() => {
        if (commentRefs.current[postId]) {
          commentRefs.current[postId].scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentText({
      ...commentText,
      [postId]: value,
    });
  };

  const handleCommentSubmit = async (postId, e) => {
    if (e.key === "Enter" && commentText[postId]) {
      e.preventDefault();

      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/posts/${postId}/comments`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: commentText[postId] }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add comment");
        }

        const data = await response.json();

        const newComment = {
          ...data.data.comment,
          commentedBy: currentUser,
          commentedAt: new Date(),
        };

        setPosts((prevState) =>
          prevState.map((post) =>
            post._id === postId
              ? { ...post, comments: [...post.comments, newComment] }
              : post
          )
        );

        setCommentText((prevState) => ({
          ...prevState,
          [postId]: "",
        }));
      } catch (err) {
        console.error(err.message);
      }
    }
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
                <p className='text-gray-700 mt-2'>
                  <strong>Country:</strong> {post.country}
                </p>
                <p className='text-gray-700 mt-2'>
                  <strong>City:</strong> {post.city}
                </p>
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

                <button
                  onClick={() => handleCommentsClick(post._id)}
                  className='flex items-center text-teal-600 hover:text-teal-800 mt-4'
                >
                  <FaCommentAlt className='mr-2' />
                  Comments ({post.comments ? post.comments.length : 0})
                </button>

                {commentsVisible[post._id] && (
                  <div
                    ref={(el) => (commentRefs.current[post._id] = el)} // Attach the ref to the comments div
                    className='mt-4 p-4 bg-gray-100 rounded-lg'
                  >
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((comment) => (
                        <div key={comment._id} className='mb-2'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                              {comment.commentedBy.photo ? (
                                <img
                                  src={`http://localhost:5000${comment.commentedBy.photo}`}
                                  alt={comment.commentedBy.firstName}
                                  className='w-8 h-8 rounded-full object-cover cursor-pointer'
                                  onClick={() =>
                                    handleProfileClick(comment.commentedBy._id)
                                  }
                                />
                              ) : (
                                <FaUserCircle
                                  className='w-8 h-8 text-gray-400 cursor-pointer'
                                  onClick={() =>
                                    handleProfileClick(comment.commentedBy._id)
                                  }
                                />
                              )}
                              <p className='ml-2 text-sm text-gray-800'>
                                <strong>
                                  {comment.commentedBy.firstName}{" "}
                                  {comment.commentedBy.lastName}
                                </strong>{" "}
                                {comment.content}
                              </p>
                            </div>
                            <p className='text-sm text-gray-500'>
                              {new Date(comment.commentedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className='text-sm text-gray-600'>No comments yet.</p>
                    )}
                    <div className='mt-4 flex items-center'>
                      {currentUser && currentUser.photo ? (
                        <img
                          src={`http://localhost:5000${currentUser.photo}`}
                          alt='Your profile'
                          className='w-8 h-8 rounded-full object-cover'
                        />
                      ) : (
                        <FaUserCircle className='w-8 h-8 text-gray-400' />
                      )}
                      <input
                        type='text'
                        placeholder='Write a comment...'
                        value={commentText[post._id] || ""}
                        onChange={(e) =>
                          handleCommentChange(post._id, e.target.value)
                        }
                        onKeyDown={(e) => handleCommentSubmit(post._id, e)}
                        className='ml-2 w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400'
                      />
                    </div>
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
