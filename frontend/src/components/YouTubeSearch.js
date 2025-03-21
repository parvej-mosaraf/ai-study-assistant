import React, { useState } from 'react';
import './YouTubeSearch.css';

const YouTubeSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const searchVideos = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/yt-search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error('Error searching videos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="youtube-search">
            <div className="search-container">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchVideos()}
                    placeholder="Search educational videos..."
                    disabled={isLoading}
                />
                <button onClick={searchVideos} disabled={isLoading}>
                    Search
                </button>
            </div>

            <div className="video-results">
                {isLoading ? (
                    <div className="loading">Searching...</div>
                ) : (
                    results.map(video => (
                        <div key={video.id} className="video-item">
                            <div className="video-embed">
                                <iframe
                                    width="100%"
                                    height="200"
                                    src={`https://www.youtube.com/embed/${video.id}?rel=0`}
                                    title={video.title}
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="video-info">
                                <h4>{video.title}</h4>
                                <p className="channel">{video.channel}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default YouTubeSearch; 