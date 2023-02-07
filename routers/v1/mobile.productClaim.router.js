import { Router } from 'express';
import { authProtection } from '../../controllers/mobile.auth.controller.js';
import {
  getAllProClaims,
  createProductClaims
} from '../../controllers/mobile.productClaim.controller.js';

const v1MobileProductClaimRouter = Router();

v1MobileProductClaimRouter.post('/v1/claims/allproClaims', authProtection, getAllProClaims);
// create a new order
v1MobileProductClaimRouter.post(
  '/v1/mobile/product-complain/create',
  authProtection,
  createProductClaims
);


export { v1MobileProductClaimRouter };
