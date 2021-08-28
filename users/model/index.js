const debug = require("debug")("charity-organization:model");
const mongo = require("mongoose");

let db = mongo.createConnection();
(async () => {
    try {
        await db.openUri('mongodb://localhost/charity-organization', {useNewUrlParser: true, useUnifiedTopology: true});
    } catch (err) {
        debug("Error connecting to DB: " + err);
    }
})();
debug('Pending DB connection');

require("./user")(db);
require("./point")(db);
require("./dist")(db);

module.exports = model => db.model(model);
