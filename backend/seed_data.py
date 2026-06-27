import os
import sys
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random

# Add project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__))))

from app.database.connection import SessionLocal, Base, engine
from app.models.models import User, Transaction, PortfolioAsset, Goal, Budget
from app.auth.security import hash_password

def seed_db():
    db = SessionLocal()
    
    # 1. Clear existing tables to reset clean
    print("Recreating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    # 2. Create seed user
    print("Creating seed user...")
    hashed_pwd = hash_password("password123")
    user = User(
        email="demo@finpilot.com",
        name="Abhishek Sharma",
        hashed_password=hashed_pwd
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # 3. Create Budgets for standard categories
    print("Seeding monthly budgets...")
    categories = {
        "Food": 10000.0,
        "Rent": 20000.0,
        "Bills": 4000.0,
        "Health": 5000.0,
        "Learning": 3000.0,
        "Shopping": 8000.0,
        "Experiences": 10000.0,
        "Miscellaneous": 5000.0
    }
    
    # Seed budgets for the last 6 months + current month
    today = datetime.today()
    for i in range(6, -1, -1):
        month_dt = today - timedelta(days=i*30)
        month_str = month_dt.strftime("%Y-%m")
        for cat, amt in categories.items():
            # Add some slight variation to monthly budget goals
            variation = random.uniform(-500, 500)
            budget = Budget(
                user_id=user.id,
                category=cat,
                amount=round(amt + variation, 2),
                month=month_str
            )
            db.add(budget)
    db.commit()
    
    # 4. Seed 6 Months of Transaction History (Income & Expenses)
    print("Seeding transaction history (6 months)...")
    
    # Set dates back 6 months
    start_date = today - timedelta(days=180)
    
    # Standard values
    monthly_salary = 75000.0
    
    # Categories & Merchants
    merchants = {
        "Food": ["Zomato", "Swiggy", "Blinkit", "BigBasket", "McDonalds", "Starbucks", "Dhaba", "Organic Market"],
        "Rent": ["Housing Owner PG", "Rental Society"],
        "Bills": ["BESCOM Electricity", "BWSSB Water", "Airtel Broadband", "Jio Recharge", "HDFC Insurance"],
        "Health": ["Cult Fit Gym", "Optimum Nutrition Protein", "Apollo Pharmacy", "Practo Doctor Consultation"],
        "Learning": ["Udemy Course", "Coursera Certification", "Sapna Book House", "O'Reilly Subscription", "AWS Certification"],
        "Experiences": ["MakeMyTrip Booking", "Uber Ride", "Ola Cabs", "BookMyShow Movies", "National Park Volunteering", "Weekend Resort Trip"],
        "Shopping": ["Amazon Purchase", "Myntra Order", "Flipkart Sale", "Nike Store"],
        "Miscellaneous": ["Local Tea Vendor", "Laundry", "Pet Shop", "Gifts"]
    }
    
    payment_modes = ["UPI", "Credit Card", "Net Banking", "Cash"]
    
    current_date = start_date
    while current_date <= today:
        # 1. Monthly Income (on the 1st of every month)
        if current_date.day == 1:
            income_txn = Transaction(
                user_id=user.id,
                amount=monthly_salary,
                type="income",
                category="Salary",
                date=current_date.strftime("%Y-%m-%d"),
                merchant="TCS Tech Salary",
                payment_mode="Net Banking",
                notes="Monthly professional salary deposit.",
                is_life_portfolio=False,
                life_category=None
            )
            db.add(income_txn)
            
            # Rent expense (on the 3rd of every month)
            rent_txn = Transaction(
                user_id=user.id,
                amount=18000.0,
                type="expense",
                category="Rent",
                date=(current_date + timedelta(days=2)).strftime("%Y-%m-%d"),
                merchant=random.choice(merchants["Rent"]),
                payment_mode="Net Banking",
                notes="Monthly house rent",
                is_life_portfolio=False,
                life_category=None
            )
            db.add(rent_txn)
            
        # 2. Food expenses (2-3 times a week, steadily increasing to show trend alerts)
        # We increase the baseline average from 5,000 to 9,000 over 6 months to trigger the linear regression warnings!
        days_from_start = (current_date - start_date).days
        multiplier = 1.0 + (days_from_start / 180) * 0.40 # 40% inflation
        
        if random.random() < 0.35: # 35% chance every day
            amt = round(random.uniform(150, 800) * multiplier, 2)
            food_txn = Transaction(
                user_id=user.id,
                amount=amt,
                type="expense",
                category="Food",
                date=current_date.strftime("%Y-%m-%d"),
                merchant=random.choice(merchants["Food"]),
                payment_mode=random.choice(["UPI", "Cash"]),
                notes="Dinner / Groceries",
                is_life_portfolio=False,
                life_category=None
            )
            db.add(food_txn)
            
        # 3. Health & Fitness (1-2 times a month, marked as Life Portfolio)
        if current_date.day == 10:
            gym_txn = Transaction(
                user_id=user.id,
                amount=2500.0,
                type="expense",
                category="Health",
                date=current_date.strftime("%Y-%m-%d"),
                merchant="Cult Fit Gym",
                payment_mode="Credit Card",
                notes="Invested in wellness and gym access.",
                is_life_portfolio=True,
                life_category="Health"
            )
            db.add(gym_txn)
        if current_date.day == 24 and random.random() < 0.7:
            protein_txn = Transaction(
                user_id=user.id,
                amount=3500.0,
                type="expense",
                category="Health",
                date=current_date.strftime("%Y-%m-%d"),
                merchant="Optimum Nutrition",
                payment_mode="UPI",
                notes="Whey Protein supplement block",
                is_life_portfolio=True,
                life_category="Health"
            )
            db.add(protein_txn)
            
        # 4. Learning (1 time a month, marked as Life Portfolio)
        if current_date.day == 15:
            learn_txn = Transaction(
                user_id=user.id,
                amount=round(random.uniform(800, 2800), 2),
                type="expense",
                category="Learning",
                date=current_date.strftime("%Y-%m-%d"),
                merchant=random.choice(merchants["Learning"]),
                payment_mode="UPI",
                notes="Skills enhancement and book purchases.",
                is_life_portfolio=True,
                life_category="Learning"
            )
            db.add(learn_txn)
            
        # 5. Experiences / Travel (2-3 times a month)
        if current_date.day in [8, 22] and random.random() < 0.6:
            exp_txn = Transaction(
                user_id=user.id,
                amount=round(random.uniform(500, 4500), 2),
                type="expense",
                category="Experiences",
                date=current_date.strftime("%Y-%m-%d"),
                merchant=random.choice(merchants["Experiences"]),
                payment_mode="Credit Card",
                notes="Invested in personal relationships & experiences.",
                is_life_portfolio=True,
                life_category="Experiences"
            )
            db.add(exp_txn)
            
        # 6. Utilities/Bills
        if current_date.day == 5:
            bill_txn = Transaction(
                user_id=user.id,
                amount=round(random.uniform(1800, 3200), 2),
                type="expense",
                category="Bills",
                date=current_date.strftime("%Y-%m-%d"),
                merchant=random.choice(merchants["Bills"]),
                payment_mode="Net Banking",
                notes="Broadband + Electric Bill",
                is_life_portfolio=False,
                life_category=None
            )
            db.add(bill_txn)
            
        # 7. Shopping & Misc (occasionally)
        if random.random() < 0.08:
            shop_txn = Transaction(
                user_id=user.id,
                amount=round(random.uniform(1000, 6000), 2),
                type="expense",
                category="Shopping",
                date=current_date.strftime("%Y-%m-%d"),
                merchant=random.choice(merchants["Shopping"]),
                payment_mode="Credit Card",
                notes="Discretionary shopping items.",
                is_life_portfolio=False,
                life_category=None
            )
            db.add(shop_txn)
            
        current_date += timedelta(days=1)
        
    db.commit()
    
    # 5. Seed Portfolio Assets (Traditional Financial & Life Portfolio)
    print("Seeding portfolios...")
    assets = [
        # Traditional Stocks
        PortfolioAsset(user_id=user.id, name="Reliance Industries", type="Stock", purchase_price=2400.0, current_value=2950.0, quantity=15.0, purchase_date="2026-01-10", notes="Blue chip energy and telecom conglomerate."),
        PortfolioAsset(user_id=user.id, name="TCS Ltd", type="Stock", purchase_price=3600.0, current_value=3900.0, quantity=10.0, purchase_date="2026-02-15", notes="Top Indian IT service provider."),
        PortfolioAsset(user_id=user.id, name="HDFC Index Fund", type="Mutual Fund", purchase_price=100.0, current_value=114.5, quantity=250.0, purchase_date="2026-01-05", notes="SIP target Nifty 50 Tracker."),
        
        # Crypto
        PortfolioAsset(user_id=user.id, name="Bitcoin (BTC)", type="Crypto", purchase_price=58000.0, current_value=64200.0, quantity=0.15, purchase_date="2026-03-20", notes="Macro store of value."),
        
        # Gold
        PortfolioAsset(user_id=user.id, name="Sovereign Gold Bond", type="Gold", purchase_price=6200.0, current_value=7100.0, quantity=5.0, purchase_date="2026-01-12", notes="Inflation hedge portfolio buffer."),
        
        # FD
        PortfolioAsset(user_id=user.id, name="SBI Fixed Deposit", type="FD", purchase_price=50000.0, current_value=51800.0, quantity=1.0, purchase_date="2026-01-01", notes="Liquid bank yield."),
        
        # Life Portfolio Assets (accumulated historic purchases as structural capital value)
        PortfolioAsset(user_id=user.id, name="Gym Membership & Coaching", type="Health", purchase_price=15000.0, current_value=15000.0, quantity=1.0, purchase_date="2026-01-10", notes="Cult Fit Annual Pass. High cognitive return."),
        PortfolioAsset(user_id=user.id, name="Home Office Setup & Ergonomics", type="Health", purchase_price=25000.0, current_value=25000.0, quantity=1.0, purchase_date="2026-02-28", notes="Standing Desk & Ergo Chair for spine health and productivity."),
        
        PortfolioAsset(user_id=user.id, name="Full Stack Web Bootcamp", type="Learning", purchase_price=12000.0, current_value=12000.0, quantity=1.0, purchase_date="2026-03-01", notes="Enrolled on Udemy/Coursera. Expected return: Higher freelance rates."),
        PortfolioAsset(user_id=user.id, name="Technical Book Library", type="Learning", purchase_price=4500.0, current_value=4500.0, quantity=1.0, purchase_date="2026-04-10", notes="Collection of backend & system design references."),
        
        PortfolioAsset(user_id=user.id, name="Himalayan Trekking Experience", type="Experiences", purchase_price=18000.0, current_value=18000.0, quantity=1.0, purchase_date="2026-05-15", notes="5-Day Trek. Mental clarity & perspective compound asset."),
        
        PortfolioAsset(user_id=user.id, name="Emergency Cash Fund", type="Emergency Fund", purchase_price=60000.0, current_value=60000.0, quantity=1.0, purchase_date="2026-01-01", notes="Liquid capital safety net (covers ~1.5 months currently).")
    ]
    
    for a in assets:
        db.add(a)
    db.commit()
    
    # 6. Seed Goals
    print("Seeding financial and life goals...")
    goals = [
        Goal(user_id=user.id, name="Build 6-Month Emergency Fund", target_amount=180000.0, current_amount=60000.0, target_date="2026-12-31", category="Emergency Fund"),
        Goal(user_id=user.id, name="Complete System Design Masterclass", target_amount=15000.0, current_amount=5000.0, target_date="2026-08-30", category="Learning"),
        Goal(user_id=user.id, name="Kashmir Solo Trek Trip", target_amount=40000.0, current_amount=15000.0, target_date="2026-10-15", category="Experiences")
    ]
    for g in goals:
        db.add(g)
    db.commit()
    
    print("\nDatabase seeded successfully!")
    print(f"Login details:\nEmail: demo@finpilot.com\nPassword: password123")
    
    db.close()

if __name__ == "__main__":
    seed_db()
