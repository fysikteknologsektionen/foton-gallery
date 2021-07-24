import '../config';

import {User} from '../app/models';

/**
 * Creates a new user
 * @param username Username for new user
 * @param password Password for new user
 * @param role Role for new user
 */
async function createUser(username: string, password: string, role: string) {
  console.log('Creating a new user with:');
  console.log(
      `Username: ${username}, 
        Password: ${password}, 
        Role: ${role}`,
  );

  try {
    const userDoc = new User({username, password, role});
    await userDoc.save();
  } catch (error) {
    console.error();
  }

  process.exit();
}

if (require.main == module) {
  const args = process.argv.slice(2);
  const username = args[0];
  const password = args[1];
  const role = args[2];

  if (!username || !password || !role || !['user', 'admin'].includes(role)) {
    console.error('Invalid arguments. Usage:');
    console.error(
        '> createUser <username> <password> <role ("user" or "admin")>',
    );
    process.exit(1);
  }

  createUser(username, password, role);
} else {
  console.error('This file can only be run directly');
}
