const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.ateldb = require("./categories.model")(mongoose);
db.evedb = require("./evenements.model")(mongoose);

module.exports = db