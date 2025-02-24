import { createClient } from '@vercel/postgres';
import { DbClient, DbError } from './db.types';

export function getClient() {
  const client = createClient();
  return client;
}

export async function withClient<T>(fn: (client: DbClient) => Promise<T>): Promise<T> {
  const client = getClient();
  await client.connect();
  try {
    return await fn(client);
  } catch (error) {
    const dbError = error as DbError;
    throw dbError;
  } finally {
    await client.end();
  }
}
