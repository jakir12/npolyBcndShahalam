// Bank Authentication Controllers for Bank Users to Login and Register
// Author: Md. Jamal Uddin
// Date: 22-07-2022

import bcrypt from 'bcryptjs';

import { create, findUserByEmail } from '../db_apis/bank.users.js';
import { FAILED, SUCCESS } from '../utils/status.js';

export async function login(req, res, next) {
  try {
    const context = {};
    context.email = req.body.email;
    context.password = req.body.password;

    const result = await findUserByEmail(context);

    if (result.length === 0)
      return res
        .status(404)
        .json({ status: SUCCESS, message: 'User not found' });

    const isPassMatch = bcrypt.compareSync(
      context.password,
      result[0].password_hash
    );
    if (!isPassMatch)
      return res
        .status(401)
        .json({ status: FAILED, message: 'Password not valid!' });

    const user = {
      id: result[0].id,
      bank_name: result[0].bank_name,
      contact_person: result[0].contact_person,
      phone: result[0].phone,
      email: result[0].email,
      api_kay: result[0].api_kay,
    };

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

function getUserFromRec(req) {
  const { bank_name, contact_person, phone, email, password } = req.body;

  return {
    bank_name,
    contact_person,
    phone,
    email,
    password,
  };
}

export async function register(req, res, next) {
  try {
    let user = getUserFromRec(req);

    user = await create(user);

    return res.status(201).json({ status: SUCCESS, user });
  } catch (err) {
    return next(err);
  }
}
