import { NextResponse } from 'next/server';
import { withClient } from '@/lib/db';
import type { DbClient, DbError } from '@/lib/db.types';

export const runtime = 'edge';

export async function GET(request: Request) {
  return withClient(async (client: DbClient) => {
    const { rows } = await client.query('SELECT * FROM calls ORDER BY created_at DESC');
    return NextResponse.json(rows);
  }).catch((error: DbError) => {
    console.error('Failed to fetch calls:', error);
    return NextResponse.json({ error: 'Failed to fetch calls' }, { status: 500 });
  });
}

export async function POST(request: Request) {
  return withClient(async (client: DbClient) => {
    const { facilityId, scheduledStart } = await request.json();
    const { rows } = await client.query(
      'INSERT INTO calls (facility_id, scheduled_start, status) VALUES ($1, $2, $3) RETURNING *',
      [facilityId, scheduledStart, 'scheduled']
    );
    return NextResponse.json(rows[0]);
  }).catch((error: DbError) => {
    console.error('Failed to create call:', error);
    return NextResponse.json({ error: 'Failed to create call' }, { status: 500 });
  });
}
