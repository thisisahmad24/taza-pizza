import argparse
import json
import os
import sys

# --- Helper functions ---

def dot_product(v1, v2):
    return sum(x * y for x, y in zip(v1, v2))

def content_similarity(pizza_tags, keywords):
    if not keywords:
        return 0.0
    matches = sum(1 for kw in keywords if kw.lower() in [t.lower() for t in pizza_tags])
    return matches / len(keywords)

def load_assets():
    assets_path = "server/ml/model_assets.json"
    if not os.path.exists(assets_path):
        print(json.dumps({"error": f"Model assets file '{assets_path}' not found. Please train models first."}))
        sys.exit(1)
        
    with open(assets_path) as f:
        return json.load(f)

# --- 1. ETA Inference ---

def predict_eta(assets, distance, weather_delay, num_pizzas, is_rush_hour, day_of_week):
    eta_model = assets["eta_model"]
    weights = eta_model["weights"]
    bias = eta_model["bias"]
    means = eta_model["means"]
    stds = eta_model["stds"]
    
    # Raw features vector
    raw_x = [distance, weather_delay, num_pizzas, is_rush_hour, day_of_week]
    
    # Normalize features using saved training parameters
    norm_x = [(raw_x[i] - means[i]) / stds[i] for i in range(len(raw_x))]
    
    # Compute prediction
    predicted_time = dot_product(weights, norm_x) + bias
    
    # Lower bound limit to 10 minutes (minimum possible prep + delivery)
    predicted_time = max(10.0, predicted_time)
    
    output = {
        "success": True,
        "predicted_eta_minutes": round(predicted_time, 2),
        "inputs": {
            "distance_km": distance,
            "weather_delay_minutes": weather_delay,
            "num_pizzas": num_pizzas,
            "is_rush_hour": bool(is_rush_hour),
            "day_of_week": day_of_week
        },
        "accuracy_metric_r2": round(eta_model["r2_score"], 4)
    }
    
    print(json.dumps(output, indent=2))


# --- 2. Pizza Suggestion Inference ---

def suggest_pizzas(assets, user_id=None, keywords_str=""):
    suggestion_model = assets["suggestion_model"]
    completed_ratings = suggestion_model["completed_ratings"]
    pizzas = suggestion_model["pizzas"]
    
    # Tokenize flavor keywords if provided
    keywords = [kw.strip().lower() for kw in keywords_str.split()] if keywords_str else []
    
    suggestions = []
    
    for pizza in pizzas:
        pizza_id_str = str(pizza["pizza_id"])
        
        # 1. Collaborative Filtering Score
        cf_score = 3.0  # fallback baseline rating
        if user_id is not None:
            user_id_str = str(user_id)
            if user_id_str in completed_ratings:
                cf_score = completed_ratings[user_id_str].get(pizza_id_str, 3.0)
                
        # 2. Content-Based Keyword Matching Score
        keyword_score = 0.0
        if keywords:
            keyword_score = content_similarity(pizza["tags"] + pizza["name"].split(), keywords)
            
        # Unified suggestion score: blend CF predicted rating and keyword match boost
        # Predicted ratings are 1-5, keyword boost adds up to 5 points
        final_score = cf_score + (keyword_score * 5.0)
        
        suggestions.append({
            "pizza_id": pizza["pizza_id"],
            "name": pizza["name"],
            "tags": pizza["tags"],
            "predicted_rating": cf_score,
            "keyword_match_ratio": keyword_score,
            "recommendation_score": round(final_score, 2)
        })
        
    # Sort suggestions descending by recommendation score
    suggestions.sort(key=lambda x: x["recommendation_score"], reverse=True)
    
    output = {
        "success": True,
        "suggestions": suggestions[:3],  # Return Top 3 Pizza Recommendations
        "query": {
            "user_id": user_id,
            "keywords": keywords
        }
    }
    
    print(json.dumps(output, indent=2))


# --- CLI Router ---

def main():
    parser = argparse.ArgumentParser(description="Taza Pizza Fast Machine Learning Inference Engine")
    
    # Subcommands
    subparsers = parser.add_subparsers(dest="mode", help="Mode of execution")
    
    # ETA prediction subcommand
    eta_parser = subparsers.add_parser("eta", help="Predict delivery ETA")
    eta_parser.add_argument("--distance", type=float, required=True, help="Distance in km")
    eta_parser.add_argument("--weather", type=float, required=True, help="Weather delay in minutes")
    eta_parser.add_argument("--pizzas", type=int, required=True, help="Number of pizzas in order")
    eta_parser.add_argument("--rush", type=int, required=True, choices=[0, 1], help="Rush hour binary (0 or 1)")
    eta_parser.add_argument("--day", type=int, required=True, choices=range(7), help="Day of the week (0=Monday, 6=Sunday)")
    
    # Suggestion subcommand
    suggest_parser = subparsers.add_parser("suggest", help="Suggest premium pizzas")
    suggest_parser.add_argument("--user", type=int, help="User ID for collaborative filtering")
    suggest_parser.add_argument("--keywords", type=str, default="", help="Cravings or ingredients keywords")
    
    args = parser.parse_args()
    
    if not args.mode:
        parser.print_help()
        sys.exit(1)
        
    assets = load_assets()
    
    if args.mode == "eta":
        predict_eta(assets, args.distance, args.weather, args.pizzas, args.rush, args.day)
    elif args.mode == "suggest":
        suggest_pizzas(assets, args.user, args.keywords)

if __name__ == "__main__":
    main()
