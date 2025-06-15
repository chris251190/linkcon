import React, { useState } from 'react';

export default function App() {
  const [input, setInput] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchYoutubeUrl = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setYoutubeUrl(null);
    setError(null);

    try {
      const params = new URLSearchParams({ spotify_url: input.trim() });
      const response = await fetch(`https://de9495e9-8d54-4d59-8b4b-edcc6d8b2328-00-asv9pts4xy3v.riker.replit.dev/track-info?${params.toString()}`);
      
      if (!response.ok) {
        setError(`Fehler: ${response.status}`);
        return;
      }

      const data = await response.json();
      if (data.youtube_url) {
        setYoutubeUrl(data.youtube_url);
      } else {
        setError('Keine YouTube-URL gefunden.');
      }
    } catch (err) {
      setError(`Fehler: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (youtubeUrl) {
      navigator.clipboard.writeText(youtubeUrl);
      alert('URL kopiert!');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>LinkCon</h1>
      <input
        type="text"
        placeholder="Gib deine URL ein"
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        disabled={loading}
      />
      <button
        onClick={fetchYoutubeUrl}
        disabled={loading}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}
      >
        {loading ? 'Lade...' : 'Senden'}
      </button>

      {youtubeUrl && (
        <div style={{ marginTop: '2rem' }}>
          <strong>YouTube URL:</strong>
          <p style={{ wordBreak: 'break-word' }}>{youtubeUrl}</p>
          <button onClick={copyToClipboard} style={{ padding: '0.4rem 0.8rem' }}>
            Kopieren
          </button>
        </div>
      )}

      {error && (
        <p style={{ color: 'red', marginTop: '1rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}