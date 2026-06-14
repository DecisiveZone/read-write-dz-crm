const zohoService = require("../services/zoho.service");
const moduleMappings = require("./moduleMappings");

async function createRecord(moduleName, data) {
  const moduleConfig = moduleMappings[moduleName];

  if (!moduleConfig) {
    throw new Error(`Unsupported module ${moduleName}`);
  }

  const response = await zohoService.post(`/${moduleConfig.apiName}`, {
    data: [data],
    trigger: ["workflow", "blueprint"],
  });

  return response;
}

module.exports = {
  createRecord,
};
