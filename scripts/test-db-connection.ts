/**
 * Test script to verify MongoDB database connection
 * Run with: npx tsx scripts/test-db-connection.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...\n');
    
    // Import after dotenv config is loaded
    const { connectToDatabase } = await import('../src/lib/mongodb');
    
    const { db, client } = await connectToDatabase();
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log(`📊 Database: ${db.databaseName}`);
    
    // Test a simple operation
    const collections = await db.listCollections().toArray();
    console.log(`\n📁 Collections found: ${collections.length}`);
    if (collections.length > 0) {
      console.log('Collections:');
      collections.forEach(col => {
        console.log(`  - ${col.name}`);
      });
    }
    
    // Ping the database
    const pingResult = await db.command({ ping: 1 });
    console.log(`\n🏓 Ping result:`, pingResult);
    
    console.log('\n✅ Database connection test completed successfully!');
    
    // Close the connection
    await client.close();
    console.log('🔌 Connection closed.');
    
  } catch (error: any) {
    console.error('\n❌ Database connection test failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('MONGODB_URI')) {
      console.error('\n💡 Make sure you have created a .env.local file with MONGODB_URI set.');
      console.error('   You can copy .env.example to .env.local and update the values.');
    }
    
    process.exit(1);
  }
}

testConnection();

