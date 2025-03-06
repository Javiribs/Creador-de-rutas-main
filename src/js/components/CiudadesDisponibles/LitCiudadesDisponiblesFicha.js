import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import { obtenerCiudades, obtenerCiudadPorNombre, addTitle } from '../../creador.rutas.js';

//añadir los CSS
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
import AppCSS from '../../../css/app.css' with { type: 'css' }
import LitCiudadesDisponiblesFichaCSS from './CiudadesDisponiblesFicha.css' with { type: 'css' }

export class LitCiudadesDisponiblesFicha extends LitElement {
    static styles = [ResetCSS, AppCSS, LitCiudadesDisponiblesFichaCSS];
    static properties = {
        listaCiudades: { type: Array },
        listaVisible: { type: Boolean }
    }

    constructor() {
        super();
        this.listaCiudades = [];
        this.listaVisible = true;
    }

    connectedCallback() {
        super.connectedCallback();
        this._getCiudades();
    }

    render() {
        return html`
            <div class="ciudades-disponibles-ficha">
                ${this.listaVisible ? html`
                    <ul>
                        ${this.listaCiudades.map(ciudad => html`
                            <li @click="${() => this._buscarCiudad(ciudad.name)}">${ciudad.name}, ${ciudad.country}</li>
                        `)}
                    </ul>
                ` : ''}
            </div>
        `;
    }


 //------------Private Methods------------------//

 //obtener listado completo de ciudades
 async _getCiudades() {
    this.listaCiudades = await obtenerCiudades();
 }


  //buscar ciudad y pintar paradas
  async _buscarCiudad(nombreCiudad) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = nombreCiudad; 
    }
    try {
        const ciudadEncontrada = await obtenerCiudadPorNombre(nombreCiudad); 
        if (!ciudadEncontrada) {
            console.error("Ciudad no encontrada");
            alert("Ciudad no encontrada");
            return;
        }
        const componenteParadas = document.querySelector('info-lista-paradas');
        if (componenteParadas) {
            componenteParadas.setAttribute('ciudadEncontradaInfo', JSON.stringify([ciudadEncontrada]));
        }
        addTitle(ciudadEncontrada);
        this.listaVisible = false;
    } catch (error) {
        console.error("Error en la búsqueda de ciudades:", error);
        alert("Ocurrió un error durante la búsqueda. Inténtalo de nuevo más tarde.");
    }
 }

}

customElements.define('ciudades-disponibles-ficha', LitCiudadesDisponiblesFicha);