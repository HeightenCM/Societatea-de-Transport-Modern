let map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let canvasAnim = document.getElementById('canvasAnimation');
animContext = canvasAnim.getContext('2d');
let bus1 = new Image();
bus1.src='assets/images/bus1.gif';
bus1.onload = function() {
    animContext.drawImage(bus1, 50, 50, 124, 33);
};