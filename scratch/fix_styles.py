import re

filepath = r"c:\Users\ritik\OneDrive\Documents\expense tracker\Expense-Manager-1\frontend\src\components\StockAnalysis.jsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Only replace in the sections that need it, keeping the top search bar intact.
# The `details` block starts here:
#       ) : details ? (
#         <div className="space-y-6 animate-fade-in">
parts = content.split(') : details ? (')

header_part = parts[0]
body_part = parts[1]

# Replacements in body_part
# border-white/5 -> border-gray-100
# bg-white/5 -> bg-gray-50
# text-white -> text-gray-900
# text-gray-300 -> text-gray-600
# text-gray-400 -> text-gray-500
# text-emerald-400 -> text-emerald-600
# text-emerald-500 -> text-emerald-600
# bg-emerald-500/10 -> bg-emerald-100
# group-hover:text-emerald-400 -> group-hover:text-emerald-600

body_part = body_part.replace('border-white/5', 'border-gray-100')
body_part = body_part.replace('border-white/10', 'border-gray-200')
body_part = body_part.replace('bg-white/5', 'bg-gray-50')
body_part = body_part.replace('bg-white/10', 'bg-gray-100')
body_part = body_part.replace('text-white', 'text-gray-900')
body_part = body_part.replace('text-gray-300', 'text-gray-600')
body_part = body_part.replace('text-gray-400', 'text-gray-500')
body_part = body_part.replace('text-emerald-400', 'text-emerald-600')
body_part = body_part.replace('text-emerald-500', 'text-emerald-600')
body_part = body_part.replace('bg-emerald-500/10', 'bg-emerald-100')
body_part = body_part.replace('group-hover:text-emerald-400', 'group-hover:text-emerald-600')

# For the AI Advisor part
body_part = body_part.replace('text-purple-400', 'text-purple-600')
body_part = body_part.replace('bg-purple-500/10', 'bg-purple-100')
body_part = body_part.replace('border-purple-500/20', 'border-purple-200')

# For the AreaChart Tooltip background
body_part = body_part.replace("backgroundColor: '#1F2937'", "backgroundColor: '#FFFFFF'")
body_part = body_part.replace("borderColor: '#374151'", "borderColor: '#E5E7EB'")
body_part = body_part.replace("color: '#F3F4F6'", "color: '#111827'")

# For the chart background
body_part = body_part.replace('bg-black/10', 'bg-gray-50')

# Fix watch list button (was text-white, it got replaced to text-gray-900, we want text-white back because it's a primary button)
body_part = body_part.replace('bg-emerald-600 hover:bg-emerald-500 text-gray-900', 'bg-emerald-600 hover:bg-emerald-500 text-white')
# Same for chart range active button
body_part = body_part.replace("bg-emerald-600 text-gray-900", "bg-emerald-600 text-white")

# Re-assemble
new_content = header_part + ') : details ? (' + body_part

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Styles updated successfully!")
