function crearResumenCarrito() {

const divResumen = document.getElementById("resumen-productos");
const carritoProductos = obtenerCarrito();
let acumuladorResumen = "";

for (const producto of carritoProductos) {
    const subTotal = producto.precio * producto.cantidad;
    acumuladorResumen += `
    <li class="list-group-item d-flex align-items-center bg-transparent px-0 small">
        <span class="resumen-nombre me-auto">${producto.nombre}</span>
        <span class="resumen-cantidad badge rounded-pill mx-3">x${producto.cantidad}</span>
        <span class="resumen-subtotal fw-semibold">${formatearPrecio(subTotal)}</span>
    </li>
    `;
}
    divResumen.innerHTML = acumuladorResumen;

}

document.addEventListener("DOMContentLoaded", () => {
    crearResumenCarrito();
    const lista = document.getElementById("lista-carrito");
    lista.addEventListener("click", () => {
        crearResumenCarrito();
    });
});