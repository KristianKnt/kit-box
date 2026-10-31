// ===== Cantidades del carrito: botones + y − =====
// Usa obtenerCarrito() y actualizarCantidad() de localStorage.js
// y renderizarCarrito() de render.js.
// Por eso en carrito.html este archivo se carga de último.

const CANTIDAD_MINIMA = 1;

// Calcula la nueva cantidad según el botón que se tocó,
// sin bajar del mínimo ni pasar del stock disponible.
function calcularNuevaCantidad(producto, accion) {
    const cantidadActual = Number(producto.cantidad);
    const stock = Number(producto.stock);
    const tieneStock = Number.isFinite(stock) && stock > 0; // si no hay dato de stock, no ponemos tope

    if (accion === "aumentar") {
        if (tieneStock && cantidadActual >= stock) {
            return cantidadActual; // ya no hay más unidades disponibles
        }
        return cantidadActual + 1;
        
    }

    if (accion === "disminuir") {
        if (cantidadActual <= CANTIDAD_MINIMA) {
            return cantidadActual; // para quitarlo del todo está el botón de eliminar
        }
        return cantidadActual - 1;
        
    }

    return cantidadActual;
}

// Se ejecuta con cualquier clic dentro de la lista del carrito
function manejarClickCantidad(evento) {
    // 1. ¿Lo que se tocó es (o está dentro de) un botón + o −?
    const boton = evento.target.closest('[data-accion="aumentar"], [data-accion="disminuir"]');
    if (!boton) {
        return; // fue otro clic, no hacemos nada
    }

    // 2. Saber qué producto es y qué botón se usó
    const id = boton.dataset.id;
    const accion = boton.dataset.accion;

    // 3. Buscar el producto en el carrito guardado
    const producto = obtenerCarrito().find(item => item.id === id);
    if (!producto) {
        return;
    }

    // 4. Calcular la cantidad nueva y, si no cambió, no hacer nada
    const nuevaCantidad = calcularNuevaCantidad(producto, accion);
    if (nuevaCantidad === Number(producto.cantidad)) {
        return;
    }

    // 5. Guardar y volver a pintar (actualiza cantidad, subtotal y total)
    actualizarCantidad(id, nuevaCantidad);
    renderizarCarrito();

    //Actualiza el contador del carrito
    actualizarContadorCarrito();
}

// Un solo listener en el contenedor (delegación de eventos):
// funciona aunque las tarjetas se borren y se vuelvan a pintar.
document.addEventListener("DOMContentLoaded", () => {
    const lista = document.getElementById("lista-carrito");

    if (!lista) {
        console.error("No se encontró el contenedor lista-carrito");
        return;
    }

    lista.addEventListener("click", manejarClickCantidad);
});
