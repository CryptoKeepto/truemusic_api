const express = require("express");
const router = express.Router();
const db = require("./db.js");

router.get("/genres", (req, res) => {
    let sql = `SELECT * FROM genres`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    })
})

router.get("/albums", (req, res) => {
    let sql = `SELECT * FROM albums`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    })
})

// ค้นหาเพลงที่อยู่ใน album
router.get("/album/:id", (req, res) => {
    let id = req.params.id;
    let sql = `SELECT * FROM songs INNER JOIN albums ON songs.album_id = albums.album_id WHERE albums.album_id = ${id}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    })
})

module.exports = router;
