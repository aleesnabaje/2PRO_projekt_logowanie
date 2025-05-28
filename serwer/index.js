const express = require("express")
const cors = require("cors")
const md5 = require("md5")

const app = express()
app.use(cors())

var mysql = require("mysql")
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "blog"
})

app.get("/logowanie/:login/:haslo",(req,res)=>{
    let login = req.params.login
    let haslo = req.params.haslo

    const sql = `SELECT * FROM users WHERE username = '${login}' AND password = '${md5(haslo)}'`;

    con.query(sql, (err, response)=>{
        if (err) throw err;
        res.send(response)        
    })
})

app.get("/rejestracja/:login/:haslo",(req,res)=>{
    let login = req.params.login
    let haslo = req.params.haslo

    const sql = `SELECT * FROM users WHERE password = '${login}'`;

    con.query(sql, (err, response)=>{
        if (err) throw err;
        if(response.length > 0){
            res.status(202)
            res.json({error: "login jest zajety"})
        }
        else {
            let sql2 = `INSERT INTO users (username, password, role) VALUES ('${login}','${md5(haslo)}','user')`;
            con.query(sql2, (err, response)=>{
                if (err) throw err
                const sql3 = `SELECT * FROM users WHERE username = '${login}' AND password = '${md5(haslo)}'`
                con.query(sql3, (err, response)=>{
                    if (err) throw err
                    res.send(response)
                })
            })
        }
    })
})


app.get("/posts", (req, res) => {
    const sql = `SELECT posts.id, posts.title, posts.content, posts.created_at, posts.edited, users.username AS author FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC`;
    con.query(sql, (err, posts) => {
        if (err) throw err;
        res.json(posts);
    });
});

app.get("/myposts/:id", (req, res) => {
    let userId = req.params.id;
    const sql = `SELECT id, title, content, created_at, edited FROM posts WHERE user_id = "${userId}" ORDER BY created_at DESC`;
    con.query(sql, (err, posts) => {
        if (err) throw err;
        res.json(posts);
    });
});

app.get("/posts/add/:title/:content/:user_id", (req, res) => {
    let title = req.params.title
    let content = req.params.content
    let userId = req.params.user_id

        const insertPostSql = `INSERT INTO posts (title, content, user_id) VALUES ("${title}", "${content}", "${userId}")`;
        con.query(insertPostSql, (err, result) => {
            if (err) throw err;
            res.json({ message: "Post został pomyślnie dodany!"});
        });

    });

app.get("/posts/delete/:id", (req, res) => {
    let postId = req.params.id;

    const deletePostSql = `DELETE FROM posts WHERE id = ${postId}`;
    con.query(deletePostSql, (err, result) => {
        if (err) throw err;
        res.json({ message: "Post został pomyślnie usunięty!" });
    });
});

app.get("/posts/edit/:id/:title/:content", (req, res) => {
    let postId = req.params.id;
    let title = req.params.title;
    let content = req.params.content;

    const updatePostSql = `UPDATE posts SET title = "${title}", content = "${content}", edited = 1 WHERE id = ${postId}`;
    con.query(updatePostSql, (err, result) => {
        if (err) throw err;
        res.json({ message: "Post został pomyślnie zaktualizowany!" });
    });
});

app.listen(3000, ()=>{
    console.log("dziala");
})
