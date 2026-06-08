const moduleMappings = require("../utils/moduleMappings");
const { resolveCompany } = require("../utils/companyResolver");
const { searchByCompany } = require("../utils/moduleSearch");
const { searchRecord } = require("../utils/searchRecord");
const { getRecordById } = require("../utils/getRecordById");

async function readRecords(payload) {

    const {
        module,
        company_name,
        search_field,
        search_value,
        record_id
    } = payload;

    if (!module) {
        throw new Error("module is required");
    }

    const moduleConfig = moduleMappings[module];

    if (!moduleConfig) {
        throw new Error(
            `Unsupported module ${module}`
        );
    }

    /*
     * RECORD ID SEARCH
     */

    if (record_id) {

        return await getRecordById(
            module,
            record_id
        );

    }

    /*
     * GENERIC SEARCH
     */

    if (
        search_field &&
        search_value
    ) {

        return await searchRecord(
            module,
            search_field,
            search_value
        );

    }

    /*
     * COMPANY SEARCH
     */

    if (!company_name) {
        throw new Error(
            "company_name OR record_id OR search_field/search_value required"
        );
    }

    /*
     * Accounts
     */

    if (module === "Accounts") {

        return await resolveCompany(
            company_name
        );

    }

    const company = await resolveCompany(
        company_name
    );

    return await searchByCompany(
        module,
        company.id
    );
}

module.exports = {
    readRecords
};