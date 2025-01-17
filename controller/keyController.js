
require('dotenv').config();

const getApiKey = (req, res) => {
    res.status(200).json({ apiKey: process.env.TINY_MCE_API_KEY });
};

module.exports = getApiKey ;