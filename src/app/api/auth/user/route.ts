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
    // Parse the JSON body from the request
    const body = await req.json();
    const { name, email, sub } = body;

    // Connect to the database
    const client = await pool.connect();

    try {
      // Check if user already exists
      const existingUser = await client.query(
        "SELECT * FROM public.users WHERE email = $1",
        [email]
      );
      if (existingUser.rows.length > 0) {
        client.release();
        return NextResponse.json(
          { error: "User already exists" },
          { status: 409 }
        );
      }

      // Insert new user
      const result = await client.query(
        "INSERT INTO public.users (name, email, auth0_sub) VALUES ($1, $2, $3) RETURNING *",
        [name, email, sub]
      );
      client.release();
      return NextResponse.json(
        { message: "User registered", user: result.rows[0] },
        { status: 201 }
      );
    } catch (error: unknown) {
      console.error("Database error:", error); // Log the error for debugging
      client.release();
      let message = "Database error";
      if (error instanceof Error) {
        message = error.message;
      }
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error("Request error:", error); // Log the error for debugging
    let message = "Invalid or missing JSON body";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM users");
    return NextResponse.json({ roles: result.rows }, { status: 200 });
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
