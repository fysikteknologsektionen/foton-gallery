/* eslint-disable no-invalid-this */
import {Schema, model} from 'mongoose';

const refreshTokenSchema = new Schema({
  jwtToken: String,
});

const refreshTokenModel = model('RefreshToken', refreshTokenSchema);
export {refreshTokenModel as RefreshToken};
