import { Router } from 'express';
import {
  getAllProductTypes,
  getCustomerProductTypes,
  getMinorCategories,
  getMotherCategories,
  getSubCategories,
} from '../../controllers/categories.controller.js';
import { authProtection } from '../../controllers/mobile.auth.controller.js';

const v1CategoriesRouter = Router();
// get all product types
v1CategoriesRouter.get(
  '/v1/sales/product-types',
  authProtection,
  getAllProductTypes
);
// get product types by customer
v1CategoriesRouter.post(
  '/v1/sales/product-types',
  authProtection,
  getCustomerProductTypes
);
// get product types by customer and sales person
v1CategoriesRouter.post(
  '/v1/sales/product-types',
  authProtection,
  getCustomerProductTypes
);
// get all mother categories
v1CategoriesRouter.get(
  '/v1/sales/mother/categories',
  authProtection,
  getMotherCategories
);
// get all mother categories by product type
v1CategoriesRouter.post(
  '/v1/sales/mother/categories',
  authProtection,
  getMotherCategories
);
// get all sub categories by product type and mother category
v1CategoriesRouter.post(
  '/v1/sales/sub/categories',
  authProtection,
  getSubCategories
);
// get all sub categories by product type, mother category and sub major category
v1CategoriesRouter.post(
  '/v1/sales/minor/categories',
  authProtection,
  getMinorCategories
);

export { v1CategoriesRouter };
