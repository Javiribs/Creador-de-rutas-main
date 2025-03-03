/* eslint-disable no-undef */
// createRoute.test.js

import { createRoute } from './funcionesParaTest.js';
import mockData from '../../api/paradas.data.json';

describe('comprobar funcionamiento de createRoute function', () => {
    it('crea una ruta con las paradas seleccionadas', () => {
        const selectedStops = [mockData[0], mockData[2]]; 
        const route = createRoute(selectedStops);

        expect(route).toEqual(selectedStops);
    });

    it('devuelve array vacio al no seleccionar paradas', () => {
        const route = createRoute([]);

        expect(route).toEqual([]);
    });
});