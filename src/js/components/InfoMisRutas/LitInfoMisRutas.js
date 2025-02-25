import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import { obtenerRutasUsuario, eliminarRuta } from '../../perfil.js';
//añadir los CSS
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
import AppCSS from '../../../css/app.css' with { type: 'css' }
import InfoMisRutasCSS from './InfoMisRutas.css' with { type: 'css' }

export class LitInfoMisRutas extends LitElement {
    static styles = [ResetCSS, AppCSS, InfoMisRutasCSS];
    static properties = {
        listaRutasPersonalizadas: { type: Array }
    }

    constructor() {
        super();
        this.listaRutasPersonalizadas = [

        ];
    }

    connectedCallback() {
        super.connectedCallback();
        this._getRutasPersonalizadas();
    }

    //metodo para escribir la vista del html
    render() {
        return html`
            <section id="info-mis-rutas">
                <h3 id="titulo-mis-rutas">Mis rutas</h3>
                <ul id="mis-rutas" class="mis-rutas">
                    ${this.listaRutasPersonalizadas.map(ruta => html`
                        <li class="ruta-personalizada">
                            <h3>${ruta.nombre}</h3>
                            <h4>${ruta.ciudad.name}</h4>
                            <p>Fecha de creación: ${new Date(ruta.fechaCreacion).toLocaleDateString()}</p>
                            <button class="boton-editar" @click="${() => this._editarRuta(ruta._id)}">Editar</button>
                            <button class="boton-eliminar" @click="${() => this._eliminarRuta(ruta._id)}">Eliminar</button>
                        </li>
                    `)}
                </ul>
            </section>          
        `;
    }

    //------------Private Methods------------------//
    //obtener las rutas personalizadas por id del usuario.
    async _getRutasPersonalizadas() {
        this.listaRutasPersonalizadas = await obtenerRutasUsuario();
    }

    _editarRuta(rutaId) {
        window.location.href = `ruta.html?id=${rutaId}`;
    }

    async _eliminarRuta(rutaId) {
        const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta ruta?');
        if (confirmacion) {
            try {
                await eliminarRuta(rutaId);
                // Actualizar la lista de rutas después de eliminar una ruta
                this.listaRutasPersonalizadas = this.listaRutasPersonalizadas.filter(ruta => ruta._id !== rutaId);
            } catch (error) {
                console.error('Error al eliminar ruta:', error);
                alert('Error al eliminar la ruta. Por favor, inténtalo de nuevo más tarde.');
            }
        }
    }
}

customElements.define('info-mis-rutas', LitInfoMisRutas);