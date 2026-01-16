//Martín Portela Seguí

// Crear mapa vacío centrado globalmente
const map = L.map("map").setView([0, 0], 2);
let puntos = JSON.parse(localStorage.getItem("localizaciones") || "[]");
let marcadores = [];
const canvas = document.getElementById("lienzo");
const ctx = canvas.getContext("2d");
const lat = document.getElementById("lat");
const lng = document.getElementById("lng")
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

//Función para el canvas
function dibujarCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    //Apartado que borrará todo lo dibujado
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (puntos.length === 0) return;

    //Tamaño del margen entre marcadores
    const margen = 20;
    ctx.font = "15px Comic Sans";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    puntos.forEach((punto, i) => {
      //Fórmula para crear el espacio entre los marcadores
      const espacio = 30 + i * margen;
      ctx.fillStyle = "#F0";
      //Lleno el canvas con el texto con la información pedida
      ctx.fillText(
        `Marcador ${i + 1}: ${punto.lat.toFixed(3)}, ${punto.lng.toFixed(3)}`,
        0, 
        espacio 
      );
    });
  }

//Función de guardar datos, donde seteo las cookies, actualizo el mapa y dibujo el canvas
function guardarDatos() {
    localStorage.setItem("localizaciones", JSON.stringify(puntos));
    actualizarMapa();
    dibujarCanvas();
  }

//Función para actualizar el mapa
function actualizarMapa() 
{
    //Primero remuevo los marcadores
    marcadores.forEach((m) => map.removeLayer(m));
    marcadores = [];

    //Ahora los vuelvo a poner utilizando el array de puntos y los añado en el mapa, también añado a marcadores
    puntos.forEach((punto, i) => {
      const marker = L.marker([punto.lat, punto.lng]).
      addTo(map).
      bindPopup(`Marcador ${i + 1}`);
      marcadores.push(marker);
    });
  }

//Función para rellenar el contenido de lat y lng con las coordenadas
function escribirCoordenadas(e) 
{
  lat.innerText=e.latlng.lat.toFixed(3);
  lng.innerText=e.latlng.lng.toFixed(3);
}

//Función para que se active poner el marcador cuando se hace click en el mapa
function onMapClick(e) 
{
    puntos.push({
      lat: e.latlng.lat,
      lng: e.latlng.lng,
    });
    guardarDatos();
}

//Evento de clicar el mapa
map.on('click', onMapClick);
//Evento de pasar el mouse por el mapa
map.on('mousemove', escribirCoordenadas);
//Estas dos funciones se harán cada vez que se reinicie la página
actualizarMapa();
dibujarCanvas();