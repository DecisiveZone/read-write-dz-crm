const axios = require("axios");

let cachedToken = null;
let tokenExpiry = null;

async function getAccessToken() {

    const now = Date.now();

    if (
        cachedToken &&
        tokenExpiry &&
        now < tokenExpiry
    ) {
        //console.log("Using Cached Token");
        return cachedToken;
    }

    //console.log("Generating New Token");

    const response = await axios.post(
        `${process.env.ZOHO_ACCOUNTS_URL}/oauth/v2/token`,
        null,
        {
            params: {
                refresh_token: process.env.ZOHO_REFRESH_TOKEN,
                client_id: process.env.ZOHO_CLIENT_ID,
                client_secret: process.env.ZOHO_CLIENT_SECRET,
                grant_type: "refresh_token"
            }
        }
    );

    cachedToken = response.data.access_token;

    tokenExpiry = now + (3600 * 1000);

    return cachedToken;
}

module.exports = {
    getAccessToken
};