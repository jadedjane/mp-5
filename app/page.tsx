"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setLoading(true);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, alias }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setShortUrl(`${window.location.origin}${data.shortUrl}`);
      setUrl("");
      setAlias("");
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
      <main
          style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f4f4f4",
            padding: "2rem",
          }}
      >
        <div
            style={{
              width: "100%",
              maxWidth: "500px",
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
        >
          <h1 style={{ marginBottom: "1rem", textAlign: "center" }}>
            URL Shortener
          </h1>

          <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
          >
            <input
                type="text"
                placeholder="Enter your URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                }}
            />

            <input
                type="text"
                placeholder="Enter custom alias"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                }}
            />

            <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#111827",
                  color: "white",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
            >
              {loading ? "Creating..." : "Shorten URL"}
            </button>
          </form>

          {error && (
              <p
                  style={{
                    marginTop: "1rem",
                    color: "crimson",
                    textAlign: "center",
                  }}
              >
                {error}
              </p>
          )}

          {shortUrl && (
              <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <p>Your shortened URL:</p>
                <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                  {shortUrl}
                </a>
              </div>
          )}
        </div>
      </main>
  );
}