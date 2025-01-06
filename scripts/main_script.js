let map = L.map('map').setView([44.439663, 26.096306], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let canvasAnim = document.getElementById('canvasAnimation');
animContext = canvasAnim.getContext('2d');
let bus1 = new Image();
bus1.src='assets/images/bus1.gif';
bus1.onload = function() {
    animContext.drawImage(bus1, 0, canvasAnim.height-bus1.height);
};


// Adding theme changing capabilities
function changeColorMode(){
    let webpage = document.getElementById('webpage');
    if(webpage.getAttribute('data-bs-theme')==='dark'){
        webpage.setAttribute('data-bs-theme', 'light');
    } else{
        webpage.setAttribute('data-bs-theme', 'dark');
    }
}

let changetheme = document.getElementById('changethemebtn');
changetheme.addEventListener('click', function(){
    if(changetheme.classList.contains('btn-light')){
        changetheme.classList.remove('btn-light');
        changetheme.classList.add('btn-dark');
    } else{
        changetheme.classList.add('btn-light');
        changetheme.classList.remove('btn-dark');
    }
    changeColorMode();
});