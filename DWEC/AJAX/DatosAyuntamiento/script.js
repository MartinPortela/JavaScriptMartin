// URLs
const API_ORIGINAL_URL =
  "https://datos.madrid.es/egob/catalogo/206974-0-agenda-eventos-culturales.json";
// Usamos el proxy que funcionó para la descarga (ej. corsproxy.io)
const EVENTOS_URL =
  "https://corsproxy.io/?" + encodeURIComponent(API_ORIGINAL_URL);

const selectElement = document.getElementById("distrito-select");
const resultadoElement = document.getElementById("resultado-conteo");

let distritosMap = {};

/**
 * Realiza la petición AJAX, procesa el JSON (con limpieza) y llena el desplegable.
 */
function cargarDistritos() {
  selectElement.innerHTML = '<option value="">Cargando distritos...</option>';

  fetch(EVENTOS_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      // 1. IMPORTANTE: Leer la respuesta como texto plano, NO como JSON
      return response.text();
    })
    .then((text) => {
      // 2. LIMPIEZA DE CARACTERES DE CONTROL INVÁLIDOS
      // Expresión regular para eliminar caracteres de control JSON inválidos
      // (ej. tabs, saltos de línea sin escapar, etc., excepto \t, \r, \n)
      const cleanedText = text.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

      // 3. Convertir el texto limpio a objeto JSON
      const data = JSON.parse(cleanedText);

      const eventos = data["@graph"] || [];

      if (eventos.length === 0) {
        selectElement.innerHTML =
          '<option value="">No se encontraron eventos o el JSON no tiene @graph.</option>';
        return;
      }

      // ... (El resto del código de procesamiento es el mismo y correcto) ...

      // 1. Procesamiento de Distritos
      eventos.forEach((evento) => {
        const districtObj = evento.address && evento.address.district;

        if (districtObj && districtObj["@id"]) {
          const districtUrl = districtObj["@id"];
          const urlLimpia = districtUrl.endsWith("/")
            ? districtUrl.slice(0, -1)
            : districtUrl;

          const nombreDistrito = urlLimpia.substring(
            urlLimpia.lastIndexOf("/") + 1
          );

          if (nombreDistrito.trim() !== "") {
            const distritoFinal = nombreDistrito.trim();
            if (!distritosMap[distritoFinal]) {
              distritosMap[distritoFinal] = [];
            }
            distritosMap[distritoFinal].push(evento);
          }
        }
      });

      // 2. Llenar el desplegable (Selector)
      const nombresDistritos = Object.keys(distritosMap).sort();

      selectElement.innerHTML =
        '<option value="">--- Selecciona un Distrito ---</option>';

      nombresDistritos.forEach((distrito) => {
        const option = document.createElement("option");
        option.value = distrito;
        option.textContent = `${distrito} (${distritosMap[distrito].length} eventos)`;
        selectElement.appendChild(option);
      });

      // 3. Añadir el Event Listener
      selectElement.addEventListener("change", mostrarConteoDistrito);
    })
    .catch((error) => {
      console.error("Hubo un problema al cargar/procesar los eventos:", error);
      // Mensaje de error para el usuario si el proceso falla
      selectElement.innerHTML = `<option value="">Error fatal. Revisa la consola.</option>`;
    });
}

// (La función mostrarConteoDistrito y el listener DOMContentLoaded se mantienen iguales)
function mostrarConteoDistrito() {
  const selectedDistrito = selectElement.value;

  if (selectedDistrito && distritosMap[selectedDistrito]) {
    const conteo = distritosMap[selectedDistrito].length;
    resultadoElement.innerHTML = `
            <h2>${selectedDistrito}</h2>
            <p>Se encontraron **${conteo}** eventos en este distrito.</p>
        `;
  } else {
    resultadoElement.innerHTML = `<p>Selecciona un distrito para ver cuántos eventos tiene.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", cargarDistritos);
