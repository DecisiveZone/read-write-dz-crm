const axios = require("axios");
const { getAccessToken } = require("./tokenManager");

function getApiUrl(crm) {
  return crm === "live"
    ? process.env.LIVE_ZOHO_API_URL
    : process.env.SANDBOX_ZOHO_API_URL;
}

async function get(crm, endpoint, params = {}) {
  const token = await getAccessToken(crm);

  const response = await axios.get(`${getApiUrl(crm)}${endpoint}`, {
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
    },
    params,
  });

  return response.data;
}

async function post(crm, endpoint, payload = {}) {
  const token = await getAccessToken(crm);

  const response = await axios.post(`${getApiUrl(crm)}${endpoint}`, payload, {
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
    },
  });

  return response.data;
}

async function put(crm, endpoint, payload = {}) {
  const token = await getAccessToken(crm);

  const response = await axios.put(`${getApiUrl(crm)}${endpoint}`, payload, {
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
    },
  });

  return response.data;
}

module.exports = {
  get,
  post,
  put,
};
