from flask import Flask, request, jsonify
from flask_cors import CORS
from backend.utils.predictor import predict_disease
import sqlite3, bcrypt, jwt, datetime, os
import sklearn
print(sklearn.__version__)

app = Flask(__name__)
CORS(app)
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key")
DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                disease TEXT,
                confidence REAL,
                description TEXT,
                recommendations TEXT,
                answers TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)

init_db()

def token_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token missing"}), 401
        try:
            token = auth_header.split(" ")[1]
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        return f(payload["user_id"], *args, **kwargs)
    return decorated

@app.route("/")
def home():
    return {"message": "Trichology API is running"}

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email и пароль обязательны"}), 400
    if len(password) < 6:
        return jsonify({"error": "Пароль минимум 6 символов"}), 400

    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    try:
        with get_db() as conn:
            conn.execute(
                "INSERT INTO users (email, password_hash) VALUES (?, ?)",
                (email, password_hash)
            )
        return jsonify({"message": "Пользователь зарегистрирован"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email уже занят"}), 409

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    with get_db() as conn:
        user = conn.execute(
            "SELECT * FROM users WHERE email = ?", (email,)
        ).fetchone()

    if not user or not bcrypt.checkpw(password.encode(), user["password_hash"].encode()):
        return jsonify({"error": "Неверный email или пароль"}), 401

    token = jwt.encode(
        {
            "user_id": user["id"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
        },
        SECRET_KEY,
        algorithm="HS256"
    )
    return jsonify({"token": token, "email": email})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    try:
        result = predict_disease(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        try:
            token = auth_header.split(" ")[1]
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload["user_id"]
            import json
            with get_db() as conn:
                conn.execute(
                    """INSERT INTO results
                       (user_id, disease, confidence, description, recommendations, answers)
                       VALUES (?, ?, ?, ?, ?, ?)""",
                    (
                        user_id,
                        result["disease"],
                        result["confidence"],
                        result["description"],
                        json.dumps(result["recommendations"], ensure_ascii=False),
                        json.dumps(data, ensure_ascii=False)
                    )
                )
        except Exception:
            pass

    return jsonify(result)

@app.route("/history", methods=["GET"])
@token_required
def history(user_id):
    import json
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM results WHERE user_id = ? ORDER BY created_at DESC",
            (user_id,)
        ).fetchall()

    return jsonify([
        {
            "id": r["id"],
            "disease": r["disease"],
            "confidence": r["confidence"],
            "description": r["description"],
            "recommendations": json.loads(r["recommendations"]),
            "answers": json.loads(r["answers"]),
            "created_at": r["created_at"]
        }
        for r in rows
    ])

if __name__ == "__main__":
    app.run(debug=True)