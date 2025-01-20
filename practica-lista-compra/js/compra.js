//importar api lista productos
import USUAL_PRODUCTS from '../api/get.articles.json' with { type: 'json' }

// Crear una lista de compras vacía (shoppingList) para ser rellenar con productos.
const shoppingList = []
// Assign DOM Content Loaded event
document.addEventListener('DOMContentLoaded', onDomContentLoaded)

// Eventos (es el resultado de la interacción del usuario con la app) //


//	Cuando el documento termina de cargarse (DOMContentLoaded) tener listo: 
//	Crear función con las variables que van a contener los inputs del usuario: 
function onDomContentLoaded() {
  const articleNameElement = document.getElementById('articleName') //elementos de entrada del nombre del artículo 
  const newArticleElement = document.getElementById('newArticle') //elementos de entrada del botón "Agregar Nuevo Artículo"
  const newListElement = document.getElementById('newList') //elementos de entrada del botón "Nueva Lista" 
//	Adjuntar listeners de eventos (app escucha interacción del usuario con las variables establecidas anteriormente): 
  articleNameElement.addEventListener('keyup', onArticleNameKeyUp) //Evento keyup de articleNameElement si el valor de articleNameElement no está vacío, habilitar newArticleElement.
  newArticleElement.addEventListener('click', onNewArticleClick) //En el evento click de newArticleElement: Llamar a createShoppingListItem 
  newListElement.addEventListener('click', onNewListClick) //En el evento click de newListElement: Llamar a funcion onNewListClick
  // Configurar el método `empty` para la clase `shoppingList`: 
  shoppingList.empty = function() {
    //	Mientras la longitud de la lista sea mayor que cero eliminar el último elemento de la lista
    while (this.length > 0){
      this.pop()
    }
  }

  //	Obtener la lista de compras almacenada desde localStorage
  //o	Obtener el valor almacenado con la clave 'shoppingList' desde localStorage
  const storedData = JSON.parse(localStorage.getItem('shoppingList')) //Agregar el artículo guardado a la lista de compras (`shoppingList`).
  // Analizar el valor obtenido como JSON
  // Iterar sobre cada artículo guardado (`savedArticle`) en los datos almacenados
  storedData.forEach(savedArticle => {
    shoppingList.push(savedArticle)
    addNewRowToShoppingListTable(savedArticle)
  });  
  getShoppingListTotalAmount() //Calcular el monto total de la lista de compras llamando a la función `getShoppingListTotalAmount`.
  getUsualProducts() //Llamamos funcion que optiene datos de una API
}
//Obtener referencias al elemento de entrada del nombre del artículo (`articleNameElement`) y al botón "Agregar Nuevo Artículo" (`newArticleElement`).
function onArticleNameKeyUp(e) {
  const articleNameElement = document.getElementById('articleName')
  const newArticleElement = document.getElementById('newArticle')
//Si el valor del elemento de entrada del nombre del artículo no está vacío:
//Habilitar el botón "Agregar Nuevo Artículo". 
//De lo contrario: - Deshabilitar el botón "Agregar Nuevo Artículo".
  if (articleNameElement.value !== '') {
    newArticleElement.disabled = undefined
  } else {
    newArticleElement.disabled = true
  }
}
//Llamar a la función `createShoppingListItem` para crear un nuevo artículo en la lista de compras
//A la vez que llama a función `cleanUpForm` para limpiar los campos del formulario
function onNewArticleClick(e) {
  createShoppingListItem()
  cleanUpForm()
}
//Llamar a la función `resetShoppingList` para reiniciar la lista de compras
function onNewListClick(e) {
  resetShoppingList()
}

// ======== METHODS ======== //

/**
 * Vaciar la lista shoppingList
 */
function resetShoppingList() {
  // Llamar a emptyTableElement para limpiar la tabla
  shoppingList.empty()
  // Llamar a getShoppingListTotalAmount para actualizar el monto total.
  emptyTableElement()
  // Llamar a cleanUpForm para limpiar el formulario.
  getShoppingListTotalAmount()
  // Para limpiar el formulario
  cleanUpForm()
}

/**
 * Clean up form: Establecer los valores de los tres elementos de entrada a cadenas vacías, para que el reseteo se aplique
 */
function cleanUpForm() {
  // 1. GCrear variables asociadas a las referencias del elemento de entrada 
  const articleNameElement = document.getElementById('articleName')
  const qtyElement = document.getElementById('qty')
  const priceElement = document.getElementById('price')
  // 2. Establecer los valores de los tres elementos de entrada a cadenas vacías
  articleNameElement.value = ''
  qtyElement.value = ''
  priceElement.value = ''
}

// C.R.U.D. Crear, Leer, Actualizar, Eliminar

/**
 * Crear la lista con los elementos
 */
//Obtener referencias al elemento de entrada del nombre del archivo html
function createShoppingListItem() {
  const articleNameElement = document.getElementById('articleName')
  const qtyElement = document.getElementById('qty')
  const priceElement = document.getElementById('price')
  const timestamp = new Date()
  // Template literals:
  // TODO: ver la próxima semana
  //	Generar un ID único para el nuevo artículo combinando el nombre del artículo y la marca de tiempo
  // const id = `${articleNameElement.value}_${String(timestamp.getTime())}`
  const id = articleNameElement.value + '_' + String(timestamp.getTime())
  //o	Crear un nuevo objeto de artículo con propiedades
  const newArticleObject = {
    id: id,
    name: articleNameElement.value,
    qty: Number(qtyElement.value),
    price: Number(priceElement.value)
  }
  //o	Agregar el nuevo objeto de artículo a la lista shoppingList
  shoppingList.push(newArticleObject)
  // o	Guardar la lista shoppingList actualizada en localStorage
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList))
  getShoppingListTotalAmount()//llamar funcion actualizar total
  addNewRowToShoppingListTable(newArticleObject)//llamar funcion para agregar fila a la tabla
  resetFocus()//metodo para que quede seleccionado el primer campo de la app (cursor)
}

/**
 * Obtener una referencia al elemento del cuerpo de la tabla de la lista de compras
 */
function addNewRowToShoppingListTable(newArticleObject){
  const shoppingListTableBodyElement = document.getElementById('shoppingListTableBody')
  // Crear la tabla en HTML con elementos tr y td para:
  const newArticleTableRow = document.createElement('tr')
  const newArticleTableCellQty = document.createElement('td')
  const newArticleTableCellName = document.createElement('td')
  const newArticleTableCellPrice = document.createElement('td')
  const newArticleTableCellSubtotal = document.createElement('td')
  const newArticleDeleteButtonCell = document.createElement('td')
  const newArticleDeleteButton = document.createElement('button')
  //asociar cada celda de la tabla a su propiedad correspondiente del objeto
  newArticleTableCellQty.innerText = newArticleObject.qty
  newArticleTableCellName.innerText = newArticleObject.name
  newArticleTableCellPrice.innerText = newArticleObject.price
  //asociar la celda del subtotal a una operación de mutiplicación entre cantidad y precio
  newArticleTableCellSubtotal.innerText = newArticleObject.qty * newArticleObject.price
  //el texto para el boton pasa a ser la basura y le damos clase para modificar en css
  newArticleDeleteButton.innerText = '🗑'
  //	Agregar un escuchador de eventos al botón de eliminar
  newArticleDeleteButton.className = 'delete-button'
  //llamar a deleteShoppingListItem cuando se haga clic
  newArticleDeleteButton.setAttribute('id-to-delete', newArticleObject.id)
  // Adjuntar el botón de eliminar a su celda y todas las celdas a la nueva fila de la tabla
  newArticleDeleteButton.addEventListener('click', deleteShoppingListItem)
  newArticleDeleteButtonCell.appendChild(newArticleDeleteButton)
  // Añadir celdas a la tabla
  newArticleTableRow.appendChild(newArticleTableCellQty)
  newArticleTableRow.appendChild(newArticleTableCellName)
  newArticleTableRow.appendChild(newArticleTableCellPrice)
  newArticleTableRow.appendChild(newArticleTableCellSubtotal)
  newArticleTableRow.appendChild(newArticleDeleteButtonCell)
  // 2.Adjuntar la nueva fila de la tabla al elemento del cuerpo de la tabla de la lista de compras.
  shoppingListTableBodyElement.appendChild(newArticleTableRow)
}

/**
 * Llamar a getShoppingListTotalAmount para actualizar el monto total.
 */
function updateShoppingListItem() {
  getShoppingListTotalAmount()
}

/**
 * Elimina un elemento de la lista de la compra
 */
function deleteShoppingListItem(e) {
  const itemIdToDelete = e.target.getAttribute('id-to-delete')//Obtener el ID del artículo a eliminar del atributo del botón de eliminar (id-to-delete). 
  const rowToDelete = e.target.closest('tr')//Obtener una referencia a la fila de la tabla que contiene el botón de eliminar (rowToDelete). 
  // Encontrar el índice del artículo a eliminar en la lista shoppingList usando su ID
  const itemIndex = shoppingList.findIndex((shoppingListItem) => shoppingListItem.id === itemIdToDelete)
  //Eliminar el artículo de la lista shoppingList usando el índice
  shoppingList.splice(itemIndex, 1)
  rowToDelete.remove()//Eliminar la fila de la tabla del DOM. 
  getShoppingListTotalAmount()//Llamamos funcion para actualizar el total
  // Guardar la lista shoppingList actualizada en localStorage.
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList))
}

/**
 * Vaciar elemntos de la tabla
 */
function emptyTableElement() {
  //Obtener una lista de todos los elementos de fila de tabla dentro del cuerpo de la tabla
  const shoppingListTableBodyRowsList = document.querySelectorAll('tbody>tr')
  // Iterar a través de cada fila de tabla
  for (let tableRow of shoppingListTableBodyRowsList) {
    //Eliminar la fila de la tabla del DOM
    tableRow.remove()
  }
}

/**
 * Calcular total de la lista de la tabla
 */
function getShoppingListTotalAmount() {
  //Obtener una referencia al elemento de la celda del monto total 
  const shoppingListTableTotalElement = document.getElementById('shoppingListTableTotal')
  //Inicializar una variable totalAmount a 0
  let totalAmount = 0
  //Iterar
  for (let article of shoppingList) {
    // calcular subtotal de cada elemento
    const subtotal = article.qty * article.price
    // sumar todos los subtotales
    totalAmount += subtotal
  }
  // mostrar total en la tabla
  shoppingListTableTotalElement.innerText = totalAmount
}

/**
 * Que el cursor de cuadros vaya al primer cuadro de texto
 */
function resetFocus(){
  const articleNameElement = document.getElementById('articleName')
  articleNameElement.focus()
}

//Obtener elementos de una lista (API) local
async function getUsualProducts() {
    const dataListElement = document.getElementById('productos')
    const apiData = await getAPIData()

    apiData.forEach((product) => {
        const newOptionElement = document.createElement('option')
        newOptionElement.value = product.name
        dataListElement.appendChild(newOptionElement)
    })
}

async function getAPIData() {
  const API_USUAL_PRODUCT_URL = 'api/get.articles.json'

  const apiData = await fetch(API_USUAL_PRODUCT_URL)
    .then((response) => {
      if (!response.ok) {
        showError(response.status)
    }
      return response.json();
    })

    return apiData
}