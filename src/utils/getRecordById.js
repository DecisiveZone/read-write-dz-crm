const zohoService = require("../services/zoho.service");
const moduleMappings = require("./moduleMappings");

async function getRecordById(moduleName, recordId) {

  const moduleConfig = moduleMappings[moduleName];

  if (!moduleConfig) {
    throw new Error(
      `Unsupported module ${moduleName}`
    );
  }

  return await zohoService.get(
    `/${moduleConfig.apiName}/${recordId}`
  );
}

module.exports = {
  getRecordById
};