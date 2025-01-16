INICIO DE LA APP "Lista de la Compra"

Variable global para el total de la compra
total = 0

Lista que almacenará los productos
productos = []

Función que agrega un producto a la lista
FUNCION agregarProducto()
    nombreProducto = solicitarEntrada("Introduce el nombre del producto o la marca")
    cantidad = solicitarEntrada("Introduce la cantidad del producto")
    precio = solicitarEntrada("Introduce el precio del producto")
    
    costoProducto = calcularCosto(cantidad, precio)
    total = total + costoProducto
    
    Crear un objeto producto y añadirlo a la lista
    producto = crearProducto(nombreProducto, cantidad, precio, costoProducto)
    agregarALista(producto)
FIN FUNCION

Función que calcula el costo de un producto
FUNCION calcularCosto(cantidad, precio)
    RETORNAR cantidad * precio
FIN FUNCION

Función para crear un objeto producto
FUNCION crearProducto(nombre, cantidad, precio, costo)
    producto = {
        "nombre": nombre,
        "cantidad": cantidad,
        "precio": precio,
        "costo": costo
    }
    RETORNAR producto
FIN FUNCION

Función para agregar un producto a la lista de productos
FUNCION agregarALista(producto)
    productos.AÑADIR(producto)
FIN FUNCION

Función que muestra la lista de productos
FUNCION mostrarLista()
    SI productos.ESTA_VACIA()
        IMPRIMIR "No hay productos en la lista"
    SINO
        PARA CADA producto en productos
            IMPRIMIR producto.nombre + " - Cantidad: " + producto.cantidad + " - Precio unitario: " + producto.precio + " - Total: " + producto.costo
        FIN PARA
        IMPRIMIR "Total de la compra: " + total
    FIN SI
FIN FUNCION

Función que elimina un producto de la lista
FUNCION eliminarProducto()
    nombreProductoAEliminar = solicitarEntrada("Introduce el nombre del producto que deseas eliminar")
    
    PARA CADA producto en productos
        SI producto.nombre es igual a nombreProductoAEliminar
            total = total - producto.costo
            productos.ELIMINAR(producto)
            IMPRIMIR "Producto eliminado"
            ROMPER
        FIN SI
    FIN PARA
    
    SI producto NO ES ENCONTRADO
        IMPRIMIR "Producto no encontrado"
    FIN SI
FIN FUNCION

Función para solicitar la entrada del usuario
FUNCION solicitarEntrada(mensaje)
    IMPRIMIR mensaje
    LEER entrada
    RETORNAR entrada
FIN FUNCION

Función para ejecutar la app
FUNCION ejecutarApp()
    mostrarMenu()
    opcion = solicitarEntrada("Selecciona una opción: ")
    
    SI opcion es 1
        LLAMAR agregarProducto()
    SINO SI opcion es 2
        LLAMAR mostrarLista()
    SINO SI opcion es 3
        LLAMAR eliminarProducto()
    SINO SI opcion es 4
        SALIR
    FIN SI
FIN FUNCION

Función para mostrar el menú de opciones
FUNCION mostrarMenu()
    IMPRIMIR "1. Agregar producto"
    IMPRIMIR "2. Ver lista de la compra"
    IMPRIMIR "3. Eliminar producto"
    IMPRIMIR "4. Salir"
FIN FUNCION

Bucle principal para ejecutar la app
MIENTRAS (la app no se cierre)
    LLAMAR ejecutarApp()
FIN MIENTRAS

FIN DE LA APP "Lista de la Compra"
