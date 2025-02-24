declare module '@vercel/postgres' {
  export interface VercelPoolClient {
    connect(): Promise<void>;
    query<T = any>(queryText: string, values?: any[]): Promise<{ rows: T[] }>;
    end(): Promise<void>;
  }

  export function createClient(): VercelPoolClient;
}
