# FinPilot Expense & Portfolio Tracker - Project Details

## 🛠️ Tools & Technologies Used

### Frontend
- **React 19**: Core UI library for building the user interface.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for rapid and responsive UI styling.
- **Recharts**: Charting library used for rendering financial data visualizations and portfolio allocations.
- **Lucide React**: Vector icon library for modern UI iconography.
- **React Joyride**: Library for creating guided user tours (onboarding).
- **Google OAuth & JWT Decode**: Used for handling user authentication via Google and decoding JSON Web Tokens.

### Backend
- **FastAPI**: High-performance Python web framework for building the RESTful API.
- **Uvicorn**: ASGI web server used to run the FastAPI application.
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapper (ORM) for interacting with the database.
- **SQLite**: Local relational database used for data persistence.
- **Pydantic**: Used for strict data validation, serialization, and deserialization using Python type annotations.
- **Google Generative AI (Gemini API)**: Powers the AI Advisor and personalized news generation by analyzing the user's financial profile.
- **Pandas & NumPy**: Utilized for robust data manipulation and analytical calculations.
- **Pdfplumber & Openpyxl**: Tools for parsing and extracting data from bank statements (PDFs and Excel files).

---

## 🔄 Project Workflow & Architecture

1. **Authentication Flow**
   - Users can authenticate using a standard Email/Password combination or via Google OAuth.
   - The backend validates the credentials and returns a secure JWT (JSON Web Token).
   - The frontend stores this token and attaches it as a Bearer token in the header of subsequent API requests.
   - OTP verification is integrated for new user signups and password resets.

2. **State Management & API Communication**
   - The frontend relies on React Context (`AppContext.jsx`) for global state management.
   - When the user logs in or the active tab changes, `AppContext` automatically triggers `refreshData()` to fetch the latest summary, transactions, portfolio assets, budgets, and news from the backend endpoints.

3. **AI Generation Workflow**
   - **Personalized News**: The frontend requests news from the `/api/news` endpoint. The backend uses the `news_service.py` to prompt the Gemini API with the user's active portfolio assets, generating a curated list of financial news. If the API fails, it falls back to a curated template list.
   - **AI Advisor**: Evaluates the user's spending habits (transactions) and investments (portfolio), securely sending summarized numerical data to Gemini to formulate actionable financial insights.

4. **Statement Parsing Workflow**
   - Users can upload bank statements. The backend uses `pdfplumber` or `pandas` (for CSV/Excel) to extract text, identify transactions, and automatically categorize them before inserting them into the database.

---

## 🗄️ Database Relations (Schema)

The database schema is heavily normalized around the central `User` entity. 

- **User (`users`)**
  - **Attributes**: `id`, `email`, `name`, `hashed_password`, `auth_provider`, `has_completed_tour`.
  - **Relations**: 1-to-Many relationships with `Transaction`, `PortfolioAsset`, `Budget`, `Goal`, and `AIAdvice`.

- **Transaction (`transactions`)**
  - **Attributes**: `id`, `amount`, `type` (income/expense), `category`, `date`, `merchant`, `payment_mode`.
  - **Relations**: Belongs to `User` via `user_id`.

- **PortfolioAsset (`portfolio_assets`)**
  - **Attributes**: `id`, `name`, `type` (Stock, Crypto, Real Estate, etc.), `purchase_price`, `current_value`, `quantity`, `symbol`, `exchange`.
  - **Relations**: Belongs to `User` via `user_id`.

- **Budget (`budgets`)**
  - **Attributes**: `id`, `category`, `amount`, `month` (YYYY-MM).
  - **Relations**: Belongs to `User` via `user_id`.

- **Goal (`goals`)**
  - **Attributes**: `id`, `name`, `target_amount`, `current_amount`, `target_date`, `category`.
  - **Relations**: Belongs to `User` via `user_id`.

- **AIAdvice (`ai_advices`)**
  - **Attributes**: `id`, `advice_text`, `created_at`.
  - **Relations**: Belongs to `User` via `user_id`.

- **OTP (`otps`)**
  - **Attributes**: `id`, `email`, `otp_code`, `type` (signup/reset), `expires_at`, `is_used`.
  - **Relations**: Independent table used strictly for authentication workflows.
