import crypto from 'crypto';
import { generate } from 'otp-generator';

import dotenv from 'dotenv';
dotenv.config();

import { sendSMS } from './sendSMS.js';

export function generateNewOtp(phone) {
  // Generate a 6 digit numeric OTP
  const otp = generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  const ttl = 3 * 60 * 1000; // 3 Minutes in milliseconds
  const expires = Date.now() + ttl; // timestamp to 3 minutes in the future
  const data = `${phone}.${otp}.${expires}`; // phone.otp.expiry_timestamp
  const hash = crypto
    .createHmac('sha256', process.env.OTP_SECRET_KEY)
    .update(data)
    .digest('hex'); // creating SHA256 hash of the data
  const fullHash = `${hash}.${expires}`; // Hash.expires, format to send to the user
  const duration = ttl / 1000 / 60;
  const message = `${otp} is your NPOLY Sales OTP with ${duration} minutes validity. Do not share this OTP with anyone.`;
  sendSMS(phone, message); // send sms to the user with otp and message
  return fullHash;
}
