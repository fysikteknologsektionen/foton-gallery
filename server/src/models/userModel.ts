/* eslint-disable no-invalid-this */
import {Schema, model} from 'mongoose';

import {UserDocument} from '../interfaces';
import bcrypt from 'bcrypt';

const userSchema = new Schema<UserDocument>({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, required: true, enum: ['user', 'admin']},
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

/**
 * Compares a given password to the users password
 * @param password Password to compare with
 * @returns Promise that resolves to true if the passwords
 * matches otherwise false
 */
userSchema.methods.comparePassword = async function(password: string) {
  return bcrypt.compare(password, this.password);
};

export const UserModel = model<UserDocument>('User', userSchema);
