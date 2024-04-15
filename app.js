const express = require("express");
const app = express();
const path = require("path");
const mysql=require("mysql");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"user",
});

db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log("connection done");
});

app.get("/createdb",(req,res)=>{
    let sql="CREATE DATABASE user"
    db.query(sql,(err,result)=>{
        if(err) console.log(err);
        console.log(result);
        res.send("Database Created");
    });
});

app.get("/createusertable",(req,res)=>{
    let sql="CREATE TABLE users(id INT AUTO_INCREMENT PRIMARY KEY,firstName VARCHAR(255),lastName VARCHAR(255),email VARCHAR(255),password VARCHAR(255))";
    db.query(sql,(err,result)=>{
        if(err) console.log(err);
        console.log(result);
        res.send("Table Created");
    })
});

app.get("/",(req,res)=>{
    let sql="SELECT * FROM users";
    db.query(sql,(err,result)=>{
        if(err) console.log(err);
        console.log(result);
        res.render("homepage",{data:result});
    });
});

app.post("/adddetails", (req,res)=>{
    console.log(req.body);
    if(req.body.firstName==""){
        req.flash("error","First Name cannot be left blank");
        return res.redirect("/");
    }
    else if(req.body.lastName==""){
        req.flash("error","Last Name cannot be left blank");
        return res.redirect("/");
    }
    else if(req.body.email==""){
        req.flash("error","Email cannot be left blank");
        return res.redirect("/");
    }
    else if(req.body.password==""){
        req.flash("error","Password cannot be left blank");
        return res.redirect("/");
    }
    let sql=`INSERT INTO users (firstName,lastName,email,password) values ("${req.body.firstName}","${req.body.lastName}","${req.body.email}","${req.body.password}")`;
    db.query(sql,(err,result)=>{
        if(err) console.log(err);
        console.log(result);
        res.redirect("/");
    });
});

app.delete("/delete/:id",(req,res)=>{
    let id=req.params.id;
    let sql=`DELETE FROM users WHERE id=${id}`;
    db.query(sql,(err,result)=>{
        if(err) console.log(err);
        console.log(result);
        res.sendStatus(200);
    });
});

app.get("/user/:id", (req, res) => {
    let id = req.params.id;
    let sql = `SELECT * FROM users WHERE id=${id}`;
    db.query(sql, (err, result) => {
        if (err) console.log(err);
        res.json(result[0]);
    });
});

app.post("/update/:id", (req, res) => {
    let id = req.params.id;
    let sql = `UPDATE users SET firstName="${req.body.firstName}", lastName="${req.body.lastName}", email="${req.body.email}", password="${req.body.password}" WHERE id=${id}`;
    db.query(sql, (err, result) => {
        if (err) console.log(err);
        console.log(result);
        res.redirect("/");
    });
});




module.exports=app;