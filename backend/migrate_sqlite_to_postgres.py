import os
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.connection import Base
# Import all models to ensure metadata is populated
import app.models.models

def migrate():
    print("Starting migration from SQLite to PostgreSQL...")
    
    # 1. Setup connections
    sqlite_url = "sqlite:///backend/finpilot.db"
    postgres_url = os.getenv("DATABASE_URL", "postgresql://finpilot_user:supersecretpassword@localhost:5432/finpilot")
    
    sqlite_engine = create_engine(sqlite_url)
    postgres_engine = create_engine(postgres_url)
    
    # 2. Create tables in PostgreSQL (this requires models to be imported)
    print("Creating tables in PostgreSQL...")
    Base.metadata.create_all(bind=postgres_engine)
    
    # 3. Define the order of tables to migrate (respecting foreign keys)
    # Users must come first.
    tables = [
        "users",
        "otps",
        "goals",
        "budgets",
        "portfolio_assets",
        "transactions",
        "ai_advices"
    ]
    
    for table in tables:
        print(f"Migrating table: {table}...")
        try:
            df = pd.read_sql_table(table, con=sqlite_engine)
            if not df.empty:
                # Insert into postgres
                df.to_sql(table, con=postgres_engine, if_exists='append', index=False)
                print(f"[OK] Successfully migrated {len(df)} rows for {table}.")
            else:
                print(f"[!] Table {table} is empty, skipping.")
        except ValueError as e:
            # Table might not exist in SQLite yet
            print(f"[ERROR] Could not migrate {table}. Error: {e}")
            
    print("Migration completed successfully!")

if __name__ == "__main__":
    migrate()
