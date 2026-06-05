const moduleMappings = require("../utils/moduleMappings");
const { resolveCompany } = require("../utils/companyResolver");
const { createRecord } = require("../utils/recordCreator");
const { searchRecord } = require("../utils/searchRecord");
const { updateRecord } = require("../utils/updateRecord");

async function writeRecords(payload) {
  const { sub_mode, module, company_name, data, contact_id, deal_id } = payload;

  if (!sub_mode) {
    throw new Error("sub_mode is required");
  }

  if (!module) {
    throw new Error("module is required");
  }

  if (!data) {
    throw new Error("data is required");
  }

  const moduleConfig = moduleMappings[module];

  if (!moduleConfig) {
    throw new Error(`Unsupported module ${module}`);
  }

  /*
   * CREATE ACCOUNT
   */

  if (sub_mode === "CREATE" && module === "Accounts") {
    return await createRecord(module, data);
  }

  /*
   * CREATE MODULES WITH COMPANY LOOKUP
   */

  if (sub_mode === "CREATE") {
    if (!company_name) {
      throw new Error("company_name is required");
    }

    const company = await resolveCompany(company_name);

    const lookupField = moduleConfig.companyLookup;

    if (!lookupField) {
      throw new Error(`No lookup configured for ${module}`);
    }

    const payloadData = {
      ...data,
      [lookupField]: {
        id: company.id,
      },
    };

    // LICENSE LOOKUPS

    if (module === "Licenses") {
      if (payload.deal_search_field && payload.deal_search_value) {
        const deal = await searchRecord(
          "Deals",
          payload.deal_search_field,
          payload.deal_search_value,
        );

        payloadData.Opportunity_Name = {
          id: deal.id,
        };
      }

      if (
        payload.sales_closure_search_field &&
        payload.sales_closure_search_value
      ) {
        const salesClosure = await searchRecord(
          "Sales_Closures",
          payload.sales_closure_search_field,
          payload.sales_closure_search_value,
        );

        payloadData.Sales_Closure = {
          id: salesClosure.id,
        };
      }
    }

    // VISA LOOKUPS

    if (module === "Visas") {
      if (payload.deal_search_field && payload.deal_search_value) {
        const deal = await searchRecord(
          "Deals",
          payload.deal_search_field,
          payload.deal_search_value,
        );

        payloadData.Related_Opportunity = {
          id: deal.id,
        };
      }

      if (payload.license_search_field && payload.license_search_value) {
        const license = await searchRecord(
          "Licenses",
          payload.license_search_field,
          payload.license_search_value,
        );

        payloadData.Related_License = {
          id: license.id,
        };
      }
    }
    
    /*
     * DEALS
     * Auto link Contact
     */

    if (module === "Deals") {
      if (contact_id) {
        payloadData.Contact_Name = {
          id: contact_id,
        };
      }
    }

    /*
     * SALES CLOSURES
     * Auto link Deal
     */

    if (module === "Sales_Closures") {
      if (deal_id) {
        payloadData.Opportunity_Name = {
          id: deal_id,
        };
      }
    }

    // console.log("MODULE =", module);
    // console.log("PAYLOAD =", JSON.stringify(payloadData || data, null, 2));

    return await createRecord(module, payloadData);
  }

  if (sub_mode === "UPDATE") {
    const { search_field, search_value } = payload;

    if (!search_field) {
      throw new Error("search_field is required");
    }

    if (!search_value) {
      throw new Error("search_value is required");
    }

    const records = await searchRecord(module, search_field, search_value);

    if (!records.length) {
      throw new Error("No matching record found");
    }

    const recordId = records[0].id;

    return await updateRecord(module, recordId, data);
  }

  return {
    message: `${sub_mode} ${module} pending implementation`,
  };
}

module.exports = {
  writeRecords,
};
