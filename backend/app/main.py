from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import engine, Base
from app.api import auth, transactions, portfolio, goals, advisor, news

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FinPilot API",
    description="Unified API backend for FinPilot Expense & Portfolio Tracker",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router, prefix="/api")
app.include_router(transactions.router, prefix="/api")
app.include_router(portfolio.router, prefix="/api")
app.include_router(goals.router, prefix="/api")
app.include_router(advisor.router, prefix="/api")
app.include_router(news.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the FinPilot Backend REST API!", "docs": "/docs"}
