import { Router } from 'express';
import {
  generateOtp,
  login,
  setPassword,
  verifyUserOtp,
} from '../../controllers/mobile.auth.controller.js';

const v1MobileAuthRouter = Router();

v1MobileAuthRouter.post('/v1/mobile/auth/generate-otp', generateOtp);
v1MobileAuthRouter.post('/v1/mobile/auth/verify-otp', verifyUserOtp);
v1MobileAuthRouter.post('/v1/mobile/auth/password', setPassword);
v1MobileAuthRouter.post('/v1/mobile/auth/login', login);

export { v1MobileAuthRouter };
