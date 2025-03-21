# AI Study Assistant

A comprehensive study assistant application that combines AI-powered chat, educational video search, and focus tools to help students study more effectively.

## Features

- 🤖 AI-powered study chat using Mistral (local LLM)
- 📚 Educational YouTube video search
- ⏱️ Pomodoro timer for focused study sessions
- 📝 Automatic PDF generation of study sessions
- 🎯 Anti-distraction system
- 💾 Session history tracking

## System Requirements

- Python 3.10+
- Node.js v18+
- 8GB RAM minimum (for local AI models)
- Free accounts:
  - Google Cloud Console (for YouTube API)
  - Hugging Face (optional, for additional models)

## Setup Instructions

### Backend Setup

1. Create and activate a Python virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the backend directory with:
```
YT_API_KEY=your_youtube_api_key
DATABASE_URL=sqlite:///study_assistant.db
```

4. Install Ollama and the Mistral model:
```bash
# Follow instructions at https://ollama.ai to install Ollama
ollama pull mistral
```

5. Run the backend server:
```bash
python app.py
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Start a new study session by asking questions in the chat
3. Use the Pomodoro timer to maintain focus
4. Search for educational videos related to your study topic
5. Download PDF summaries of your study sessions

## Development

### Project Structure

```
study-assistant/
├── backend/
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.js
│   │   │   ├── FocusTimer.js
│   │   │   └── YouTubeSearch.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

### Adding New Features

1. Backend:
   - Add new routes in `app.py`
   - Create new database models if needed
   - Add new API endpoints

2. Frontend:
   - Create new components in `src/components/`
   - Add new routes in `App.js`
   - Style new components with CSS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 