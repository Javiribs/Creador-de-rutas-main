import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import { inicializarCreacionRuta } from '../../crear-ruta-personalizada.js';

//añadir los CSS
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
import AppCSS from '../../../css/app.css' with { type: 'css' }
import InfoListaParadasCSS from './InfoListaParadas.css' with { type: 'css' }

export class LitInfoListaParadas extends LitElement {
    static styles = [ResetCSS, AppCSS, InfoListaParadasCSS];
    static properties = {
        ciudadEncontradaInfo: { type: Array },
        paradasSeleccionadas: { type: Array }
    }

    constructor() {
        super();
        this.ciudadEncontradaInfo = [];
        this.paradasSeleccionadas = [];
        this.botonSeleccionarTodosTexto = 'Seleccionar Todos';
    }

    render() {
        if (!this.ciudadEncontradaInfo || this.ciudadEncontradaInfo.length === 0) {
            return html`<p>Busca una Ciudad</p>`;
        }

        const infoCiudad = this.ciudadEncontradaInfo[0];

        if (!infoCiudad || !infoCiudad.paradas) {
            return html`<p>Datos de ruta incompletos.</p>`;
        }

        const paradas = infoCiudad.paradas;

        return html`
            <ol id="paradas-interesantes">
                <button id="crearRuta" @click="${() => inicializarCreacionRuta(this.shadowRoot.querySelector('#crearRuta'), this.paradasSeleccionadas, infoCiudad)}">Crear ruta</button>
                <button class="alternar-seleccion" id="alternar-seleccion" @click="${this._alternarSeleccion}">${this.botonSeleccionarTodosTexto}</button>
                ${paradas.map(parada => html`
                    <li class="info-lista-paradas">
                        <article>
                            <figure>
                                <img src="${parada.imagen}">
                            </figure>
                            <section>
                                <h2>${parada.nombre_parada}</h2>
                                <p>${parada.descripcion}</p>
                                <h3>${parada.categoria}</h3>
                                <input type="checkbox" id="${parada._id}" class="parada-checkbox" @change="${(e) => this._toggleParada(e, parada)}">
                                <label for="${parada._id}">Añadir a la ruta</label>
                            </section>
                        </article>
                    </li>
                `)}
                <button id="crearRuta" @click="${() => inicializarCreacionRuta(this.shadowRoot.querySelector('#crearRuta'), this.paradasSeleccionadas, infoCiudad)}">Crear ruta</button>
            </ol>
        `;
    }

    _alternarSeleccion() {
        const checkboxesParadas = this.shadowRoot.querySelectorAll('.parada-checkbox');
        const todosSeleccionados = Array.from(checkboxesParadas).every(checkbox => checkbox.checked);

        if (todosSeleccionados) {
            checkboxesParadas.forEach(checkbox => checkbox.checked = false);
            this.paradasSeleccionadas = [];
            this.botonSeleccionarTodosTexto = 'Seleccionar Todos';
        } else {
            checkboxesParadas.forEach(checkbox => checkbox.checked = true);
            this.paradasSeleccionadas = this.ciudadEncontradaInfo[0].paradas;
            this.botonSeleccionarTodosTexto = 'Desmarcar Todos';
        }

        console.log(this.paradasSeleccionadas);
    }

    _toggleParada(e, parada) {
        if (e.target.checked) {
            if (!this.paradasSeleccionadas.includes(parada)) {
                this.paradasSeleccionadas.push(parada);
            }
        } else {
            this.paradasSeleccionadas = this.paradasSeleccionadas.filter(p => p._id !== parada._id);
        }
        console.log(this.paradasSeleccionadas);
    }
}

customElements.define('info-lista-paradas', LitInfoListaParadas);