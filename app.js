const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

// ===== DATABASE =====
const DB = "keys.json";
if (!fs.existsSync(DB)) fs.writeFileSync(DB, "[]");

const load = () => JSON.parse(fs.readFileSync(DB));
const save = (d) => fs.writeFileSync(DB, JSON.stringify(d,null,2));

// ===== UI =====
app.get("/", (req,res)=>{
res.send(`<h2 style="color:lime;text-align:center">VX MENU ONLINE ✅</h2>
<p style="text-align:center">Server aktif 🔥</p>`);
});

// ===== LOGIN =====
app.post("/login",(req,res)=>{
let {username,password}=req.body;

if(username==="Jeje" && password==="admin"){
return res.json({status:"ok"});
}
res.json({status:"fail"});
});

// ===== GENERATE =====
app.get("/generate",(req,res)=>{
let key="VX-"+Math.random().toString(36).substring(2,10).toUpperCase();

let db=load();
db.push({
key,
used:false,
device:null,
expire:Date.now()+86400000
});
save(db);

res.json({key});
});

// ===== VERIFY =====
app.post("/verify",(req,res)=>{
let {key,device}=req.body;

let db=load();
let data=db.find(x=>x.key===key);

if(!data) return res.json({status:"invalid"});
if(Date.now()>data.expire) return res.json({status:"expired"});

if(!data.used){
data.used=true;
data.device=device;
save(db);
return res.json({status:"ok",expire:data.expire});
}

if(data.device===device){
return res.json({status:"ok",expire:data.expire});
}else{
return res.json({status:"used"});
}
});

// ===== RESET =====
app.get("/reset/:key",(req,res)=>{
let db=load();
let data=db.find(x=>x.key===req.params.key);

if(!data) return res.send("not found");

data.used=false;
data.device=null;
save(db);

res.send("reset success");
});

// ===== PORT ONLINE =====
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log("🔥 jalan di "+PORT));