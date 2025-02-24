import { NextResponse } from 'next/server';
import { createClient } from '@vercel/postgres';

export const runtime = 'edge';

export async function GET(request: Request) {
  const client = createClient();
  await client.connect();
  
  try {
    const { rows } = await client.query('SELECT id, email, name, role FROM users');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  } finally {
    await client.end();
  }
}

export async function POST(request: Request) {
  const client = createClient();
  await client.connect();
  
  try {
    const { email, name, role } = await request.json();
    const { rows } = await client.query(
      'INSERT INTO users (email, name, role) VALUES ($1, $2, $3) RETURNING id, email, name, role',
      [email, name, role]
    );
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  } finally {
    await client.end();
  }
}
