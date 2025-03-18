import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

export default function App() {
    const [url, setUrl] = useState('');
    const [customSlug, setCustomSlug] = useState("");
    const [shortUrl, setShortUrl] = useState('');
    const [error, setError] = useState('');
    const [links, setLinks] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            fetch("http://localhost:3000/shortener/user/links", {
                headers: { Authorization: `Bearer ${token}` },
            })
              .then((res) => res.json())
              .then(setLinks)
              .catch((err) => console.error("Failed to load links", err));
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setShortUrl('');

        try {
            const response = await fetch('http://localhost:3000/shortener', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ url, customSlug }),
            });

            const data = await response.json();

            if (!response.ok) {
                const message = data.message || response.statusText;
                throw new Error(`Shortening failed [${message}]`);
            }

            setShortUrl(data.shortUrl);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleCopy = () => {
        if (shortUrl) {
            navigator.clipboard.writeText(shortUrl);
            alert("URL copied to clipboard!");
        }
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <h1 className="text-2xl font-bold mb-4">URL Shortener</h1>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
                className="p-2 border rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Custom slug (optional)"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
              />
              <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">Shorten</button>
          </form>
          {shortUrl && (
            <div className="mt-4 p-2 bg-green-200 rounded-md">
                Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer"
                              className="text-blue-600">{shortUrl}</a>
                <button onClick={handleCopy}>Copy to Clipboard</button>
            </div>
          )}
          {error && <div className="mt-4 p-2 bg-red-200 rounded-md">Error: {error}</div>}

          {token && (
            <>
                <h2>Your Links</h2>
                <ul>
                    {links && links.length && links.map((link: {slug: string, original_url: string, visit_count: number}) => (
                      <li key={link.slug}>
                          <a href={`${link.original_url}`} target="_blank">{link.slug} - [{link.original_url}]</a>
                          - {link.visit_count} visits
                      </li>
                    ))}
                </ul>
            </>
          )}
      </div>
    );
    }
