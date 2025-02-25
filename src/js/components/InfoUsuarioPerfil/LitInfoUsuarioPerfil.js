import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import { obtenerInfoUsuario } from '../../perfil.js';

import ResetCSS from '../../../css/reset.css' with { type: 'css' }
import AppCSS from '../../../css/app.css' with { type: 'css' }
import InfoUsuarioPerfilCSS from './InfoUsuarioPerfil.css' with { type: 'css' }

export class LitInfoUsuarioPerfil extends LitElement {
    static styles = [ResetCSS, AppCSS, InfoUsuarioPerfilCSS];
    static properties = {
        infoUsuario: { type: Object }
    }

    constructor() {
        super();
        this.infoUsuario = {};
    }

    connectedCallback() {
        super.connectedCallback();
        this._getUsuarioData();
    }

    render() {
        return html`
            <section id="info-usuario">
                <h2>${this.infoUsuario.name}</h2>
                <h3>${this.infoUsuario.country}</h3>
            </section>          
        `;
    }

     //------------Private Methods------------------//

        //obtengo info del usuario por su id
      async _getUsuarioData() {
             this.infoUsuario = await obtenerInfoUsuario();
         }
}

customElements.define('info-usuario', LitInfoUsuarioPerfil);