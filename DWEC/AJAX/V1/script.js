// script.js (Versión ajustada)
const urlAPI =
  "http://csrocopin.atwebpages.com/chinook/api_chinook.php?action=rocktracks";
const container = document.getElementById("tracks-container");

// Función para construir y mostrar la tabla
function displayTracks(tracks) {
  // Tomar solo las primeras 10 pistas
  const topTen = tracks.slice(0, 10);

  // 1. Crear la tabla y el encabezado con las nuevas columnas
  let html = "<table>";
  html +=
    "<thead><tr><th>#</th><th>Pista</th><th>Artista</th><th>Álbum</th><th>Precio</th></tr></thead>";
  html += "<tbody>";

  // 2. Iterar sobre las pistas para crear las filas, usando los nuevos nombres de propiedades
  topTen.forEach((track, index) => {
    // Aseguramos que el precio se muestre con dos decimales, si es posible
    const price = parseFloat(track.UnitPrice).toFixed(2);

    html += "<tr>";
    html += `<td>${index + 1}</td>`;
    html += `<td>${track.TrackName}</td>`; // <- Propiedad ajustada
    html += `<td>${track.ArtistName}</td>`; // <- Propiedad ajustada
    html += `<td>${track.AlbumTitle}</td>`;
    html += `<td>$${price}</td>`; // <- Propiedad ajustada
    html += "</tr>";
  });

  // 3. Cerrar la tabla
  html += "</tbody></table>";

  // 4. Insertar el HTML generado en el contenedor
  container.innerHTML = html;
}

// Ejecutar la petición Fetch
fetch(urlAPI)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  })
  .then((data) => {
    if (data && data.length > 0) {
      // Verificamos que los datos no son null/undefined y tienen elementos
      // Llamar a la función para mostrar los datos
      console.log(data);
      displayTracks(data);
    } else {
      container.innerHTML = "<p>No se encontraron pistas de rock.</p>";
    }
  })
  .catch((error) => {
    console.error("Hubo un problema con la petición Fetch:", error);
    // Mostrar el error al usuario
    container.innerHTML = `<p style="color: red;">❌ Error al cargar los datos: ${error.message}. Verifica tu conexión o el estado de la API.</p>`;
  });
