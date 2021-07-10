/* eslint-disable no-invalid-this */
import {Schema, model} from 'mongoose';

import {User as IUser} from '../../interfaces';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUser>({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, required: true},
});

/**
 * Hash passwords before saving them
 */
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
  }
  next();
});

export const User = model<IUser>('User', userSchema);
