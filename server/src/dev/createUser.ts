import '../config';

import {UserAuthenicationData, UserSession} from '../interfaces';

import {User} from '../app/models';

/**
 * Creates a new user
 */
async function createUser() {
  const user: UserAuthenicationData & UserSession = {
    username: 'admin',
    password: 'admin',
    role: 'admin',
  };

  console.log('Creating a new user with:');
  console.log(
      `Username: ${user.username}, 
        Password: ${user.password}, 
        Role: ${user.role}`,
  );

  try {
    const userDoc = new User({...user});
    await userDoc.save();
  } catch (error) {
    console.error();
  }

  process.exit();
}

if (require.main == module) {
  createUser();
} else {
  console.error('This file can only be run directly');
}
