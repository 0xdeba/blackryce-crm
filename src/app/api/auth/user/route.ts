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
    const email = body.email;
    const sub = body.sub;

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
        "INSERT INTO public.users (email, auth0_sub) VALUES ($1, $2) RETURNING *",
        [email, sub]
      );
      client.release();
      return NextResponse.json(
        { message: "User registered", user: result.rows[0] },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("Database error:", error); // Log the error for debugging
      client.release();
      return NextResponse.json(
        { error: "Database error", details: error.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Request error:", error); // Log the error for debugging
    return NextResponse.json(
      { error: "Invalid or missing JSON body", details: error.message },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const result = await pool.query("SELECT * FROM roles");
    return NextResponse.json({ roles: result.rows }, { status: 200 });
  } catch (error: any) {
    // Cast error to any to safely access error.message
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
