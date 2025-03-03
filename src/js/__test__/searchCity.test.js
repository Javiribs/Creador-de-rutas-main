/* eslint-disable no-undef */
// searchCity.test.js

import { searchCity } from './funcionesParaTest.js';

describe('comprobar la searchCity function', () => {
    it('devolver un array vacío si el input está vacío', () => {
        expect(searchCity('')).toEqual([]);
    });

    it('devolver array con la ciudad que coincida del input', () => {
        expect(searchCity('madrid')).toEqual([
            {
                "_id": "1",
                "country": "España",
                "name": "Madrid"
            }
        ]);
    });

    it('devolver array vacio si no hay similitud de ciudades', () => {
        expect(searchCity('ciudad inexistente')).toEqual([]);
    });
});