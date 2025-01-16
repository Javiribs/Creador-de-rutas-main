/*
INICIAR APP "Lista de la Compra"

CREAR una variable "total" para llevar la cuenta del costo total, inicializada en 0
CREAR una lista vacía llamada "productos" para almacenar la información de los productos ingresados

FUNCION agregarProducto()
    SOLICITAR al usuario "Introduce el nombre del producto o la marca"
    LEER nombreProducto
    
    SOLICITAR al usuario "Introduce la cantidad del producto"
    LEER cantidad
    
    SOLICITAR al usuario "Introduce el precio del producto"
    LEER precio
    
    CALCULAR costoProducto = cantidad * precio
    SUMAR costoProducto a la variable "total"
    
    AÑADIR un objeto con las propiedades: nombreProducto, cantidad, precio, y costoProducto a la lista "productos"

FIN FUNCION

FUNCION mostrarLista()
    IMPRIMIR "Lista de la compra:"
    SI la lista "productos" está vacía
        IMPRIMIR "No hay productos en la lista"
    SINO
        PARA CADA producto en productos
            IMPRIMIR producto.nombreProducto + " - Cantidad: " + producto.cantidad + " - Precio unitario: " + producto.precio + " - Total: " + producto.costoProducto
        FIN PARA
        IMPRIMIR "Total de la compra: " + total
    FIN SI

FIN FUNCION

FUNCION eliminarProducto()
    SOLICITAR al usuario "Introduce el nombre del producto que deseas eliminar"
    LEER nombreProductoAEliminar
    
    PARA CADA producto en productos
        SI producto.nombreProducto es igual a nombreProductoAEliminar
            RESTAR producto.costoProducto de la variable "total"
            ELIMINAR producto de la lista "productos"
            IMPRIMIR "Producto eliminado"
            ROMPER el bucle
        FIN SI
    FIN PARA
    SI el producto no es encontrado
        IMPRIMIR "Producto no encontrado"

FIN FUNCION

FUNCION ejecutar()
    MOSTRAR menú con opciones:
        1. Agregar producto
        2. Ver lista de la compra
        3. Eliminar producto
        4. Salir

    LEER opción seleccionada

    SI opción es 1
        LLAMAR a la función agregarProducto
    SINO SI opción es 2
        LLAMAR a la función mostrarLista
    SINO SI opción es 3
        LLAMAR a la función eliminarProducto
    SINO SI opción es 4
        SALIR de la app
    FIN SI
FIN FUNCION

MIENTRAS (la app no se cierre)
    LLAMAR a la función ejecutar
FIN MIENTRAS

FIN
*/