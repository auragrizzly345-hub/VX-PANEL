const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

// ===== DATABASE SIMPLE =====
const DB = "keys.json";
if (!fs.existsSync(DB)) fs.writeFileSync(DB, "[]");

const load = () => JSON.parse(fs.readFileSync(DB));
const save = (d) => fs.writeFileSync(DB, JSON.stringify(d,null,2));

// ===== MULTI USER =====
const USERS = [
{username:"Jeje", password:"admin"},
{username:"guest", password:"123"}
];

// ===== UI =====
app.get("/", (req,res)=>{
res.send(`<!DOCTYPE html>
<html>
<head>
<title>VX MENU GOD FINAL</title>

<style>
body{background:#000;color:#00ffcc;font-family:monospace;display:flex;overflow:hidden}
.left{width:70%;padding:20px}
.right{width:30%;border-left:1px solid #00ffcc;padding:10px}

.box{
border:1px solid #00ffcc;
margin:10px;
padding:10px;
animation:glow 2s infinite alternate;
}
@keyframes glow{
from{box-shadow:0 0 10px #00ffcc}
to{box-shadow:0 0 30px #00ffcc}
}

button{
background:black;color:#00ffcc;border:1px solid #00ffcc;
padding:8px;margin:5px;cursor:pointer;
}
button:hover{background:#00ffcc;color:black}

input{background:black;color:#00ffcc;border:1px solid #00ffcc;padding:6px}

#terminal{height:200px;overflow:auto;font-size:12px}

.loading{
position:fixed;width:100%;height:100%;
background:black;display:flex;justify-content:center;align-items:center;
z-index:999;font-size:20px;
}
</style>
</head>

<body>

<div class="loading" id="loadScreen">LOADING VX SYSTEM...</div>

<div class="left">

<div class="box" id="loginBox">
<h3>LOGIN</h3>
<input id="user"><br><br>
<input id="pass" type="password"><br><br>
<button onclick="login()">LOGIN</button>

<div id="keyDiv" style="display:none">
<input id="key"><br><br>
<button onclick="verify()">VERIFY KEY</button>
</div>

<p id="msg"></p>
</div>

<div id="menu" style="display:none">

<div class="box">
<h3>MOUSE</h3>
<button onclick="run('Apply Reg Mouse')">APPLY</button>
<button onclick="run('Raw Input')">APPLY</button>
<button onclick="run('Auto Drag')">APPLY</button>
<button onclick="run('High Precision')">APPLY</button>
<button onclick="run('DPI Awareness')">APPLY</button>
</div>

<div class="box">
<h3>SYSTEM</h3>
<button onclick="run('Debloat VX')">APPLY</button>
<button onclick="run('Debloat CTT')">APPLY</button>
<button onclick="run('CPU Tweaks')">APPLY</button>
<button onclick="run('RAM Cleaner')">APPLY</button>
<button onclick="run('Network Boost')">APPLY</button>
</div>

<div class="box">
<h3>TERMINAL</h3>
<div id="terminal"></div>
</div>

</div>
</div>

<div class="right">
<h3>STATUS</h3>
<p>CPU: <span id="cpu">0%</span></p>
<p>RAM: <span id="ram">0%</span></p>
<p id="expire"></p>
</div>

<script>

// ===== LOADING =====
setTimeout(()=>{
loadScreen.style.display="none";
},2000);

// ===== ANTI BYPASS =====
document.onkeydown=e=>{
if(e.key==="F12") return false;
if(e.ctrlKey && e.shiftKey) return false;
};

document.addEventListener("contextmenu", e=>e.preventDefault());

setInterval(()=>{
if(window.outerWidth - window.innerWidth > 150){
document.body.innerHTML="BLOCKED";
}
debugger;
},1000);

// ===== DEVICE =====
function device(){
let d=localStorage.getItem("vx_dev");
if(!d){
d=btoa(navigator.userAgent);
localStorage.setItem("vx_dev",d);
}
return d;
}

// ===== TERMINAL AUTO =====
function autoLog(){
let logs=["Injecting...","Bypassing...","Optimizing...","Connected..."];
setInterval(()=>{
terminal.innerHTML+="> "+logs[Math.floor(Math.random()*logs.length)]+"<br>";
terminal.scrollTop=terminal.scrollHeight;
},1500);
}

// ===== CPU RAM FAKE =====
setInterval(()=>{
cpu.innerText=Math.floor(Math.random()*100)+"%";
ram.innerText=Math.floor(Math.random()*100)+"%";
},1000);

// ===== RUN =====
function run(name){
terminal.innerHTML+="> "+name+" start...<br>";

let p=0;
let i=setInterval(()=>{
p+=10;
cpu.innerText=p+"%";
ram.innerText=p+"%";

if(p>=100){
clearInterval(i);
terminal.innerHTML+="> "+name+" DONE<br>";
}
},200);
}

// ===== LOGIN =====
async function login(){
let r=await fetch("/login",{method:"POST",headers:{"Content-Type":"application/json"},
body:JSON.stringify({username:user.value,password:pass.value})});
let d=await r.json();

if(d.status==="ok"){
msg.innerText="SUCCESS";
keyDiv.style.display="block";
}else{
msg.innerText="FAIL";
}
}

// ===== VERIFY =====
async function verify(){
let r=await fetch("/verify",{method:"POST",headers:{"Content-Type":"application/json"},
body:JSON.stringify({key:key.value,device:device()})});
let d=await r.json();

if(d.status==="ok"){
loginBox.style.display="none";
menu.style.display="block";
localStorage.setItem("exp",d.expire);
autoLog();
}else{
msg.innerText=d.status;
}
}

// ===== EXPIRE =====
setInterval(()=>{
let e=localStorage.getItem("exp");
if(!e) return;

let s=Math.floor((e-Date.now())/1000);
expire.innerText="Expire: "+s+"s";

if(s<=0){
alert("Expired");
location.reload();
}
},1000);

</script>

</body>
</html>`);
});

// ===== LOGIN =====
app.post("/login",(req,res)=>{
let {username,password}=req.body;

let user = USERS.find(u=>u.username===username && u.password===password);
if(user) return res.json({status:"ok"});

res.json({status:"fail"});
});

// ===== GENERATE KEY =====
app.get("/generate",(req,res)=>{
let days = parseInt(req.query.days || 1);

let key="VX-"+Math.random().toString(36).substring(2,8).toUpperCase();
let expire = Date.now() + days*86400000;

let db = load();
db.push({key,used:false,device:null,expire});
save(db);

res.json({key,expire});
});

// ===== VERIFY =====
app.post("/verify",(req,res)=>{
let {key,device}=req.body;

let db = load();
let d = db.find(x=>x.key===key);

if(!d) return res.json({status:"invalid"});
if(Date.now()>d.expire) return res.json({status:"expired"});

if(!d.used){
d.used=true;
d.device=device;
save(db);
return res.json({status:"ok",expire:d.expire});
}

if(d.device===device){
return res.json({status:"ok",expire:d.expire});
}

res.json({status:"used"});
});

// ===== ADMIN PANEL =====
app.get("/admin",(req,res)=>{
let db = load();

let html = "<h2>KEY LIST</h2>";
db.forEach(k=>{
html += `<p>${k.key} | ${k.used?"USED":"FREE"} | ${new Date(k.expire)}</p>`;
});

res.send(html);
});

// ===== RUN =====
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log("🔥 VX GOD SYSTEM RUNNING "+PORT));});

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
