// clave principal para guardar todo en el local storage
const CLAVE_CARRITO = "kitbox_carrito";

// 1. Obtener los productos guardados en el carrito
function obtenerCarrito() {
    const carritoGuardado = localStorage.getItem(CLAVE_CARRITO);

    if (carritoGuardado === null) {
        return [];
    }

    try {
        const carrito = JSON.parse(carritoGuardado);

        if (!Array.isArray(carrito)) {
            console.error("El carrito guardado no tiene un formato válido.");
            return [];
        }

        return carrito;
    } catch (error) {
        console.error("No se pudo leer el carrito guardado.", error);
        return [];
    }
}

// 2. Guardar los productos del carrito
function guardarCarrito(carrito) {
    if (!Array.isArray(carrito)) {
        console.error("El carrito debe ser un arreglo.");
        return;
    }

    localStorage.setItem(
        CLAVE_CARRITO,
        JSON.stringify(carrito)
    );
}

// 3. Agregar un producto al carrito

function agregarProducto(producto) {
    const carrito = obtenerCarrito();

    const productoExistente = carrito.find(
        item => item.id === producto.id
    );

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
}


// 4. Actualizar la cantidad de un producto
function actualizarCantidad(id, cantidad) {

}

// 5. Eliminar un producto del carrito
function eliminarProducto(id) {

}

// 6. Calcular el total de la compra
function calcularTotal() {

}
