require('dotenv').config({ path: '.env.production' });
const { createPool } = require('@vercel/postgres');

async function seedTestAccounts() {
  console.log('Seeding test accounts...');
  
  // Use environment variables for database connection
  const pool = createPool({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    console.log('Connected to database');
    
    // Create test accounts for different roles
    const testAccounts = [
      {
        email: 'inmate@test.facility.com',
        name: 'Test Inmate',
        role: 'incarcerated',
        facility_id: 'facility_001'
      },
      {
        email: 'family@test.facility.com',
        name: 'Test Family',
        role: 'family',
        facility_id: 'facility_001'
      },
      {
        email: 'staff@test.facility.com',
        name: 'Test Staff',
        role: 'staff',
        facility_id: 'facility_001'
      }
    ];
    
    // Insert each test account
    for (const account of testAccounts) {
      const { email, name, role, facility_id } = account;
      
      // Check if account already exists
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      if (rows.length > 0) {
        console.log(`Account with email ${email} already exists, skipping...`);
        continue;
      }
      
      // Insert new account - let the database auto-increment the ID
      await pool.query(
        'INSERT INTO users (email, name, role, facility_id) VALUES ($1, $2, $3, $4)',
        [email, name, role, facility_id]
      );
      
      console.log(`Created test account: ${role} (${email})`);
    }
    
    console.log('Test accounts seeded successfully!');
  } catch (error) {
    console.error('Error seeding test accounts:', error);
  } finally {
    await pool.end();
  }
}

seedTestAccounts();
