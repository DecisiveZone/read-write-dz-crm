const moduleMappings = require("../utils/moduleMappings");
const { resolveCompany } = require("../utils/companyResolver");
const { createRecord } = require("../utils/recordCreator");
const { searchRecord } = require("../utils/searchRecord");
const { updateRecord } = require("../utils/updateRecord");

async function writeRecords(payload) {
  const {
    sub_mode,
    module,
    company_name,
    company_id,
    data,
    contact_id,
    deal_id,
    license_id,
    sales_closure_id,
  } = payload;

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
    let companyId;

    if (company_id) {
      companyId = company_id;
    } else {
      if (!company_name) {
        throw new Error("company_name or company_id is required");
      }

      const company = await resolveCompany(company_name);

      companyId = company.id;
    }

    const lookupField = moduleConfig.companyLookup;

    if (!lookupField) {
      throw new Error(`No lookup configured for ${module}`);
    }

    const payloadData = {
      ...data,
      [lookupField]: {
        id: companyId,
      },
    };

    // LICENSE LOOKUPS

    if (module === "Licenses") {
      if (deal_id) {
        payloadData.Opportunity_Name = {
          id: deal_id,
        };
      } else if (payload.deal_search_field && payload.deal_search_value) {
        const deal = await searchRecord(
          "Deals",
          payload.deal_search_field,
          payload.deal_search_value,
        );

        payloadData.Opportunity_Name = {
          id: deal.id,
        };
      }

      if (sales_closure_id) {
        payloadData.Sales_Closure = {
          id: sales_closure_id,
        };
      } else if (
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
      if (deal_id) {
        payloadData.Related_Opportunity = {
          id: deal_id,
        };
      } else if (payload.deal_search_field && payload.deal_search_value) {
        const deal = await searchRecord(
          "Deals",
          payload.deal_search_field,
          payload.deal_search_value,
        );

        payloadData.Related_Opportunity = {
          id: deal.id,
        };
      }

      if (license_id) {
        payloadData.Related_License = {
          id: license_id,
        };
      } else if (payload.license_search_field && payload.license_search_value) {
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

    /*
     * DIRECT RECORD ID UPDATE
     */

    if (search_field.toLowerCase() === "id") {
      return await updateRecord(module, search_value, data);
    }

    /*
     * SEARCH + UPDATE
     */

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
