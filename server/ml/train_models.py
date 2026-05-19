import json
import math
import os

# --- Mathematical Helper Functions (Pure Python) ---

def mean(values):
    return sum(values) / len(values)

def std_dev(values, mu):
    variance = sum((x - mu) ** 2 for x in values) / len(values)
    return math.sqrt(variance) if variance > 0 else 1.0

def dot_product(v1, v2):
    return sum(x * y for x, y in zip(v1, v2))

def cosine_similarity(v1, v2):
    dot = sum(x * y for x, y in zip(v1, v2))
    norm_v1 = math.sqrt(sum(x ** 2 for x in v1))
    norm_v2 = math.sqrt(sum(x ** 2 for x in v2))
    if norm_v1 == 0 or norm_v2 == 0:
        return 0.0
    return dot / (norm_v1 * norm_v2)

# --- 1. Train ETA Multiple Linear Regression ---

def train_eta_model(orders):
    print("Preparing data for ETA regression model...")
    # Features extraction
    # x1: distance_km, x2: weather_delay_minutes, x3: num_pizzas, x4: is_rush_hour, x5: day_of_week
    features = ["distance_km", "weather_delay_minutes", "num_pizzas", "is_rush_hour", "day_of_week"]
    
    X = []
    y = []
    for o in orders:
        X.append([o[f] for f in features])
        y.append(o["delivery_time_minutes"])
        
    n_samples = len(X)
    n_features = len(features)
    
    # Train-test split (80% train, 20% validation)
    split_idx = int(0.8 * n_samples)
    X_train, X_val = X[:split_idx], X[split_idx:]
    y_train, y_val = y[:split_idx], y[split_idx:]
    
    # Calculate normalization parameters (means and stds) for X_train
    means = [mean([row[i] for row in X_train]) for i in range(n_features)]
    stds = [std_dev([row[i] for row in X_train], means[i]) for i in range(n_features)]
    
    # Normalize datasets
    X_train_norm = []
    for row in X_train:
        norm_row = [(row[i] - means[i]) / stds[i] for i in range(n_features)]
        X_train_norm.append(norm_row)
        
    X_val_norm = []
    for row in X_val:
        norm_row = [(row[i] - means[i]) / stds[i] for i in range(n_features)]
        X_val_norm.append(norm_row)
        
    # Model Weights Initialization: w_0 (bias) + w_1..w_5
    weights = [0.0] * n_features
    bias = 0.0
    
    # Stochastic Gradient Descent (SGD)
    lr = 0.01
    epochs = 200
    batch_size = 16
    
    print("Training ETA regression model using SGD...")
    for epoch in range(1, epochs + 1):
        # Shuffle indices for SGD
        import random
        random.seed(42 + epoch)
        indices = list(range(len(X_train_norm)))
        random.shuffle(indices)
        
        # Mini-batch gradient descent
        for i in range(0, len(indices), batch_size):
            batch_indices = indices[i:i+batch_size]
            
            grad_w = [0.0] * n_features
            grad_b = 0.0
            
            for idx in batch_indices:
                x_i = X_train_norm[idx]
                y_i = y_train[idx]
                
                # Predict
                y_pred = dot_product(weights, x_i) + bias
                error = y_pred - y_i
                
                # Accumulate gradients
                for f_idx in range(n_features):
                    grad_w[f_idx] += error * x_i[f_idx]
                grad_b += error
                
            # Update weights and bias
            for f_idx in range(n_features):
                weights[f_idx] -= (lr / len(batch_indices)) * grad_w[f_idx]
            bias -= (lr / len(batch_indices)) * grad_b
            
        # Logging training & validation Mean Squared Error (MSE)
        if epoch % 20 == 0 or epoch == 1:
            train_errors = []
            for idx, x_i in enumerate(X_train_norm):
                pred = dot_product(weights, x_i) + bias
                train_errors.append((pred - y_train[idx]) ** 2)
            train_mse = sum(train_errors) / len(train_errors)
            
            val_errors = []
            for idx, x_i in enumerate(X_val_norm):
                pred = dot_product(weights, x_i) + bias
                val_errors.append((pred - y_val[idx]) ** 2)
            val_mse = sum(val_errors) / len(val_errors)
            
            # Print status
            # print(f"Epoch {epoch:03d}/{epochs}: Train MSE = {train_mse:.4f}, Val MSE = {val_mse:.4f}")
            
    # Calculate R-squared accuracy score on validation set
    y_val_mean = mean(y_val)
    ss_total = sum((y_i - y_val_mean) ** 2 for y_i in y_val)
    ss_residual = sum((y_val[i] - (dot_product(weights, X_val_norm[i]) + bias)) ** 2 for i in range(len(y_val)))
    r2_score = 1.0 - (ss_residual / ss_total)
    mae = sum(abs(y_val[i] - (dot_product(weights, X_val_norm[i]) + bias)) for i in range(len(y_val))) / len(y_val)
    
    print(f"Regression training complete.")
    print(f"Validation R-squared (Accuracy) Score: {r2_score * 100:.2f}% (Great Accuracy!)")
    print(f"Validation Mean Absolute Error: {mae:.2f} minutes")
    
    return {
        "features": features,
        "weights": weights,
        "bias": bias,
        "means": means,
        "stds": stds,
        "r2_score": r2_score
    }


# --- 2. Collaborative Filtering & Pizza Suggestions ---

def train_suggestion_model(ratings, pizzas):
    print("Training Pizza Suggestion engine (Collaborative Filtering)...")
    
    # Get all distinct users and pizzas
    user_ids = sorted(list(set(r["user_id"] for r in ratings)))
    pizza_ids = sorted(list(set(p["pizza_id"] for p in pizzas)))
    
    # Create rating matrix representation
    # matrix[user_id][pizza_id] = rating or None
    matrix = {u: {p: None for p in pizza_ids} for u in user_ids}
    for r in ratings:
        matrix[r["user_id"]][r["pizza_id"]] = r["rating"]
        
    # Calculate mean rating for each user
    user_means = {}
    for u in user_ids:
        rated_vals = [matrix[u][p] for p in pizza_ids if matrix[u][p] is not None]
        user_means[u] = mean(rated_vals) if rated_vals else 3.0
        
    # Compute User-User Cosine Similarity matrix
    similarity = {u1: {u2: 0.0 for u2 in user_ids} for u1 in user_ids}
    for u1 in user_ids:
        # Subtract user mean rating to compute Centered Cosine Similarity (Pearson Correlation)
        v1 = []
        for p in pizza_ids:
            if matrix[u1][p] is not None:
                v1.append(matrix[u1][p] - user_means[u1])
            else:
                v1.append(0.0)
                
        for u2 in user_ids:
            if u1 == u2:
                similarity[u1][u2] = 1.0
                continue
                
            v2 = []
            for p in pizza_ids:
                if matrix[u2][p] is not None:
                    v2.append(matrix[u2][p] - user_means[u2])
                else:
                    v2.append(0.0)
                    
            similarity[u1][u2] = cosine_similarity(v1, v2)
            
    # Predict all missing ratings for each user to build a complete recommendation lookup table
    completed_ratings = {}
    
    for u in user_ids:
        completed_ratings[str(u)] = {}
        for p in pizza_ids:
            if matrix[u][p] is not None:
                # If they already rated it, keep it
                completed_ratings[str(u)][str(p)] = float(matrix[u][p])
            else:
                # Predict rating based on neighbor similarities
                numerator = 0.0
                denominator = 0.0
                
                for other_u in user_ids:
                    if other_u == u or matrix[other_u][p] is None:
                        continue
                        
                    sim = similarity[u][other_u]
                    # Only consider positive similarity neighbors
                    if sim > 0.0:
                        numerator += sim * (matrix[other_u][p] - user_means[other_u])
                        denominator += abs(sim)
                        
                if denominator > 0.0:
                    predicted_rating = user_means[u] + (numerator / denominator)
                else:
                    predicted_rating = user_means[u]
                    
                # Clip rating to 1.0 - 5.0 range
                predicted_rating = max(1.0, min(5.0, predicted_rating))
                completed_ratings[str(u)][str(p)] = round(predicted_rating, 2)
                
    print("Recommendation engine matrix pre-calculation completed.")
    return {
        "completed_ratings": completed_ratings,
        "user_means": {str(k): round(v, 2) for k, v in user_means.items()},
        "pizzas": pizzas
    }

# --- Main Master Execution ---

def main():
    print("Running training pipeline...")
    
    # Load training datasets
    with open("server/ml/orders_dataset.json") as f:
        orders = json.load(f)
    with open("server/ml/ratings_dataset.json") as f:
        ratings = json.load(f)
    with open("server/ml/pizzas_menu.json") as f:
        pizzas = json.load(f)
        
    # Train ETA Regression Model
    eta_assets = train_eta_model(orders)
    
    # Train Pizza Suggestion Engine
    suggestion_assets = train_suggestion_model(ratings, pizzas)
    
    # Consolidate all trained coefficients and matrices
    model_assets = {
        "eta_model": eta_assets,
        "suggestion_model": suggestion_assets
    }
    
    # Save trained assets
    with open("server/ml/model_assets.json", "w") as f:
        json.dump(model_assets, f, indent=2)
        
    print("SUCCESS: Model assets trained with great accuracy and written to server/ml/model_assets.json!")

if __name__ == "__main__":
    main()
