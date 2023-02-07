import { Router } from 'express';
import { authProtection } from '../../controllers/mobile.auth.controller.js';
import {
  getAllItems,
  getAllItemsByPage,
  getItemsBySubMajorPage,
  getItemById,
  getItemPriceById,
  getItemsBySubMajor,
  getItemByPage,
  searchItem,
  getItemBySubSearchText,
  getItemByMCatSearchText,
  getAllCompItemsByPage,
  getCompItemsBySubMajorPage,
  getCompItemBySubSearchText,
  getCompItemByMCatSearchText
} from '../../controllers/products.controller.js';

const v1ProductsRouter = Router();

v1ProductsRouter.post('/v1/sales/items', authProtection, getAllItems);
v1ProductsRouter.post('/v1/sales/pageWiseItems', authProtection, getAllItemsByPage);
v1ProductsRouter.post('/v1/sales/items/pageWiseSub',authProtection,getItemsBySubMajorPage);
v1ProductsRouter.post('/v1/sales/items/sub',authProtection,getItemsBySubMajor);

v1ProductsRouter.post('/v1/sales/items/item', authProtection, getItemById);
v1ProductsRouter.post(
  '/v1/sales/items/item/price',
  authProtection,
  getItemPriceById
);
v1ProductsRouter.get(
  '/v1/items-page/:offset',
  authProtection,
  getItemByPage
);
v1ProductsRouter.get(
  '/v1/items-search/:itemSearchText',
   authProtection,
    searchItem
);

v1ProductsRouter.post('/v1/search-items-sub', authProtection, getItemBySubSearchText);
v1ProductsRouter.post('/v1/search-items', authProtection, getItemByMCatSearchText);



v1ProductsRouter.post('/v1/sales/pageWiseCompItems', authProtection, getAllCompItemsByPage);
v1ProductsRouter.post('/v1/sales/items/pageWiseCompSub',authProtection,getCompItemsBySubMajorPage);
v1ProductsRouter.post('/v1/search-comp-items-sub', authProtection, getCompItemBySubSearchText);
v1ProductsRouter.post('/v1/search-comp-items', authProtection, getCompItemByMCatSearchText);


export { v1ProductsRouter };
