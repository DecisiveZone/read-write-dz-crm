const zohoService = require("../services/zoho.service");
const moduleMappings = require("./moduleMappings");

async function searchByCompany(crm, moduleName, companyId) {
  const moduleConfig = moduleMappings[moduleName];

  if (!moduleConfig) {
    throw new Error(`Unsupported module ${moduleName}`);
  }

  const lookupField = moduleConfig.companyLookup;

  if (!lookupField) {
    throw new Error(`No company lookup configured for ${moduleName}`);
  }

  const response = await zohoService.get(
    crm,
    `/${moduleConfig.apiName}/search`,
    {
      criteria: `(${lookupField}:equals:${companyId})`,
    },
  );

  return response.data || [];
}

module.exports = {
  searchByCompany,
};
