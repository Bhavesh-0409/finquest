from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

auth_client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
db_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

app = Flask(__name__)
CORS(app)

# --------------------------------------------------
# SIGNUP
# --------------------------------------------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json

    res = auth_client.auth.sign_up({
        "email": data["email"],
        "password": data["password"]
    })

    return jsonify(res.user), 201


# --------------------------------------------------
# LOGIN
# --------------------------------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    res = auth_client.auth.sign_in_with_password({
        "email": data["email"],
        "password": data["password"]
    })

    return jsonify({
        "user": res.user,
        "session": res.session
    }), 200


# --------------------------------------------------
# CREATE PROFILE
# --------------------------------------------------
@app.route("/profile", methods=["POST"])
def create_profile():
    data = request.json

    res = db_client.table("profiles").insert({
        "id": data["user_id"],
        "name": data["name"],
        "role": data["role"],
        "xp": 0
    }).execute()

    return jsonify(res.data), 201


# --------------------------------------------------
# ADD XP (NO RANK LOGIC HERE)
# --------------------------------------------------
@app.route("/profile/xp", methods=["POST"])
def add_xp():
    data = request.json
    user_id = data["user_id"]
    xp_gain = data["xp"]

    profile = db_client.table("profiles") \
        .select("xp") \
        .eq("id", user_id) \
        .single() \
        .execute()

    new_xp = profile.data["xp"] + xp_gain

    db_client.table("profiles") \
        .update({"xp": new_xp}) \
        .eq("id", user_id) \
        .execute()

    # leaderboard_position is updated automatically by DB trigger
    return jsonify({"xp": new_xp}), 200


# --------------------------------------------------
# GET PROFILE (RANK COMES FROM DB)
# --------------------------------------------------
@app.route("/profile/<user_id>", methods=["GET"])
def get_profile(user_id):
    profile = db_client.table("profiles") \
        .select("id, name, role, xp, leaderboard_position") \
        .eq("id", user_id) \
        .single() \
        .execute()

    return jsonify(profile.data), 200


# --------------------------------------------------
# LEADERBOARD (TOP 10)
# --------------------------------------------------
@app.route("/leaderboard", methods=["GET"])
def leaderboard():
    res = db_client.table("profiles") \
        .select("name, xp, leaderboard_position") \
        .order("leaderboard_position") \
        .limit(10) \
        .execute()

    return jsonify(res.data), 200


# --------------------------------------------------
# HEALTH
# --------------------------------------------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "OK"})


if __name__ == "__main__":
    app.run(debug=True)
