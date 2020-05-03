let lightStateOn = true;
let motionDetectOn = true;

const ledOnUrl = "http://esp8266.local/?led=on";
const ledOffUrl = "http://esp8266.local/?led=off";
const url = "http://esp8266.local/?feedback";

const ledState = [
  {
    ledState: "OFF",
  },
  {
    ledState: "ON",
  },
];
const switchStyleBig = [
  {
    "justify-content": "flex-start",
    "background-color": "#cddcdc",
    "background-image":
      "radial-gradient(at 50% 100%,rgba(255, 255, 255, 0.5) 0%,rgba(0, 0, 0, 0.5) 100%),linear-gradient(to bottom,rgba(255, 255, 255, 0.25) 0%,rgba(0, 0, 0, 0.25) 100%)",
    "background-blend-mode": "screen, overlay",
  },
  {
    "justify-content": "flex-end",
    "background-color": "#98fb98",
    "background-image": "",
    "background-blend-mode": "",
  },
];

const switchStyleSmall = [
  {
    "justify-content": "flex-start",
    "background-color": "#cddcdc",
    "background-image":
      "radial-gradient(at 50% 100%,rgba(255, 255, 255, 0.5) 0%,rgba(0, 0, 0, 0.5) 100%),linear-gradient(to bottom,rgba(255, 255, 255, 0.25) 0%,rgba(0, 0, 0, 0.25) 100%)",
    "background-blend-mode": "screen, overlay",
  },
  {
    "justify-content": "flex-end",
    "background-color": "#98fb98",
    "background-image": "",
    "background-blend-mode": "",
  },
];

function post(url, json) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(json));
}

function changeSwitchStyle(classname) {
  let currentClass = undefined;

  if (classname === ".inner-shape-big") {
    currentClass = classname;
    if (lightStateOn) {
      $(currentClass).css(switchStyleBig[0]);
      lightStateOn = false;
    } else {
      $(currentClass).css(switchStyleBig[1]);
      lightStateOn = true;
    }
  }

  if (classname === ".inner-shape-small") {
    currentClass = classname;
    if (motionDetectOn) {
      $(currentClass).css(switchStyleSmall[0]);
      motionDetectOn = false;
    } else {
      $(currentClass).css(switchStyleSmall[1]);
      motionDetectOn = true;
    }
  }
}

function httpGetJson(url) {
  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then(function (responseAsJson) {
      updateCondition(responseAsJson);
      console.log("I am running!");
    })
    .catch((error) => {
      $(".wifi-status").html("DISCONNECTED");
      console.error("Error:", error);
    })
}

function lightToggle() {
  changeSwitchStyle(".inner-shape-big");
  if (lightStateOn) {
    fetch(ledOnUrl);
  } else {
    fetch(ledOffUrl);
  }
}

function motionDetectToggle() {
  changeSwitchStyle(".inner-shape-small");
}

function updateCondition(jsonfile) {
  let temp = "" + jsonfile.temprature + "°";
  let humidity = "" + jsonfile.humidity + "%";
  let isConnected = jsonfile.connectionstatus;
  if(jsonfile.ledstate != lightStateOn){
    changeSwitchStyle(".inner-shape-big");
  }
  if(isConnected){
    $(".wifi-status").html("CONNECTED");
  }
  $(".temprature-content").html(temp);
  $(".humidity-content").html(humidity);
}

$(document).ready(function () {
  fetch(ledOnUrl);
});

let ssid;
let password;

function openPanel() {
  $(".flex-container-1").css({
    "filter": "brightness(60%)",
  })

  $(".cloud").css({
    "filter": "blur(15px)",
  })

  $(".device-field-wrapper").css({
    "display": "flex",
  })
}

function closePanel() {
  $(".flex-container-1").css({
    "filter": "",
  })

  $(".cloud").css({
    "filter": "",
  })
  $(".device-field-wrapper").css({
    "display": "none",
  })
}

function submitWifi() {
  ssid = $("#ssid").val();
  password = $("#password").val();
  $(".wifi-status").html("CONNECTING...");
  let createdUrl = `http://192.168.11.4/?ssid=${ssid}&pass=${password}`;
  fetch(createdUrl);

  let customUrl = `http://esp8266.local/?ssid=${ssid}&pass=${password}`;
  fetch(customUrl);
}

setInterval(function () {
  httpGetJson(url);
}, 2500);