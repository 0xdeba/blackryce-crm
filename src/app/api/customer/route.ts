import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

// Connection string for PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

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
  } catch (err: any) {
    return NextResponse.json({
      error: err,
    });
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Get all customers
export async function GET() {
  let client;
  try {
    client = await pool.connect();
    const data = await client.query(
      "SELECT id, name, email, phone, address from public.customers"
    );
    return NextResponse.json({
      data: data.rows,
    });
  } catch (err: any) {
    return NextResponse.json({
      message: "Server issue",
      error: err,
    });
  } finally {
    if (client) client.release();
  }
}
