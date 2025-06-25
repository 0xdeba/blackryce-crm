import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      // Join leads, lead_statuses, and users for display
      const result = await client.query(`
        SELECT l.id, l.name, l.email, l.phone, l.address,
               l.status_id, s.name AS status_name,
               l.assigned_to, u.name AS assigned_to_name
        FROM leads l
        LEFT JOIN lead_statuses s ON l.status_id = s.id
        LEFT JOIN users u ON l.assigned_to = u.id
        ORDER BY l.id DESC
      `);
      client.release();
      return NextResponse.json({ data: result.rows }, { status: 200 });
    } catch (error: unknown) {
      client.release();
      let message = "Database error";
      if (error instanceof Error) message = error.message;
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
