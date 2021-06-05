import { Model, model, Schema } from 'mongoose';
import { User } from '../types';
import bcrypt from 'bcrypt';

const userSchema: Schema<User> = new Schema<User>({
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true }
});

/**
 * Hashes the password before saving it
 */
userSchema.pre('save', async function (next) {
  const hash: string = await bcrypt.hash(this.password, 12);
  this.password = hash;
  next();
});

userSchema.methods.comparePassword = function (password: string) {
  return this.password === password;
};

export const UserModel: Model<User> = model('User', userSchema);