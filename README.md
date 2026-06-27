# FinPilot App Runner Guide

This document lists the commands and instructions required to run the **FinPilot Expense & Portfolio Tracker** application locally on your Windows environment.

## Prerequisites
Ensure you have the following installed:
- **Python 3.10+**
- **Node.js** (version 18 or newer) & **npm**

---

## 1. Running the Backend Server

To start the API server, navigate to the `backend` folder first:

```bash
# Navigate into backend directory
cd backend

# Create virtual environment (if not already created)
python -m venv .venv

# Activate the virtual environment:
# If using Git Bash:
source .venv/Scripts/activate
# If using PowerShell:
.venv\Scripts\Activate.ps1
# If using Command Prompt:
.venv\Scripts\activate.bat

# Install required dependencies
pip install -r requirements.txt

# Start the FastAPI server (running on port 8000)
uvicorn app.main:app --port 8000
```

*Note: The interactive API documentation will be accessible at: `http://127.0.0.1:8000/docs`*

---

## 2. Running the Frontend Development Server

Open a **separate terminal**, navigate to the `frontend` folder, and run these commands:

```powershell
# Navigate into frontend directory
cd frontend

# Install Node dependencies (if not already installed)
npm install

# Start the Vite development server (running on port 5173)
npm run dev
```

*Note: The web application will be accessible at: `http://localhost:5173/`*
