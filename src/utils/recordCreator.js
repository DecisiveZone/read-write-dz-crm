const zohoService = require("../services/zoho.service");
const moduleMappings = require("./moduleMappings");

async function createRecord(
  crm,
  moduleName,
  data,
) {
  const moduleConfig = moduleMappings[moduleName];

  if (!moduleConfig) {
    throw new Error(`Unsupported module ${moduleName}`);
  }

  return await zohoService.post(
    crm,
    `/${moduleConfig.apiName}`,
    {
      data: [data],
      trigger: ["workflow", "blueprint"],
    },
  );
}

module.exports = {
  createRecord,
};