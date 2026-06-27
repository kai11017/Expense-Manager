from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import engine, Base
from app.api import auth, transactions, portfolio, goals, advisor, news
from sqlalchemy import text

# Create database tables automatically
Base.metadata.create_all(bind=engine)

# Database migration to add reference_id if not present
with engine.connect() as conn:
    try:
        cursor = conn.execute(text("PRAGMA table_info(transactions)"))
        columns = [row[1] for row in cursor.fetchall()]
        if columns and "reference_id" not in columns:
            conn.execute(text("ALTER TABLE transactions ADD COLUMN reference_id VARCHAR;"))
            conn.commit()
    except Exception as e:
        print("Migration error:", e)

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
