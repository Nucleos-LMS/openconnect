import { VercelPoolClient } from '@vercel/postgres';

export type DbClient = VercelPoolClient;
export type DbError = Error & { code?: string };
