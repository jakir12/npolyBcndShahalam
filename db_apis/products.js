import { simpleExecute } from '../services/database.js';

const baseQuery = `SELECT 
    INVENTORY_ITEM_ID "invItemId",
    MOTHER_CAT "motherCat",
    CONCATENATED_SEGMENTS "itemCode",
    DESCRIPTION "description",
    UOM_CODE "uom",
    LIST_PRICE "grossPrice",
    LIST_LINE_ID "priceListLineId",
    LIST_HEADER_ID "priceListHeaderId",
    NAME "priceListName",
    NET_PRICE "netPrice",
    CURRENCY_CODE "currency"
  FROM APPS.XX_MAPRICING_V@SALES
 WHERE NET_PRICE IS NOT NULL`;

export async function getItems(context) {
  let query = baseQuery;
  const binds = {};

  if (context.mother_category && context.price_list_id) {
    binds.mother_cat = context.mother_category;
    binds.list_header_id = context.price_list_id;
    
    query += `\nAND MOTHER_CAT = :mother_cat`;
    query += `\nAND LIST_HEADER_ID = :list_header_id`;
  }

  if (context.sub_major_category) {
    binds.sub_major_category = context.sub_major_category;
    query += `\nAND SUB_MAJOR = :sub_major_category`;
  }

  query += `\nORDER BY CONCATENATED_SEGMENTS ASC`;
  
  const result = await simpleExecute(query, binds);
  return result.rows !== null ? result.rows : null;
}

export async function getItemsByPageCat(context) {
  let query = baseQuery;
  const binds = {};

  if (context.mother_category && context.price_list_id) {
    binds.mother_cat = context.mother_category;
    binds.ordId = context.ordId;
    binds.list_header_id = context.price_list_id;
    binds.offset = context.offset;

    query += `\nAND MOTHER_CAT = :mother_cat`;
    query += `\nAND ORG_ID = :ordId`;
    query += `\nAND LIST_HEADER_ID = :list_header_id`;
    
  }
  
  query += `\nORDER BY INVENTORY_ITEM_ID ASC OFFSET :offset ROWS FETCH NEXT 50 ROWS ONLY`;
 
  const result = await simpleExecute(query, binds);
  return result.rows !== null ? result.rows : null;
}


export async function getItemsByPageSubCat(context) {
  let query = baseQuery;
  const binds = {};

  if (context.mother_category && context.sub_major_category) {
    
    binds.mother_cat = context.mother_category;
    binds.list_header_id = context.price_list_id;
    binds.sub_major_category = context.sub_major_category;
    binds.ordId = context.ordId;
    
    query += `\nAND MOTHER_CAT = :mother_cat`;
    query += `\nAND SUB_MAJOR = :sub_major_category`;
    query += `\nAND ORG_ID = :ordId`;
    query += `\nAND LIST_HEADER_ID = :list_header_id`;

  }

  binds.offset = context.offset;
  query += `\nORDER BY INVENTORY_ITEM_ID ASC OFFSET :offset ROWS FETCH NEXT 50 ROWS ONLY`;
  const result = await simpleExecute(query, binds);
  return result.rows !== null ? result.rows : null;
}

export async function getItem(context) {
  let query = baseQuery;

  const binds = {};

  if (context.inventory_item_id) {
    binds.inventory_item_id = context.inventory_item_id;

    if(context.orgId){
      binds.orgId = context.orgId;
      query += `\nAND INVENTORY_ITEM_ID = :inventory_item_id`;
      query += `\nAND org_id = :orgId`;
    }else{
      query += `\nAND INVENTORY_ITEM_ID = :inventory_item_id`;
    }
  }
  
  const result = await simpleExecute(query, binds);
  return result.rows.length === 1 ? result.rows[0] : null;
}

export async function getItemWisePage(context) {
  let query = baseQuery;

  const binds = {};
  
  if (context.offset) {
    binds.offset = context.offset;
    query += `\nORDER BY INVENTORY_ITEM_ID ASC OFFSET :offset ROWS FETCH NEXT 50 ROWS ONLY`;
  } else {
    query += `\nORDER BY CONCATENATED_SEGMENTS ASC`;
  }

//  console.log(query);
  const result = await simpleExecute(query, binds);
  return result.rows !== null ? result.rows : null;
}


export async function getSearchItem(context) {
  let query = baseQuery;

  const binds = {};
  
  if (context.itemSearchText) {
    
    binds.itemSearchText = context.itemSearchText;
    query += `\nAND (CONCATENATED_SEGMENTS LIKE '%' || :itemSearchText || '%')`;
    query += `\nOR (DESCRIPTION LIKE '%' || :itemSearchText || '%')`;
    query += `\nORDER BY CONCATENATED_SEGMENTS ASC`;
    query += `\nFETCH FIRST 10 ROWS ONLY`;
  }
  const result = await simpleExecute(query, binds);
  return result.rows !== null ? result.rows : null;
}


// Sub Category Wise Search

export async function searchItemBySubCatText(context) {
  let query = baseQuery;

  const binds = {};
  
  if (context.searchText) {
    
    binds.mother_cat = context.mother_category;
    binds.ordId = context.ordId;
    binds.list_header_id = context.price_list_id;
    binds.sub_major_category = context.sub_major_category;
    binds.searchText = context.searchText;

    query += `\nAND mother_cat = :mother_cat AND SUB_MAJOR = :sub_major_category AND org_id = :ordId AND LIST_HEADER_ID = :list_header_id AND (CONCATENATED_SEGMENTS LIKE '%' || :searchText || '%')`;
    query += `\nOR (DESCRIPTION LIKE '%' || :searchText || '%')`;
    query += `\nORDER BY CONCATENATED_SEGMENTS ASC`;
    query += `\nFETCH FIRST 10 ROWS ONLY`;
  }

  const result = await simpleExecute(query, binds);
  return result.rows !== null ? result.rows : null;
}

export async function searchItemByMCatText(context) {
  let query = baseQuery;

  const binds = {};
  
  if (context.searchText) {
    
    binds.mother_cat = context.mother_category;
    binds.ordId = context.ordId;
    binds.list_header_id = context.price_list_id;
    binds.searchText = context.searchText;

    query += `\nAND mother_cat = :mother_cat AND org_id = :ordId AND LIST_HEADER_ID = :list_header_id AND (CONCATENATED_SEGMENTS LIKE '%' || :searchText || '%')`;
    query += `\nOR (DESCRIPTION LIKE '%' || :searchText || '%')`;
    query += `\nORDER BY CONCATENATED_SEGMENTS ASC`;
    query += `\nFETCH FIRST 10 ROWS ONLY`;
  }
  const result = await simpleExecute(query, binds);
  return result.rows !== null ? result.rows : null;
}

export async function getCompItemsByPageCat(context) {
  let query = baseQuery;
  const binds = {};

  if (context.mother_category) {
    binds.mother_cat = context.mother_category;
    binds.ordId = context.ordId;
    binds.offset = context.offset;

    query += `\nAND MOTHER_CAT = :mother_cat`;
    query += `\nAND ORG_ID = :ordId`;    
  }
  
  query += `\nORDER BY INVENTORY_ITEM_ID ASC OFFSET :offset ROWS FETCH NEXT 50 ROWS ONLY`;
 
  const result = await simpleExecute(query, binds);
  return result.rows !== null ? result.rows : null;
}

export async function getCompItemsByPageSubCat(context) {
  let query = baseQuery;
  const binds = {};

  if (context.mother_category && context.sub_major_category) {
    
    binds.mother_cat = context.mother_category;
    binds.sub_major_category = context.sub_major_category;
    binds.ordId = context.ordId;
    
    query += `\nAND MOTHER_CAT = :mother_cat`;
    query += `\nAND SUB_MAJOR = :sub_major_category`;
    query += `\nAND ORG_ID = :ordId`;
  }

  binds.offset = context.offset;
  query += `\nORDER BY INVENTORY_ITEM_ID ASC OFFSET :offset ROWS FETCH NEXT 50 ROWS ONLY`;
  const result = await simpleExecute(query, binds);
  return result.rows !== null ? result.rows : null;
}

// Sub Category Wise Search

export async function getCompItemBySubSearch(context) {
  let query = baseQuery;

  const binds = {};
  
  if (context.searchText) {
    
    binds.mother_cat = context.mother_category;
    binds.ordId = context.ordId;
    binds.sub_major_category = context.sub_major_category;
    binds.searchText = context.searchText;

    query += `\nAND mother_cat = :mother_cat AND SUB_MAJOR = :sub_major_category AND org_id = :ordId AND (CONCATENATED_SEGMENTS LIKE '%' || :searchText || '%')`;
    query += `\nOR (DESCRIPTION LIKE '%' || :searchText || '%')`;
    query += `\nORDER BY CONCATENATED_SEGMENTS ASC`;
    query += `\nFETCH FIRST 10 ROWS ONLY`;
  }

  const result = await simpleExecute(query, binds);
  return result.rows !== null ? result.rows : null;
}

export async function searchCompItemByMCat(context) {
  let query = baseQuery;

  const binds = {};
  
  if (context.searchText) {
    
    binds.mother_cat = context.mother_category;
    binds.ordId = context.ordId;
    binds.searchText = context.searchText;

    query += `\nAND mother_cat = :mother_cat AND org_id = :ordId AND (CONCATENATED_SEGMENTS LIKE '%' || :searchText || '%')`;
    query += `\nOR (DESCRIPTION LIKE '%' || :searchText || '%')`;
    query += `\nORDER BY CONCATENATED_SEGMENTS ASC`;
    query += `\nFETCH FIRST 10 ROWS ONLY`;
  }
  const result = await simpleExecute(query, binds);
  return result.rows !== null ? result.rows : null;
}
