from typing import List, Dict, Any
import random
import json
import os
from datetime import datetime, timedelta
import google.generativeai as genai

def get_personalized_news(assets: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Generates customized, premium financial and life news based on the user's specific assets using Gemini AI.
    Falls back to templates if AI generation fails.
    """
    today = datetime.today()
    news_items = []
    
    # Try AI generation first
    try:
        api_key = os.getenv("GEMINI_API_KEY", "")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-3.5-flash")
        
        asset_names = [a.get("name", "") for a in assets if a.get("name")]
        asset_str = ", ".join(asset_names) if asset_names else "General Market, Indian Equities"
        
        prompt = f"""
        You are a top financial news aggregator. The user has the following assets in their portfolio: {asset_str}.
        Generate 6 highly relevant, realistic, and up-to-date news headlines and short summaries related to these specific assets or their sectors.
        Output the result STRICTLY as a JSON array of objects with the following keys:
        - "title": (string)
        - "summary": (string)
        - "source": (string, e.g., 'Economic Times', 'Reuters', 'Bloomberg')
        - "sentiment": (string, 'positive', 'negative', or 'neutral')
        - "relevant_asset": (string, the name of the matching asset from the user's list)
        - "published_at": (string, formatted as 'YYYY-MM-DD HH:MM', use a recent date within the last 48 hours)
        
        Do not include any other text, markdown formatting (like ```json), or explanations. ONLY return the JSON array.
        """
        
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Clean up any markdown blocks if the model accidentally includes them
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        ai_news = json.loads(response_text.strip())
        
        if isinstance(ai_news, list) and len(ai_news) > 0:
            return ai_news
    except Exception as e:
        print(f"Failed to generate AI news: {e}")
        # Fall back to template-based news below

    # Base news templates
    templates = {
        "Stock": [
            {
                "title": "{name} Shares Surge Following Strong Quarterly Earnings Report",
                "summary": "Investors react positively as {name} reports a 14% increase in year-over-year revenue, driven by robust performance in its core segments.",
                "source": "MarketWatch",
                "sentiment": "positive"
            },
            {
                "title": "Analyst Upgrades {name} to 'Strong Buy' Citing Long-Term Growth Catalyst",
                "summary": "Leading equity research firms have adjusted their price targets for {name}, highlighting strategic expansion plans and market leadership.",
                "source": "Bloomberg",
                "sentiment": "positive"
            },
            {
                "title": "{name} Announces Strategic Investment in Artificial Intelligence Operations",
                "summary": "In a bid to streamline efficiency and launch smart features, {name} has pledged ₹500 crores to deploy AI agents across their enterprise workflow.",
                "source": "TechCrunch",
                "sentiment": "positive"
            }
        ],
        "Crypto": [
            {
                "title": "Crypto Market Analysis: {name} Gains Momentum Amid Institutional Inflow",
                "summary": "Major liquid funds are increasing allocations in {name}, leading to a price breakout and testing key resistance levels.",
                "source": "CoinDesk",
                "sentiment": "positive"
            },
            {
                "title": "Regulatory Clarity for {name} Boosts Investor Confidence",
                "summary": "Legislative panels have proposed a unified regulatory framework that favors decentralized assets, raising liquidity for {name}.",
                "source": "Reuters",
                "sentiment": "positive"
            }
        ],
        "Gold": [
            {
                "title": "Gold Prices Climb as Inflation Fears Drive Safe-Haven Demand",
                "summary": "Spot gold rises as central banks continue to accumulate bullion as a structural hedge against global currency volatility.",
                "source": "Kitco News",
                "sentiment": "positive"
            },
            {
                "title": "Gold ETF Inflows Hit 6-Month High Amid Market Volatility",
                "summary": "Retail and institutional accounts are shifting capital to gold backing as equity markets experience short-term consolidation.",
                "source": "Financial Times",
                "sentiment": "positive"
            }
        ],
        "Mutual Fund": [
            {
                "title": "Mutual Funds Report High Inflow via SIP Allocations",
                "summary": "Systematic Investment Plans hit record numbers this month. Fund managers are buying index underlyings and blue-chip equities.",
                "source": "MoneyControl",
                "sentiment": "positive"
            }
        ],
        "Health": [
            {
                "title": "The ROI of Wellness: How Fitness Compounds Your Career Focus",
                "summary": "Neuroscientific studies prove regular cardio and strength training increase prefrontal cortex blood flow, improving productivity by up to 23%.",
                "source": "Harvard Health Review",
                "sentiment": "positive"
            },
            {
                "title": "Optimal Sleep Hygiene: The Secret Asset of High-Performance Founders",
                "summary": "Getting 7.5 hours of sleep with regular REM cycles reduces stress hormones and increases cognitive decision-making capabilities.",
                "source": "Nature Science",
                "sentiment": "positive"
            }
        ],
        "Learning": [
            {
                "title": "The Half-Life of Skills is Shrinking: The Case for Continuous Learning",
                "summary": "Technological shifts require professionals to upskill every 18 months. Certificates and courses in AI and data analysis yield the highest career premium.",
                "source": "Forbes Education",
                "sentiment": "positive"
            },
            {
                "title": "Earning Potential Increases by 30% After Technical Upskilling",
                "summary": "Survey shows employees who invested ₹15,000+ per year in books and credentials experienced much higher promotion rates and salary bumps.",
                "source": "Wall Street Journal",
                "sentiment": "positive"
            }
        ],
        "Experiences": [
            {
                "title": "Psychology of Experiences: Why Travel Yields More Happiness Than Purchases",
                "summary": "Behavioral economics studies reveal that memories from trips and experiences have a compounding emotional return, unlike material goods which decay.",
                "source": "Psychology Today",
                "sentiment": "positive"
            }
        ]
    }
    
    # Fallback/General news
    general_news = [
        {
            "title": "Nifty Reaches New Highs as Domestic Capital Floods Markets",
            "summary": "Indian markets show resilience as retail participation surges, offsetting foreign outflows and supporting valuations.",
            "source": "Economic Times",
            "sentiment": "positive"
        },
        {
            "title": "Personal Finance Rules Rewritten: The Move to Life Portfolios",
            "summary": "Modern wealth managers are encouraging clients to track physical and mental capital as assets, creating a balanced, high-yield lifestyle.",
            "source": "Business Standard",
            "sentiment": "positive"
        }
    ]
    
    # Process assets to generate news
    seen_titles = set()
    
    for asset in assets:
        t_type = asset.get("type")
        name = asset.get("name")
        
        # Determine templates key
        key = None
        if t_type in templates:
            key = t_type
        elif t_type in ["Stock", "Mutual Fund", "Gold", "FD", "Crypto", "Bonds", "Real Estate", "PPF", "EPF"]:
            if "gold" in name.lower():
                key = "Gold"
            elif "crypto" in name.lower() or "btc" in name.lower() or "eth" in name.lower():
                key = "Crypto"
            elif t_type in ["Mutual Fund", "FD", "PPF", "EPF"]:
                key = "Mutual Fund"
            else:
                key = "Stock"
        
        if key and key in templates:
            selected_templates = templates[key]
            for temp in selected_templates:
                title = temp["title"].format(name=name)
                summary = temp["summary"].format(name=name)
                
                if title not in seen_titles:
                    seen_titles.add(title)
                    # Randomize date in last 3 days
                    days_ago = random.randint(0, 2)
                    pub_date = (today - timedelta(days=days_ago)).strftime("%Y-%m-%d %H:%M")
                    
                    news_items.append({
                        "title": title,
                        "summary": summary,
                        "source": temp["source"],
                        "sentiment": temp["sentiment"],
                        "published_at": pub_date,
                        "relevant_asset": name
                    })
                    
    # Add general news to make sure we always have enough items
    for item in general_news:
        if item["title"] not in seen_titles:
            seen_titles.add(item["title"])
            days_ago = random.randint(0, 1)
            pub_date = (today - timedelta(days=days_ago)).strftime("%Y-%m-%d %H:%M")
            news_items.append({
                "title": item["title"],
                "summary": item["summary"],
                "source": item["source"],
                "sentiment": item["sentiment"],
                "published_at": pub_date,
                "relevant_asset": "Market"
            })
            
    # Sort by date
    news_items.sort(key=lambda x: x["published_at"], reverse=True)
    return news_items
