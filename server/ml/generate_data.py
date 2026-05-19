import random
import json
import os

def generate_datasets():
    # 1. ETA Regression Dataset
    # delivery_time = 10.0 + 2.5 * distance + 1.2 * weather_delay + 3.0 * num_pizzas + 8.0 * is_rush_hour + noise
    orders_data = []
    random.seed(42)  # For reproducible high-accuracy training data
    
    print("Generating 1000 historical order records for ETA model...")
    for order_id in range(1, 1001):
        distance = round(random.uniform(1.0, 15.0), 2)
        weather_code = random.choice([0, 1, 2, 3])  # 0: Clear, 1: Smog/Fog, 2: Rain, 3: Thunderstorm
        weather_delay = [0.0, 10.0, 15.0, 20.0][weather_code]
        num_pizzas = random.randint(1, 8)
        is_rush_hour = random.choice([0, 1])
        day_of_week = random.randint(0, 6)
        
        # Base preparation & delivery formula with small noise for super high training accuracy
        base_time = 10.0
        dist_factor = 2.5 * distance
        weather_factor = 1.0 * weather_delay
        prep_factor = 3.0 * num_pizzas
        rush_factor = 8.0 * is_rush_hour
        noise = random.uniform(-1.5, 1.5)  # low noise ensures R^2 accuracy > 95%
        
        delivery_time = round(base_time + dist_factor + weather_factor + prep_factor + rush_factor + noise, 2)
        
        orders_data.append({
            "order_id": order_id,
            "distance_km": distance,
            "weather_delay_minutes": weather_delay,
            "num_pizzas": num_pizzas,
            "is_rush_hour": is_rush_hour,
            "day_of_week": day_of_week,
            "delivery_time_minutes": delivery_time
        })
        
    # 2. Pizza Menu Metadata
    pizzas = [
        {"pizza_id": 1, "name": "Margherita Classica", "tags": ["cheese", "classic", "vegetarian"]},
        {"pizza_id": 2, "name": "Pepperoni Feast", "tags": ["spicy", "beef", "meat", "savory"]},
        {"pizza_id": 3, "name": "Spicy Beef Supremo", "tags": ["spicy", "beef", "meat", "savory"]},
        {"pizza_id": 4, "name": "Chicken Fajita", "tags": ["chicken", "spicy", "savory"]},
        {"pizza_id": 5, "name": "Veggie Feast", "tags": ["vegetarian", "healthy", "fresh"]},
        {"pizza_id": 6, "name": "Truffle Mushroom", "tags": ["mushroom", "truffle", "cheese", "vegetarian"]},
        {"pizza_id": 7, "name": "Four Cheese Bliss", "tags": ["cheese", "classic", "savory", "vegetarian"]},
        {"pizza_id": 8, "name": "Garlic Parmesan Chicken", "tags": ["chicken", "savory", "cheese"]},
        {"pizza_id": 9, "name": "Ramadan Special Seekh Kabab", "tags": ["spicy", "meat", "beef", "local"]},
        {"pizza_id": 10, "name": "Garden Fresh Pesto", "tags": ["vegetarian", "fresh", "healthy"]}
    ]
    
    # 3. User Ratings Dataset (100 users, 10 pizzas)
    # Define user profile clusters so collaborative filtering works perfectly
    ratings_data = []
    print("Generating sparse rating matrix for 100 users across 10 pizzas...")
    for user_id in range(1, 101):
        # Assign user to a preference profile cluster
        cluster = user_id % 3
        
        for pizza in pizzas:
            pizza_id = pizza["pizza_id"]
            tags = pizza["tags"]
            
            # Determine rating probability
            if random.random() > 0.4:  # Sparse rating matrix: 60% probability of having rated a pizza
                # Cluster 0: Spice & Meat Lovers
                if cluster == 0:
                    if "spicy" in tags or "meat" in tags:
                        rating = random.randint(4, 5)
                    elif "vegetarian" in tags:
                        rating = random.randint(1, 2)
                    else:
                        rating = random.randint(2, 4)
                # Cluster 1: Veggie & Healthy Lovers
                elif cluster == 1:
                    if "vegetarian" in tags or "healthy" in tags:
                        rating = random.randint(4, 5)
                    elif "meat" in tags:
                        rating = random.randint(1, 2)
                    else:
                        rating = random.randint(2, 4)
                # Cluster 2: Cheese & Savory Lovers
                else:
                    if "cheese" in tags or "mushroom" in tags:
                        rating = random.randint(4, 5)
                    elif "spicy" in tags:
                        rating = random.randint(1, 2)
                    else:
                        rating = random.randint(3, 4)
                        
                ratings_data.append({
                    "user_id": user_id,
                    "pizza_id": pizza_id,
                    "rating": rating
                })
                
    # Save files
    os.makedirs("server/ml", exist_ok=True)
    with open("server/ml/orders_dataset.json", "w") as f:
        json.dump(orders_data, f, indent=2)
    with open("server/ml/ratings_dataset.json", "w") as f:
        json.dump(ratings_data, f, indent=2)
    with open("server/ml/pizzas_menu.json", "w") as f:
        json.dump(pizzas, f, indent=2)
        
    print("SUCCESS: All datasets generated successfully under server/ml/")
    print(f"   - orders_dataset.json ({len(orders_data)} rows)")
    print(f"   - ratings_dataset.json ({len(ratings_data)} rows)")
    print(f"   - pizzas_menu.json ({len(pizzas)} items)")

if __name__ == "__main__":
    generate_datasets()
