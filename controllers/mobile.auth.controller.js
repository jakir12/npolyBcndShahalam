import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { promisify } from 'util';

import {
  createMobileAppUser,
  findMobileAppUser,
  getOneSalesEmployee,
  updatePassword,
} from '../db_apis/mobile.users.js';

import { generateNewOtp } from '../utils/generateNewOtp.js';
import { FAILED, NOT_FOUND, SUCCESS, UNAUTHORIZED } from '../utils/status.js';
import { verifyOtp } from '../utils/verifyOtp.js';


let hash; // save generated hash


// generate OTP and send it to user
export async function generateOtp(req, res, next) {
  try {
    const context = {};
    context.employee_number = req.body.employee_number;

    const salesEmployee = await getOneSalesEmployee(context);
    const empPhone = salesEmployee ? salesEmployee.phone : '';

    if (empPhone) {
      hash = generateNewOtp(empPhone);
      return res
        .status(200)
        .json({ status: SUCCESS, hash: hash, phone: empPhone });
    }
    return res.status(401).json({
      status: UNAUTHORIZED,
      message: 'You are not authorized for NPOLY Sales.',
    });
  } catch (error) {
    return next(error);
  }
}

export async function verifyUserOtp(req, res, next) {
  try {
    const context = {};
    context.phone = req.body.phone;
    context.otp = req.body.otp;
    context.hash = req.body.hash;

    const verifyResult = verifyOtp(context);

    return res.json({ status: verifyResult });
  } catch (error) {
    return next(error);
  }
}

export async function setPassword(req, res, next) {
  try {
    const context = {};
    context.employee_number = req.body.employee_number;
    context.password = req.body.password;
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(context.password, salt);

    const salesEmp = await getOneSalesEmployee(context);

    if (!salesEmp) {
      return res.status(401).json({
        status: UNAUTHORIZED,
        message: 'You are not authorized for NPOLY Sales.',
      });
    } else if (salesEmp.employeeNumber) {
      const isEmployeeRegistered = await findMobileAppUser(context);

      if (!isEmployeeRegistered) {
        context.employee_number = salesEmp.employeeNumber;
        context.employee_name = salesEmp.employeeName;
        context.password_hash = hashedPassword;
        const user = await createMobileAppUser(context);
        return user
          ? res.status(200).json({
              status: SUCCESS,
              message: 'You are successfully registered.',
            })
          : res.status(401).json({
              status: FAILED,
              message: 'Your registration has been failed. Please try again.',
            });
      } else {
        context.employee_number = salesEmp.employeeNumber;
        context.employee_name = salesEmp.employeeName;
        context.password_hash = hashedPassword;
        const result = await updatePassword(context);
        return result
          ? res.status(201).json({
              status: SUCCESS,
              message: 'You password has been successfully changed.',
            })
          : res.status(401).json({
              status: FAILED,
              message:
                'Your password change has been failed. Please try again.',
            });
      }
    }
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const context = {};
    context.employee_number = req.body.employee_number;
    context.password = req.body.password;
    context.version = req.body.version;
    
    if(context.version !== '3.0.0' || context.version === '' || context.version === null){
      return res
          .status(402)
          .json({ status: 'version_law', message: "Sorry you don't have updated version. Please contact with your ZM" });
    }else {

    const salesEmp = await getOneSalesEmployee(context);

    if (salesEmp === null || salesEmp.length > 1) {
      return res.status(401).json({
        status: UNAUTHORIZED,
        message: 'You are not authorized for NPOLY Sales.',
      });
    } else {
      const isEmployeeRegistered = await findMobileAppUser(context);
      if (isEmployeeRegistered === null) {
        return res
          .status(404)
          .json({ status: NOT_FOUND, message: 'You are not registered yet.' });
      } else {
        const isPasswordCorrect = await bcrypt.compare(
          context.password,
          isEmployeeRegistered.password_hash
        );
        if (isPasswordCorrect) {
          const token = jwt.sign(
            { id: context.employee_number },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
          );
          return res.status(200).json({
            status: SUCCESS,
            data: {
              employeeNumber: salesEmp.employeeNumber,
              employeeName: salesEmp.employeeName,
              phone: salesEmp.phone,
              designation: salesEmp.designation,
              officeIdCard: salesEmp.officeIdCard,
              token,
            },
          });

        } else {
          return res
            .status(401)
            .json({ status: UNAUTHORIZED, message: 'Wrong Password' });
        }
      }
    }
  }
  } catch (err) {
    return next(err);
  }
}

// auth protection middleware
export async function authProtection(req, res, next) {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token || token === '' || token === 'null' || token === 'undefined') {
    return res
      .status(401)
      .json({ status: FAILED, message: 'You are not authorized!' });
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  // 3) Check if user still exists
  const context = {};
  context.employee_number = decoded.id;
  const currentUser = await findMobileAppUser(context);

  if (!currentUser) {
    return res
      .status(401)
      .json({ status: FAILED, message: 'You are not authorized!' });
  }

  next();
}
