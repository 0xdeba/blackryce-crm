import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email;

    const result = await pool.query(
      "SELECT role_id FROM public.users WHERE email = $1",
      [email]
    );
    if (result.rows.length > 0) {
      return NextResponse.json(
        { role: result.rows[0].role_id },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error: any) {
    // Cast error to any to safely access error.message
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
