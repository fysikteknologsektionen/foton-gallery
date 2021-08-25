/* eslint-disable no-invalid-this */
import {Schema, model} from 'mongoose';

const refreshTokenSchema = new Schema({
  token: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  expiryDate: Date,
});

refreshTokenSchema.virtual('verifyToken').get(function(this: any) {
  return this.expiryDate < Date.now()
});

const refreshTokenModel = model('RefreshToken', refreshTokenSchema);
export {refreshTokenModel as RefreshToken};
