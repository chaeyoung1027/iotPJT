function ledOn() {
  console.log("ledOn")
  var ref = database.ref('led');
  ref.update({ led: 1 });
}

function ledOff() {
  console.log("ledOff")
  var ref = database.ref('led');
  ref.update({ led: 0 });
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

// Initialize Firebase
firebase.initializeApp(config);
const database = firebase.database();

// LED 상태 가져오기
const ledRef = database.ref("led");
ledRef.on("value", function(data) {
  var val = data.val();
  if (val.led == 0) {
    document.getElementById("ledImage").src = "off.png";
  } else {
    document.getElementById("ledImage").src = "on.png?" + new Date().getTime();
  }
});

// 온도 가져오기
const tempRef = database.ref("temperature");
tempRef.on("value", function(data) {
  var temp = data.val();
  if (temp !== null) {
    document.getElementById("temperature").innerHTML = `현재 온도: ${temp}°C`;
  }
});
