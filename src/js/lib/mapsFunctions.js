

/**
 * @typedef {object} DirectionsRoute
 * @property {any[]} waypoint_order
 */

/**
 * @typedef {object} DirectionsResponse
 * @property {object[]} routes
 * @property {DirectionsRoute[]} routes
 */

/**
 * @param {any[]} paradasCompletas
 */
export async function initMap(paradasCompletas) {
    console.log('initMap', paradasCompletas);
    try {
        if (!paradasCompletas || paradasCompletas.length === 0) {
            console.error("No hay paradas para mostrar.");
            return;
        }

        const primerPunto = paradasCompletas[0];
        console.log('primerPunto', primerPunto);
        const latInicial = primerPunto.parada.coordenadas[0];
        const lngInicial = primerPunto.parada.coordenadas[1];

        // @ts-ignore
        // eslint-disable-next-line no-undef
        const map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: latInicial, lng: lngInicial },
            zoom: 13,
        });
  
        // @ts-ignore
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService();
  
        // @ts-ignore
        // eslint-disable-next-line no-undef
        const directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
        });
  
        const waypoints = paradasCompletas.slice(1, -1).map(parada => ({
            location: { lat: parada.parada.coordenadas[0], lng: parada.parada.coordenadas[1] },
            stopover: true,
        }));
  
        directionsService.route(
            {
                origin: { lat: paradasCompletas[0].parada.coordenadas[0], lng: paradasCompletas[0].parada.coordenadas[1] },
                destination: { lat: paradasCompletas[paradasCompletas.length - 1].parada.coordenadas[0], lng: paradasCompletas[paradasCompletas.length - 1].parada.coordenadas[1] },
                waypoints: waypoints,
                optimizeWaypoints: true,
                // @ts-ignore
                // eslint-disable-next-line no-undef
                travelMode: google.maps.TravelMode.WALKING,
            },
            (/** @type {DirectionsResponse} */ response, /** @type {string} */ status) => {
                if (status === "OK") {
                    directionsRenderer.setDirections(response);
                    const optimizedWaypoints = response.routes[0].waypoint_order;
                    console.log("Orden optimizado de los waypoints:", optimizedWaypoints);
  
                    const url = generarEnlaceGoogleMaps(paradasCompletas, "walking");
                      if (url) {
                          // Almacena la URL en el atributo data-url del botón
                          const botonGoogleMaps = document.getElementById("boton-google-maps");
                          // @ts-ignore
                          botonGoogleMaps.dataset.url = url;
  
                          // Llama a abrirGoogleMaps con la URL directamente
                          abrirGoogleMaps(url);
                      } else {
                          console.error("Error: generarEnlaceGoogleMaps() devolvió null.");
                      }
                  } else {
                      console.error("Error al calcular la ruta:", status);
                  }
              }
          );
          const botonGeolocalizacion = document.getElementById("boton-geolocalizacion");
            botonGeolocalizacion?.addEventListener("click", () => {
            obtenerGeolocalizacion(map); // Pasa el objeto map a la función
            });

    } catch (error) {
        console.error("Error al mostrar las paradas en el mapa:", error);
    }
  }
  
/**
 * Attempts to obtain the user's current geolocation and place a marker on the map.
 * If the geolocation is successful, it adds a marker at the user's location.
 * If the geolocation fails or is not supported, it logs an error to the console.
 *
 * @param {google.maps.Map} map - The Google Map object where the user's location will be marked.
 */

  export function obtenerGeolocalizacion(map) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Añade un marcador en la ubicación del usuario
                // eslint-disable-next-line no-undef
                new google.maps.Marker({
                    position: pos,
                    map: map,
                    title: "Tu ubicación",
                });
            },
            () => {
                console.error("Error: El servicio de geolocalización falló.");
            }
        );
    } else {
        console.error("Error: Tu navegador no soporta geolocalización.");
    }
}


  /**
   * @param {any[]} paradasCompletas
   * @param {string} travelMode
   */
  function generarEnlaceGoogleMaps(paradasCompletas, travelMode) {
    if (!paradasCompletas || paradasCompletas.length < 2) {
        return null;
    }
  
    const origin = `${paradasCompletas[0].parada.coordenadas[0]},${paradasCompletas[0].parada.coordenadas[1]}`;
    const destination = `${paradasCompletas[paradasCompletas.length - 1].parada.coordenadas[0]},${paradasCompletas[paradasCompletas.length - 1].parada.coordenadas[1]}`;
  
    let waypoints = "";
    if (paradasCompletas.length > 2) {
        waypoints = paradasCompletas
            .slice(1, -1)
            .map(parada => `${parada.parada.coordenadas[0]},${parada.parada.coordenadas[1]}`)
            .join("|");
    }
  
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=${encodeURIComponent(waypoints)}&travelmode=${travelMode}`;
    return url;
  }
  
  /**
   * @param {string | URL | undefined} url
   */
 export function abrirGoogleMaps(url) {
    if (url) {
        window.open(url, "_blank");
    } else {
        console.error("La URL de Google Maps no está definida.");
    }
  }