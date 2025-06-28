import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("email");

    const client = await pool.connect();
    try {
      let query = `
        SELECT l.id, l.name, l.email, l.phone, l.address,
               l.status_id, s.name AS status_name,
               l.assigned_to, u.name AS assigned_to_name,
               l.created_at
        FROM leads l
        LEFT JOIN lead_statuses s ON l.status_id = s.id
        LEFT JOIN users u ON l.assigned_to = u.id
      `;

      const queryParams: number[] = [];

      // If userEmail is provided, check user role and filter accordingly
      if (userEmail) {
        // Get user role
        const userResult = await client.query(
          "SELECT id, role_id FROM users WHERE email = $1",
          [userEmail]
        );

        if (userResult.rows.length > 0) {
          const user = userResult.rows[0];
          const userRole = user.role_id;
          const userId = user.id;

          // If user is not admin (role_id = 1), filter to only assigned leads
          if (userRole !== 1) {
            query += " WHERE l.assigned_to = $1";
            queryParams.push(userId);
          }
        }
      }

      query += " ORDER BY l.id DESC";

      const result = await client.query(query, queryParams);
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
