import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaUserCircle, FaPaperclip, FaTimes } from "react-icons/fa";

const MessagesPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/chats", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch chats");
        }

        const data = await response.json();
        setChats(data.data.chats);
      } catch (err) {
        console.error(err.message);
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

        if (!response.ok) {
          throw new Error("Failed to fetch current user");
        }

        const data = await response.json();
        setCurrentUser(data.data.user);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchChats();
    fetchCurrentUser();
  }, []);

  const handleChatClick = async (chat) => {
    setSelectedChat(chat);
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/messages/${chat._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data.data.messages);
      scrollToBottom();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() && selectedFiles.length === 0) return;

    const receiverId =
      selectedChat.firstParticipant._id === currentUser._id
        ? selectedChat.secondParticipant._id
        : selectedChat.firstParticipant._id;

    const formData = new FormData();
    formData.append("content", newMessage);
    selectedFiles.forEach((file) => {
      formData.append("mediaFiles", file);
    });

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/messages/${receiverId}/${selectedChat._id}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const updatedMessagesResponse = await fetch(
        `http://localhost:5000/api/v1/messages/${selectedChat._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!updatedMessagesResponse.ok) {
        throw new Error("Failed to fetch messages after sending");
      }

      const updatedMessagesData = await updatedMessagesResponse.json();
      setMessages(updatedMessagesData.data.messages);
      setNewMessage("");
      setSelectedFiles([]);
      scrollToBottom();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...selectedFiles, ...e.target.files]);
  };

  const removeSelectedFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const renderProfilePicture = (user) => {
    return user && user.photo ? (
      <img
        src={`http://localhost:5000${user.photo}`}
        alt={`${user.firstName} ${user.lastName}`}
        className='w-8 h-8 rounded-full object-cover'
      />
    ) : (
      <FaUserCircle className='w-8 h-8 text-gray-400' />
    );
  };

  useEffect(() => {
    if (selectedChat) {
      console.log("Selected Chat:", selectedChat);
      console.log("Current User ID:", currentUser?._id);
    }
  }, [selectedChat, currentUser]);

  useEffect(() => {
    if (messages.length > 0) {
      messages.forEach((message) => {
        const isSender = String(message.sender) === String(currentUser?._id);
        console.log("Message:", message);
        console.log("Is Sender:", isSender);
      });
    }
  }, [messages, currentUser]);
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-grow flex overflow-hidden'>
        <div className='w-1/4 bg-white p-4 overflow-y-auto'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>Chats</h2>
          <div className='space-y-2 h-full overflow-y-auto'>
            {chats.length > 0 ? (
              chats.map((chat) => {
                const otherUser =
                  chat.firstParticipant._id === currentUser?._id
                    ? chat.secondParticipant
                    : chat.firstParticipant;

                return (
                  <div
                    key={chat._id}
                    className={`p-2 rounded-lg cursor-pointer hover:bg-teal-100 ${
                      selectedChat && selectedChat._id === chat._id
                        ? "bg-teal-200"
                        : ""
                    }`}
                    onClick={() => handleChatClick(chat)}
                  >
                    <div className='flex items-center'>
                      {renderProfilePicture(otherUser)}
                      <div className='ml-2'>
                        <p className='text-sm font-semibold text-gray-800'>
                          {otherUser.firstName} {otherUser.lastName}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {chat.lastMessage?.slice(0, 30)}...
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className='text-gray-600'>No chats available</p>
            )}
          </div>
        </div>

        <div className='w-3/4 bg-white flex flex-col'>
          {selectedChat ? (
            <>
              <div className='flex-grow overflow-y-auto p-4 h-0'>
                {messages.map((message, index) => {
                  const isSender =
                    String(message.sender._id) === String(currentUser._id);

                  const otherUser =
                    selectedChat.firstParticipant._id === currentUser._id
                      ? selectedChat.secondParticipant
                      : selectedChat.firstParticipant;

                  const displayUser = isSender ? currentUser : otherUser;

                  return (
                    <div
                      key={index}
                      className={`flex ${
                        isSender ? "justify-end" : "justify-start"
                      } mb-4`}
                    >
                      {!isSender && (
                        <>
                          <div className='mr-2'>
                            {renderProfilePicture(displayUser)}
                          </div>
                          <div>
                            <p className='text-sm'>
                              <strong>
                                {displayUser.firstName} {displayUser.lastName}
                              </strong>
                            </p>
                            <div className='p-3 rounded-lg max-w-xs bg-gray-300 text-gray-800'>
                              <p>{message.content}</p>
                              {message.mediaFiles &&
                                message.mediaFiles.map((file, idx) => (
                                  <div key={idx} className='mt-2'>
                                    {file.endsWith(".png") ||
                                    file.endsWith(".jpg") ||
                                    file.endsWith(".jpeg") ||
                                    file.endsWith(".gif") ? (
                                      <img
                                        src={`http://localhost:5000${file}`}
                                        alt='media'
                                        className='max-w-full h-auto rounded-lg'
                                      />
                                    ) : file.endsWith(".mp4") ||
                                      file.endsWith(".mov") ||
                                      file.endsWith(".avi") ? (
                                      <video
                                        controls
                                        className='max-w-full h-auto rounded-lg'
                                      >
                                        <source
                                          src={`http://localhost:5000${file}`}
                                          type='video/mp4'
                                        />
                                        Your browser does not support the video
                                        tag.
                                      </video>
                                    ) : (
                                      <a
                                        href={`http://localhost:5000${file}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-blue-600 underline'
                                      >
                                        View File
                                      </a>
                                    )}
                                  </div>
                                ))}
                              <p className='text-xs mt-1 text-right'>
                                {new Date(message.messageAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                      {isSender && (
                        <>
                          <div>
                            <p className='text-sm text-right'>
                              <strong>
                                {displayUser.firstName} {displayUser.lastName}
                              </strong>
                            </p>
                            <div className='p-3 rounded-lg max-w-xs bg-teal-500 text-white text-left'>
                              <p>{message.content}</p>
                              {message.mediaFiles &&
                                message.mediaFiles.map((file, idx) => (
                                  <div key={idx} className='mt-2'>
                                    {file.endsWith(".png") ||
                                    file.endsWith(".jpg") ||
                                    file.endsWith(".jpeg") ||
                                    file.endsWith(".gif") ? (
                                      <img
                                        src={`http://localhost:5000${file}`}
                                        alt='media'
                                        className='max-w-full h-auto rounded-lg'
                                      />
                                    ) : file.endsWith(".mp4") ||
                                      file.endsWith(".mov") ||
                                      file.endsWith(".avi") ? (
                                      <video
                                        controls
                                        className='max-w-full h-auto rounded-lg'
                                      >
                                        <source
                                          src={`http://localhost:5000${file}`}
                                          type='video/mp4'
                                        />
                                        Your browser does not support the video
                                        tag.
                                      </video>
                                    ) : (
                                      <a
                                        href={`http://localhost:5000${file}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-white underline'
                                      >
                                        View File
                                      </a>
                                    )}
                                  </div>
                                ))}
                              <p className='text-xs mt-1 text-right'>
                                {new Date(message.messageAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className='ml-2'>
                            {renderProfilePicture(displayUser)}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSendMessage}
                className='flex flex-col p-4 border-t'
              >
                <div className='flex space-x-2 mb-4'>
                  {Array.from(selectedFiles).map((file, index) => (
                    <div key={index} className='relative'>
                      <img
                        src={URL.createObjectURL(file)}
                        alt='preview'
                        className='w-20 h-20 rounded-lg object-cover'
                      />
                      <button
                        type='button'
                        onClick={() => removeSelectedFile(index)}
                        className='absolute top-0 right-0 text-red-500'
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
                <div className='flex items-center'>
                  <label className='mr-4 cursor-pointer'>
                    <FaPaperclip className='text-gray-500' />
                    <input
                      type='file'
                      multiple
                      onChange={handleFileChange}
                      className='hidden'
                    />
                  </label>
                  <input
                    type='text'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder='Type a message...'
                    className='flex-grow p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500'
                  />
                  <button
                    type='submit'
                    className='ml-4 bg-teal-500 text-white p-2 rounded-full'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      className='w-6 h-6'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 10l7-7m0 0l7 7m-7-7v18'
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className='flex-grow flex items-center justify-center'>
              <p className='text-gray-600'>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
