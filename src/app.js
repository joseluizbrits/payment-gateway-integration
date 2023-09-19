const express = require("express");
const cors = require("cors");

const routes = require("./routes");
require("./database/index");

const server = express();

server.get("/", (req, res) => {
	res.send("Hello world!");
});

server.use(express.json());
server.use(cors());

server.use(routes);

module.exports = server;
