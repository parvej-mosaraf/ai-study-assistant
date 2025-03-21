import React, { useState } from 'react';
import Chat from './components/Chat';
import YouTubeSearch from './components/YouTubeSearch';
import FocusTimer from './components/FocusTimer';
import './App.css';

function App() {
    const [activeSession, setActiveSession] = useState(null);

    return (
        <div className="App">
            <header className="App-header">
                <h1>AI Study Assistant</h1>
            </header>
            <main className="App-main">
                <div className="left-panel">
                    <FocusTimer />
                    <YouTubeSearch />
                </div>
                <div className="right-panel">
                    <Chat sessionId={activeSession} onSessionChange={setActiveSession} />
                </div>
            </main>
        </div>
    );
}

export default App; 