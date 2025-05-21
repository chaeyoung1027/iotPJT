function ledOn() {
  console.log("ledOn")
  var ref = database.ref('led');
  ref.update({ led: 1 })
}
function ledOff() {
  console.log("ledOff")
  var ref = database.ref('led');
  ref.update({ led: 0 })
}

var config = {
  apiKey: "AIzaSyAcPT_S00tDc3wdVRz2uxb9-7COdbCSQeo",
  authDomain: "myweb-dad12.firebaseapp.com",
  databaseURL: "https://myweb-dad12-default-rtdb.firebaseio.com",
  projectId: "myweb-dad12",
  storageBucket: "myweb-dad12.firebasestorage.app",
  messagingSenderId: "360930516999",
  appId: "1:360930516999:web:3b553a97d5d623cf32caa2"
};

//Firebase 데이터베이스 만들기
firebase.initializeApp(config);
database = firebase.database();

// Firebase 데이터베이스 정보 가져오기
var ref = database.ref("led");
ref.on("value", gotData);

function gotData(data) {
  var val = data.val();
  console.log(document.getElementById("img"))
  console.log(val.led)
  if (val.led == 0) {
    //document.getElementById("ledstatus").innerHTML = "led가 현재 꺼짐";
    document.getElementById("ledImage").src = "off.png";
    console.log("LED 꺼짐, 이미지 off.png로 변경");
  }
  else {
    //document.getElementById("ledstatus").innerHTML = "led가 현재 켜짐";
    document.getElementById("ledImage").src = "on.png";
    console.log("LED 켜짐, 이미지 on.png로 변경");
  }

  console.log(val)
}