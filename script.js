const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#submitButton");
const stopAlarmButton = document.querySelector("#stopButton");
const alarmContainer = document.querySelector("#alarms-container");
const alarmSound = document.querySelector("#alarmSound");
let intervalId;

window.addEventListener("DOMContentLoaded", (event) => {
    dropDownMenu(0, 12, setHours);
    dropDownMenu(0, 59, setMinutes);
    dropDownMenu(0, 59, setSeconds);

    setInterval(getCurrentTime, 1000);
    fetchAlarm();
});

setAlarmButton.addEventListener("click", getInput);
stopAlarmButton.addEventListener("click", stopAlarm);

function dropDownMenu(start, end, element) {
    for (let i = start; i <= end; i++) {
        const option = document.createElement("option");
        option.value = i < 10 ? "0" + i : i;
        option.text = i < 10 ? "0" + i : i;
        element.add(option);
    }
}

function getCurrentTime() {
    const time = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
    });
    currentTime.innerHTML = time;
    return time;
}

function getInput(e) {
    e.preventDefault();
    const hourValue = setHours.value;
    const minuteValue = setMinutes.value;
    const secondValue = setSeconds.value;
    const amPmValue = setAmPm.value;
    const alarmTime = convertToTime(hourValue, minuteValue, secondValue, amPmValue);
    setAlarm(alarmTime);
}

function convertToTime(hour, minute, second, amPm) {
    return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

function setAlarm(time, fetching = false) {
    const alarm = setInterval(() => {
        if (time === getCurrentTime()) {
            alarmSound.play();
            alert("Alarm Ringing");
            clearInterval(alarm);
        }
    }, 500);
    intervalId = alarm;
    addAlarmToDOM(time, intervalId);
    if (!fetching) {
        saveAlarm(time);
    }
}

function addAlarmToDOM(time, intervalId) {
    const alarm = document.createElement("div");
    alarm.classList.add("alarm", "mb", "d-flex");
    alarm.innerHTML = `
        <div class="time">${time}</div>
        <button class="btn delete-alarm" data-id="${intervalId}">Delete</button>
    `;
    const deleteButton = alarm.querySelector(".delete-alarm");
    deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));
    alarmContainer.prepend(alarm);
}

function checkAlarms() {
    const alarms = localStorage.getItem("alarms");
    return alarms ? JSON.parse(alarms) : [];
}

function saveAlarm(time) {
    const alarms = checkAlarms();
    alarms.push(time);
    localStorage.setItem("alarms", JSON.stringify(alarms));
}

function fetchAlarm() {
    const alarms = checkAlarms();
    alarms.forEach((time) => {
        setAlarm(time, true);
    });
}

function deleteAlarm(event, time, intervalId) {
    const self = event.target;
    const alarms = checkAlarms();
    const filteredAlarms = alarms.filter((alarm) => alarm !== time);
    localStorage.setItem("alarms", JSON.stringify(filteredAlarms));
    clearInterval(intervalId);
    self.parentNode.remove();
}

function stopAlarm() {
    alarmSound.pause();
    alarmSound.currentTime = 0;
}
