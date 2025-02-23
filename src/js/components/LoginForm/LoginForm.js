
import { getAPIData, getInputValue, API_PORT } from '../../userUtils.js';
import { importTemplate } from '../../lib/importTemplate.js';
//añadir los CSS
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
import AppCSS from '../../../css/app.css' with { type: 'css' }
import LoginFormCSS from './LoginForm.css' with { type: 'css' }

const TEMPLATE = {
  id: 'loginFormTemplate',
  url: './js/components/LoginForm/LoginForm.html'
}
// Wait for template to load
await importTemplate(TEMPLATE.url).then(() => {
  console.log('Template importado correctamente');
});

/**
 * Login Form Web Component
 * 
 * @class LoginForm
 * @emits 'login-form-submit'
 */
export class LoginForm extends HTMLElement {
  get template(){
    return document.getElementById(TEMPLATE.id);
  }

    constructor() {
        super()
    }

// ======================= Lifecycle Methods ======================= //

    async connectedCallback() {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.adoptedStyleSheets.push(ResetCSS, AppCSS, LoginFormCSS);

      this._setUpContent();
      this._checkSmallScreenBehaviors();
    // Add event listeners to form elements
      const form = this.shadowRoot.getElementById("login-form");
    //  // Get updates when content is updated in the slot
    //   this.shadowRoot.addEventListener('slotchange', this._handleSlotChanged.bind(this), { passive: true });
    //  // Global store state listener
    //   window.addEventListener('stateChanged', this._handleStateChanged.bind(this), { passive: true });

      form.addEventListener("submit", this._onFormSubmit.bind(this));
    }

    disconnectedCallback() {
      console.log("disconnectedCallback: Custom element removed from page.");
      // Don't forget to remove event listeners
      window.removeEventListener('stateChanged', this._handleStateChanged);
    }

    adoptedCallBack() {
      console.log('adoptedCallback: Custom element moved to new page.')
    }

    attributeChangedCallback(name, oldValue, newValue) {
      console.log(`attributeChangedCallback: Attribute ${name} has changed.`, oldValue, newValue);
      this._setUpContent();
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
    // Prevent render when disconnected or the template is not loaded
    if (this.shadowRoot && this.template) {
      // Replace previous content
      this.shadowRoot.innerHTML = '';
      this.shadowRoot.appendChild(this.template.content.cloneNode(true));
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

  /**
  * @param {Event} e - The form submission event.
  * @private
  */
  async _onFormSubmit(e) {
    e.preventDefault();
    const email = this.shadowRoot.getElementById("email");
    const password = this.shadowRoot.getElementById("password");
    const loginData = {
      email: getInputValue(email),
      password: getInputValue(password)
    }
    
    let onFormSubmitEvent

    if (loginData.email !== '' && loginData.password !== '') {
      const payload = JSON.stringify(loginData)
      const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/login`, 'POST', payload)
        
      onFormSubmitEvent = new CustomEvent("login-form-submit", {
        bubbles: true,
        detail: apiData
      })
    } else {
      onFormSubmitEvent = new CustomEvent("login-form-submit", {
        bubbles: true,
        detail: null
      })
    }

    this.dispatchEvent(onFormSubmitEvent);
  }
}

customElements.define('login-form', LoginForm)