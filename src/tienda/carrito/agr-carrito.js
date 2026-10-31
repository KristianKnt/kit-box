
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


function actualizarContadorCarrito() {
    const carrito = obtenerCarrito(); 
    const cantidadTotal = carrito.reduce((total, producto) => total + (producto.cantidad || 1), 0);
    const contadorElemento = document.getElementById("contador-carrito");

    if (contadorElemento) {
        contadorElemento.textContent = cantidadTotal;
    }
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
        
        // Se borra sola a los 3 segundos
        setTimeout(() => { 
            contenedorAlerta.innerHTML = ''; 
        }, 3000);
    } else {
        console.warn("No se encontró el contenedor de alertas en el DOM");
    }
}

function mostrarMensajeEliminado(nombreProducto) {
    const contenedorAlerta = document.getElementById('alerta-contenedor');
    
    if (contenedorAlerta) {
        contenedorAlerta.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
                🗑️ <strong>${nombreProducto}</strong> se ha eliminado del carrito.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
            </div>
        `;
        
        setTimeout(() => { 
            contenedorAlerta.innerHTML = ''; 
        }, 3000);
    }
}


// ==========================================
// INICIALIZACIÓN Y VIGILANCIA DEL CONTADOR
// ==========================================

// 1. Ejecutar inmediatamente por si el Header ya está en la página
document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);

// 2. Crear un vigilante (Observer) para el Header dinámico en TODAS las vistas
const vigilanteDOM = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // Si detecta que el span del contador fue inyectado, actualiza
            const contadorElemento = document.getElementById("contador-carrito");
            if (contadorElemento && contadorElemento.textContent === "0") {
                actualizarContadorCarrito();
            }
        }
    }
});

// 3. Comenzar a vigilar todo el cuerpo de la página
vigilanteDOM.observe(document.body, { childList: true, subtree: true });