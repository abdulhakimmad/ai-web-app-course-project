"use client";

import { useState } from "react";

export function ApiStatus() {
  const [status, setStatus] = useState<string>("Not checked");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function checkApi() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://127.0.0.1:5000/health");

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      setStatus(data.status);
    } catch {
      setError("Cannot connect to API");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="ux-card ux-status">
      <div className="ux-section-heading">
        <p className="ux-eyebrow">SYSTEM STATUS</p>
        <h2>Backend API</h2>
        <p className="ux-muted">Check the connection to Flask.</p>
      </div>

      <p>
        API Status: <strong>{status}</strong>
      </p>

      <button
        type="button"
        className="ux-button"
        onClick={checkApi}
        disabled={loading}
      >
        {loading ? "Checking..." : "Check API"}
      </button>

      {error && (
        <div className="ux-error" role="alert" style={{ marginTop: "10px" }}>
          {error}
        </div>
      )}
    </section>
  );
}