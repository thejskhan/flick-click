let lightStateOn = true;
let motionDetectOn = true;

const ledOnUrl = "http://192.168.1.200/data?data=on";
const ledOffUrl = "http://192.168.1.200/data?data=off";
const url = "http://192.168.1.200/data?data=temp";

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
    });
}

function lightToggle() {
  changeSwitchStyle(".inner-shape-big");
  $(".flex-container-1").css({
    "background-image": "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
  });
  if (lightStateOn) {
    fetch(ledOnUrl);
  } else {
    $(".flex-container-1").css({
      "background-image": "linear-gradient(to top, #30cfd0 0%, #330867 100%)",
    });
    fetch(ledOffUrl);
  }
}

function motionDetectToggle() {
  changeSwitchStyle(".inner-shape-small");
}

function updateCondition(jsonfile) {
  let temp = "" + jsonfile.temprature + "°";
  let humidity = "" + jsonfile.humidity + "%";
  $(".temprature-content").html(temp);
  $(".humidity-content").html(humidity);
}

$(document).ready(function () {
  fetch(ledOnUrl);
});

setInterval(function () {
  httpGetJson(url);
}, 7000);
