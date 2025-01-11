// Adding themes and button to change
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

//list of destinations, might add more idk (edit: ali added more, thanks for the free labour)
let destinationList = [
    {"name":"Piata Romana","latitude":"44.445355","longitude":"26.097703"},
    {"name":"Universitate","latitude":"44.435553","longitude":"26.102475"},
    {"name":"Piata Victoriei 1","latitude":"44.451953","longitude":"26.087076"},
    {"name":"Piata Victoriei 2","latitude":"44.452623","longitude":"26.086433"},
    {"name":"Obor","latitude":"44.449437","longitude":"26.124598"},
    {"name":"Stefan Cel Mare","latitude":"44.452929","longitude":"26.104696"},
    {"name":"Piata Unirii 1","latitude":"44.427543","longitude":"26.10192"},
    {"name":"Piata Unirii 2","latitude":"44.427758","longitude":"26.10409"},
    {"name":"Aviatorilor","latitude":"44.466033","longitude":"26.086649"},
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
    {"name":"Timpuri Noi","latitude":"44.416963","longitude":"26.113346"},
    {"name":"Mihai Bravu","latitude":"44.41129","longitude":"26.125891"},
    {"name":"Grozavesti","latitude":"44.442739","longitude":"26.060359"},
];
const metroMap = {
    "Piata Romana": ["Universitate", "Piata Victoriei 2"],
    "Universitate": ["Piata Romana", "Piata Unirii 2"],
    "Piata Unirii 2": ["Piata Romana","Piata Unirii 1"],
    "Piata Unirii 1": ["Izvor","Timpuri Noi","Piata Unirii 2"],
    "Izvor": ["Piata Unirii 1", "Eroilor"],
    "Eroilor": ["Izvor", "Grozavesti"],
    "Grozavesti": ["Eroilor", "Petrache Poenaru"],
    "Petrache Poenaru": ["Grozavesti", "Crangasi"],
    "Crangasi": ["Basarab 1", "Petrache Poenaru"],
    "Basarab 1": ["Crangasi", "Gara De Nord 1"],
    "Gara De Nord 1": ["Basarab 1", "Piata Victoriei 1"],
    "Piata Victoriei 1": ["Gara De Nord 1", "Stefan Cel Mare", "Piata Victoriei 2"],
    "Stefan Cel Mare": ["Piata Victoriei 1", "Obor"],
    "Obor": ["Stefan Cel Mare", "Piata Iancului"],
    "Piata Iancului": ["Obor", "Piata Muncii"],
    "Piata Muncii": ["Piata Iancului", "Dristor 2"],
    "Dristor 2": ["Piata Muncii", "Dristor 1"],
    "Dristor 1": ["Mihai Bravu", "Dristor 2"],
    "Mihai Bravu": ["Timpuri Noi", "Dristor 1"],
    "Timpuri Noi": ["Mihai Bravu", "Piata Unirii 1"],
    "Pipera": ["Aurel Vlaicu"],  
    "Aurel Vlaicu": ["Pipera", "Aviatorilor"],
    "Aviatorilor": ["Aurel Vlaicu", "Piata Victoriei 2"],
    "Piata Victoriei 2": ["Aviatorilor", "Piata Romana", "Piata Victoriei 1"],
};


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
        initializeCanvas();
        initializeMap(destination.name,destination.latitude, destination.longitude);
    } else{
        alert("Didn't select a destination!"); //Might never trigger.. oh well..
    }
});

// function to find the nearest station to the user's location (H: not used only with user location but whatever)
function findNearestStation(lat, lng) {
    let nearestStation = null;
    let shortestDistance = Infinity; //H: didn't know you can assign infinity in js, lol; is this === max int val?

    destinationList.forEach(station => {
        const distance = Math.sqrt(
            Math.pow(lat - parseFloat(station.latitude), 2) +
            Math.pow(lng - parseFloat(station.longitude), 2)
        );
        if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestStation = station;
        }
    });

    return nearestStation;
}

// baguette first search to find the path
function findShortestPath(start, end) {
    const queue = [[start]];
    const visited = new Set();

    while (queue.length > 0) {
        const path = queue.shift();
        const station = path[path.length - 1];

        if (station === end) return path;

        if (!visited.has(station)) {
            visited.add(station);

            metroMap[station].forEach(neighbor => {
                const newPath = [...path, neighbor];
                queue.push(newPath);
            });
        }
    }

    return null; // No path found -- technically not possible since the destination list is covered in its entirety, but u never know
}

function initializeMap(destinationName, latitude, longitude) {
    const mapDiv = document.createElement("div");
    mapDiv.id='map';
    document.body.appendChild(mapDiv);

    const map = L.map('map').setView([latitude, longitude], 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.locate(); //finding user
    map.on('locationfound', (e) => { //once loc found (if user is nice enough to give it :))
        const userLat = e.latlng.lat;
        const userLng = e.latlng.lng;
        L.marker(e.latlng).addTo(map)
        .bindPopup("<h3>" + e.latlng + "</h3>\nCurrent location"); // marker for current user location

        // computing the nearest station to the user and the nearest one to the destination (read comm below)
        const nearestUserStation = findNearestStation(userLat, userLng);
        const nearestDestStation = findNearestStation(latitude, longitude); //ali this is useless, all destinations are nodes

        if (nearestUserStation && nearestDestStation) {
            const path = findShortestPath(nearestUserStation.name, nearestDestStation.name);

            if (path) {
                const pathCoords = path.map(stationName => {
                    const station = destinationList.find(dest => dest.name === stationName);
                    return [station.latitude, station.longitude];
                });

                pathCoords.unshift([userLat, userLng]);
                // Draw the path on the map (H: I added the user location temporarily, so it's connected to the rest)
                const polyline = L.polyline(pathCoords, { color: 'blue' }).addTo(map);
                map.flyToBounds(polyline.getBounds());
                pathCoords.shift();

                // Add markers for each station on the path
                pathCoords.forEach(([lat, lng], index) => {
                    L.marker([lat, lng]).addTo(map)
                        .bindPopup(`<h3>${path[index]}</h3>`);
                });

                // marker for the destination
                L.marker([latitude, longitude]).addTo(map)
                .bindPopup("<h3>" + destinationName + "</h3>\nDestination");
            } else {
                alert("No path found between the stations!"); // Might not trigger considering current implementation
            }
        } else {
            alert("Could not find the nearest stations!"); // I still wonder if this ever triggers
        }
    });
}



//Adding a canvas for animations and stuff
function initializeCanvas(){
    const canvas = document.createElement('canvas');
    canvas.id="canvas";
    canvas.width=1000;
    canvas.height=80;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    ctx.font="30px Open Sans";
    ctx.fillStyle="yellow";
    drawDestinationList(ctx, 2);
}

function drawDestinationList(ctx, stationList){
    let canvasWidth = ctx.canvas.width;
    let canvasHeight = ctx.canvas.height;
    for(let i = canvasWidth; i>canvasWidth/2; i--){
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillText("Hello World!", i, canvasHeight/2);
    }
}