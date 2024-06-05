const http = require("http");
const app = require("./app");
const { APP_PORT } = require("./config/app.config");

const port = APP_PORT || 5455;

const server = http.createServer(app);

server.listen(port);
