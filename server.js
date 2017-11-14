const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

// static directory
app.use(express.static("./dist"));
// router
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
app.use("/api", require("./module/api.js"));
app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
})


const server = app.listen(3000, () => {
    const port = server.address().port;
    console.log("Server running at http://localhost:" + port);
})