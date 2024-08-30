import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import Navbar from "../components/Navbar";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + photos.length > 5) {
      setError("You can upload up to 5 photos only.");
    } else {
      setPhotos([...photos, ...selectedFiles]);
      setError(null);
    }
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    try {
      const response = await fetch("http://localhost:5000/api/v1/posts", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      navigate("/posts");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-teal-100 flex flex-col'>
      <Navbar />
      <div className='flex-grow flex items-center justify-center'>
        <div className='w-full max-w-xl p-6'>
          <form
            onSubmit={handleSubmit}
            className='bg-white p-8 rounded-lg shadow-lg w-full'
          >
            {error && <p className='text-red-500 mb-4'>{error}</p>}
            <div className='mb-4'>
              <label
                htmlFor='title'
                className='block text-gray-700 font-bold mb-2'
              >
                Title
              </label>
              <input
                type='text'
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                required
              />
            </div>
            <div className='mb-4'>
              <label
                htmlFor='content'
                className='block text-gray-700 font-bold mb-2'
              >
                Content
              </label>
              <textarea
                id='content'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                rows='6'
                required
              ></textarea>
            </div>
            {photos.length > 0 && (
              <div className='mb-4'>
                {photos.map((photo, index) => (
                  <div key={index} className='relative'>
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Selected ${index + 1}`}
                      className='w-full h-48 object-cover rounded-lg mb-2'
                    />
                    <button
                      type='button'
                      onClick={() => removePhoto(index)}
                      className='absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full'
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className='mb-4'>
              <label
                htmlFor='photos'
                className='block text-gray-700 font-bold mb-2'
              >
                Add Photos (Max 5)
              </label>
              <input
                type='file'
                id='photos'
                accept='image/*'
                onChange={handlePhotoChange}
                className='block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-teal-500 file:text-white
              hover:file:bg-teal-600'
                multiple
              />
            </div>
            <div className='flex justify-end'>
              <button
                type='submit'
                className='bg-teal-500 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-600 transition duration-300'
                disabled={loading || photos.length > 5}
              >
                {loading ? "Creating..." : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
