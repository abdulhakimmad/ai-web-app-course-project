import { pool } from "@/lib/db";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

// ฟังก์ชันสำหรับเช็กว่า ID ที่ส่งมาถูกต้องไหม
function validId(raw: string) {
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

// 1. PUT: สำหรับแก้ไขข้อมูล Prompt ตาม ID
export async function PUT(request: Request, context: Context) {
  const { id: raw } = await context.params;
  const id = validId(raw);
  if (id === null) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return Response.json({ error: "Invalid body" }, { status: 400 });
    }

    const data = body as Record<string, unknown>;
    if (
      typeof data.title !== "string" ||
      typeof data.promptText !== "string" ||
      (data.category !== undefined && typeof data.category !== "string")
    ) {
      return Response.json({ error: "Invalid fields" }, { status: 400 });
    }

    const title = data.title.trim();
    const promptText = data.promptText.trim();
    const category = typeof data.category === "string" ? data.category.trim() : "";

    if (!title || !promptText || title.length > 200 || category.length > 100) {
      return Response.json({ error: "Check title and prompt" }, { status: 400 });
    }

    // อัปเดตข้อมูลใน PostgreSQL
    const result = await pool.query(
      `UPDATE prompts
       SET title = $1, prompt_text = $2, category = $3
       WHERE id = $4
       RETURNING *`,
      [title, promptText, category, id]
    );

    if (result.rowCount === 0) {
      return Response.json({ error: "Prompt not found" }, { status: 404 });
    }

    return Response.json({ prompt: result.rows[0] });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Cannot update prompt" }, { status: 500 });
  }
}

// 2. DELETE: สำหรับลบข้อมูล Prompt ตาม ID
export async function DELETE(_request: Request, context: Context) {
  const { id: raw } = await context.params;
  const id = validId(raw);
  if (id === null) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    // ลบข้อมูลใน PostgreSQL
    const result = await pool.query(
      `DELETE FROM prompts WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return Response.json({ error: "Prompt not found" }, { status: 404 });
    }

    return Response.json({ message: "Prompt deleted" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Cannot delete prompt" }, { status: 500 });
  }
}