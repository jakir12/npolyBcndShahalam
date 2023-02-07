import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config();

const BL_SMS_USER = process.env.BL_SMS_USER;
const BL_SMS_PASS = process.env.BL_SMS_PASS;

export function sendSMS(phone, message) {
  axios.get(
    `https://vas.banglalink.net/sendSMS/sendSMS?msisdn=88${phone}&message=${message}&userID=${BL_SMS_USER}&passwd=${BL_SMS_PASS}&sender=NPOLY`
  );
}
