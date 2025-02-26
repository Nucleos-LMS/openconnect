import { createClient } from '@vercel/postgres';
import { randomUUID } from 'crypto';

async function seedTestAccounts() {
  console.log('Seeding test accounts...');
  
  const client = createClient();
  await client.connect();
  
  try {
    // Create test accounts for different roles
    const testAccounts = [
      {
        id: randomUUID(),
        email: 'inmate@test.facility.com',
        name: 'Test Inmate',
        role: 'incarcerated',
        facility_id: 'facility_001',
        password: 'password123' // In production, this would be hashed
      },
      {
        id: randomUUID(),
        email: 'family@test.facility.com',
        name: 'Test Family',
        role: 'family',
        facility_id: 'facility_001',
        password: 'password123' // In production, this would be hashed
      },
      {
        id: randomUUID(),
        email: 'staff@test.facility.com',
        name: 'Test Staff',
        role: 'staff',
        facility_id: 'facility_001',
        password: 'password123' // In production, this would be hashed
      }
    ];
    
    // Insert each test account
    for (const account of testAccounts) {
      const { id, email, name, role, facility_id, password } = account;
      
      // Check if account already exists
      const { rows } = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      if (rows.length > 0) {
        console.log(`Account with email ${email} already exists, skipping...`);
        continue;
      }
      
      // Insert new account
      await client.query(
        'INSERT INTO users (id, email, name, role, facility_id, password) VALUES ($1, $2, $3, $4, $5, $6)',
        [id, email, name, role, facility_id, password]
      );
      
      console.log(`Created test account: ${role} (${email})`);
    }
    
    console.log('Test accounts seeded successfully!');
  } catch (error) {
    console.error('Error seeding test accounts:', error);
  } finally {
    await client.end();
  }
}

seedTestAccounts();
