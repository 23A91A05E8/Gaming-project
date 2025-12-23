const express = require("express");
const app = express();

const choices = ["rock", "paper", "scissors"];
const icons = { rock: "✊", paper: "✋", scissors: "✌️" };

/* ========= COMPUTER MODE STATE ========= */
let cUserScore = 0;
let cCompScore = 0;
let cRounds = 5;
let cGameOver = false;

/* ========= FRIENDS MODE STATE ========= */
let fP1Choice = null;
let fP2Choice = null;
let fP1Score = 0;
let fP2Score = 0;
let fRounds = 5;
let fGameOver = false; // Added to limit friends mode rounds

/* ========= HELPERS ========= */
const rand = () => choices[Math.floor(Math.random() * 3)];

function resetComputer() {
  cUserScore = 0;
  cCompScore = 0;
  cRounds = 5;
  cGameOver = false;
}

function resetFriends() {
  fP1Choice = null;
  fP2Choice = null;
  fP1Score = 0;
  fP2Score = 0;
  fRounds = 5;
  fGameOver = false; // reset flag
}

/* ================= HOME SCREEN ================= */
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Rock Paper Scissors</title>
<style>
body{
  margin:0;height:100vh;
  background:
    linear-gradient(120deg,#ff512f,#f09819,#ff512f);
  background-size:400% 400%;
  animation:bg 8s ease infinite;
  color:white;
  font-family:Segoe UI;
  display:flex;
  justify-content:center;
  align-items:center;
}
@keyframes bg{
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
.container{text-align:center}
h1{
  font-size:4rem;
  margin-bottom:40px;
  text-shadow:0 0 25px rgba(0,0,0,.5);
}
.menu{display:flex;gap:50px}
.card{
  width:260px;height:180px;
  background:rgba(255,255,255,.25);
  border-radius:25px;
  padding:25px;
  cursor:pointer;
  transition:.4s;
  box-shadow:0 20px 40px rgba(0,0,0,.4);
}
.card:hover{
  transform:translateY(-12px) scale(1.05);
}
</style>
</head>
<body>
<div class="container">
<h1>✊ ✋ ✌️<br>Rock Paper Scissors</h1>
<div class="menu">
  <div class="card" onclick="location.href='/computer'">
    <h2>💻 Play with Computer</h2>
    <p>Beat the AI</p>
  </div>
  <div class="card" onclick="location.href='/friends'">
    <h2>🧑‍🤝‍🧑 Play with Friends</h2>
    <p>2 Player Fun</p>
  </div>
</div>
</div>
</body>
</html>
`);
});

/* ================= COMPUTER MODE ================= */
app.get("/computer", (req, res) => {
  resetComputer();
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Computer Mode</title>
<style>
body{
  margin:0;height:100vh;
  background:
    radial-gradient(circle at top,#0f2027,#000000 70%);
  color:#00ffff;
  font-family:Segoe UI;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
}
h1{text-shadow:0 0 15px cyan}
.score{display:flex;gap:60px;font-size:1.4rem}
.arena{display:flex;gap:140px;margin:30px}
.icon{
  font-size:9rem;
  text-shadow:0 0 35px cyan;
}
button{
  padding:15px 45px;
  font-size:1.2rem;
  border-radius:40px;
  border:none;
  cursor:pointer;
  margin:10px;
  background:linear-gradient(90deg,#00f260,#0575e6);
}
.back{background:#222;color:white}
</style>
</head>
<body>

<h1>YOU ⚔ COMPUTER</h1>

<div class="score">
  <div>👤 You: <span id="u">0</span></div>
  <div>🎯 Chances: <span id="r">5</span></div>
  <div>💻 Computer: <span id="c">0</span></div>
</div>

<div class="arena">
  <div id="ui" class="icon">❔</div>
  <div id="ci" class="icon">❔</div>
</div>

<h2 id="msg"></h2>

<div>
  <button onclick="play()">PLAY</button>
  <button class="back" onclick="location.href='/'">BACK TO MENU</button>
</div>

<script>
function play(){
 fetch('/cplay')
 .then(r=>r.json())
 .then(d=>{
   ui.textContent=d.ui;
   ci.textContent=d.ci;
   u.textContent=d.us;
   c.textContent=d.cs;
   r.textContent=d.r;
   msg.textContent=d.m;
 });
}
</script>

</body>
</html>
`);
});

app.get("/cplay",(req,res)=>{
  if(cGameOver) return res.json({});
  const u=rand(), c=rand();
  let m="🤝 Tie";
  if(u!==c){
    if(
      (u==="rock"&&c==="scissors")||
      (u==="paper"&&c==="rock")||
      (u==="scissors"&&c==="paper")
    ){cUserScore++;m="🎉 You Win!";}
    else{cCompScore++;m="😢 Computer Wins!";}
  }
  cRounds--;
  if(cRounds===0) cGameOver=true;
  res.json({ui:icons[u],ci:icons[c],us:cUserScore,cs:cCompScore,r:cRounds,m});
});

/* ================= FRIENDS MODE ================= */
app.get("/friends",(req,res)=>{
  resetFriends();
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Friends Mode</title>
<style>
body{
  margin:0;height:100vh;
  background:
    linear-gradient(135deg,#fbc2eb,#a6c1ee,#fbc2eb);
  background-size:300% 300%;
  animation:bg2 10s ease infinite;
  color:#333;
  font-family:Segoe UI;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
}
@keyframes bg2{
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
.score{display:flex;gap:60px;font-size:1.3rem}
.arena{display:flex;gap:120px;margin:30px}
.icon{
  font-size:8rem;
  text-shadow:0 0 20px rgba(0,0,0,.3);
}
button{
  padding:14px 35px;
  font-size:1.1rem;
  border-radius:35px;
  border:none;
  cursor:pointer;
  margin:10px;
  background:white;
}
</style>
</head>
<body>

<h1>PLAYER 1 🤝 PLAYER 2</h1>

<div class="score">
  <div>👤 P1: <span id="s1">0</span></div>
  <div>🎯 Chances: <span id="r">5</span></div>
  <div>👤 P2: <span id="s2">0</span></div>
</div>

<div class="arena">
  <div>
    <h2>PLAYER 1</h2>
    <div id="i1" class="icon">❔</div>
    <button onclick="playP1()">PLAY</button>
  </div>
  <div>
    <h2>PLAYER 2</h2>
    <div id="i2" class="icon">❔</div>
    <button onclick="playP2()">PLAY</button>
  </div>
</div>

<h2 id="msg"></h2>

<button onclick="location.href='/'">BACK TO MENU</button>

<script>
function playP1(){
 fetch('/friend/p1').then(r=>r.json()).then(d=>{
   i1.textContent=d.icon;
   msg.textContent="Player 2 turn";
 });
}
function playP2(){
 fetch('/friend/p2').then(r=>r.json()).then(d=>{
   i2.textContent=d.icon;
   s1.textContent=d.s1;
   s2.textContent=d.s2;
   r.textContent=d.r;
   msg.textContent=d.msg;
 });
}
</script>

</body>
</html>
`);
});

app.get("/friend/p1",(req,res)=>{
  if(fGameOver) return res.json({ icon:"❌" });
  fP1Choice=rand();
  res.json({icon:icons[fP1Choice]});
});

app.get("/friend/p2",(req,res)=>{
  if(fGameOver || !fP1Choice){
    return res.json({icon:"❌",msg:"Game Over",s1:fP1Score,s2:fP2Score,r:fRounds});
  }
  fP2Choice=rand();
  let msg="🤝 Tie";
  if(fP1Choice!==fP2Choice){
    if(
      (fP1Choice==="rock"&&fP2Choice==="scissors")||
      (fP1Choice==="paper"&&fP2Choice==="rock")||
      (fP1Choice==="scissors"&&fP2Choice==="paper")
    ){fP1Score++;msg="🎉 Player 1 wins";}
    else{fP2Score++;msg="🎉 Player 2 wins";}
  }
  fRounds--; fP1Choice=null;
  if(fRounds===0){
    fGameOver = true;
    msg=fP1Score>fP2Score?"🏆 PLAYER 1 WINS!":fP2Score>fP1Score?"🏆 PLAYER 2 WINS!":"🤝 DRAW!";
  }
  res.json({icon:icons[fP2Choice],msg,s1:fP1Score,s2:fP2Score,r:fRounds});
});

/* ================= SERVER ================= */
app.listen(5000,()=>console.log("Running at http://localhost:5000"));
