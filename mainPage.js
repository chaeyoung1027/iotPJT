// Firebase config
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

// LED ON function
function ledOn() {
  console.log("ledOn");
  var ref = database.ref('led');
  ref.update({ led: 1 });
}

// LED OFF function
function ledOff() {
  console.log("ledOff");
  var ref = database.ref('led');
  ref.update({ led: 0 });
}

// Listen to LED changes and update image
const ledRef = database.ref("led");
ledRef.on("value", function(data) {
  var val = data.val();
  if (val && val.led === 0) {
    document.getElementById("ledImage").src = "off.png";
    document.getElementById("ledImage").classList.remove("on");
  } else if (val && val.led === 1) {
    document.getElementById("ledImage").src = "on.png?" + new Date().getTime();
    document.getElementById("ledImage").classList.add("on");
  }
});

// Custom alert banner function
function showAlert(message, bgColor = '#4caf50') {
  const banner = document.getElementById('alertBanner');
  banner.style.backgroundColor = bgColor;
  banner.textContent = message;
  banner.style.display = 'block';

  setTimeout(() => {
    banner.style.display = 'none';
  }, 3000);
}

// Send message to Firebase
function sendMessage() {
  const msg = document.getElementById("messageInput").value.trim();
  if (msg.length === 0) {
    showAlert("메시지를 입력하세요.", '#f44336'); // red for error
    return;
  }

  const messagesRef = database.ref('messages');
  const newMsgRef = messagesRef.push();
  newMsgRef.set({
    text: msg,
    timestamp: Date.now()
  })
    .then(() => {
      showAlert("메시지가 전송되었습니다.");
      document.getElementById("messageInput").value = "";
    })
    .catch((error) => {
      showAlert("메시지 전송 실패: " + error.message, '#f44336');
    });
}

// Update temperature display
const tempRef = database.ref("temperature");
tempRef.on("value", function(data) {
  var temp = data.val();
  if (temp !== null) {
    document.getElementById("temperature").innerHTML = `현재 온도: ${temp} °C`;
  }
});

// Update humidity display
const humidityRef = database.ref("humidity");
humidityRef.on("value", function(data) {
  var humidity = data.val();
  if (humidity !== null) {
    document.getElementById("humidity").innerHTML = `현재 습도: ${humidity} %`;
  }
});

// Update gyroscope display
const gyroRef = database.ref("gyroscope");
gyroRef.on("value", function(data) {
  var gyro = data.val();
  if (gyro !== null) {
    document.getElementById("gyroscope").innerHTML =
      `자이로스코프 - X: ${gyro.x || 0}°, Y: ${gyro.y || 0}°, Z: ${gyro.z || 0}°`;
  }
});

// Update accelerometer display
const accelRef = database.ref("acceleration");
accelRef.on("value", function(data) {
  var accel = data.val();
  if (accel !== null) {
    document.getElementById("accelerometer").innerHTML =
      `가속도계 - X: ${accel.x || 0}m/s², Y: ${accel.y || 0}m/s², Z: ${accel.z || 0}m/s²`;
  }
});

// Logout function
function logout() {
  sessionStorage.removeItem('loggedIn');
  sessionStorage.removeItem('username');
  window.location.href = 'index.html';
}

// Update timestamp display
const timestampRef = database.ref("last_update");
timestampRef.on("value", function(data) {
  var timestamp = data.val();

  if (timestamp !== null) {
    var timestampString;
    
    // Check if timestamp is an object with last_update property
    if (typeof timestamp === 'object' && timestamp.last_update) {
      timestampString = timestamp.last_update;
    } else if (typeof timestamp === 'string') {
      timestampString = timestamp;
    }

    if (timestampString) {
      // Convert "2025-05-28 03:00:44" format to JavaScript Date
      var dateStr = timestampString.replace(' ', 'T'); // Convert to ISO format
      var date = new Date(dateStr);

      // If still invalid, try manual parsing
      if (isNaN(date.getTime())) {
        var parts = timestampString.split(' ');
        var datePart = parts[0]; // "2025-05-28"
        var timePart = parts[1]; // "03:00:44"
        date = new Date(datePart + 'T' + timePart);
      }

      document.getElementById("timestamp").innerHTML =
        `마지막 업데이트: ${date.toLocaleString('ko-KR')}`;
    } else {
      document.getElementById("timestamp").innerHTML = `마지막 업데이트: 형식 오류`;
    }
  } else {
    document.getElementById("timestamp").innerHTML = `마지막 업데이트: 데이터 없음`;
  }
});