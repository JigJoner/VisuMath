

const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");

app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));
app.use("/html", express.static("./app/html"));
app.use("/modules", express.static("./modules"));



app.get("/", function (req, res) {
    let doc = fs.readFileSync("./app/html/index.html", "utf8");
    res.send(doc);
});
app.get("/main", function (req, res) {
    let doc = fs.readFileSync("./app/html/main.html", "utf8");
    res.send(doc);
});

app.get("/table-student", function(req, res){
    tableStudent(req, res);
});

async function tableStudent(req, res){
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "assignment6"
    })
    let [rows, fields] = await (connection.execute("SELECT * FROM student"));
    if (req.get("type") == "rows"){
        res.send(rows);
    }else if (req.get("type") == "fields"){
        res.send(fields);
    }else{
        res.send("Error");
    }
    
    
    //TO DO
}
app.get("/table-post", function(req, res){
    tablePost(req, res)
});

async function tablePost(req, res){
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "assignment6"
    })
    let [rows, fields] = await (connection.execute("SELECT * FROM post INNER JOIN student ON student.ID = post.userID"));
    res.send(rows);
    //TO DO
}

app.post('/add-row-post', (req, res) => {
    const postData = req.body;
    console.log(postData);

    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "assignment6"
    })
    connection.execute(`INSERT INTO post (ID, userID, date, time, text, views) VALUES
    ('${postData.ID}', '${postData.userID}', '${postData.date}', '${postData.time}', '${postData.text}', '${postData.views}')`);
    res.status(200).send('POST request received successfully');
});

let port = 8000;
app.listen(port, function () {
    console.log("Example app listening on port " + port + "!");
});

