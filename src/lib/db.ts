import { createClient } from '@vercel/postgres';

export function getClient() {
  const client = createClient();
  return client;
}

export async function withClient<T>(fn: (client: ReturnType<typeof createClient>) => Promise<T>): Promise<T> {
  const client = getClient();
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}
