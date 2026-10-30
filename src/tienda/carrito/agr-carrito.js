
// tienda/carrito/agr-carrito.js

// Usa obtenerCarrito() y guardarCarrito() del archivo localStorage.js

function agregarProductoAlCarrito(producto) {
    const carrito = obtenerCarrito();
    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    actualizarContadorCarrito(); // <-- Actualiza al hacer clic
    mostrarMensajeExito(producto.nombre);
}

function mostrarMensajeExito(nombreProducto) {
    const contenedorAlerta = document.getElementById('alerta-contenedor');
    
    if (contenedorAlerta) {
        contenedorAlerta.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
                🛒 ¡<strong>${nombreProducto}</strong> se ha añadido al carrito!
                <a href="../carrito/carrito.html" class="alert-link ms-2">Ver carrito</a>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
            </div>
        `;
        setTimeout(() => { contenedorAlerta.innerHTML = ''; }, 3000);
    }
}

function actualizarContadorCarrito() {
    const carrito = obtenerCarrito(); 
    const cantidadTotal = carrito.reduce((total, producto) => total + (producto.cantidad || 1), 0);
    const contadorElemento = document.getElementById("contador-carrito");

    if (contadorElemento) {
        contadorElemento.textContent = cantidadTotal;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();
});