const express = require("express");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const mysql = require("mysql");
const { v4: uuidv4 } = require("uuid");
var app = express();

// log requests
app.use(morgan("tiny"));

// parse request to body-parser
app.use(bodyparser.json());

// database
var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "testdb",
  multipleStatements: true,
});

mysqlConnection.connect((err) => {
  if (!err) console.log("DB connection succeded.");
  else
    console.log(
      "DB connection failed \n Error : " + JSON.stringify(err, undefined, 2)
    );
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// get all users
app.get("/users", (req, res) => {
  mysqlConnection.query("SELECT * FROM user", (err, rows, fields) => {
    if (!err) res.send(rows);
    console.log(err);
  });
});

//Get a user by id
app.get("/users/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM user WHERE id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      console.log(err);
    }
  );
});

// Delete a user
app.delete("/user/:id", (req, res) => {
  mysqlConnection.query(
    "DELETE FROM user WHERE id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send("Deleted successfully.");
      else console.log(err);
    }
  );
});

// Delete multiple user
app.delete("/user/multiple-delete", (req, res) => {
  var users = req.body;
  for (var i = 0; i < users.length; i++) {
    mysqlConnection.query(
      "DELETE FROM user WHERE id = ?",
      [users.id],
      (err, rows, fields) => {
        if (!err) res.send("Deleted successfully.");
        else console.log(err);
      }
    );
  }
});

app.post("/users", (req, res) => {
  let user = req.body;
  let post = {
    id: uuidv4(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    postCode: req.body.postCode,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  };
  let sql = "INSERT INTO user SET ?";

  mysqlConnection.query(sql, post, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Added New User");
  });
});

app.put("/users/:id", (req, res) => {
  let user = req.body;

  let sql =
    `UPDATE user SET firstName = "${user.firstName}", lastName = "${user.lastName}", address = "${user.address}",` +
    `postCode = "${user.postCode}", phoneNumber = "${user.phoneNumber}", email = "${user.email}", ` +
    `username = "${user.username}", password = "${user.password}" ` +
    `WHERE id = "${req.params.id}"`;

  mysqlConnection.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Updated User");
  });
});
