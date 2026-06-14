const zohoService = require("../services/zoho.service");
const moduleMappings = require("./moduleMappings");

async function searchRecord(
  moduleName,
  fieldName,
  fieldValue
) {
  const moduleConfig =
    moduleMappings[moduleName];

  if (!moduleConfig) {
    throw new Error(
      `Unsupported module ${moduleName}`
    );
  }

  const response =
    await zohoService.get(
      `/${moduleConfig.apiName}/search`,
      {
        criteria:
          `(${fieldName}:equals:${fieldValue})`
      }
    );

  const records =
    response.data || [];

  if (!records.length) {
    throw new Error(
      `${moduleName} record not found for ${fieldName}=${fieldValue}`
    );
  }

  return records[0];
}

module.exports = {
  searchRecord,
};