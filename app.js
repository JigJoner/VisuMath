

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

app.get("/timeline", async function(req, res){
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "assignment6"
    })
    let [rows, fields] = await (connection.execute("SELECT * FROM post INNER JOIN student ON student.ID = post.userID"));
    rows.sort(function(a, b){
        let dateA = new Date(`${a.date}${a.time}`);
        let dateB = new Date(`${b.date}${b.time}`);
        if (a < b){
            return 1;
        }else if (a > b){
            return -1;
        }else{
            return 0;
        }
    })
    let table = "<table><tr><th>time</th><th>username</th><th>text</th></tr>";
    for (let i = 0; i < rows.length; i++) {
        table += "<tr><td>" + `${rows[i].date}<br>${rows[i].time}` + "</td><td>" + rows[i].userName + "</td><td>"
            + rows[i].text + "</td></tr>";
    }
    table += "</table>";
    res.send(table);
    //TO DO
})

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

app.post('/add-row-post', async (req, res) => {
    const mysql = require("mysql2/promise");
    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "assignment6"
        });

        const postData = req.body;

        const [results, fields] = await connection.execute(
            `INSERT INTO post (userID, date, time, text, views) VALUES (?, ?, ?, ?, ?)`,
            [postData.userID, postData.date, postData.time, postData.text, postData.views]
        );

        res.send('POST request received successfully');
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).send('Internal Server Error');
    }
});

let port = 8000;
app.listen(port, function () {
    console.log("Example app listening on port " + port + "!");
});

