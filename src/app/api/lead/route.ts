import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

function hasCodeProperty(error: unknown): error is { code: string } {
  return typeof error === "object" && error !== null && "code" in error;
}

// Add a new lead
export async function POST(req: NextRequest) {
  let client;
  try {
    client = await pool.connect();
    const { name, email, phone, address, status_id, assigned_to } =
      await req.json();
    const data = await client.query(
      `INSERT INTO public.leads (name, email, phone, address, status_id, assigned_to) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [name, email, phone, address, status_id, assigned_to]
    );
    return NextResponse.json({
      message: "Lead added",
      leadID: data.rows[0].id,
    });
  } catch (err: unknown) {
    if (hasCodeProperty(err) && err.code === "23505") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}

// Get all leads or a single lead by id
export async function GET(req: NextRequest) {
  let client;
  let data;
  try {
    client = await pool.connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      data = await client.query(
        `SELECT id, name, email, phone, address, status_id, assigned_to FROM public.leads WHERE id = $1`,
        [id]
      );
    } else {
      data = await client.query(
        `SELECT id, name, email, phone, address, status_id, assigned_to FROM public.leads`
      );
    }
    return NextResponse.json({ data: data.rows });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ message: "Server issue", error: message });
  } finally {
    if (client) client.release();
  }
}

// Update lead by id
export async function PUT(req: NextRequest) {
  let client;
  try {
    client = await pool.connect();
    const { id, name, email, phone, address, status_id, assigned_to } =
      await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Lead id is required" },
        { status: 400 }
      );
    }
    const result = await client.query(
      `UPDATE public.leads SET name = $1, email = $2, phone = $3, address = $4, status_id = $5, assigned_to = $6 WHERE id = $7 RETURNING id`,
      [name, email, phone, address, status_id, assigned_to, id]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Lead updated",
      leadID: result.rows[0].id,
    });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}

// Delete lead by id
export async function DELETE(req: NextRequest) {
  let client;
  try {
    client = await pool.connect();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Lead id is required" },
        { status: 400 }
      );
    }
    const result = await client.query(
      `DELETE FROM public.leads WHERE id = $1 RETURNING id`,
      [id]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Lead deleted",
      leadID: result.rows[0].id,
    });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
