const express = require("express");
const router = express.Router();
const db = require("./db.js");
var sess;

//------------------------------------------------------------------------------------//

router.post("/signup", (req, res) => {

});

router.post("/login", (req, res) => {
    // check email and password
    let email = req.body.email;
    let password = req.body.password;
    let sql = `SELECT * FROM users WHERE user_email = "${email}" AND user_password = "${password}"`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.json({ "status": "fail", "detail": "ไม่มีข้อมูลอยู่ในระบบ กรุณาสมัครสมาชิก"});
        } else {
            let res_email = result[0].user_email;
            let res_image = result[0].user_image;
            res.json({ "status": "success", "detail": {"email": res_email, "image": res_image}});

            // เก็บใส่ session
            sess = req.session;
            sess.email = res_email;
            sess.image = res_image;
        }        
    });
});

router.get("/", (req, res) => {
    if (sess.email && sess.image) {
        // เก็บเข้า cookie
        res.cookie("email", sess.email)
        res.cookie("image", sess.image)
        
        res.redirect("/api/logged");
        res.status(200).end();
    } else {
        res.send("คุณยังไม่ login");
        res.status(500).end();
    }
   
});

router.get("/logged", (req, res) => {
    res.send("<p>Hi: " + req.cookies.email + "</p><a href='/api/logout'>logout</a>")
});

router.get("/logout", (req, res) => {
    // clear cookie
    res.clearCookie("email");
    res.clearCookie("image");
    req.session.destroy(function(err) {
        if (err) throw err;
        res.end("destroy done.");
    })

});

//------------------------------------------------------------------------------------//

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

// stream messages
router.get("/chat_rooms", (req, res) => {
    let id = req.params.id;
    let sql = "SELECT * FROM chat_rooms";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    })
})

router.get("/chat_room/:id", (req, res) => {
    let id = req.params.id;
    let sql = "SELECT * FROM messages INNER JOIN users ON messages.user_id = users.user_id INNER JOIN chat_rooms ON messages.chat_room_id = chat_rooms.chat_room_id WHERE chat_rooms.chat_room_id = " + id;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    })
})

router.post("/message", (req, res) => {
    let message_detail = req.body.message_detail;
    let message_created = req.body.message_created;
    let user_id = req.body.user_id;
    let chat_room_id = req.body.chat_room_id;

    let sql = `INSERT INTO messages (message_detail, message_created, user_id, chat_room_id) VALUES ("${message_detail}", "${message_created}", "${user_id}", "${chat_room_id}")`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result) {
            res.json({ "status": "success" });
        } else {
            res.json({ "status": "fail" });
        }

    })
})

module.exports = router;
