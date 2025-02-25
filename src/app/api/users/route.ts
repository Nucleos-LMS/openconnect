import { NextResponse } from 'next/server';
import { withClient } from '@/lib/db';
import type { DbClient, DbError } from '@/lib/db.types';

export const runtime = 'edge';

export async function GET(request: Request) {
  return withClient(async (client: DbClient) => {
    const { rows } = await client.query('SELECT id, email, name, role FROM users');
    return NextResponse.json(rows);
  }).catch((error: DbError) => {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  });
}

export async function POST(request: Request) {
  return withClient(async (client: DbClient) => {
    const { email, name, role } = await request.json();
    const { rows } = await client.query(
      'INSERT INTO users (email, name, role) VALUES ($1, $2, $3) RETURNING id, email, name, role',
      [email, name, role]
    );
    return NextResponse.json(rows[0]);
  }).catch((error: DbError) => {
    console.error('Failed to create user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  });
}
