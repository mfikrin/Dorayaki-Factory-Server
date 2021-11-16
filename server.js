const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./dbconfig");
const bodyParser = require('body-parser');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Kinda bad, bakal diganti pake jwt
app.post("/users", async (req, res) => {
    try {
      var username = req.body.username;
      var email = req.body.email;
      var password = req.body.password;
      var que = await db.query(
        "INSERT INTO users(username,email,password) VALUES($1,$2,$3) RETURNING *",
        [username,email,password]
      );
  
    res.json(que.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });

// TBA : Request Management - pake soap keknya

// ========= MANAJEMEN BAHAN

// Add bahan
app.post("/bahan",async(req,res)=>{
    try{
        var name = req.body.name;
        var qty = req.body.qty;
        var que = await db.query(
            "INSERT INTO bahan(bahan_name,bahan_qty) VALUES($1,$2) RETURNING *",
            [name,qty]);
        res.json(que.rows[0]);
    }
    catch (err) {
    console.error(err.message);
    }
});
// Lihat bahan
app.get("/bahan",async(req,res)=>{
    try{
        var que = await db.query("SELECT * from bahan");
        res.json(que.rows);
    }
    catch (err) {
        console.error(err.message);
    }
});
// Update bahan - quantity
app.put("/bahan/:id",async(req,res)=>{
    try{
        var {id} = req.params;
        var qty = req.body.qty;
        var que = await db.query(
            "UPDATE bahan SET bahan_qty = $1 WHERE bahan_id = $2",[qty,id]);
        res.json(que.rows[0]);
    }
    catch (err) {
    console.error(err.message);
    }
});

// =========== Manajemen Resep

// Add resep
// app.post("/resep",async(req,res)=>{
//     try{
//         var dora = req.body.dora;
//         var qty = req.body.qty;
//         var que1 = await db.query(
//             "INSERT INTO dora(dora_name) VALUES($1,$2) RETURNING *",
//             [dora]);
//         var que2 = await db.query(
//             "INSERT INTO bahan(bahan_id) VALUES($1,$2) RETURNING *",
//             [name]);

//         res.json(que1.rows[0]);
//     }
//     catch (err) {
//     console.error(err.message);
//     }
// });



app.listen(5000, () => {
    console.log("server has started on port 5000");
  });