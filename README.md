# 🐾 Find Your Lost Pet Project

Welcome to the Find Your Lost Pet project! This platform helps users post and search for lost pets, built using Node.js, Express.js, MongoDB, and a React-based frontend.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [API Endpoints](#apiendpoints)
- [Scripts](#scripts)
- [Usage](#usage)
- [License](#license)

## 🔧 Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Download and install Node.js from [nodejs.org](https://nodejs.org/en).
- **MongoDB**: Make sure you have MongoDB installed and running. You can download it from [mongodb.com](https://www.mongodb.com/try/download/community).

## ⚙️ Installation

- **Clone the repository**:
  ```
  git clone https://github.com/your-username/find-your-lost-pet.git
  ```
- **Navigate to the backend folder**:
  ```
  cd find-your-lost-pet/backend
  ```
- **Install backend dependencies**:
  ```
  npm install
  ```
- **Set up environment variables: Create a config.env file with the following**:
  ```
  MONGO_URI=your_mongo_db_connection_string
  PORT=5000
  ```
- **Start the backend server**:
  ```
  npm run start:dev
  ```
- **Navigate to the frontend folder**:
  ```
  cd ../frontend
  ```
- **Install frontend dependencies**:
  ```
  npm install
  ```
- **Start the frontend server**:
  ```
  npm start
  ```
## 🔗 API Endpoints

Base URL: **/api/v1**

User Routes
  - POST /signupUser - Register a new user.
  - POST /loginUser - Log in an existing user.
  - GET /isLoggedIn - Check if the user is logged in.
  - GET /signoutUser - Log out the user.
  - PATCH /changePassword - Change the user's password.
  - POST /forgotPassword - Send a password reset email.
  - PATCH /resetPassword/:token - Reset password using a token.
  - GET /myProfile - Get the profile data of the logged-in user.
  - PATCH /changeUserData - Update the user's profile information.
  - GET /search - Search for users.
  - GET / - Get all users.
  - GET /:id - Get user by ID.
        
Post Routes
  - GET /posts: Retrieve all posts.
  - POST /posts: Create a new post.
  - DELETE /posts/:postId: Delete a post by ID.

Message Routes
  - POST /messages/:receiverId/:chatId: Send a message.
  - GET /messages/:chatId: Retrieve messages in a chat.

Chat Routes
  - POST /:user1/:user2 - Create a chat between two users.
  - GET / - Retrieve all chats.

## 📜 Scripts

- **Run backend in development**:
  ```
  npm run start:dev
  ```
- **Run backend in production**:
  ```
  npm run start:prod
  ```
- **Start the frontend**:
  ```
  npm start
  ```

## 🚀 Usage

- **Start the backend server**:
  ```
  npm run start:dev
  ```
- **Start the frontend server**:
  ```
  npm start
  ```
- **Access the application**:

    Frontend: http://localhost:3000
    Backend API: http://localhost:5000

## 📄 License

This project is licensed under the MIT License.
