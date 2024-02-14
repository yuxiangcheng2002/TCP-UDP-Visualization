// Initialize WebSocket connection
const socket = new WebSocket("ws://localhost:1880/testpage");
socket.addEventListener("open", handleSocketOpen);
socket.addEventListener("close", handleSocketClose);
socket.addEventListener("message", handleSocketMessage);

let lastHue = 0; 
const hueIncrement = 5; 
let lightness = 50; 
let messageActivityTimeout;

function startBlinking() {
    lightness = lightness === 50 ? 75 : 50;
    updateBackgroundColor();
}

function updateBackgroundColor() {
    const color = `hsl(${lastHue}, 100%, ${lightness}%)`;
    document.body.style.backgroundColor = color;
}

function handleSocketOpen() {
    document.body.style.backgroundColor = "green";
    console.log("Socket connection opened.");
}

function handleSocketClose() {
    document.body.style.backgroundColor = "red";
    console.log("Socket connection closed.");
    if (messageActivityTimeout) clearTimeout(messageActivityTimeout);
}

// Handle WebSocket message event
function handleSocketMessage(event) {
    document.getElementById("socket_data").innerHTML = event.data;

    if (messageActivityTimeout) clearTimeout(messageActivityTimeout);
    messageActivityTimeout = setTimeout(() => {
        startBlinking(); 
    }, 1000);

    lastHue = (lastHue + hueIncrement) % 360;
    updateBackgroundColor();

    startBlinking();
}

function startColorChange() {
    setInterval(() => {
        lastHue = (lastHue + hueIncrement) % 360; 
        updateBackgroundColor();
    }, 10000); 
}

handleSocketOpen();
startColorChange();
