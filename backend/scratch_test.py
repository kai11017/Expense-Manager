import re

text1 = """
Date Transaction Details Type Amount
Jun 24, 2026
07:53 pm
Paid to YASH BHARATBHAI LIMBANI DEBIT ₹200
"""

text2 = """
Date Transaction Details Type Amount
Jun 24, 2026 Paid to YASH BHARATBHAI LIMBANI DEBIT ₹200
07:53 pm Transaction ID T260...
"""

pattern = r'([A-Z][a-z]{2}\s\d{1,2},\s\d{4})[\s\S]{0,50}?(Paid to|Received from|Mobile recharged)\s+(.*?)\s+(DEBIT|CREDIT)?\s*₹([\d,.]+)'

for text in [text1, text2]:
    print("---")
    for match in re.finditer(pattern, text, re.IGNORECASE):
        print(match.groups())

