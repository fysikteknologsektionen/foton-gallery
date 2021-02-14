import { Model, model, Schema } from 'mongoose';
import { User } from '../types';
import bcrypt from 'bcrypt';

const userSchema: Schema = new Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true }
});

userSchema.pre<User>('save', async function(next) {
  const user: User = this;
  const hash: string = await bcrypt.hash(user.password, 12);
  user.password = hash;
  next();
});

const UserModel: Model<User> = model('User', userSchema);

export default UserModel;