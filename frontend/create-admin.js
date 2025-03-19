// create-admin.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

// Initialize Prisma Client
const prisma = new PrismaClient();

// Get command line arguments
const args = process.argv.slice(2);
const username = args[0];
const email = args[1];
const password = args[2];

if (!username || !email || !password) {
  console.error('Usage: node create-admin.js <username> <email> <password>');
  process.exit(1);
}

async function createAdminUser() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      console.error('Error: User with this username or email already exists');
      process.exit(1);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the admin user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'Admin'
      }
    });

    console.log('✅ Admin user created successfully:');
    console.log(`Username: ${user.username}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();