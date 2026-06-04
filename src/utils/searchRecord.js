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

  return response.data || [];
}

module.exports = {
  searchRecord
};