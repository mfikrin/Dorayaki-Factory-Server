const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./dbconfig");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authJWT = require("./authFunc");

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



app.listen(5000, () => {
    console.log("server has started on port 5000");
  });