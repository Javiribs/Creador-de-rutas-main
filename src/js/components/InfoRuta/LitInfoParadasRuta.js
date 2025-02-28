import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import { obtenerRuta } from '../../ruta.js';
//añadir los CSS
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
import AppCSS from '../../../css/app.css' with { type: 'css' }
import InfoParadasRutaCSS from './InfoParadasRuta.css' with { type: 'css' }

export class LitInfoParadasRuta extends LitElement {
    static styles = [ResetCSS, AppCSS, InfoParadasRutaCSS];
    static properties = {
        listaRutaPersonalizada: { type: Array }
    }

    constructor() {
        super();
        this.listaRutaPersonalizada = [

        ];
    }

    connectedCallback() {
        super.connectedCallback();
        this._getRutaInfo();
    }
    
    render() {
        if (!this.listaRutaPersonalizada || this.listaRutaPersonalizada.length === 0) {
            return html`<p>Cargando...</p>`; // O un mensaje de "No hay datos"
        }
    
        const ruta = this.listaRutaPersonalizada[0];
    
        if (!ruta || !ruta.paradasRuta) {
            return html`<p>Datos de ruta incompletos.</p>`; // O un mensaje de error
        }
    
        const paradas = ruta.paradasRuta;
    
        return html`
            <ul id="info-paradas-ruta">
                ${paradas.map(parada => html`
                    <li class="info-parada">
                        <article>
                            <figure>
                                <img src="${parada.parada.imagen}">
                            </figure>
                            <section>
                                <h2>${parada.parada.nombre_parada}</h2>
                                <p>${parada.parada.categoria}</p>
                                <button class="boton-mas-info" @click="${() => this._masInfoParada(parada.parada._id)}">+ Info</button>
                            </section>
                        </article>
                    </li>
                `)}
            </ul>
        `;
    }

    //------------Private Methods------------------//
    //obtener las paradas de la ruta a partir del id.
    async _getRutaInfo() {
        this.listaRutaPersonalizada = await obtenerRuta();
    }

    _masInfoParada(paradaId) {
        window.location.href = `info-parada.html?id=${paradaId}`;
    }
}

customElements.define('info-paradas-ruta', LitInfoParadasRuta);