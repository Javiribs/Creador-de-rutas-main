// @ts-check
import { simpleFetch } from './simpleFetch.js'
import { HttpError } from './class/HttpError.js'
/** @import {Usuario} from './class/usuario.js' */
// Asigno en el DOM los eventos cargados 
document.addEventListener('DOMContentLoaded', onDomContentLoaded)

const API_PORT = location.port ? `:${location.port}` : ''

//EVENTOS
function onDomContentLoaded() {
    //obtengo elemento del DOM por su ID
    const registerForm = document.getElementById('register-form')
    const loginForm = document.getElementById('login-form')
    //activo evento mediante boton submit
    registerForm?.addEventListener('submit', registerUser)
    loginForm?.addEventListener('submit', logInButton)
}


// EVENTOS
/**
 * @param {SubmitEvent} e
 */
//Funciones que se activan al apretar el registerbutton
//busca crea un nuevo usuario
async function registerUser(e) {
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
    } catch (error) {
        console.error('Error al registrar usuario:', error)
        alert('Error al registrar usuario. Por favor, inténtalo de nuevo más tarde.')   
    }
}


/**
 * @param {SubmitEvent} e
 */
//Funciones que se activan al apretar el loginbutton
//busca coincidencias entre email y password
    async function logInButton(e) {
        
        const loginData = {
          email: getElementValue('login-email'),
          password: getElementValue('login-password')
        }

        e.preventDefault()

        if (loginData.email !== '' && loginData.password !== '') {
          const payload = JSON.stringify(loginData)
          const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/login`, 'POST', payload)
          if (!apiData) {
            // Show error
            alert('El usuario no existe')
          } else {
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
async function getAPIData(apiURL, method = 'GET', data) {
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
      body: data ?? undefined,
      headers: headers
      });
      
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
  
    return apiData
  }


//Obtener el value de los inputs del usuario
  /**
 * @param {string} id
 */
  function getElementValue(id) {
    const element = document.querySelector(`#${id}`);
    if (element instanceof HTMLInputElement) {
      return element.value;
    } else {
      return '';
    }
  }

