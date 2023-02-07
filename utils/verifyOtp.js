import { createHmac } from 'crypto';

import dotenv from 'dotenv';
import { EXPIRED, FAILED, SUCCESS } from './status.js';
dotenv.config();

export function verifyOtp(context) {
  const { phone, otp, hash } = context;
  // Separate Hash value and expires from the hash returned from the user
  let [hashValue, expires] = hash.split('.');
  // Check if expiry time has passed
  let now = Date.now();
  if (now > parseInt(expires)) return EXPIRED;
  // Calculate new hash with the same key and the same algorithm
  let data = `${phone}.${otp}.${expires}`;
  let newCalculatedHash = createHmac('sha256', process.env.OTP_SECRET_KEY)
    .update(data)
    .digest('hex');
  return newCalculatedHash === hashValue ? SUCCESS : FAILED;
}
