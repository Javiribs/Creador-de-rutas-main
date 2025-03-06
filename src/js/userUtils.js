// @ts-check
import { simpleFetch } from './simpleFetch.js'
import { HttpError } from './class/HttpError.js'
/** @import {Usuario} from './class/usuario.js' */
// Asigno en el DOM los eventos cargados 
document.addEventListener('DOMContentLoaded', onDomContentLoaded)

export const API_PORT = location.port ? `:${location.port}` : ''

//EVENTOS
function onDomContentLoaded() {
    //obtengo elemento del DOM por su ID
    const registerForm = document.getElementById('register-form')
    //activo evento mediante boton submit
    registerForm?.addEventListener('submit', registerUser)
    //Login component
    window.addEventListener('stateChanged', (event) => {
      console.log('stateChanged', /** @type {CustomEvent} */(event).detail)
    })
    window.addEventListener('login-form-submit', (event) => {
      console.log('login-form-submit', /** @type {CustomEvent} */(event).detail)
      onLoginComponentSubmit(/** @type {CustomEvent} */(event).detail)
    })
}


// EVENTOS


/**
 * @param {SubmitEvent} e
 */
//Funciones que se activan al apretar el registerbutton
//busca crea un nuevo usuario
export async function registerUser(e) {
    e.preventDefault()

  const registerName = getElementValue('register-name')
  const registerLastname = getElementValue('register-lastname')
  const registerBirthdate = getElementValue('register-birthdate')
  const registerCountry = getElementValue('register-country')
  const registerEmail = getElementValue('register-email')
  const registerPassword = getElementValue('register-password')

    // Validación básica
    if (!registerName || !registerLastname || !registerEmail || !registerPassword || !registerBirthdate || !registerCountry) {
        alert('Todos los campos son obligatorios.')
        return;
    }
    // Formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(registerEmail)) {
        alert('Por favor, introduce un correo electrónico válido.')
        return;
    }

    try {
        const userData = { // Datos del usuario
            name: registerName,
            lastname: registerLastname,
            birthdate: registerBirthdate,
            country: registerCountry,
            email: registerEmail,
            password: registerPassword,
            id: '',
        }
        
        const payload = JSON.stringify(userData)
        // Send fetch to API, create new article
        const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/usuarios`, 'POST', payload) // Ruta al archivo JSON 
        if (!response) {
            throw new Error('Error al crear usuario') // Muestra el error del servidor o un mensaje genérico
        }
        alert('Registro exitoso. ¡Puedes iniciar sesión!')
        document.getElementById('register-form')?.dispatchEvent(new Event('reset')) // Limpia el formulario
        //iniciar sesion automaticamente
        await loginUser(registerEmail, registerPassword);
    } catch (error) {
        console.error('Error al registrar usuario:', error)
        alert('Error al registrar usuario. Por favor, inténtalo de nuevo más tarde.')   
    }
}


/**
 * Handles a successful login from the login component
 * @param {Object} apiData - The user data returned from the API
 * @returns void
 */
function onLoginComponentSubmit(apiData) {
  console.log(`DESDE FUERA DEL COMPONENTE:`, apiData);
  if (!apiData) {
    alert('Usuario no encontrado.');
    return
  }
  if ('_id' in apiData
    && 'name' in apiData
    && 'lastname' in apiData
    && 'birthdate' in apiData
    && 'country' in apiData
    && 'email' in apiData
    && 'token' in apiData) {
    // @ts-ignore
    const userData = /** @type {Usuario} */(apiData)
    sessionStorage.setItem('usuario', JSON.stringify(userData)) // Guardar datos en sessionStorage
    window.location.href = 'inicio.html'
  } else {
    alert('Invalid user data')
  }
}


//C.R.U.D

/**
 * Get data from API
 * @param {string} apiURL
 * @param {string} method
 * @param {Object} [data]
 * @returns {Promise<Array<Usuario>>}
 */
export async function getAPIData(apiURL, method = 'GET', data) {
    let apiData

    try {
      let headers = new Headers()
  
      headers.append('Content-Type', 'application/json')
      headers.append('Access-Control-Allow-Origin', '*')
      if (data) {
        headers.append('Content-Length', String(JSON.stringify(data).length))
      }
      apiData = await simpleFetch(apiURL, {
        // Si la petición tarda demasiado, la abortamos
      signal: AbortSignal.timeout(3000),
      method: method,      
      // @ts-ignore
      body: data ?? undefined,
      headers: headers
      });
      if (!apiData) {
        throw new Error('No se obtuvo respuesta del servidor');
      }
      console.log('Respuesta del servidor:', apiData);
    } catch (/** @type {any | HttpError} */err) {
      if (err.name === 'AbortError') {
        console.error('Fetch abortado');
      }
      if (err instanceof HttpError) {
        if (err.response.status === 404) {
          console.error('Not found');
        }
        if (err.response.status === 500) {
          console.error('Internal server error');
        }
      }
    }
  
    return apiData;
   
  }

/**
 * Inicia sesión en la aplicación
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @throws {Error} Si no se puede iniciar sesión
 */
  export async function loginUser(email, password) {
    try {
        const userData = {
            email: email,
            password: password,
        };
        const payload = JSON.stringify(userData);
        const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/login`, 'POST', payload);
        // @ts-ignore
        if (!response || !response.token) {
            throw new Error('Error al iniciar sesión');
        }
        sessionStorage.setItem('usuario', JSON.stringify(response)); // Almacena el objeto user completo
        alert('Inicio de sesión exitoso.');
        window.location.href = 'inicio.html'; // Redirige al usuario
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
    }
}


//Obtener el value de los inputs del usuario por el ID
  /**
 * @param {string} id
 */
  export function getElementValue(id) {
    const element = document.querySelector(`#${id}`);
    if (element instanceof HTMLInputElement) {
      return element.value;
    } else {
      return '';
    }
  }

  /**
 * Recibe el valor de un input por el propio valor
 * @param {HTMLElement | null} inputElement - The input element from which to get the value.
 * @returns {string} The value of the input element, or an empty string if the element is null.
 */
export function getInputValue(inputElement) {
  if (inputElement) {
    return /** @type {HTMLInputElement} */(inputElement).value
  } else {
    return ''
  }
}

