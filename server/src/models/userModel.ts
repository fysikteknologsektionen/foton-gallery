/* eslint-disable no-invalid-this */
import {model, Schema} from 'mongoose';
import {UserDocument} from '../interfaces';
import bcrypt from 'bcrypt';

const userSchema = new Schema<UserDocument>({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  isAdmin: {type: Boolean, required: true},
});

userSchema.index({email: 1}, {unique: true});

// Hashes the password before saving it
userSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  next();
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const UserModel = model<UserDocument>('User', userSchema);
