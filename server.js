const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./dbconfig");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authJWT = require("./authFunc");
const resp = require('./nestedJSON');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// JWT auth - login
const accesstoken = 'hv0DyfMXoJd0fhB8pPtxOr6Czg1F3TtMBH8JZbFVadx5dMKCB5HRmuh9sH7yP2A3Zd4svx0qZFjY3RiO';
const refreshtoken = 'f1u3A85OdpdmJE6uaLAZVofkNde06GBXoe9es1yKN16rKPdsqWYuKDICAy90qM0g3N0j2HzY5tHpwCL9'

var refArray = [];

app.post('/login',async (req,res)=>{
    try{
        var username = req.body.username;
        var password = req.body.password;
        var que = await db.query(
            "SELECT * from users WHERE username = $1 AND password = $2",
            [username,password]
          );

          if(que.rows.length != 0){
            const accToken = jwt.sign({username : username},accesstoken,{expiresIn:'24h'});
            const refToken = jwt.sign({username : username},refreshtoken);
            refArray.push(refToken);
            res.json({accToken,refToken});
        }
        else{
            res.json({"msg" : "Invalid Login"});
        }

    }
    catch (err){
        console.error(err.message);
    }
})

app.post('/token', (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.sendStatus(401);
    }
    if (!refArray.includes(token)) {
        return res.sendStatus(403);
    }
    jwt.verify(token, refreshtoken, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        const accToken = jwt.sign({username : user.username},accesstoken,{expiresIn :'24h'});
        res.json({accToken});
    });
});

app.post('/logout', (req, res) => {
    const { token } = req.body;
    refArray = refArray.filter(t => t !== token);
    res.send("Logout successful");
});

// register, gatau butuh apa ga
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
// List request buat admin lihat di pabrik
app.get('/request',authJWT,async (req,res)=>{
    try {
        var que = await db.query(
          "SELECT * FROM request",
        );
    
        res.json(que.rows);
    } catch (err) {
        console.error(err.message);
    }
});
// Update status list request (dari admin pabrik)
app.put('/requestUpdate',authJWT,async (req,res)=>{
    try{
        var request_id = req.body.request_id;
        var status = req.body.status;
        var que = await db.query(
            "UPDATE request SET status=($1) WHERE request_id=($2) RETURNING *",
            [status, request_id]
        );
      
        res.json(que.rows[0]);
    } catch (err){
        console.error(err.message);
    }

});

// ========= MANAJEMEN BAHAN

// Add bahan
app.post("/bahan",authJWT, async(req,res)=>{
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
app.get("/bahan", authJWT, async(req,res)=>{
    try{
        var que = await db.query("SELECT * from bahan");
        res.json(que.rows);
    }
    catch (err) {
        console.error(err.message);
    }
});
// Update bahan - quantity
app.put("/bahan/:id",authJWT, async(req,res)=>{
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
//         var 
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

// Melihat daftar resep dan isinya
app.get('/resepList',authJWT,async (req,res)=>{
    try{
        var que = await db.query(
            "SELECT * FROM resep",
          );
      
          resp.nestedJSON(que.rows,res);
    } catch(err){
        console.error(err.message);
    }
});
// Add resep baru
app.post('/resep',authJWT,async (req,res)=>{
    try {
        var bahan_id = req.body.bahan_id;
        var dora_id = req.body.dora_id;
        var resep_qty = req.body.resep_qty;

        var que = await db.query(
            "INSERT INTO resep (bahan_id, dora_id, resep_qty) VALUES($1,$2,$3) RETURNING *",
            [bahan_id, dora_id, resep_qty]
          );
      
          res.json(que.rows[0]);
    } catch(err) {
        console.error(err.message);
    }
});

app.listen(5000, () => {
    console.log("server has started on port 5000");
  });