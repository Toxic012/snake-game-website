from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

HIGHSCORE_FILE = "highscore.json"

# Initialize file if not present
if not os.path.exists(HIGHSCORE_FILE):
    with open(HIGHSCORE_FILE, "w") as f:
        json.dump({"highscore": 0}, f)

def get_highscore():
    with open(HIGHSCORE_FILE, "r") as f:
        return json.load(f)["highscore"]

def update_highscore(score):
    high = get_highscore()
    if score > high:
        with open(HIGHSCORE_FILE, "w") as f:
            json.dump({"highscore": score}, f)
        return True
    return False

@app.route("/")
def home():
    return render_template("index.html", highscore=get_highscore())

@app.route("/update_score", methods=["POST"])
def update_score():
    data = request.get_json()
    score = int(data.get("score", 0))
    updated = update_highscore(score)
    return jsonify({"updated": updated, "highscore": get_highscore()})

if __name__ == "__main__":
    app.run(debug=True)
