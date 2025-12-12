// script.js - REVISADO Y OPTIMIZADO
const urlBaseAPI = "http://csrocopin.atwebpages.com/chinook/api_chinook.php";
const selector = document.getElementById("artista-selector");
const container = document.getElementById("tracks-container");

// --- Funciones de Utilidad ---

function mostrarTabla(tracks) {
  let html = "<table>";
  html +=
    "<thead><tr><th>Pista</th><th>Artista</th><th>Álbum</th><th>Precio</th></tr></thead>";
  html += "<tbody>";

  if (!Array.isArray(tracks) || tracks.length === 0) {
    container.innerHTML =
      "<p>No se encontraron pistas para el artista seleccionado.</p>";
    return;
  }

  tracks.forEach((track) => {
    const price = parseFloat(track.UnitPrice).toFixed(2);
    html += "<tr>";
    html += `<td>${track.TrackName}</td>`;
    html += `<td>${track.ArtistName}</td>`;
    html += `<td>${track.AlbumTitle}</td>`;
    html += `<td>$${price}</td>`;
    html += "</tr>";
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

// --- Peticiones AJAX ---

/**
 * Petición AJAX 1: Carga los artistas y llena el desplegable.
 */
async function cargarArtistas() {
  console.log("-> 1. Iniciando AJAX: Carga de artistas.");
  try {
    const url = `${urlBaseAPI}?action=artists`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: No se pudo cargar la lista de artistas.`
      );
    }

    let data = await response.json();

    // NORMALIZACIÓN: Intentar obtener el array de 'data' si existe, si no, usar el objeto completo.
    const artistas = data.data || data;

    console.log("-> 2. Artistas recibidos (normalizados):", artistas);

    // 🚨 VERIFICACIÓN FINAL: ¿Tenemos un array para iterar?
    if (!Array.isArray(artistas)) {
      throw new Error(
        "Respuesta de la API con formato inesperado (no es un array)."
      );
    }

    // 3. Llenar el desplegable
    selector.innerHTML = "";
    let htmlOptions = '<option value="todos">Todas las Pistas de Rock</option>';

    artistas.forEach((artist) => {
      // Verifica que 'ArtistId' y 'Name' coincidan con la DB
      htmlOptions += `<option value="${artist.ArtistId}">${artist.Name}</option>`;
    });

    selector.innerHTML = htmlOptions;
    selector.disabled = false;
  } catch (error) {
    console.error("❌ Error al cargar artistas:", error);
    selector.innerHTML = `<option disabled>Error de carga: ${error.message}</option>`;
    selector.disabled = true;
    // Lanzamos el error para detener el encadenamiento .then() si falla la carga inicial
    throw error;
  }
}

/**
 * Petición AJAX 2 & 3: Carga la lista de pistas (completa o filtrada).
 */
async function cargarPistas(artistId = null) {
  try {
    container.innerHTML = '<p class="loading">Cargando pistas...</p>';

    let url;
    if (artistId === null || artistId === "todos") {
      url = `${urlBaseAPI}?action=rocktracks`;
    } else {
      url = `${urlBaseAPI}?action=tracksbyartist&artist_id=${artistId}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: No se pudo cargar la lista de pistas.`
      );
    }

    let data = await response.json();

    // NORMALIZACIÓN: Mismo ajuste, toma el array del campo 'data' o el objeto completo
    const tracks = data.data || data;

    mostrarTabla(tracks);
  } catch (error) {
    console.error("❌ Error al cargar pistas:", error);
    container.innerHTML = `<p class="error">❌ Error al cargar las pistas: ${error.message}</p>`;
  }
}

// --- Lógica del Evento ---

selector.addEventListener("change", (event) => {
  const artistId = event.target.value;
  cargarPistas(artistId); // Llama a la función AJAX de filtrado
});

// --- Inicialización ---

document.addEventListener("DOMContentLoaded", () => {
  // 1. Cargar el desplegable de artistas
  cargarArtistas()
    .then(() => {
      // 2. Cargar la lista inicial de todas las pistas de rock, solo si los artistas se cargaron bien
      console.log(
        "-> 3. Artistas cargados con éxito. Cargando pistas iniciales."
      );
      cargarPistas("todos");
    })
    .catch(() => {
      console.log(
        "-> 3. Deteniendo la carga de pistas debido a un error previo."
      );
    });
});
