const axios = require("axios");

const tokenCache = {};

async function getAccessToken(crm) {
  const envPrefix = crm === "live" ? "LIVE" : "SANDBOX";

  const now = Date.now();

  if (
    tokenCache[crm] &&
    tokenCache[crm].token &&
    tokenCache[crm].expiry > now
  ) {
    return tokenCache[crm].token;
  }

  const response = await axios.post(
    `${process.env[`${envPrefix}_ZOHO_ACCOUNTS_URL`]}/oauth/v2/token`,
    null,
    {
      params: {
        refresh_token: process.env[`${envPrefix}_ZOHO_REFRESH_TOKEN`],

        client_id: process.env[`${envPrefix}_ZOHO_CLIENT_ID`],

        client_secret: process.env[`${envPrefix}_ZOHO_CLIENT_SECRET`],

        grant_type: "refresh_token",
      },
    },
  );

  tokenCache[crm] = {
    token: response.data.access_token,
    expiry: now + 3600 * 1000,
  };

  return response.data.access_token;
}

module.exports = {
  getAccessToken,
};
