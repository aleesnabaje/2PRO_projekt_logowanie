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

    const sql = `SELECT * FROM uzytkownicy WHERE login = '${login}' AND haslo = '${md5(haslo)}'`;

    con.query(sql, (err, response)=>{
        if (err) throw err;
        res.send(response)        
    })
})

app.get("/rejestracja/:login/:haslo",(req,res)=>{
    let login = req.params.login
    let haslo = req.params.haslo

    const sql = `SELECT * FROM uzytkownicy WHERE login = '${login}'`;

    con.query(sql, (err, response)=>{
        if (err) throw err;
        if(response.length > 0){
            res.status(202)
            res.json({error: "login jest zajety"})
        }
        else {
            let sql2 = `INSERT INTO uzytkownicy (login, haslo, rola) VALUES ('${login}','${md5(haslo)}','user')`;
            con.query(sql2, (err, response)=>{
                if (err) throw err
                const sql3 = `SELECT * FROM uzytkownicy WHERE login = '${login}' AND haslo = '${md5(haslo)}'`
                con.query(sql3, (err, response)=>{
                    if (err) throw err
                    res.send(response)
                })
            })
        }
    })
})

app.listen(3000, ()=>{
    console.log("dziala");
})
