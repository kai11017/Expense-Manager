import sys
import os

# Add the backend path so we can import the module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.parser_service import parse_pdf_statement

pdf_path = r"C:\Users\ritik\.gemini\antigravity-ide\brain\6543ff53-fc97-4b35-b2c5-c330d76236b9\media__1782528282532.pdf"

if not os.path.exists(pdf_path):
    print("PDF not found at:", pdf_path)
else:
    with open(pdf_path, "rb") as f:
        file_bytes = f.read()
        
    print("Parsing PDF...")
    transactions = parse_pdf_statement(file_bytes)
    
    if not transactions:
        print("No transactions found or parser returned empty list!")
    else:
        print(f"Success! Extracted {len(transactions)} transactions.")
        for i, txn in enumerate(transactions):
            print(f"{i+1}. Date: {txn['date']} | {txn['type'].upper()} | {txn['category']} | {txn['merchant']} | Rs {txn['amount']}")
