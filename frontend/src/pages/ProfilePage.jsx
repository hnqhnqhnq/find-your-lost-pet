import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaCommentAlt, FaTrashAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import "../styles/styles.css";

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [commentsVisible, setCommentsVisible] = useState({});
  const [commentText, setCommentText] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const commentRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
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
          setUserProfile(data.data.user);
          setCurrentUser(data.data.user);

          const postsResponse = await fetch(
            `http://localhost:5000/api/v1/posts/${data.data.user._id}/posts`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (postsResponse.ok) {
            const postsData = await postsResponse.json();
            setUserPosts(postsData.data.posts);
            setLoadingPosts(false);
          } else {
            setLoadingPosts(false);
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        setLoadingPosts(false);
        navigate("/login");
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleProfileClick = (userId) => {
    if (currentUser && userId === currentUser._id) {
      navigate("/profile");
    } else {
      navigate(`/profile/${userId}`);
    }
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/posts/${postToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setUserPosts((prevState) =>
        prevState.filter((post) => post._id !== postToDelete)
      );
      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("profilePic", selectedFile);

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/users/updateProfilePicture",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUserProfile(data.data.user);
        alert("Profile picture updated successfully!");
      }
    } catch (error) {}
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
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
      setUserPosts((prevState) =>
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

        setUserPosts((prevState) =>
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
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-teal-100 flex flex-col'>
      <Navbar />
      <div className='flex-grow flex flex-col lg:flex-row mt-12 px-4 lg:px-12 gap-8'>
        {userProfile ? (
          <div className='bg-white p-8 rounded-lg shadow-lg text-center w-full lg:w-3/12 min-h-[200px]'>
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
            <p
              className={`text-lg text-gray-600 mb-4 ${
                userProfile.role === "admin" ? "rainbow-text" : ""
              }`}
            >
              <strong>First Name:</strong> {userProfile.firstName}
            </p>
            <p
              className={`text-lg text-gray-600 mb-4 ${
                userProfile.role === "admin" ? "rainbow-text" : ""
              }`}
            >
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
            <input
              type='file'
              id='fileInput'
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button
              className='mt-4 px-6 py-2 mx-2 bg-teal-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1'
              onClick={handleUploadClick}
            >
              Upload Profile Picture
            </button>
            <button
              className='mt-4 px-6 py-2 mx-2 bg-teal-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1'
              onClick={() => navigate("/profile/changedata")}
            >
              Change User Data
            </button>
            <button
              className='mt-4 px-6 py-2 mx-2 bg-teal-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1'
              onClick={() => navigate("/profile/changepassword")}
            >
              Change Your Password
            </button>
          </div>
        ) : (
          <div>Loading...</div>
        )}
        <div className='w-full lg:w-9/12'>
          {loadingPosts ? (
            <div>Loading posts...</div>
          ) : userPosts.length > 0 ? (
            userPosts.map((post) => (
              <div
                key={post._id}
                className='bg-white p-6 rounded-lg shadow mb-4'
              >
                <div className='flex justify-between'>
                  <h2 className='text-2xl font-bold text-gray-800'>
                    {post.title}
                  </h2>
                  <FaTrashAlt
                    className='text-red-500 cursor-pointer'
                    onClick={() => {
                      setShowDeleteModal(true);
                      setPostToDelete(post._id);
                    }}
                  />
                </div>
                <p className='text-gray-700 mt-2'>{post.content}</p>
                <p className='text-gray-700 mt-2'>
                  <strong>Posted at:</strong>{" "}
                  {new Date(post.postedAt).toLocaleString()}
                </p>

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
                    ref={(el) => (commentRefs.current[post._id] = el)}
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
          ) : (
            <div>No posts available.</div>
          )}
        </div>

        {showDeleteModal && (
          <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <p className='mb-4'>Are you sure you want to delete this post?</p>
              <div className='flex justify-end'>
                <button
                  className='px-4 py-2 bg-gray-300 rounded-lg mr-2'
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className='px-4 py-2 bg-red-500 text-white rounded-lg'
                  onClick={handleDeletePost}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
