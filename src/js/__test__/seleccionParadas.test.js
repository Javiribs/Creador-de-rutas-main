/* eslint-disable no-undef */
// seleccionParadas.test.js

import { selectStops } from './funcionesParaTest.js';

// Simulacion del json con la propiedad paradas
const mockData = [
    {
        "id": "1",
        "nombre_parada": "Parada 1",
        "imagen": "parada1.jpg",
        "info": "Información de la parada 1",
        "enlace": "https://parada1.com",
        "categoria": "Categoría 1"
    },
    {
        "id": "2",
        "nombre_parada": "Parada 2",
        "imagen": "parada2.jpg",
        "info": "Información de la parada 2",
        "enlace": "https://parada2.com",
        "categoria": "Categoría 2"
    }
];

describe('comprobar la selectStops function', () => {
    it('debería guardar la parada seleccionada', () => {
        const selectedStops = [];
        const selectedStop = mockData[1]; // Selecciona la segunda parada

        selectStops(selectedStops, selectedStop);

        expect(selectedStops).toEqual([selectedStop]);
    });

    it('debería no duplicar paradas', () => {
        const selectedStops = [];
        const selectedStop = mockData[1]; // Selecciona la segunda parada

        selectStops(selectedStops, selectedStop);
        selectStops(selectedStops, selectedStop);

        expect(selectedStops).toEqual([selectedStop]);
    });
});