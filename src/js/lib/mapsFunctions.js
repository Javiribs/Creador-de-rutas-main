

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
            (/** @type {{ routes: { waypoint_order: any; }[]; }} */ response, /** @type {string} */ status) => {
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
    } catch (error) {
        console.error("Error al mostrar las paradas en el mapa:", error);
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