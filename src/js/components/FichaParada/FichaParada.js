// import { getParadasData, getInputValue, API_PORT } from '../../pagina-parada.js';
import { importTemplate } from '../../lib/importTemplate.js';
//añadir los CSS
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
import AppCSS from '../../../css/app.css' with { type: 'css' }
import FichaParadaCSS from './FichaParada.css' with { type: 'css' }

const TEMPLATE = {
    id: 'FichaParadaTemplate',
    url: './js/components/FichaParada/FichaParada.html'
  }
  // Wait for template to load
  await importTemplate(TEMPLATE.url).then(() => {
    console.log('Template importado correctamente');
  });

  /**
   * Info de una Parada
   * @class FichaParada
   * @class info Parada
   * @emits 'ficha-parada-info'
   */
  export class FichaParada extends HTMLElement {
    static observedAttributes = ['parada'];
    
    get parada() {
        return this.getAttribute('parada');
    }
    
    set parada(newValue) {
        this.setAttribute('parada', newValue);
    }
    
    get template(){
      return document.getElementById(TEMPLATE.id);
    }
  
      constructor() {
          super()
      }

// ======================= Lifecycle Methods ======================= //

    async connectedCallback() {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.adoptedStyleSheets.push(ResetCSS, AppCSS, FichaParadaCSS);

      this._checkSmallScreenBehaviors();    
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`attributeChangedCallback: Attribute ${name} has changed.`, oldValue, newValue);
        if (name === 'parada') { 
            this._setUpContent();
        }
    }

    disconnectedCallback() {
        console.log("disconnectedCallback: Custom element removed from page.");
        // Don't forget to remove event listeners
        window.removeEventListener('stateChanged', this._handleStateChanged);
    }
  
    adoptedCallBack() {
        console.log('adoptedCallback: Custom element moved to new page.')
    }
  
    
// ======================= Private Methods ======================= //

  /**
   * Private method to set up the content of the web component.
   *
   * Only render if the web component is connected and the template is loaded.
   * Replace any previous content with the template content.
   * @private
   */
  _setUpContent() {
    //leer contenido platnilla añadir en shadow room y modificar
    // Prevent render when disconnected or the template is not loaded
    if (this.shadowRoot && this.template) {
      // Replace previous content
      this.shadowRoot.innerHTML = '';
      this.shadowRoot.appendChild(this.template.content.cloneNode(true));
      const datosParada = JSON.parse(this.parada);
      
        // Crear elementos en el DOM para almacenar la información
        const newH1Parada = this.shadowRoot.getElementById('nombre-parada');
        const newImagenParada = this.shadowRoot.getElementById('imagen-parada');
        const newSpanNombreFotoParada = this.shadowRoot.getElementById('pie-foto-parada');
        const newInfoParada = this.shadowRoot.getElementById('info-parada');
        const newEnlaceParada = this.shadowRoot.getElementById('enlace-parada');
        const newSpanCategoriaParada = this.shadowRoot.getElementById('categoria-parada');

        // Asociar cada elemento DOM con información del JSON
        newH1Parada.innerText = datosParada.nombre_parada ?? "";
        newImagenParada.src = datosParada.imagen ?? "";
        newSpanNombreFotoParada.innerText = datosParada.nombre_parada ?? "";
        newInfoParada.innerText = datosParada.info ?? "";
        newEnlaceParada.href = datosParada.enlace ?? "";
        newEnlaceParada.textContent = 'Visita sitio web';
        newSpanCategoriaParada.innerText = datosParada.categoria ?? "";

    }
  }

  /**
   * Updates the visibility of the sidebar based on the screen size.
   * If the screen width is 460px or less, the sidebar is hidden;
   * otherwise, the sidebar is shown.
   * @private
   */
  _checkSmallScreenBehaviors() {
      if (window.matchMedia('(max-width: 460px)').matches) {
          this.showSidebar = false;
      } else {
          this.showSidebar = true;
      }
  }



}

  customElements.define('ficha-parada', FichaParada)