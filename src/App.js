import React, { useState } from 'react';

export default function App() {
  const [input, setInput] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchYoutubeUrl = async (url) => {
    if (!url.trim()) return;
    setLoading(true);
    setYoutubeUrl(null);
    setError(null);

    try {
      const params = new URLSearchParams({ spotify_url: url.trim() });
      const response = await fetch(`https://de9495e9-8d54-4d59-8b4b-edcc6d8b2328-00-asv9pts4xy3v.riker.replit.dev/track-info?${params.toString()}`);
      
      if (!response.ok) {
        setError(`Fehler: ${response.status}`);
        return;
      }

      const data = await response.json();
      if (data.youtube_url) {
        setYoutubeUrl(data.youtube_url);
        try {
          await navigator.clipboard.writeText(data.youtube_url);
          alert("YouTube-Link automatisch kopiert!");
        } catch {
          // still allow manual copy
          console.warn("Automatisches Kopieren fehlgeschlagen.");
        }
      } else {
        setError('Keine YouTube-URL gefunden.');
      }
    } catch (err) {
      setError(`Fehler: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClipboardImport = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        alert("Die Zwischenablage ist leer.");
        return;
      }
      setInput(text);
      if (text.includes("spotify.com/track")) {
        fetchYoutubeUrl(text);
      } else {
        alert("Kein gültiger Spotify-Link in der Zwischenablage.");
      }
    } catch (err) {
      alert("Zugriff auf die Zwischenablage nicht erlaubt.");
      console.error(err);
    }
  };

  const copyToClipboard = () => {
    if (youtubeUrl) {
      navigator.clipboard.writeText(youtubeUrl);
      alert('YouTube-Link kopiert!');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>LinkCon</h1>

      <button
        onClick={handleClipboardImport}
        disabled={loading}
        style={{
          marginBottom: '1rem',
          padding: '0.4rem 0.8rem',
          fontSize: '0.95rem',
          backgroundColor: '#e0e0e0',
          border: '1px solid #ccc',
          cursor: 'pointer'
        }}
      >
        Aus Zwischenablage einfügen
      </button>

      <input
        type="text"
        placeholder="Gib deine URL ein"
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        disabled={loading}
      />

      {youtubeUrl && (
        <div style={{ marginTop: '2rem' }}>
          <strong>YouTube URL:</strong>
          <p style={{ wordBreak: 'break-word' }}>{youtubeUrl}</p>
          <button onClick={copyToClipboard} style={{ padding: '0.4rem 0.8rem', marginTop: '0.5rem' }}>
            Manuell kopieren
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