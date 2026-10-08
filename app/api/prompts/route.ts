import { pool } from "@/lib/db";

export const runtime = "nodejs";

// GET: อ่านรายการ Prompt ทั้งหมด
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, title, prompt_text, category, created_at 
       FROM prompts 
       ORDER BY created_at DESC, id DESC`
    );
    return Response.json({ prompts: result.rows });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Cannot load prompts" },
      { status: 500 }
    );
  }
}

// POST: บันทึก Prompt ใหม่
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return Response.json(
        { error: "Invalid JSON object" },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;
    if (
      typeof data.title !== "string" ||
      typeof data.promptText !== "string" ||
      (data.category !== undefined && typeof data.category !== "string")
    ) {
      return Response.json(
        { error: "Invalid fields" },
        { status: 400 }
      );
    }

    const title = data.title.trim();
    const promptText = data.promptText.trim();
    const category = typeof data.category === "string" ? data.category.trim() : "";

    if (!title || !promptText || title.length > 200 || category.length > 100) {
      return Response.json(
        { error: "Check title and prompt" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO prompts (title, prompt_text, category)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, promptText, category]
    );

    return Response.json(
      { prompt: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Cannot save prompt" },
      { status: 500 }
    );
  }
}