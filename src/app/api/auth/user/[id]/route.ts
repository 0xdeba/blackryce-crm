import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id);
    const body = await req.json();
    const { role_id } = body;

    const client = await pool.connect();

    try {
      // Update user role
      const result = await client.query(
        "UPDATE public.users SET role_id = $1 WHERE id = $2 RETURNING *",
        [role_id, userId]
      );

      if (result.rows.length === 0) {
        client.release();
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      client.release();
      return NextResponse.json(
        { message: "User role updated successfully", user: result.rows[0] },
        { status: 200 }
      );
    } catch (error: unknown) {
      console.error("Database error:", error);
      client.release();
      let message = "Database error";
      if (error instanceof Error) {
        message = error.message;
      }
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error("Request error:", error);
    let message = "Invalid request";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
