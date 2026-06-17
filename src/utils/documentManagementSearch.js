const zohoService = require("../services/zoho.service");

async function searchDocumentManagementBySalesClosure(crm, salesClosureId) {
  const response = await zohoService.get(crm, "/Document_Management", {
    fields:
      "id,Name,Sales_Closure,Companies,Opportunity,Bulk_File_Upload_1,Bulk_File_Upload_2,Bulk_File_Upload_3,Bulk_File_Upload_4,Bulk_File_Upload_5,Owner,Document_Verification",
  });

  const records = response.data || [];

  return records.filter((record) => {
    const salesClosures = record.Sales_Closure || [];

    return salesClosures.some(
      (item) => item?.Sales_Closure?.id === salesClosureId,
    );
  });
}

module.exports = {
  searchDocumentManagementBySalesClosure,
};
