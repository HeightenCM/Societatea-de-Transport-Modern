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
    {"name":"Piata Romana","latitude":"44.445355","longitude":"26.097703"},
    {"name":"Piata Universitati","latitude":"44.435553","longitude":"26.102475"},
    {"name":"Piata Victoriei 1","latitude":"44.451953","longitude":"26.087076"},
    {"name":"Piata Victoriei 2","latitude":"44.452623","longitude":"26.086433"},
    {"name":"Obor","latitude":"44.449437","longitude":"26.124598"},
    {"name":"Stefan Cel Mare","latitude":"44.452929","longitude":"26.104696"},
    {"name":"Piata Unirii 1","latitude":"44.427543","longitude":"26.10192"},
    {"name":"Piata Unirii 2","latitude":"44.427758","longitude":"26.10409"},
    {"name":"Aviatilor","latitude":"44.466033","longitude":"26.086649"},
    {"name":"Aurel Vlaicu","latitude":"44.479156","longitude":"26.100233"},
    {"name":"Pipera","latitude":"44.48062","longitude":"26.116637"},
    {"name":"Dristor 1","latitude":"44.419368","longitude":"26.140471"},
    {"name":"Dristor 2","latitude":"44.420477","longitude":"26.139417"},
    {"name":"Piata Muncii","latitude":"44.431828","longitude":"26.138674"},
    {"name":"Piata Iancului","latitude":"44.441695","longitude":"26.132323"},
    {"name":"Gara De Nord 1","latitude":"44.447235","longitude":"26.076562"},
    {"name":"Basarab 1","latitude":"44.450745","longitude":"26.068368"},
    {"name":"Crangasi","latitude":"44.451911","longitude":"26.047141"},
    {"name":"Petrache Poenaru","latitude":"44.445423","longitude":"26.046554"},
    {"name":"Eroilor","latitude":"44.435063","longitude":"26.075653"},
    {"name":"Izvor","latitude":"44.433064","longitude":"26.089584"},
    {"name":"timpuri Noi","latitude":"44.416963","longitude":"26.113346"},
    {"name":"Mihai","latitude":"44.41129","longitude":"26.125891"},
    {"name":"Grozavesti","latitude":"44.442739","longitude":"26.060359"},
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
        initializeCanvas();
    } else{
        alert("Didn't select a destination!"); //Might never trigger.. oh well..
    }
});

//Initializing the map based on given coordinates
function initializeMap(destinationName, latitude, longitude) {
    const mapDiv = document.getElementById("map");
    mapDiv.style.display = "block"; // And magically the map appears

    const map = L.map('map').setView([latitude, longitude], 15); // Centers map on destination (for now)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map)
        .bindPopup("<h3>"+destinationName+"</h3>\nDestination");
    
    map.locate();
    map.on('locationfound', (e)=>{
        var radius = e.accuracy;
    
        L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();
    
        L.circle(e.latlng, radius).addTo(map);
    });
}

//Adding a canvas for animations and stuff
function initializeCanvas(){
    const canvas = document.getElementById('canvas');
    canvas.style.display = "block";
    const ctx = canvas.getContext('2d');
}