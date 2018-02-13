/* Events
版本: 1.0.0.7
*/

/* Click Events */
function button1_Clicked(){ // 報名
  sendOnline();
  involved = true;
  button1.style.display="none";
  document.getElementById('p1').innerHTML = document.getElementById('p1').value = '';
}

function button4_Clicked(){ // click, set username (void)
  /* Change username */
  var userName = textBox5.value;
  localStorage.setItem("name", userName);

  /* Send record */
  var reff = database.ref('record');
  var now = new Date();
  var data = {
    Ip: ip,
    Name: localStorage.getItem('name'),
    Time: now.toString()
  }
  console.log(data);
  reff.push(data);
}

/* Value Events */
function gotData1(data){ // value reset (void)
  var dt = data.val();
  destination = new Date(dt['time']);
}

function errData1(err){ // value (void)
  console.log("Error!");
  console.log(err);
}

function gotData2(data){ // result (void)
  resultList = [];
  var dt = data.val();
  var keys = Object.keys(dt);
  for(var i=0; i<keys.length; i++){
    var k = keys[i];
    var n = dt[k].name;
    if(onlineList.includes(n)){
      resultList[i] = [];
      resultList[i][0] = n + ' 按了 ' + code2string[dt[k].key];
      resultList[i][1] = n;
      resultList[i][2] = dt[k].key.toString();
      console.log(resultList);
    }
  }
}

function errData2(err){ // value (void)
  console.log("Error!");
  console.log(err);
}

function gotData3(data){ // lastBankerTime (void)

  var now = new Date();
  var dt = data.val();
  lastBankerData = dt;

  // Initialize last banker Time

  if(dt[ip] == null || dt[ip] == undefined){
    var ref = database.ref('lastBankerTime/' + ip);
    var data3 = {name: localStorage.getItem('name'),
                 lastBankerTime: now.toString()};
    ref.set(data3);
  }
}

function errData3(err){ // value (void)
  console.log("Error!");
  console.log(err);
}

function gotData4(data){ // value reset (void)
  var dt = data.val();
  leaderboardData = dt;
  var listings = selectAll('.Leaderboard');
  for(var i=0; i<listings.length; i++){
    listings[i].remove();
  }
  var li1 = createElement('li', '1st: ' + dt['1stName'] + ', ' + dt['1stScore'] + ' points.');
  li1.class('Leaderboard');
  li1.parent('leaderboard');
  var li2 = createElement('li', '2nd: ' + dt['2ndName'] + ', ' + dt['2ndScore'] + ' points.');
  li2.class('Leaderboard');
  li2.parent('leaderboard');
  var li3 = createElement('li', '3rd: ' + dt['3rdName'] + ', ' + dt['3rdScore'] + ' points.');
  li3.class('Leaderboard');
  li3.parent('leaderboard');
}

function errData4(err){ // value (void)
  console.log("Error!");
  console.log(err);
}

function gotData5(data){ // value online (void)

  var listings = selectAll('.fuck');
  for(var i=0; i<listings.length; i++){
    listings[i].remove();
  }

  var dt = data.val();

  if(dt==null){
    return;
  }
  onlineList = [];
  var keys = Object.keys(dt);
  for(var i=0; i<keys.length; i++){
    var k = keys[i];
    var n = dt[k].name;
    var t = new Date(dt[k].time);

    var now = new Date();

    if(t.getTime() > now.getTime() - 27000){

      var li = createElement('li', n + ' is online');
      li.class('fuck');
      li.parent('onlineList');
      onlineList.push(n);

    }
  }

}

function errData5(err){ // value (void)
  console.log("Error!");
  console.log(err);
}


/* Timed events */
