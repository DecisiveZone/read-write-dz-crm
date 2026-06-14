module.exports = {
  Accounts: {
    apiName: "Accounts",
    companyModule: true,
    fields: "id,Account_Name",
  },

  Contacts: {
    apiName: "Contacts",
    companyLookup: "Account_Name",
  },

  Deals: {
    apiName: "Deals",
    companyLookup: "Account_Name",
  },

  Licenses: {
    apiName: "Licenses",
    companyLookup: "Company_Name",
  },

  Sales_Closures: {
    apiName: "Sales_Closures",
    companyLookup: "Company_Name",
  },

  Visas: {
    apiName: "Visas1",
    companyLookup: "Related_Company1",
  },

  Client_KYC: {
    apiName: "Client_KYC",
    companyLookup: "Company",
  },

  Document_Management: {
    apiName: "Document_Management",
    companyLookup: "Companies",
  },

  Collections: {
    apiName: "Collections",
    companyLookup: "Company_Name",
  },

  Master_Closures: {
    apiName: "Master_Closures",
  },
};
