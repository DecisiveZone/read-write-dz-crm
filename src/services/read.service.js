const moduleMappings = require("../utils/moduleMappings");
const { resolveCompany } = require("../utils/companyResolver");
const { searchByCompany } = require("../utils/moduleSearch");
const { searchRecord } = require("../utils/searchRecord");
const { getRecordById } = require("../utils/getRecordById");
const {
  searchDocumentManagementBySalesClosure,
} = require("../utils/documentManagementSearch");

async function readRecords(payload) {
  const {
    crm,
    module,
    company_name,
    search_field,
    search_value,
    record_id,
    sales_closure_id,
  } = payload;

  if (!module) {
    throw new Error("module is required");
  }

  const moduleConfig = moduleMappings[module];

  if (!moduleConfig) {
    throw new Error(`Unsupported module ${module}`);
  }

  if (record_id) {
    return await getRecordById(crm, module, record_id);
  }

  if (module === "Document_Management" && sales_closure_id) {
    return await searchDocumentManagementBySalesClosure(crm, sales_closure_id);
  }

  if (search_field && search_value) {
    return await searchRecord(crm, module, search_field, search_value);
  }

  if (!company_name) {
    throw new Error(
      "company_name OR record_id OR sales_closure_id OR search_field/search_value required",
    );
  }

  if (module === "Accounts") {
    return await resolveCompany(crm, company_name);
  }

  const company = await resolveCompany(crm, company_name);

  return await searchByCompany(crm, module, company.id);
}

module.exports = {
  readRecords,
};
