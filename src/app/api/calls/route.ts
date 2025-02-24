import { NextResponse } from 'next/server';
import { createClient } from '@vercel/postgres';

export const runtime = 'edge';

export async function GET(request: Request) {
  const client = createClient();
  await client.connect();
  
  try {
    const { rows } = await client.query('SELECT * FROM calls ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch calls' }, { status: 500 });
  } finally {
    await client.end();
  }
}

export async function POST(request: Request) {
  const client = createClient();
  await client.connect();
  
  try {
    const { facilityId, scheduledStart } = await request.json();
    const { rows } = await client.query(
      'INSERT INTO calls (facility_id, scheduled_start, status) VALUES ($1, $2, $3) RETURNING *',
      [facilityId, scheduledStart, 'scheduled']
    );
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create call' }, { status: 500 });
  } finally {
    await client.end();
  }
}
