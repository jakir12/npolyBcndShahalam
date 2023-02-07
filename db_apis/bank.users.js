import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import OracleDB from 'oracledb';

import dotenv from 'dotenv';
dotenv.config();

import { simpleExecute } from '../services/database.js';

const baseQuery = `SELECT 
  id "id", 
  bank_name "bankName",
  contact_person "contactPerson",
  phone "phone",
  email "email",
  password_hash "passwordHash",
  api_key "apiKey"
FROM XX_BANK_USERS`;

const createSql = `insert into XX_BANK_USERS (
    bank_name,
    contact_person,
    phone,
    email,
    password_hash,
    api_key
  ) values (
    :bank_name,
    :contact_person,
    :phone,
    :email,
    :password_hash,
    :api_key
  ) returning id
  into :id`;

export async function create(usr) {
  const user = Object.assign({}, usr);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  const apiKey = jwt.sign({ id: user.email }, process.env.JWT_SECRET_KEY);

  user.id = {
    dir: OracleDB.BIND_OUT,
    type: OracleDB.NUMBER,
  };

  user.password_hash = hashedPassword;
  user.api_key = apiKey;

  const newUser = {
    id: user.id,
    bankName: user.bank_name,
    contactPerson: user.contact_person,
    phone: user.phone,
    email: user.email,
    passwordHash: user.password_hash,
    apiKey: user.api_key,
  };

  const result = await simpleExecute(createSql, newUser);

  newUser.id = result.outBinds.id[0];
  return newUser;
}

export async function findUserByEmail(context) {
  let query = baseQuery;
  const binds = {};

  if (context.email) {
    binds.email = context.email;

    query += `\nwhere email = :email`;
  }

  const result = await simpleExecute(query, binds);
  return result.rows;
}
