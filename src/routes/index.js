const USER = require("./user");
const TRANSACTION = require("./transaction");
const Gathering = require("./gathering");
const Note = require("./note");
const refreshToken = require("./refreshToken");
function route(app) {
    app.use("/users", USER);
    app.use("/transaction", TRANSACTION);
    app.use("/gathering", Gathering);
    app.use("/note", Note);
    app.use("/refresh", refreshToken);
}

module.exports = route;
