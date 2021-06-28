import '../db';
import {UserModel} from '../models';
import {User} from '../interfaces';

const userData: Partial<User> = {
  email: 'foo@bar.com',
  password: 'admin',
  isAdmin: true,
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
  console.log(`Email: ${userData.email}, Password: ${userData.password}`);
  createExampleUser();
} else {
  console.error('For security reasons this script can only be run directly.');
}
