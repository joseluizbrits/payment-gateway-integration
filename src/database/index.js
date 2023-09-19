const mongoose = require("mongoose");
const config = require("../config/database");

const connection = mongoose.connect(config.url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

module.exports = connection;
