let mysql = require("mysql");
const db = mysql.createConnection({
    host: "streetfood.in.th",
    user: "admin_sittikiat",
    password: "7856ek31",
    database: "admin_truemusic"
});

db.connect((err) => {
    if (err) throw err;
    console.log("Database connected.");
})

module.exports = db;