import { Router } from 'express';
import {
  addAvatar,
  getAllDSM,
  getAllSR,
  getAllZM,
  getEmployee,
  getEmployees,
  getOneDSM,
  getOneSR,
  getOneZM,
  upload,
  uploadErrorHandler,
} from '../../controllers/employees.controller.js';

import { authProtection } from '../../controllers/mobile.auth.controller.js';

const v1EmployeesRouter = Router();

v1EmployeesRouter.get('/v1/employees/', authProtection, getEmployees);
v1EmployeesRouter.get(
  '/v1/employees/:employee_number',
  authProtection,
  getEmployee
);
v1EmployeesRouter.get(
  '/v1/employees/phone/:phone',
  authProtection,
  getEmployee
);
v1EmployeesRouter.post('/v1/employees/', authProtection, getEmployee);
v1EmployeesRouter.get('/v1/employees/sales/sr/', authProtection, getAllSR);
v1EmployeesRouter.get(
  '/v1/employees/sales/sr/:employee_number',
  authProtection,
  getOneSR
);
v1EmployeesRouter.get('/v1/employees/sales/zm/', authProtection, getAllZM);
v1EmployeesRouter.get(
  '/v1/employees/sales/zm/:employee_number',
  authProtection,
  getOneZM
);
v1EmployeesRouter.get('/v1/employees/sales/dsm/', authProtection, getAllDSM);
v1EmployeesRouter.get(
  '/v1/employees/sales/dsm/:employee_number',
  authProtection,
  getOneDSM
);
v1EmployeesRouter.post(
  '/v1/employees/:employee_number/avatar',
  upload.single('avatar'),
  uploadErrorHandler,
  authProtection,
  addAvatar
);

export { v1EmployeesRouter };
