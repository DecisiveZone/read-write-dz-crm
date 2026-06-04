const axios = require("axios");
const { getAccessToken } = require("./tokenManager");

async function get(endpoint, params = {}) {

    const token = await getAccessToken();

    // console.log("ZOHO_API_URL:", process.env.ZOHO_API_URL);
    // console.log("ENDPOINT:", endpoint);
    // console.log("FINAL URL:", `${process.env.ZOHO_API_URL}${endpoint}`);

    const response = await axios.get(
        `${process.env.ZOHO_API_URL}${endpoint}`,
        {
            headers: {
                Authorization: `Zoho-oauthtoken ${token}`
            },
            params
        }
    );

    return response.data;
}

async function post(endpoint, payload = {}) {

    const token = await getAccessToken();

    const response = await axios.post(
        `${process.env.ZOHO_API_URL}${endpoint}`,
        payload,
        {
            headers: {
                Authorization: `Zoho-oauthtoken ${token}`
            }
        }
    );

    return response.data;
}

async function put(endpoint, payload = {}) {

    const token = await getAccessToken();

    const response = await axios.put(
        `${process.env.ZOHO_API_URL}${endpoint}`,
        payload,
        {
            headers: {
                Authorization: `Zoho-oauthtoken ${token}`
            }
        }
    );

    return response.data;
}

module.exports = {
    get,
    post,
    put
};