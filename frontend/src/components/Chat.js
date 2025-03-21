import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chat = ({ sessionId, onSessionChange }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages,
                    session_id: sessionId
                })
            });

            const data = await res.json();

            if (data.session_id) {
                onSessionChange(data.session_id);
            }

            setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages([...newMessages, {
                role: 'assistant',
                content: 'Sorry, there was an error processing your request.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadPDF = async () => {
        if (!sessionId) return;

        try {
            const res = await fetch('http://localhost:5000/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId })
            });

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `study-summary-${sessionId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <div className="chat-container">
            <div className="messages-container">
                {messages.map((msg, i) => (
                    <div key={i} className={`message ${msg.role}`}>
                        <div className="message-content">{msg.content}</div>
                    </div>
                ))}
                {isLoading && (
                    <div className="message assistant">
                        <div className="message-content">Thinking...</div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-container">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask your study question..."
                    disabled={isLoading}
                />
                <button onClick={sendMessage} disabled={isLoading}>
                    Send
                </button>
            </div>
            {sessionId && (
                <button className="download-pdf" onClick={downloadPDF}>
                    Download Summary
                </button>
            )}
        </div>
    );
};

export default Chat; 