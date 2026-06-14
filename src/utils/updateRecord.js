const zohoService = require("../services/zoho.service");
const moduleMappings = require("./moduleMappings");

async function updateRecord(
  moduleName,
  recordId,
  data
) {
  const moduleConfig =
    moduleMappings[moduleName];

  if (!moduleConfig) {
    throw new Error(
      `Unsupported module ${moduleName}`
    );
  }

  const response =
    await zohoService.put(
      `/${moduleConfig.apiName}`,
      {
        data: [
          {
            id: recordId,
            ...data
          }
        ],
        trigger: [
          "workflow",
          "blueprint"
        ]
      }
    );

  return response;
}

module.exports = {
  updateRecord,
};