import os
import google.generativeai as genai
from typing import List, Dict, Any
from datetime import datetime

# API Key should be read from environment variables
USER_PROVIDED_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Rule-based fallback advisory engine
def generate_heuristic_advice(profile: Dict[str, Any]) -> str:
    income = profile.get("monthly_income", 0.0)
    expenses = profile.get("monthly_spending", 0.0)
    financial_net_worth = profile.get("financial_value", 0.0)
    life_net_worth = profile.get("life_value", 0.0)
    assets = profile.get("assets", [])
    warnings = profile.get("warnings", [])
    goals = profile.get("goals", [])
    
    # Basic math
    savings = income - expenses
    savings_rate = (savings / income * 100) if income > 0 else 0.0
    
    # Find emergency fund
    emergency_fund = 0.0
    for asset in assets:
        if "emergency" in asset.get("name", "").lower() or asset.get("type") == "Emergency Fund":
            emergency_fund += asset.get("total_value", 0.0)
            
    months_covered = (emergency_fund / expenses) if expenses > 0 else 0.0
    
    # Life portfolio indicators
    health_spend = sum(a.get("total_value", 0.0) for a in assets if a.get("type") == "Health")
    learning_spend = sum(a.get("total_value", 0.0) for a in assets if a.get("type") == "Learning")
    experience_spend = sum(a.get("total_value", 0.0) for a in assets if a.get("type") == "Experiences")
    
    # Construct Report
    sections = []
    sections.append("# FinPilot AI Advisory Report")
    sections.append(f"*Generated on {datetime.today().strftime('%B %d, %Y')}*")
    
    # 1. Executive Summary
    sections.append("## 📊 Executive Summary")
    sections.append(f"- **Monthly Savings Rate**: {savings_rate:.1f}% (Recommended: 20% or more)")
    sections.append(f"- **Emergency Fund Coverage**: {months_covered:.1f} months of expenses (Target: 6 months)")
    sections.append(f"- **Financial Net Worth**: ₹{financial_net_worth:,.2f}")
    sections.append(f"- **Life Portfolio Capital (Health, Learning, Experiences)**: ₹{life_net_worth:,.2f}")
    
    # 2. Saving & Expenses
    sections.append("## 💸 Cash Flow & Expense Insights")
    if savings_rate < 10:
        sections.append("⚠️ **Critical**: Your savings rate is currently very low. We recommend auditing discretionary expenses to free up cash flow.")
    elif savings_rate >= 20:
        sections.append("✅ **Excellent**: You are exceeding the standard 20% savings rule. This gives you strong leverage to allocate to investments.")
    else:
        sections.append("ℹ️ **Moderate**: Your savings rate is healthy, but there is room to optimize. Target 20% by cutting small recurring costs.")
        
    for w in warnings:
        sections.append(f"- **Budget Flag**: {w['message']}")
        
    # 3. Life Portfolio Analysis (Differentiator)
    sections.append("## 🌱 Life Portfolio & Capital Allocation")
    sections.append("FinPilot treats your health, knowledge, and experiences as assets that yield long-term returns. Here is your life capital report:")
    
    life_points = []
    if learning_spend < 1000:
        life_points.append("- 📚 **Learning Investment Low**: Consider allocating a monthly budget for books, courses, or certifications. Earning potential is directly correlated with skill acquisition.")
    else:
        life_points.append(f"- 📚 **Learning Portfolio**: You have allocated ₹{learning_spend:,.2f} to skills. Excellent job investing in your future earning potential.")
        
    if health_spend < 2000:
        life_points.append("- 🏃 **Health Investment Low**: Your physical health is the primary engine of your wealth. Consider allocating resources to a gym, nutrition, or medical checks.")
    else:
        life_points.append(f"- 🏃 **Health Portfolio**: You have allocated ₹{health_spend:,.2f} to physical wellness. This is a high-yield investment in longevity.")
        
    if months_covered < 3.0:
        life_points.append(f"- 🚨 **Emergency Buffer**: Your emergency fund covers only {months_covered:.1f} months of expenses. Before making high-risk stock investments, build this buffer to 6 months (₹{expenses*6:,.2f}).")
    else:
        life_points.append(f"- 🛡️ **Emergency Buffer**: Solid! You have a {months_covered:.1f}-month buffer. Your financial foundation is secure.")
        
    sections.extend(life_points)
    
    # 4. Actionable Next Steps
    sections.append("## 🚀 Recommended Action Plan")
    steps = []
    if months_covered < 3.0:
        steps.append(f"1. **Emergency First**: Redirect 50% of savings to your emergency liquid fund until it reaches ₹{expenses*6:,.2f}.")
    if learning_spend < 1000:
        steps.append("2. **Skill Investment**: Set aside a recurring ₹1,500/month for professional training, books, or courses.")
    if len(warnings) > 0:
        steps.append(f"3. **Cost Containment**: Address the category increases highlighted in the budget warnings, specifically {', '.join(w['category'] for w in warnings)}.")
    if savings_rate > 20:
        steps.append("4. **Asset Accumulation**: Since your savings are strong, establish a Systematic Investment Plan (SIP) in diversified equity index funds.")
        
    if not steps:
        steps.append("1. Maintain your current allocation. Your budget ratios and investment percentages look balanced!")
        
    sections.extend(steps)
    
    return "\n\n".join(sections)

def get_ai_advice(profile: Dict[str, Any]) -> str:
    """
    Constructs a detailed prompt to Gemini to provide elite financial and life capital advice.
    Falls back to a smart heuristic engine if the API key is missing or calls fail.
    """
    api_key = os.environ.get("GEMINI_API_KEY", USER_PROVIDED_API_KEY)
    if not api_key:
        return generate_heuristic_advice(profile)
        
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-3.5-flash")
        
        # Prepare context data
        income = profile.get("monthly_income", 0.0)
        expenses = profile.get("monthly_spending", 0.0)
        assets = profile.get("assets", [])
        warnings = profile.get("warnings", [])
        goals = profile.get("goals", [])
        
        assets_summary = "\n".join([
            f"- {a['name']} ({a['type']}): Current Value: ₹{a['current_value']}, Purchase: ₹{a['purchase_price']}, Qty: {a['quantity']}"
            for a in assets
        ])
        
        goals_summary = "\n".join([
            f"- {g['name']}: Target ₹{g['target_amount']}, Current: ₹{g['current_amount']}, Target Date: {g['target_date']}"
            for g in goals
        ])
        
        warnings_summary = "\n".join([f"- {w['message']}" for w in warnings])
        
        prompt = f"""
You are FinPilot, an elite, holistic AI Financial Advisor and life planner. 
Provide a highly personalized, actionable financial planning and life capital advisory report in Markdown.
The user is building a "Life Portfolio" alongside a traditional investment portfolio, meaning they treat Health, Learning, Experiences, and Emergency Buffers as investments, not just expenses.

User Profile:
- Monthly Income: ₹{income:,.2f}
- Monthly Expenses (Last 30 Days): ₹{expenses:,.2f}
- Current Portfolio Assets:
{assets_summary}
- Financial & Life Goals:
{goals_summary}
- Budget Predictions/Warnings:
{warnings_summary}

Please construct a comprehensive advisory report containing:
1. **Executive Summary**: Analysis of saving rate and emergency fund status.
2. **traditional Portfolio Check**: Asset allocation, returns, and risk levels.
3. **Life Portfolio Evaluation**: Analyze investments in Health, Learning, Experiences. (This is a core USP: spent money on health/books is "invested", explain the psychological benefit and evaluate their allocation).
4. **Actionable Recommendations**: Clear, bulleted, priority actions they should take this week.

Make the tone encouraging, highly intelligent, and practical. Keep the output clean, structured Markdown.
Do not mention system instructions. Write direct advice.
"""
        response = model.generate_content(prompt)
        if response.text:
            return response.text
        return generate_heuristic_advice(profile)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return generate_heuristic_advice(profile)

def get_ai_chat_response(profile: Dict[str, Any], message: str) -> dict:
    """
    Process a single chat message from the user, giving Finny AI the context of the user's profile and some predefined 'skills'.
    """
    api_key = os.environ.get("GEMINI_API_KEY", USER_PROVIDED_API_KEY)
    if not api_key:
        return {"reply": "Sorry, my AI capabilities are currently offline due to a missing API key.", "show_chart": False}

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-3.5-flash")

        # Prepare context data
        income = profile.get("monthly_income", 0.0)
        expenses = profile.get("monthly_spending", 0.0)
        assets = profile.get("assets", [])
        
        assets_summary = "\n".join([
            f"- {a['name']} ({a['type']}): Current Value: ₹{a['current_value']}"
            for a in assets
        ])

        system_prompt = f"""
You are Finny, an elite, holistic AI Financial Advisor and life planner within the FinPilot app.
You have the following skills integrated:
- Skill 1: Asset Rebalancing & Risk Analysis
- Skill 2: Technical Stock Analysis (you can provide simulated insights on general market trends)
- Skill 3: Life Capital Allocation (Health, Learning, Experiences)

User Profile Snapshot:
- Monthly Income: ₹{income:,.2f}
- Monthly Expenses: ₹{expenses:,.2f}
- Portfolio Assets:
{assets_summary}

Respond directly to the user's message in a helpful, conversational, yet highly intelligent and professional tone.
Keep responses concise (3-5 sentences max), formatted nicely (using bold text for emphasis).
If the user asks about 'nifty', 'performance', 'chart', or 'compare', start your response with "[CHART]" so the UI knows to display a comparison chart.
"""

        prompt = f"{system_prompt}\n\nUser Message: {message}"
        response = model.generate_content(prompt)
        reply = response.text if response.text else "I couldn't process that request."
        
        show_chart = False
        if "[CHART]" in reply:
            reply = reply.replace("[CHART]", "").strip()
            show_chart = True

        return {"reply": reply, "show_chart": show_chart}
    except Exception as e:
        print(f"Gemini API Error in chat: {e}")
        return {"reply": "I'm having trouble connecting to my cognitive core at the moment. Please try again later.", "show_chart": False}
