# How to Start the Portfolio Servers

## Quick Start

### Option 1: Use the Batch File (Easiest)
Double-click `start-admin.bat` in the project root folder.

### Option 2: Manual Start

#### Start Backend (Laravel)
Open a terminal and run:
```bash
cd backend
php artisan serve
```
The backend will start at: http://localhost:8000

#### Start Frontend (React)
Open another terminal and run:
```bash
cd frontend
npm run dev
```
The frontend will start at: http://localhost:5173

## Accessing the Application

- **Main Portfolio**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin
- **Backend API**: http://localhost:8000/api

## Troubleshooting

### "Nothing happens when I click Save"
This means the backend is not running. Make sure you:
1. Started the backend server (`php artisan serve`)
2. See "Server started at http://localhost:8000" in the terminal
3. The backend terminal is still open and running

### Check if Backend is Running
Open http://localhost:8000 in your browser. You should see the Laravel welcome page.

### Check if Frontend is Running
Open http://localhost:5173 in your browser. You should see your portfolio.

### Backend Not Starting
- Make sure you're in the `backend` folder
- Check if PHP is installed: `php --version`
- Check if composer dependencies are installed: `composer install`

### Frontend Not Starting
- Make sure you're in the `frontend` folder
- Check if Node.js is installed: `node --version`
- Check if npm packages are installed: `npm install`

## What the Admin Panel Needs

The admin panel requires BOTH servers to be running:
- **Frontend** (React) - Displays the admin interface
- **Backend** (Laravel) - Handles data storage and API requests

When you click "Save" in the admin panel:
1. Frontend sends data to backend API
2. Backend saves to database
3. Backend sends success response
4. Frontend shows success message and refreshes data

If the backend is not running, step 1 fails and nothing happens.
