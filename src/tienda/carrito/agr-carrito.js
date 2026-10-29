// tienda/carrito/agr-carrito.js

const CARRITO_KEY = 'carrito';

function agregarProductoAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem(CARRITO_KEY)) || [];
    const indice = carrito.findIndex(item => item.id === producto.id);

    if (indice !== -1) {
        carrito[indice].cantidad = (carrito[indice].cantidad || 1) + 1;
    } else {
        producto.cantidad = 1;
        carrito.push(producto);
    }

    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
    mostrarMensajeProductoAgregado(producto.nombre);
}

function mostrarMensajeProductoAgregado(nombreProducto) {
    const contenedorAlerta = document.getElementById('alerta-contenedor');
    if (contenedorAlerta) {
        contenedorAlerta.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
                🛒 ¡<strong>${nombreProducto}</strong> se ha añadido al carrito!
                <a href="../carrito/carrito.html" class="alert-link ms-2">Ver carrito</a>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
            </div>
        `;
        setTimeout(() => { contenedorAlerta.innerHTML = ''; }, 3500);
    }
}