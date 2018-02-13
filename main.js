/*
感謝您觀看這份程式碼
作品名稱: 烏龜烏龜翹
作者: 陳光穎 Bruce Chen
聯絡方式
    Facebook連結: https://www.facebook.com/bruce.chen.372
    LINE ID: brucechen0
最後修改日期: 2018/2/13
版本: 1.0.0.7
發表於: https://brucechen034020.github.io/
程式碼尺度
  N/A
作者註解:
  1. 如本網頁有 bug 請用 Facebook(Messenger) 通知 Bruce Chen，謝謝。
  2. 如有任何建議，請用 Facebook(Messenger) 通知 Bruce Chen，謝謝。
*/

/* Global variables */
var label1; // Show how many seconds left (Label)
var label2; // Show which key you pressed (Label)
var ip; // ip address of client (string)
var database; // firebase database
var button1; // (Button)
var button4; // (Button)
var textBox5; // (Input)
var destination; // time destination to 公布大家按的 (Date)
var involved; // You are involved in the game (bool)
var onlineList = []; // online list (string array)
var onlineListOl; // online list (ol)
var resultList = []; // result list (2D string array)  resultList[i][0] = string to present; resultList[i][1] = name ; resultList[i][2] = keyCode;
var isSent; // key pressed is sent to the server (bool)
var result; // result p (p)
var onlineCount; // (p)
var banker; // 莊家 (string)
var isBanker; // I am  banker (bool)
var lastBankerData = {}; // (dictionary)
var bankerChosen = false; // I know who is 莊家 (bool)
var score; // (int)
var scoreL; // (Label)
var leaderboardData = {}; // (dict<string, string>)

/* p5 functions */
function setup() {
  destination = new Date();
  involved = false;
  isBanker = false;
  banker = '';
  score = 0;

  $('body').on('contextmenu', 'canvas', function(e){ return false; });

  $.getJSON('https://freegeoip.net/json/', function(data) {
    console.log(JSON.stringify(data, null, 2));
    var userName = data['ip']
    userName += ' (' + (data['country_name']) + ')';
    if(localStorage.getItem("name") == null)
      localStorage.setItem("name", userName);
    ip = userName.replace('.', '-');
    ip = ip.replace('.', '-');
    ip = ip.replace('.', '-');
    ip = ip.replace('.', '-');
    ip = ip.replace(' ', '-');
    ip = ip.replace('(', '');
    ip = ip.replace(')', '');
    ip = '-' + ip;
  });

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAtSmq-5eSZnGlmlk5yCucJxTk6uKLRbCw",
    authDomain: "turtleturtle-e35e8.firebaseapp.com",
    databaseURL: "https://turtleturtle-e35e8.firebaseio.com",
    projectId: "turtleturtle-e35e8",
    storageBucket: "turtleturtle-e35e8.appspot.com",
    messagingSenderId: "528080390379"
  };
  firebase.initializeApp(config);
  database = firebase.database();

  noCanvas();

  // initialize elements
  label1 = document.getElementById('label1');
  label1.style.fontSize = '100px';

  label2 = document.getElementById('label2');

  button1 = document.getElementById('button1');
  button1.addEventListener("click", button1_Clicked);
  button1.style.fontSize = '48px';

  button4 = document.getElementById('button2');
  button4.addEventListener("click", button4_Clicked);

  textBox5 = document.getElementById('textBox5');
  setTimeout(function(){ textBox5.value = localStorage.getItem('name'); }, 3000);

  result = document.getElementById('result');
  result.style.fontSize = '20px';

  onlineCount = document.getElementById('onlineCount');

  scoreL = document.getElementById('scoreL');

  // set ref.on
  var ref1 = database.ref('reset/0');
  var ref2 = database.ref('key');
  var ref3 = database.ref('lastBankerTime');
  var ref4 = database.ref('leaderboard');
  var ref5 = database.ref('online');

  //ref3.push({name: localStorage.getItem('name')});
  /*ref4.set({'1stScore': 0,
              '1stName': 0,
            '2ndName': 0,
            '2ndScore': 0,
          '3rdName': 0,
        '3rdScore': 0});*/

  ref1.on('value', gotData1, errData1);
  ref2.on('value', gotData2, errData2);
  ref3.on('value', gotData3, errData3);
  ref4.on('value', gotData4, errData4);
  ref5.on('value', gotData5, errData5);

  code2string_ini();

  /* Welcome Message */
  var welcom = "歡迎來玩「烏龜烏龜翹，鍵盤鍵盤按」！\r\n規則：每個人隨便在鍵盤上按一個按鍵。若有人按的按鍵和莊家相同，則莊家得1分。";
  alert(welcom);
}

function draw(){
  frameRate(3);
  scoreL.innerHTML = 'Your score: ' + score + ' points';
  var now = new Date();
  if(destination.getTime() < now.getTime()){
    Reset1();
  }
  if(destination.getTime() + 7000 < now.getTime()){
    Reset2();
  }
  if(involved){
    label1.innerHTML = ceil((destination.getTime() - now.getTime())/1000);
  }else{
    label1.innerHTML = '';
  }
  if(destination.getTime() - 7000 < now.getTime() && !bankerChosen){
    countOnline();
    chooseBanker();
  }
  var listings = selectAll('.fuck');
  var n = listings.length;
  onlineCount.innerHTML = onlineCount.value = n + ' people online';
}

function keyPressed(e){
  if(!involved) return;
  if(isSent) return;
  console.log('Key: ' + keyCode);
  console.log(code2string[keyCode]);
  var now = new Date();
  var ref = database.ref('key/' + ip);
  data = {name: localStorage.getItem('name'),
          key: keyCode,
          time: now.toString()};
  ref.set(data);
  isSent = true;
  label2.innerHTML = "您按了 " + code2string[keyCode];
}

function mousePressed(e){
  var keyCode = e.button + 512;

  if(!involved) return;
  if(isSent) return;
  console.log('Mouse: ' + e.button);
  console.log(code2string[keyCode]);
  var now = new Date();
  var ref = database.ref('key/' + ip);
  data = {name: localStorage.getItem('name'),
          key: keyCode,
          time: now.toString()};
  ref.set(data);
  isSent = true;
  label2.innerHTML = "您按了 " + code2string[keyCode];
}

/* User defined functions */
function countOnline(){
  var listings = selectAll('.fuck');
  var n = listings.length;
  if(n<=1){
    involved = false;
    label2.innerHTML = "Sorry, 上線人數不夠，遊戲無法進行。";
  }
}

function chooseBanker(){

  var now = new Date();
  var min = now.getTime() * 2;
  var minHolder;
  var keys = Object.keys(lastBankerData);

  for(var i=0; i<keys.length; i++){
    var k = keys[i];

    var n = lastBankerData[k].name;

    var t = new Date(lastBankerData[k].lastBankerTime);

    if(onlineList.includes(n)){

      if(t.getTime() < min){

        min =  t.getTime();
        minHolder = n;

      }
    }
  }

  banker = minHolder;

  if(banker == localStorage.getItem('name')){
    isBanker = true;
  }else{
    isBanker = false;
  }
  bankerChosen = true;

  var listing2 = selectAll('.fuck');
  for(var i=0; i<listing2.length; i++){

    if(listing2[i].html() == banker + ' is online'){

      listing2[i].html(listing2[i].html() + '        <------- (莊家)');
    }
  }
}

function sendOnline(){ // send a message to show you are online to the server
  var ref = database.ref('online/' + ip);
  var d = new Date();
  var data = {
    name: localStorage.getItem('name'),
    time: d.toString()
  }
  console.log(data);
  ref.set(data);
}

function Reset2(){
    /* Send reset to server */
    var now = new Date();
    var des = new Date(now.getTime() + 11000);
    var ref = database.ref('reset/0');
    var data = {time: des.toString(),
              sender: localStorage.getItem('name')};
    ref.set(data);


}
function Reset1(){
  involved = false;
    var now = new Date();

    /* Update result */
    var bankerCode = '';

    for(var i=0; i<resultList.length; i++){
      if(resultList[i][1] == banker){
        bankerCode = resultList[i][2];
      }
    }
    var listings = selectAll('.result');
    for(var i=0; i<listings.length; i++){
      listings[i].remove();
    }
    for(var i=0; i<resultList.length; i++){
      var li;
      if(resultList[i][1] == banker){
        li = createElement('li', resultList[i][0] + '        ←------- (莊家)');
      }else if(resultList[i][2] == bankerCode){
        li = createElement('li', resultList[i][0] + '        ←------- (跟莊家一樣耶! 笑死他!)');
      }else{
        li = createElement('li', resultList[i][0]);
      }
      li.class('result');
      li.parent('resultList');

    }
    document.getElementById('resultList').style.fontSize = '20px';

    var coin = false
    var n = resultList.length;
    for(var i=0; i<n; i++){
      if(resultList[i][2] == bankerCode && resultList[i][1] != banker){
        var final = [];
        final[0] = resultList[i][1] + ' 按了跟莊家一樣的按鍵，莊家得1分';
        coin = true;
        if(isBanker){
          score++;
        }
        var li = createElement('li', final[0]);
        li.class('result');
        li.parent('resultList');
      }
    }
    if(!coin){
      var li = createElement('li', "沒有人按了跟莊家一樣的按鍵。");
      li.class('result');
      li.parent('resultList');
    }

    var pressed = [];
    for(var i=0; i<onlineList.length; i++){
      pressed[i] = false;
    }
    for(var i=0; i<n; i++){
      for(var j=0; j<onlineList.length; j++){
        if(resultList[i][1]==onlineList[j]){
          pressed[j] = true;
        }
      }
    }
    for(var i=0; i<onlineList.length; i++){
      if(pressed[i]==false){
        var li = createElement('li', onlineList[i] + ' 沒按任何按鍵，被罰扣1分。');
        if(onlineList[i]==localStorage.getItem('name')){
          score -= 1;
        }
        li.class('result');
        li.parent('resultList');
      }
    }

    button1.style.display="block";
    document.getElementById('p1').innerHTML = document.getElementById('p1').value = '莊家會在剩餘7秒時抽，所以請勿太晚加入以免損失機會。';
    label2.innerHTML = '';
    isSent = false;

    if(isBanker){
      var ref3 = database.ref('lastBankerTime/' + ip);
      var data3 = {name: localStorage.getItem('name'),
                   lastBankerTime: now.toString()};
      ref3.set(data3);
    }

    bankerChosen = false;

    /* Update leaderboard */
    console.log(score);
    console.log(leaderboardData['3rdScore']);
    if(score > leaderboardData['1stScore']){
      leaderboardData['3rdName'] = leaderboardData['2ndName'];
      leaderboardData['3rdScore'] = leaderboardData['2ndScore'];
      leaderboardData['2ndName'] = leaderboardData['1stName'];
      leaderboardData['2ndScore'] = leaderboardData['1stScore'];
      leaderboardData['1stName'] = localStorage.getItem('name');
      leaderboardData['1stScore'] = score;
      var ref4 = database.ref('leaderboard');
      ref4.set(leaderboardData);
    }else if(score > leaderboardData['2ndScore']){
      leaderboardData['3rdName'] = leaderboardData['2ndName'];
      leaderboardData['3rdScore'] = leaderboardData['2ndScore'];
      leaderboardData['2ndName'] = localStorage.getItem('name');
      leaderboardData['2ndScore'] = score;
      var ref4 = database.ref('leaderboard');
      ref4.set(leaderboardData);
    }else if(score > leaderboardData['3rdScore']){
      leaderboardData['3rdName'] = localStorage.getItem('name');
      leaderboardData['3rdScore'] = score;
      var ref4 = database.ref('leaderboard');
      ref4.set(leaderboardData);
    }


    var d = destination.getTime();
    destination.setTime(d + 18000)
}
