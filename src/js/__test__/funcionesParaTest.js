import ciudades from '../../api/get.ciudades.json';

/**
 * Funcion que simula la verificación si el input del usuario coincide con el nombre de alguna ciudad.
 *
 * @param {string} userInput - El input del usuario.
 * @returns {Array} - Un array con las ciudades que coinciden con el input del usuario.
 */
export function searchCity(userInput) {
    if (!userInput) {
        return []; 
    }

    const userInputLowerCase = userInput.toLowerCase();
    return ciudades.filter(ciudad => ciudad.name.toLowerCase().includes(userInputLowerCase));
}


/**
 * Función que simula la selección de paradas de interés.
 *
 * @param {Array} selectedStops - Array de paradas seleccionadas.
 * @param {Object} stop - Parada a seleccionar.
 */
export function selectStops(selectedStops, stop) {
    if (!selectedStops.includes(stop)) {
        selectedStops.push(stop);
    }
}


/**
 * Función que simula la creación de una ruta personalizada.
 *
 * @param {Array} selectedStops - Array de paradas seleccionadas.
 * @returns {Array} - Ruta creada.
 */
export function createRoute(selectedStops) {
    return selectedStops;
}