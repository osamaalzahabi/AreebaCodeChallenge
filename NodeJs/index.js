const cors = require('cors');
const mysql = require('mysql');
const express = require('express');
var app = express();
app.use(cors({ origin: true }));
const bodyparser = require('body-parser');
app.use(bodyparser.json());

//local mysql db connection
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3308,
    user: 'osama',
    password: '1234',
    database: 'computerstore'
});

connection.connect((err) => {
    if (!err)
        console.log("Connection succeeded!!");
    else
        console.log("Errrrorrr: " + JSON.stringify(err, undefined, 2));
});

app.listen(3000, () => console.log('Express server is running on port 3000'));

app.get('/computers', (req, res) => {
    connection.query('SELECT * FROM computers', (err, rows, fields) => {
        if (!err)
            res.json(rows);
        else
            console.log(err);
    })
});

app.get('/computers/:id', (req, res) => {
    connection.query('SELECT * FROM computers WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.json(rows[0]);
        else
            console.log(err);
    })
});

app.get('/searchcomputers/:name', (req, res) => {
    connection.query("SELECT * FROM computers WHERE name like ?", '%'+[req.params.name]+'%', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});


app.delete('/computers/:id', (req, res) => {
    connection.query('DELETE FROM computers WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send("Deleted!");
        else
            console.log(err);
    });
});
app.put('/computers', (req, res) => {
    let comp = req.body;
    var sql = 'UPDATE computers SET name=?, price =?, cpu=?, screen=?, ram=?, storage=? WHERE id = ?';
    connection.query(sql, [comp.name, comp.price, comp.cpu, comp.screen, comp.ram, comp.storage, comp.id], (err, rows, fields) => {
        if (!err)
            res.send("Updatedd!");
        else
            console.log(err);
    })
});

app.post('/computers', (req, res) => {
    let comp = req.body;
    var sql = 'INSERT INTO computers (name, price, cpu, screen, ram, storage) VALUES(?, ?, ?, ?, ?, ?);';
    connection.query(sql, [comp.name, comp.price, comp.cpu, comp.screen, comp.ram, comp.storage], (err, rows, fields) => {
        if (!err)
            res.send("Insertedddd!");
        else
            console.log(err);
    })
});