from typing import Dict, List, Tuple, Any
from collections import defaultdict
from datetime import datetime

def calculate_linear_regression(points: List[float]) -> Tuple[float, float]:
    """
    Fits y = mx + c on a list of numerical values representing sequence of monthly values.
    Returns (slope_m, intercept_c).
    """
    n = len(points)
    if n == 0:
        return 0.0, 0.0
    if n == 1:
        return 0.0, points[0]
        
    x = list(range(n))
    y = points
    
    sum_x = sum(x)
    sum_y = sum(y)
    sum_xx = sum(xi * xi for xi in x)
    sum_xy = sum(xi * yi for xi, yi in zip(x, y))
    
    denominator = (n * sum_xx) - (sum_x * sum_x)
    if denominator == 0:
        return 0.0, sum_y / n
        
    m = (n * sum_xy - sum_x * sum_y) / denominator
    c = (sum_y - m * sum_x) / n
    return m, c

def get_predictions_and_warnings(transactions: List[Any]) -> Dict[str, Any]:
    """
    Groups transactions by category and month, applies moving average & linear regression,
    predicts the next month's spending, and generates budget warnings.
    """
    # Group by category -> month -> total spending
    spending_map = defaultdict(lambda: defaultdict(float))
    
    for txn in transactions:
        if txn.type != "expense":
            continue
        try:
            # Parse Date
            dt = datetime.strptime(txn.date, "%Y-%m-%d")
            month_key = dt.strftime("%Y-%m")
            spending_map[txn.category][month_key] += txn.amount
        except Exception:
            continue
            
    predictions = {}
    warnings = []
    
    # Get all unique months in order to sort them
    unique_months = set()
    for txn in transactions:
        if txn.type == "expense":
            try:
                dt = datetime.strptime(txn.date, "%Y-%m-%d")
                unique_months.add(dt.strftime("%Y-%m"))
            except Exception:
                continue
    all_months = sorted(list(unique_months))
    
    for category, months in spending_map.items():
        # Get sorted historical values
        sorted_months = sorted(months.keys())
        points = [months[m] for m in sorted_months]
        
        if not points:
            continue
            
        n = len(points)
        
        # Simple calculations based on history size
        if n == 1:
            predicted = points[0]
            growth_pct = 0.0
        elif n <= 3:
            # Moving average
            predicted = sum(points) / n
            # Growth comparison: last month vs first
            growth_pct = ((points[-1] - points[0]) / points[0] * 100) if points[0] > 0 else 0.0
        else:
            # Fit linear regression on last 6 points
            recent_points = points[-6:]
            m, c = calculate_linear_regression(recent_points)
            # Predict for the next month index (N)
            predicted = max(0.0, m * len(recent_points) + c)
            
            # Growth over the regression timeline
            avg = sum(recent_points) / len(recent_points)
            growth_pct = (m / avg * 100) if avg > 0 else 0.0
            
        predictions[category] = {
            "predicted": round(predicted, 2),
            "historical_average": round(sum(points) / n, 2),
            "growth_rate": round(growth_pct, 2),
            "data_points": points
        }
        
        # If spending is increasing significantly, generate a warning
        if growth_pct >= 10.0 and points[-1] > 500:
            warnings.append({
                "category": category,
                "growth_rate": round(growth_pct, 1),
                "last_month_spend": round(points[-1], 2),
                "predicted_spend": round(predicted, 2),
                "message": f"{category} spending is increasing by {round(growth_pct, 1)}% month-over-month. Expected next month: ₹{round(predicted, 2)}."
            })
            
    # Calculate overall total predicted spending
    total_predicted = sum(item["predicted"] for item in predictions.values())
    
    return {
        "predictions": predictions,
        "warnings": warnings,
        "total_predicted_spending": round(total_predicted, 2)
    }
