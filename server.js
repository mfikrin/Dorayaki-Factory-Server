const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./dbconfig");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authJWT = require("./authFunc");
const resp = require('./nestedJSON');
const nodemailer = require("nodemailer");
// const db = require('./factoryDB')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// JWT auth - login
const accesstoken = 'hv0DyfMXoJd0fhB8pPtxOr6Czg1F3TtMBH8JZbFVadx5dMKCB5HRmuh9sH7yP2A3Zd4svx0qZFjY3RiO';
const refreshtoken = 'f1u3A85OdpdmJE6uaLAZVofkNde06GBXoe9es1yKN16rKPdsqWYuKDICAy90qM0g3N0j2HzY5tHpwCL9'

var refArray = [];
var uname = '';

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
            uname = username;
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

app.post('/logout',authJWT, async (req, res) => {
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
          "SELECT r.request_id,d.dora_name,r.req_qty,r.status,rl.ip,rl.timestamp_req FROM dora as d,request as r,request_log as rl where d.dora_id=r.dora_id and r.request_id=rl.request_id and r.status='pending'",
        );
        que.rows.forEach(e => {
            e.timestamp_req = e.timestamp_req.toString().toString();
            // var tm2 = tm.replace('T',' ');
            e.timestamp_req = e.timestamp_req.replace(' GMT+0700 (Western Indonesia Time)','');
        });
        res.json(que.rows);
    } catch (err) {
        console.error(err.message);
    }
});
// Update status list request (dari admin pabrik)
app.put('/request',authJWT,async (req,res)=>{
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
        var name = req.body.bahan_name;
        var qty = req.body.bahan_qty;
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
// Lihat bahan Spesifik
app.get("/bahan/:bahan_name", authJWT, async(req,res)=>{
    try{
        var bahan_name = req.params.bahan_name;
        var que = await db.query("SELECT * from bahan WHERE bahan_name=$1", [bahan_name]);
        res.json(que.rows[0]);
    }
    catch (err) {
        console.error(err.message);
    }
});
// Lihat bahan Spesifik
app.get("/bahanName/:bahan_id", authJWT, async(req,res)=>{
    try{
        var bahan_id = req.params.bahan_id;
        var que = await db.query("SELECT * from bahan WHERE bahan_id=$1", [bahan_id]);
        res.json(que.rows[0]);
    }
    catch (err) {
        console.error(err.message);
    }
});
app.get("/bahanut/:bahan_id", authJWT, async(req,res)=>{
    try{
        var bahan_id = req.params.bahan_id;
        var que = await db.query("SELECT bahan_name,bahan_qty FROM bahan WHERE bahan_id = $1",[bahan_id]);
        res.json(que.rows);
    }
    catch (err) {
        console.error(err.message);
    }
});
// Update bahan - quantity
app.put("/bahan/:bahan_id",authJWT, async(req,res)=>{
    try{
        var id = req.params.bahan_id;
        id = parseInt(id);
        var bahan_qty = req.body.bahan_qty;
        var que = await db.query(
            "UPDATE bahan SET bahan_qty = bahan_qty + $1 WHERE bahan_id = $2 RETURNING bahan_name",[bahan_qty,id]);
        // res.json(que.rows[0]);
        res.json(que.rows[0]);
    }
    catch (err) {
    console.error(err.message);
    }
});

// =========== Manajemen Resep

// Melihat daftar resep dan isinya
app.get('/resep',authJWT,async (req,res)=>{
    try{
        var que = await db.query(
            "SELECT * FROM resep",
          );
      
          resp.nestedJSON(que.rows,res);
    } catch(err){
        console.error(err.message);
    }
});

// Lihat resep Spesifik
app.get("/resep/:id", authJWT, async(req,res)=>{
    try{
        var {id} = req.params;   
        var que = await db.query("SELECT dora_name, bahan_name, resep_qty FROM resep AS re, bahan as ba, dora as d WHERE re.dora_id=d.dora_id AND re.bahan_id=ba.bahan_id AND d.dora_id=$1", [id]);
        res.json(que.rows);
    }
    catch (err) {
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
// Melihat daftar dorayaki name dan dora id di resep
app.get('/resepdora',authJWT,async (req,res)=>{
    try{
        var que = await db.query(
            "SELECT DISTINCT(dora_id), dora_name FROM resep NATURAL INNER JOIN dora ORDER BY dora_id",
          );
      
          res.json(que.rows);
    } catch(err){
        console.error(err.message);
    }
});

// Dorayaki

// Mendapatkan Dorayaki berdasar nama
app.get("/dora/:dora_name",authJWT, async(req,res)=>{
    try{
        var dora_name = req.params.dora_name;
        var que = await db.query("SELECT * from dora WHERE dora_name=$1",[dora_name]);
        if(que.rows.length!=0){
            res.json(que.rows[0]);
        }
        else{
            res.json({"dora_id":-1,"dora_name":"null"});
        }
        
    }
    catch (err) {
        console.error(err.message);
    }
});
// Mendapatkan Dorayaki berdasar ID
app.get("/doraName/:dora_id", authJWT, async(req,res)=>{
    try{
        var dora_id = req.params.dora_id;
        var que = await db.query("SELECT * from dora WHERE dora_id=$1",[dora_id]);
        res.json(que.rows[0]);
    }
    catch (err) {
        console.error(err.message);
    }
});

app.post("/dora",authJWT,async(req,res)=>{
    try{
        var dora_name = req.body.namae;
        var que = await db.query("INSERT INTO dora(dora_name) VALUES($1) RETURNING dora_id",[dora_name]);
        res.json(que.rows[0]);

    }
    catch(err){
        console.error(err.message);
    }
})

// Endpoint buat Java Interface

// Send Notif ke email
app.post('/reqdor',async(req,res)=>{
    var em =  'shokomakinohara10@gmail.com';
    
    try{
        var {msg} = req.body;
        res.json(msg);
        var teks = msg + '. More at http://localhost:3000/report';
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'stoccnots@gmail.com',
              pass: 'Giantsun420' 
            }
          });
          
          const mailOptions = {
            from: '"Stock Request Notifier" <stoccnots@gmail.com>',
            to: em,
            subject: 'Dorayaki Stock Request',
            text: teks
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }
    catch(err){
        console.error(err.message);
    }
}
);

app.listen(5000, () => {
    console.log("server has started on port 5000");
  });