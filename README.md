101420473_lab_test1_chat_app
Description

This is a real-time chat application built as part of a lab assignment. The app allows users to:

->Sign up and log in to create an account.
->Join different chat rooms and communicate with other users.
->Send private messages to specific users.
->View and interact with group chats in various rooms.

The application uses Node.js, Express, MongoDB, Socket.io, and Bootstrap for modern, responsive user interface.

Features
Authentication:
Secure user signup and login using MongoDB.
Passwords are hashed for security.

Real-Time Messaging:
Users can send and receive messages instantly in group chats.
Private messaging is supported.

Chat Rooms:
Multiple rooms such as "Cloud", "DevOps", and "Sports."
Users can join and leave rooms dynamically.

Database Storage:
All messages are stored in MongoDB for persistence.

Tech Stack
Frontend:
HTML, CSS (with Bootstrap)
JavaScript

Backend:
Node.js with Express

Socket.io for real-time communication

Database:
MongoDB (Atlas)

Tools:
Postman for API testing
GitHub for version control

API Endpoints
Authentication
POST /auth/signup
Register a new user.
Request:

json
{
"username": "testuser",
"firstname": "Test",
"lastname": "User",
"password": "password123"
}
Response:
json
{
"message": "User registered successfully"
}

POST /auth/login
Log in with valid credentials.
Request:

json
{
"username": "testuser",
"password": "password123"
}
Response:

json
{
"token": "jwt_token",
"username": "testuser"
}
POST /messages/group
Send a message to a group chat.

json
{
"from_user": "testuser",
"room": "general",
"message": "Hello, world!"
}
POST /messages/private
Send a private message to a user.

json
{
"from_user": "testuser",
"to_user": "user",
"message": "Hello!"
}

Author
Name: Dhruvi Patel
GitHub: @dhruvi1704
