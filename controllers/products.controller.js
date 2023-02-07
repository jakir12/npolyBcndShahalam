import { getItem,
   getItems,
   getItemsByPageCat,
   getItemWisePage,
   getSearchItem,
   searchItemBySubCatText,
   searchItemByMCatText,
   getItemsByPageSubCat,
   getCompItemsByPageCat,
   getCompItemsByPageSubCat,
   getCompItemBySubSearch,
   searchCompItemByMCat
   } from '../db_apis/products.js';
import { NOT_FOUND, SUCCESS } from '../utils/status.js';

// get all items from database by mother category and price list
export async function getAllItems(req, res, next) {
  try {
    const context = {};

    context.mother_category = req.body.mother_category;
    context.price_list_id = req.body.price_list_id;
    
    const items = await getItems(context);
    return items
      ? res.status(200).json({
          len: items.length,
          data: items,
        })
      : res.status(404).json({
          len: 0,
          data: [],
        });
  } catch (error) {
    return next(error);
  }
}

// get all items from database by mother category and price list
export async function getAllItemsByPage(req, res, next) {
  try {
    const context = {};

    context.mother_category = req.body.mother_category;
    context.ordId = req.body.ordId;
    context.price_list_id = req.body.price_list_id;
    context.offset = req.body.offset;
    
    const items = await getItemsByPageCat(context);

    return items
      ? res.status(200).json({
          len: items.length,
          data: items,
        })
      : res.status(404).json({
          len: 0,
          data: [],
        });
  } catch (error) {
    return next(error);
  }
}

// get items from database by sub category and price list
export async function getItemsBySubMajorPage(req, res, next) {
  try {
    const context = {};

    context.mother_category = req.body.mother_category;
    context.price_list_id = req.body.price_list_id;
    context.sub_major_category = req.body.sub_major_category;
    context.ordId = req.body.ordId;
    context.offset = req.body.offset;

    const items = await getItemsByPageSubCat(context);

    return items
      ? res.status(200).json({ len: items.length, data: items })
      : res.status(404).json({ len: 0, data: [] });
  } catch (error) {
    return next(error);
  }
}

// get items from database by sub category and price list
export async function getItemsBySubMajor(req, res, next) {
  try {
    const context = {};

    context.mother_category = req.body.mother_category;
    context.price_list_id = req.body.price_list_id;
    context.sub_major_category = req.body.sub_major_category;
    
    const items = await getItems(context);

    return items
      ? res.status(200).json({ len: items.length, data: items })
      : res.status(404).json({ len: 0, data: [] });
  } catch (error) {
    return next(error);
  }
}

// get item from database by id
export async function getItemById(req, res, next) {
  try {
    const context = {};

    context.inventory_item_id = req.body.inventory_item_id;
    context.orgId = req.body.orgId;

    const item = await getItem(context);

    return item
      ? res.status(200).json({ status: SUCCESS, data: item })
      : res.status(404).json({ status: NOT_FOUND, data: {} });
  } catch (error) {
    return next(error);
  }
}

// get item price from database by id
export async function getItemPriceById(req, res, next) {
  try {
    const context = {};
    context.inventory_item_id = req.body.inventory_item_id;

    const item = await getItem(context);

    return item
      ? res.status(200).json({
          status: SUCCESS,
          data: {
            netPrice: parseFloat(item.netPrice.toFixed(2)),
            grossPrice: item.grossPrice,
          },
        })
      : res.status(404).json({ status: NOT_FOUND, data: {} });
  } catch (error) {
    return next(error);
  }
}

// get items by Page
export async function getItemByPage(req, res, next) {
  try {

    const context = {};
    context.offset = req.params.offset;
    const items = await getItemWisePage(context);

    return items
      ? res.status(200).json({
          len: items.length,
          data: items,
        })
      : res.status(404).json({
          len: 0,
          data: [],
        });
  } catch (error) {
    return next(error);
  }
}
// get item from database by searchtext
export async function searchItem(req, res, next) {
  try {
    const context = {};
    context.itemSearchText = req.params.itemSearchText;
    
    const items = await getSearchItem(context);
    return items
    ? res.status(200).json({
        len: items.length,
        data: items,
      })
    : res.status(404).json({
        len: 0,
        data: [],
      });
    } catch (error) {
      return next(error);
    }
}

// get item from database by 
export async function getItemBySubSearchText(req, res, next) {
  try {
    const context = {};
    context.mother_category = req.body.mother_category;
    context.ordId = req.body.ordId;
    context.price_list_id = req.body.price_list_id;
    context.sub_major_category = req.body.sub_major_category;
    context.searchText = req.body.searchText;
    
    const items = await searchItemBySubCatText(context);
    return items
    ? res.status(200).json({
        len: items.length,
        data: items,
      })
    : res.status(404).json({
        len: 0,
        data: [],
      });
    } catch (error) {
      return next(error);
    }
}

// get item from database by 
export async function getItemByMCatSearchText(req, res, next) {
  try {
    const context = {};
    context.mother_category = req.body.mother_category;
    context.ordId = req.body.ordId;
    context.price_list_id = req.body.price_list_id;
    context.searchText = req.body.searchText;
    
    const items = await searchItemByMCatText(context);
    return items
    ? res.status(200).json({
        len: items.length,
        data: items,
      })
    : res.status(404).json({
        len: 0,
        data: [],
      });
    } catch (error) {
      return next(error);
    }
}


// get all items from database by mother category and price list
export async function getAllCompItemsByPage(req, res, next) {
  try {
    const context = {};

    context.mother_category = req.body.mother_category;
    context.ordId = req.body.ordId;
    context.offset = req.body.offset;
    
    const items = await getCompItemsByPageCat(context);

    return items
      ? res.status(200).json({
          len: items.length,
          data: items,
        })
      : res.status(404).json({
          len: 0,
          data: [],
        });
  } catch (error) {
    return next(error);
  }
}

// get items from database by sub category and price list
export async function getCompItemsBySubMajorPage(req, res, next) {
  try {
    const context = {};

    context.mother_category = req.body.mother_category;
    context.sub_major_category = req.body.sub_major_category;
    context.ordId = req.body.ordId;
    context.offset = req.body.offset;

    const items = await getCompItemsByPageSubCat(context);

    return items
      ? res.status(200).json({ len: items.length, data: items })
      : res.status(404).json({ len: 0, data: [] });
  } catch (error) {
    return next(error);
  }
}

// get item from database by 
export async function getCompItemBySubSearchText(req, res, next) {
  try {
    const context = {};
    context.mother_category = req.body.mother_category;
    context.ordId = req.body.ordId;
    context.sub_major_category = req.body.sub_major_category;
    context.searchText = req.body.searchText;
    
    const items = await getCompItemBySubSearch(context);
    return items
    ? res.status(200).json({
        len: items.length,
        data: items,
      })
    : res.status(404).json({
        len: 0,
        data: [],
      });
    } catch (error) {
      return next(error);
    }
}

// get item from database by 
export async function getCompItemByMCatSearchText(req, res, next) {
  try {
    const context = {};
    context.mother_category = req.body.mother_category;
    context.ordId = req.body.ordId;
    context.searchText = req.body.searchText;
    
    const items = await searchCompItemByMCat(context);
    return items
    ? res.status(200).json({
        len: items.length,
        data: items,
      })
    : res.status(404).json({
        len: 0,
        data: [],
      });
    } catch (error) {
      return next(error);
    }
}