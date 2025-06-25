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

// Update Customer by id
export async function PUT(req: NextRequest) {
  let client;
  try {
    client = await pool.connect();
    const { id, name, email, phone, address } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Customer id is required" },
        { status: 400 }
      );
    }

    const result = await client.query(
      `UPDATE public.customers
       SET name = $1, email = $2, phone = $3, address = $4
       WHERE id = $5
       RETURNING id`,
      [name, email, phone, address, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Customer updated",
      customerID: result.rows[0].id,
    });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}

// Delete by ID
export async function DELETE(req: NextRequest) {
  let client;
  try {
    client = await pool.connect();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Customer id is required" },
        { status: 400 }
      );
    }

    const result = await client.query(
      "DELETE FROM public.customers WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Customer deleted",
      customerID: result.rows[0].id,
    });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
