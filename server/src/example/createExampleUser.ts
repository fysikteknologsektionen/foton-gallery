import '../db';
import { UserModel } from '../models';
import { User } from '../types';

const userData: Partial<User> = {
  email: 'foo@bar.com',
  password: 'admin',
  isAdmin: true
};

async function createExampleUser () {
  try {
    const user: User = new UserModel({ ...userData });
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
}
else {
  console.error('For security reasons this script can only be run directly.');
}