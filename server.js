var express = require("express");

var app = express();
var PORT = process.env.PORT || 3000;

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'burger_db'
})

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connecting as id ' + connection.threadId)
});

app.get("/", function (req, res) {
    connection.query("SELECT * FROM burgers;", function (err, data) {
        if (err) {
            return res.status(500).end();
        }

        res.render("index", {
            burgers: data
        });
    });
});

app.post("/", function (req, res) {
    connection.query("INSERT INTO burgers (burger) VALUES (?)", [req.body.burger], function (err, result) {
        if (err) {
            return res.status(500).end();
        }

        // Send back the ID of the new todo
        res.json({
            id: result.insertId
        });
        console.log({
            id: result.insertId
        });
    });
});


app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
  });
  