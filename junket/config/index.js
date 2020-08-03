const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    assistantApi: process.env.ASSISTANT_API,
    assistantUrl: process.env.ASSISTANT_URL,
    assistantId: process.env.ASSISTANT_ID,
    translatorApi: process.env.TRANSLATOR_API,
    translatorUrl: process.env.TRANSLATOR_URL,
    mongoUrl: process.env.MONGO_URL,
    placesToken: process.env.PLACES_TOKEN,
    mapquestKey: process.env.MAPQUEST_KEY,
    distanceMeters: process.env.DISTANCE_METERS,
    limitPeriodTime: process.env.LIMIT_PERIOD_TIME,

    adSuffix: process.env.ADSUFFIX,
    server: process.env.SERVER,
    port: process.env.PORT,
};
