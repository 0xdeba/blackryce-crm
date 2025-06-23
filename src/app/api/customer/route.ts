import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

// Connection string for PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

function hasCodeProperty(error: unknown): error is { code: string } {
  return typeof error === "object" && error !== null && "code" in error;
}

// Add a new customer
export async function POST(req: NextRequest) {
  let client;
  try {
    client = await pool.connect();
    const { name, email, phone, address } = await req.json();
    const data = await client.query(
      "INSERT INTO public.customers (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, email, phone, address]
    );

    return NextResponse.json({
      message: "Customer added",
      customerID: data.rows[0].id,
    });
  } catch (err: unknown) {
    if (hasCodeProperty(err) && err.code === "23505") {
      return NextResponse.json(
        {
          error: "Email already exists",
        },
        { status: 409 }
      );
    }
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Get all customers
export async function GET(req: NextRequest) {
  let client;
  let data;
  try {
    client = await pool.connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      data = await client.query(
        `SELECT id, name, email, phone, address from public.customers WHERE id = $1`,
        [id]
      );
    } else {
      data = await client.query(
        "SELECT id, name, email, phone, address from public.customers"
      );
    }
    return NextResponse.json({
      data: data.rows,
    });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json({
      message: "Server issue",
      error: message,
    });
  } finally {
    if (client) client.release();
  }
}
