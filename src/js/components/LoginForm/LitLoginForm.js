import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
// import { importTemplate } from '../../lib/importTemplate.js';

import { getAPIData, API_PORT } from '../../userUtils.js';

//añadir los CSS
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
import AppCSS from '../../../css/app.css' with { type: 'css' }
import LoginFormCSS from './LoginForm.css' with { type: 'css' }

//NO USAMOS TEMPLATE POR QUE PEGAMOS DIRECTAMENTE EL HTML AFECTADO EN EL RENDER
// const TEMPLATE = {
//   id: 'loginFormTemplate',
//   url: './js/components/LoginForm/LoginForm.html'
// }

// // Wait for template to load
// await importTemplate(TEMPLATE.url);

export class LitLoginForm extends LitElement {
    static styles = [ResetCSS, AppCSS, LoginFormCSS];
    
    get _email() {
        return this.renderRoot?.querySelector('#email') ?? null;
    }
    
    get _password() {
        return this.renderRoot?.querySelector('#password') ?? null;
    }

    constructor() {
      super();
    }

    render() {
        return html`
        <slot></slot>
    <form id="login-form" @submit="${this._onFormSubmit}">
      <h3>Iniciar Sesión</h3>
      <label>Usuario: <input type="text" id="email" placeholder="email" /></label>
      <label>Contraseña: <input type="password" id="password" placeholder="contraseña" /></label>
      <button type="submit" id="loginButton" title="Login">Login</button>
      <slot name="error"></slot>
    </form>
    `
    }

    // ======================= Private Methods ======================= //

    /**
      * @param {Event} e - The form submission event.
      * @private
      */
      async _onFormSubmit(e) {
        e.preventDefault();
        const email = this._email
        const password = this._password;
        const loginData = {
          email: email.value,
          password: password.value
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

customElements.define('login-form', LitLoginForm);