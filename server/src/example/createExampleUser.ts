import '../db';

import {User} from '../interfaces';
import {UserModel} from '../models';

const userData: Partial<User> = {
  username: 'foo',
  password: 'bar',
  role: 'admin',
};

/**
 * Creates an example user
 */
async function createExampleUser() {
  try {
    const user = new UserModel({...userData});
    await user.save();
  } catch (error) {
    console.error(error);
  }
  process.exit();
}

if (require.main == module) {
  console.log('Attempting to creating an example user...');
  console.log(`Username: ${userData.username}, Password: ${userData.password}`);
  createExampleUser();
} else {
  console.error('For security reasons this script can only be run directly.');
}
