const {url, username, password, version} = require("./config.json")
const { CTProvider } = require("./ctprovider.js")
exports.CTProvider = new CTProvider(url, username, password, version)