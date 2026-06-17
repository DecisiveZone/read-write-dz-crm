const zohoService = require("../services/zoho.service");

async function resolveCompany(crm, companyName) {
  if (!companyName) {
    throw new Error("company_name is required");
  }

  const response = await zohoService.get(crm, "/Accounts/search", {
    criteria: `(Account_Name:equals:${companyName})`,
    fields: "id,Account_Name",
  });

  if (!response.data || !response.data.length) {
    throw new Error(`Company not found: ${companyName}`);
  }

  return response.data[0];
}

module.exports = {
  resolveCompany,
};
