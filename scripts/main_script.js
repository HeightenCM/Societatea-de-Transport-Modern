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
changetheme.addEventListener('click', () => {
    if(changetheme.classList.contains('btn-light')){
        changetheme.classList.remove('btn-light');
        changetheme.classList.add('btn-dark');
    } else{
        changetheme.classList.add('btn-light');
        changetheme.classList.remove('btn-dark');
    }
    changeColorMode();
});

//list of destinations, might add more idk
let destinationList = [
    {"name":"ASE","latitude":"44.447437","longitude":"26.097938"},
    {"name":"Unibuc","longitude":"44.447437","latitude":"26.097938"},
    {"name":"Piata Victoriei","longitude":"44.447437","latitude":"26.097938"},
    {"name":"Obor","longitude":"44.447437","latitude":"26.097938"},
    {"name":"Idk","longitude":"44.447437","latitude":"26.097938"}
];

function populateDestinationSelector(){
    const destSelector = document.getElementById('destinationSelector');
    destinationList.forEach(destination=>{
        const newOption = document.createElement('option');
        newOption.value = destination.name;
        newOption.textContent = destination.name;
        destSelector.appendChild(newOption);
    })
}

populateDestinationSelector();

const destinationForm = document.getElementById('destinationForm');

destinationForm.addEventListener('submit', (event)=>{
    //I don't want the page to refresh smh
    event.preventDefault();
    const selectedDest = document.getElementById('destinationSelector').value;
    const destination = destinationList.find(dest => dest.name===selectedDest);

    const containerDest = document.getElementById('containerthingie');

    if(destination){ //Might not need this check but just to be sure
        containerDest.remove();
        initializeMap(destination.name,destination.latitude, destination.longitude);
    } else{
        alert("Didn't select a destination!");
    }
});

//Initializing the map based on given coordinates
function initializeMap(destinationName, latitude, longitude) {
    const mapDiv = document.getElementById("map");
    mapDiv.style.display = "block"; // And magically the map appears

    const map = L.map('map').setView([latitude, longitude], 13); // Centers map on destination (for now)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map)
        .bindPopup(destinationName)
        .openPopup();
}