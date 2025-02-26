// scripts/create-test-accounts.js
const { createClient } = require('@vercel/postgres');

async function createTestAccounts() {
  const client = createClient();
  await client.connect();

  try {
    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('Creating users table...');
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255),
          role VARCHAR(50) NOT NULL,
          facility_id VARCHAR(100) NOT NULL,
          password VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }

    // Create test accounts
    const testAccounts = [
      {
        email: 'inmate@test.facility.com',
        name: 'Test Inmate',
        role: 'incarcerated',
        facility_id: 'facility_001',
        password: 'password123'
      },
      {
        email: 'family@test.facility.com',
        name: 'Test Family',
        role: 'family',
        facility_id: 'facility_001',
        password: 'password123'
      },
      {
        email: 'staff@test.facility.com',
        name: 'Test Staff',
        role: 'staff',
        facility_id: 'facility_001',
        password: 'password123'
      }
    ];

    for (const account of testAccounts) {
      // Check if user already exists
      const userCheck = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [account.email]
      );

      if (userCheck.rows.length === 0) {
        // Insert new user
        await client.query(
          `INSERT INTO users (email, name, role, facility_id, password) 
           VALUES ($1, $2, $3, $4, $5)`,
          [account.email, account.name, account.role, account.facility_id, account.password]
        );
        console.log(`Created test account: ${account.email}`);
      } else {
        console.log(`Test account already exists: ${account.email}`);
      }
    }

    console.log('Test accounts created successfully!');
  } catch (error) {
    console.error('Error creating test accounts:', error);
  } finally {
    await client.end();
  }
}

createTestAccounts();
