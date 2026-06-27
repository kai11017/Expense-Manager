import pandas as pd
import io
import re
from typing import List, Dict, Any
from datetime import datetime

def clean_amount(val: Any) -> float:
    if pd.isna(val):
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    # Remove currency symbols and commas
    val_str = str(val).replace('₹', '').replace('$', '').replace(',', '').strip()
    try:
        return float(val_str)
    except ValueError:
        return 0.0

def parse_date(date_str: str) -> str:
    # Try different formats
    formats = [
        "%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%m/%d/%Y",
        "%d-%b-%Y", "%d-%b-%y", "%Y/%m/%d"
    ]
    date_str = str(date_str).strip()
    for fmt in formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue
    # Default to today if we cannot parse
    return datetime.today().strftime("%Y-%m-%d")

def parse_csv_statement(file_content: bytes) -> List[Dict[str, Any]]:
    # Read the file as a string
    try:
        # Try utf-8 first, fallback to latin-1
        try:
            content_str = file_content.decode('utf-8')
        except UnicodeDecodeError:
            content_str = file_content.decode('latin-1')
            
        # Create a StringIO
        df = pd.read_csv(io.StringIO(content_str))
        
        # Lowercase columns for easier match
        orig_cols = list(df.columns)
        cols = [c.lower().strip() for c in orig_cols]
        df.columns = cols
        
        # Find index columns
        date_col = next((c for c in cols if 'date' in c or 'dt' in c), None)
        desc_col = next((c for c in cols if 'merchant' in c or 'desc' in c or 'particular' in c or 'narrative' in c or 'detail' in c or 'payee' in c), None)
        amount_col = next((c for c in cols if 'amount' in c or 'amt' in c or 'value' in c or 'debit' in c or 'credit' in c), None)
        mode_col = next((c for c in cols if 'mode' in c or 'payment' in c or 'type' in c), None)
        
        # Fallbacks if columns aren't named standardly
        if not date_col and len(cols) > 0:
            date_col = cols[0]
        if not desc_col and len(cols) > 1:
            desc_col = cols[1]
        if not amount_col and len(cols) > 2:
            amount_col = cols[2]
            
        parsed_transactions = []
        
        # Standard list of categories for automatic heuristic mapping
        categories = {
            "food": ["restaurant", "swiggy", "zomato", "cafe", "grocery", "diner", "supermarket", "blinkit", "instamart"],
            "rent": ["rent", "landlord", "pg", "society"],
            "learning": ["book", "course", "udemy", "coursera", "conference", "tuition", "certificat", "skills"],
            "health": ["gym", "protein", "pharmacy", "medical", "doctor", "hospital", "supplement", "fit", "sports"],
            "experiences": ["travel", "trip", "hotel", "flight", "uber", "ola", "irctc", "movie", "ticket", "concert", "volunteering"],
            "bills": ["electricity", "water", "recharge", "jio", "airtel", "broadband", "gas", "insurance"],
            "shopping": ["amazon", "flipkart", "clothing", "myntra", "mall"],
            "investment": ["mutual fund", "zerodha", "groww", "stock", "crypto", "sip", "gold"]
        }
        
        for idx, row in df.iterrows():
            # Skip if date or amount is missing
            if pd.isna(row.get(date_col)) or pd.isna(row.get(amount_col)):
                continue
                
            raw_amt = clean_amount(row.get(amount_col))
            if raw_amt == 0.0:
                continue
                
            # Classify income vs expense
            txn_type = "expense"
            amt = abs(raw_amt)
            
            # Check if there is separate debit/credit column
            if 'debit' in row and not pd.isna(row['debit']) and clean_amount(row['debit']) > 0:
                txn_type = "expense"
                amt = clean_amount(row['debit'])
            elif 'credit' in row and not pd.isna(row['credit']) and clean_amount(row['credit']) > 0:
                txn_type = "income"
                amt = clean_amount(row['credit'])
            elif raw_amt > 0 and 'income' in str(row.get(mode_col, '')).lower():
                txn_type = "income"
            
            desc = str(row.get(desc_col, "Unknown Merchant")).strip()
            date_val = parse_date(str(row.get(date_col)))
            
            # Match Category heuristics
            matched_category = "Miscellaneous"
            desc_lower = desc.lower()
            
            for cat, keywords in categories.items():
                if any(kw in desc_lower for kw in keywords):
                    matched_category = cat.capitalize()
                    break
            
            # Check if it should be marked as Life Portfolio
            is_life = False
            life_cat = None
            if matched_category in ["Health", "Learning", "Experiences"]:
                is_life = True
                life_cat = matched_category
            
            # Deduce payment mode
            mode = "UPI"
            if mode_col and not pd.isna(row.get(mode_col)):
                mode = str(row.get(mode_col)).strip()
            else:
                if "upi" in desc_lower or "transfer" in desc_lower:
                    mode = "UPI"
                elif "card" in desc_lower or "visa" in desc_lower or "pos" in desc_lower:
                    mode = "Credit Card"
                elif "cash" in desc_lower:
                    mode = "Cash"
                elif "neft" in desc_lower or "rtgs" in desc_lower or "imps" in desc_lower:
                    mode = "Net Banking"
            
            parsed_transactions.append({
                "amount": amt,
                "type": txn_type,
                "category": matched_category,
                "date": date_val,
                "merchant": desc,
                "payment_mode": mode,
                "notes": f"Imported transaction: {desc}",
                "is_life_portfolio": is_life,
                "life_category": life_cat
            })
            
        return parsed_transactions
    except Exception as e:
        print("Error parsing CSV:", e)
        return []

def _process_dataframe(df: pd.DataFrame) -> List[Dict[str, Any]]:
    # Lowercase columns for easier match
    orig_cols = list(df.columns)
    cols = [str(c).lower().strip() for c in orig_cols]
    df.columns = cols
    
    # Find index columns
    date_col = next((c for c in cols if 'date' in c or 'dt' in c), None)
    desc_col = next((c for c in cols if 'merchant' in c or 'desc' in c or 'particular' in c or 'narrative' in c or 'detail' in c or 'payee' in c), None)
    amount_col = next((c for c in cols if 'amount' in c or 'amt' in c or 'value' in c or 'debit' in c or 'credit' in c), None)
    mode_col = next((c for c in cols if 'mode' in c or 'payment' in c or 'type' in c), None)
    
    # Fallbacks if columns aren't named standardly
    if not date_col and len(cols) > 0:
        date_col = cols[0]
    if not desc_col and len(cols) > 1:
        desc_col = cols[1]
    if not amount_col and len(cols) > 2:
        amount_col = cols[2]
        
    parsed_transactions = []
    
    # Standard list of categories for automatic heuristic mapping
    categories = {
        "food": ["restaurant", "swiggy", "zomato", "cafe", "grocery", "diner", "supermarket", "blinkit", "instamart", "vada", "paan", "soda", "idli"],
        "rent": ["rent", "landlord", "pg", "society"],
        "learning": ["book", "course", "udemy", "coursera", "conference", "tuition", "certificat", "skills"],
        "health": ["gym", "protein", "pharmacy", "medical", "doctor", "hospital", "supplement", "fit", "sports"],
        "experiences": ["travel", "trip", "hotel", "flight", "uber", "ola", "irctc", "movie", "ticket", "concert", "volunteering", "railway", "train"],
        "bills": ["electricity", "water", "recharge", "jio", "airtel", "broadband", "gas", "insurance", "recharged"],
        "shopping": ["amazon", "flipkart", "clothing", "myntra", "mall", "meesho"],
        "investment": ["mutual fund", "zerodha", "groww", "stock", "crypto", "sip", "gold"]
    }
    
    for idx, row in df.iterrows():
        # Skip if date or amount is missing
        if pd.isna(row.get(date_col)) or pd.isna(row.get(amount_col)):
            continue
            
        raw_amt = clean_amount(row.get(amount_col))
        if raw_amt == 0.0:
            continue
            
        # Classify income vs expense
        txn_type = "expense"
        amt = abs(raw_amt)
        
        # Check if there is separate debit/credit column
        if 'debit' in row and not pd.isna(row['debit']) and clean_amount(row['debit']) > 0:
            txn_type = "expense"
            amt = clean_amount(row['debit'])
        elif 'credit' in row and not pd.isna(row['credit']) and clean_amount(row['credit']) > 0:
            txn_type = "income"
            amt = clean_amount(row['credit'])
        elif raw_amt > 0 and 'income' in str(row.get(mode_col, '')).lower():
            txn_type = "income"
        
        desc = str(row.get(desc_col, "Unknown Merchant")).strip()
        date_val = parse_date(str(row.get(date_col)))
        
        # Match Category heuristics
        matched_category = "Miscellaneous"
        desc_lower = desc.lower()
        
        for cat, keywords in categories.items():
            if any(kw in desc_lower for kw in keywords):
                matched_category = cat.capitalize()
                break
        
        # Check if it should be marked as Life Portfolio
        is_life = False
        life_cat = None
        if matched_category in ["Health", "Learning", "Experiences"]:
            is_life = True
            life_cat = matched_category
        
        # Deduce payment mode
        mode = "UPI"
        if mode_col and not pd.isna(row.get(mode_col)):
            mode = str(row.get(mode_col)).strip()
        else:
            if "upi" in desc_lower or "transfer" in desc_lower:
                mode = "UPI"
            elif "card" in desc_lower or "visa" in desc_lower or "pos" in desc_lower:
                mode = "Credit Card"
            elif "cash" in desc_lower:
                mode = "Cash"
            elif "neft" in desc_lower or "rtgs" in desc_lower or "imps" in desc_lower:
                mode = "Net Banking"
        
        parsed_transactions.append({
            "amount": amt,
            "type": txn_type,
            "category": matched_category,
            "date": date_val,
            "merchant": desc,
            "payment_mode": mode,
            "notes": f"Imported transaction: {desc}",
            "is_life_portfolio": is_life,
            "life_category": life_cat
        })
        
    return parsed_transactions

def parse_excel_statement(file_content: bytes) -> List[Dict[str, Any]]:
    try:
        df = pd.read_excel(io.BytesIO(file_content))
        return _process_dataframe(df)
    except Exception as e:
        print("Error parsing Excel:", e)
        return []

def parse_pdf_statement(file_content: bytes) -> List[Dict[str, Any]]:
    import pdfplumber
    parsed_transactions = []
    
    categories = {
        "food": ["restaurant", "swiggy", "zomato", "cafe", "grocery", "diner", "supermarket", "blinkit", "instamart", "vada", "paan", "soda", "idli"],
        "rent": ["rent", "landlord", "pg", "society"],
        "learning": ["book", "course", "udemy", "coursera", "conference", "tuition", "certificat", "skills"],
        "health": ["gym", "protein", "pharmacy", "medical", "doctor", "hospital", "supplement", "fit", "sports"],
        "experiences": ["travel", "trip", "hotel", "flight", "uber", "ola", "irctc", "movie", "ticket", "concert", "volunteering", "railway", "train"],
        "bills": ["electricity", "water", "recharge", "jio", "airtel", "broadband", "gas", "insurance", "recharged"],
        "shopping": ["amazon", "flipkart", "clothing", "myntra", "mall", "meesho"],
        "investment": ["mutual fund", "zerodha", "groww", "stock", "crypto", "sip", "gold"]
    }
    
    try:
        with pdfplumber.open(io.BytesIO(file_content)) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        
        # Robust regex approach for PhonePe style text block extraction
        pattern = r'([A-Z][a-z]{2}\s\d{1,2},\s\d{4})[\s\S]{0,50}?(Paid to|Received from|Mobile recharged)\s+(.*?)\s+(DEBIT|CREDIT)?\s*₹([\d,.]+)'
        
        for match in re.finditer(pattern, text, re.IGNORECASE):
            date_str = match.group(1).strip()
            action = match.group(2).strip()
            merchant = match.group(3).strip()
            type_indicator = match.group(4)
            amount_str = match.group(5)
            
            current_date = parse_date(date_str)
            
            if current_date:
                
                amount = clean_amount(amount_str)
                
                if type_indicator:
                    txn_type = "income" if type_indicator.upper() == "CREDIT" else "expense"
                else:
                    txn_type = "income" if "received" in action.lower() else "expense"
                    
                merchant = merchant.replace("DEBIT", "").replace("CREDIT", "").strip()
                
                # Categorize
                matched_category = "Miscellaneous"
                desc_lower = merchant.lower()
                for cat, keywords in categories.items():
                    if any(kw in desc_lower for kw in keywords):
                        matched_category = cat.capitalize()
                        break
                        
                is_life = False
                life_cat = None
                if matched_category in ["Health", "Learning", "Experiences"]:
                    is_life = True
                    life_cat = matched_category
                    
                parsed_transactions.append({
                    "amount": amount,
                    "type": txn_type,
                    "category": matched_category,
                    "date": current_date,
                    "merchant": merchant,
                    "payment_mode": "UPI", # Defaulting to UPI for PhonePe statements
                    "notes": f"PDF Import: {action} {merchant}",
                    "is_life_portfolio": is_life,
                    "life_category": life_cat
                })
                
        return parsed_transactions
    except Exception as e:
        print("Error parsing PDF:", e)
        return []
