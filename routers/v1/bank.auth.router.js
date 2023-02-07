import { Router } from 'express';
import { login, register } from '../../controllers/bank.auth.controller.js';

const v1BankAuthRouter = Router();

v1BankAuthRouter.post('/v1/bank/auth/register', register);
v1BankAuthRouter.post('/v1/bank/auth/login', login);

export { v1BankAuthRouter };
