# Task Mate - Advanced To-Do List Web Application

A modern, feature-rich task management application built with React and Node.js.

## Features

- 📅 Interactive Timeline View
- ✅ Task Completion Tracking
- 🔍 Advanced Search and Filtering
- 🎨 Beautiful UI with Gradient Backgrounds
- 📱 Responsive Design
- ⏰ Time-based Task Organization
- 🏷️ Task Categories and Priority Levels

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Date-fns for date manipulation
  - Axios for API requests
  - React-toastify for notifications

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Mongoose

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd task-mate
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables:
Create a `.env` file in the server directory with:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

4. Start the application:
```bash
# Start backend server
cd server
npm start

# Start frontend in a new terminal
cd client
npm start
```

The application will be available at `http://localhost:3000`

## Features Overview

### Timeline View
- Visual representation of tasks across a two-week period
- Time-slot based organization
- Drag-and-drop task management

### Task Management
- Create, edit, and delete tasks
- Set due dates and times
- Assign priority levels
- Mark tasks as complete
- Add descriptions and categories

### Filtering and Organization
- Filter tasks by status (All, Pending, Completed)
- Search tasks by title or description
- Sort by date and completion status

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details. 