from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from langchain_community.llms import Ollama
from googleapiclient.discovery import build
from reportlab.pdfgen import canvas
from io import BytesIO
import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL", "sqlite:///study_assistant.db"
)
db = SQLAlchemy(app)

# Initialize Ollama
llm = Ollama(model="mistral")

# YouTube API setup
YT_API_KEY = os.getenv("YT_API_KEY")
youtube = build("youtube", "v3", developerKey=YT_API_KEY)


# Database Models
class ChatSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    messages = db.relationship("Message", backref="session", lazy=True)


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(10), nullable=False)
    content = db.Column(db.Text, nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey("chat_session.id"), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


# Content filtering
BLOCKED_TERMS = ["music", "game", "movie", "social media"]


@app.before_request
def check_content():
    if request.method == "POST" and "/chat" in request.path:
        user_input = request.json["messages"][-1]["content"].lower()
        if any(term in user_input for term in BLOCKED_TERMS):
            return jsonify({"reply": "⚠️ Stay focused on studies!"}), 403


@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    messages = data.get("messages", [])
    session_id = data.get("session_id")

    if not session_id:
        # Create new session
        session = ChatSession()
        db.session.add(session)
        db.session.commit()
        session_id = session.id

    # Get the last message
    prompt = messages[-1]["content"]

    # Save user message
    user_message = Message(role="user", content=prompt, session_id=session_id)
    db.session.add(user_message)

    # Get AI response
    response = llm.invoke(
        f"""<s>[INST] You are a study assistant. 
        Answer academically. If off-topic, say "Focus on studies!" [/INST]
        User: {prompt}
        Assistant:"""
    )

    ai_response = response.split("Assistant:")[-1].strip()

    # Save AI response
    ai_message = Message(role="assistant", content=ai_response, session_id=session_id)
    db.session.add(ai_message)
    db.session.commit()

    return jsonify({"reply": ai_response, "session_id": session_id})


@app.route("/yt-search")
def yt_search():
    query = request.args.get("q")

    res = (
        youtube.search()
        .list(
            q=query,
            part="snippet",
            type="video",
            videoCategoryId="27",  # Education
            maxResults=5,
            safeSearch="strict",
        )
        .execute()
    )

    return jsonify(
        [
            {
                "id": item["id"]["videoId"],
                "title": item["snippet"]["title"],
                "channel": item["snippet"]["channelTitle"],
            }
            for item in res["items"]
        ]
    )


@app.route("/generate-pdf", methods=["POST"])
def generate_pdf():
    session_id = request.json.get("session_id")
    if not session_id:
        return jsonify({"error": "No session ID provided"}), 400

    session = ChatSession.query.get_or_404(session_id)
    messages = (
        Message.query.filter_by(session_id=session_id).order_by(Message.timestamp).all()
    )

    # Create PDF
    packet = BytesIO()
    c = canvas.Canvas(packet)
    y = 800

    c.drawString(
        50,
        y,
        f"Study Session Summary - {session.created_at.strftime('%Y-%m-%d %H:%M')}",
    )
    y -= 30

    for msg in messages:
        text = f"{msg.role.title()}: {msg.content}"
        c.drawString(50, y, text)
        y -= 20
        if y < 50:  # New page
            c.showPage()
            y = 800

    c.save()
    packet.seek(0)

    return send_file(
        packet,
        mimetype="application/pdf",
        as_attachment=True,
        download_name=f"study_summary_{session_id}.pdf",
    )


@app.route("/sessions")
def get_sessions():
    sessions = ChatSession.query.order_by(ChatSession.created_at.desc()).all()
    return jsonify(
        [
            {
                "id": session.id,
                "created_at": session.created_at.isoformat(),
                "message_count": len(session.messages),
            }
            for session in sessions
        ]
    )


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
