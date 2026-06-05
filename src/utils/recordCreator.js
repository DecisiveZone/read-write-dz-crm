const zohoService = require("../services/zoho.service");
const moduleMappings = require("./moduleMappings");

async function createRecord(moduleName, data) {
  const moduleConfig = moduleMappings[moduleName];

  if (!moduleConfig) {
    throw new Error(`Unsupported module ${moduleName}`);
  }

//   console.log("MODULE =", moduleName);
//   console.log("API NAME =", moduleConfig.apiName);
//   console.log(
//     "REQUEST BODY =",
//     JSON.stringify(
//       {
//         data: [data],
//       },
//       null,
//       2,
//     ),
//   );

  const response = await zohoService.post(`/${moduleConfig.apiName}`, {
    data: [data],
  });

  return response;
}

module.exports = {
  createRecord,
};
