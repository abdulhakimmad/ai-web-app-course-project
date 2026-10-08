"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";

type Prompt = {
  id: number;
  title: string;
  prompt_text: string;
  category: string | null;
  created_at: string;
};

export default function SavedPromptsPage() {
  const [title, setTitle] = useState("");
  const [promptText, setPromptText] = useState("");
  const [category, setCategory] = useState("");
  const [items, setItems] = useState<Prompt[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ดึงข้อมูล Prompt ทั้งหมดจาก API (GET)
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/prompts");
      if (!response.ok) throw new Error("GET failed");
      const data = await response.json();
      setItems(data.prompts);
      setError("");
    } catch {
      setError("Cannot load prompts. Check PostgreSQL.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  // ล้างค่าในฟอร์ม
  function clearForm() {
    setTitle("");
    setPromptText("");
    setCategory("");
    setEditingId(null);
  }

  // กดปุ่ม Edit แล้วดึงข้อมูลเดิมขึ้นมาบนฟอร์ม
  function edit(item: Prompt) {
    setTitle(item.title);
    setPromptText(item.prompt_text);
    setCategory(item.category || "");
    setEditingId(item.id);
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // กดบันทึก (POST สำหรับสร้างใหม่ / PUT สำหรับแก้ไข)
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !promptText.trim()) {
      setError("Title and Prompt are required.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    const isEdit = editingId !== null;

    try {
      const response = await fetch(
        isEdit ? `/api/prompts/${editingId}` : "/api/prompts",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, promptText, category }),
        }
      );
      if (!response.ok) throw new Error("Save failed");
      clearForm();
      await load();
      setMessage(isEdit ? "Prompt updated." : "Prompt saved.");
    } catch {
      setError("Cannot save prompt.");
    } finally {
      setSaving(false);
    }
  }

  // กดลบข้อมูล (DELETE)
  async function remove(id: number) {
    if (!window.confirm("Delete this prompt?")) return;
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/prompts/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      if (editingId === id) clearForm();
      await load();
      setMessage("Prompt deleted.");
    } catch {
      setError("Cannot delete prompt.");
    }
  }

  return (
    <main className="sp-page">
      <header className="sp-hero">
        <div className="sp-container sp-hero-inner">
          <div>
            <p className="sp-eyebrow">AI APPLICATION DEVELOPMENT WEEK 6</p>
            <h1>Saved Prompts</h1>
            <p className="sp-intro">Create, organize, and reuse prompt ideas.</p>
          </div>
          <Link href="/" className="sp-back">← Back to Home</Link>
        </div>
      </header>

      <div className="sp-container sp-layout">
        {/* ฟอร์มกรอกข้อมูล */}
        <section className="sp-panel sp-editor">
          <h2>{editingId === null ? "Create a prompt" : "Edit prompt"}</h2>
          <form className="sp-form" onSubmit={save}>
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              value={title}
              maxLength={200}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Explain AI simply"
              required
            />

            <label htmlFor="prompt">Prompt *</label>
            <textarea
              id="prompt"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Write the instruction you want to reuse..."
              required
            />

            <label htmlFor="category">Category (optional)</label>
            <input
              id="category"
              value={category}
              maxLength={100}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Example: Education"
            />

            <div className="sp-actions">
              <button type="submit" className="sp-primary" disabled={saving}>
                {saving ? "Saving..." : editingId === null ? "Save prompt" : "Update prompt"}
              </button>
              {editingId !== null && (
                <button type="button" className="sp-secondary" onClick={clearForm}>
                  Cancel edit
                </button>
              )}
            </div>
          </form>
          {error && <p className="sp-feedback sp-error">{error}</p>}
          {message && <p className="sp-feedback sp-success">{message}</p>}
        </section>

        {/* รายการแสดง Prompts */}
        <section className="sp-library">
          <div className="sp-library-head">
            <h2>My saved prompts</h2>
            <span className="sp-count">{items.length} saved</span>
          </div>

          {loading && <p className="sp-empty">Loading prompts...</p>}

          {!loading && items.length === 0 && (
            <div className="sp-empty">
              <strong>No saved prompts yet</strong>
              <p>Your first prompt will appear here after you save it.</p>
            </div>
          )}

          <div className="sp-list">
            {!loading &&
              items.map((item) => (
                <article className="sp-item" key={item.id}>
                  <div className="sp-item-top">
                    <h3>{item.title}</h3>
                    <span className="sp-tag">{item.category || "General"}</span>
                  </div>
                  <p className="sp-prompt-text">{item.prompt_text}</p>
                  <div className="sp-item-actions">
                    <button type="button" onClick={() => edit(item)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="sp-delete"
                      onClick={() => void remove(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}