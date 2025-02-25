import { createClient } from '@vercel/postgres';

async function seedDatabase() {
  const client = createClient();
  await client.connect();

  try {
    // Create users table
    await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'visitor',
        facility_id UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Insert test user
    await client.sql`
      INSERT INTO users (email, name, role)
      VALUES ('visitor@example.com', 'Test Visitor', 'visitor')
      ON CONFLICT (email) DO NOTHING;
    `;

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

seedDatabase();
