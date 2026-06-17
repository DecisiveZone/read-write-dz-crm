const zohoService = require("../services/zoho.service");
const moduleMappings = require("./moduleMappings");

async function updateRecord(crm, moduleName, recordId, data) {
  const moduleConfig = moduleMappings[moduleName];

  if (!moduleConfig) {
    throw new Error(`Unsupported module ${moduleName}`);
  }

  return await zohoService.put(crm, `/${moduleConfig.apiName}`, {
    data: [
      {
        id: recordId,
        ...data,
      },
    ],
    trigger: ["workflow", "blueprint"],
  });
}

module.exports = {
  updateRecord,
};
