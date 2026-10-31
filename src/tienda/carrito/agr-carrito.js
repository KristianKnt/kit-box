
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
function eliminarProducto(idOObjeto) {
    const id = (typeof idOObjeto === 'object' && idOObjeto !== null) ? idOObjeto.id : idOObjeto;
    const carrito = obtenerCarrito();
    
    // Filtramos dejando todo lo que NO sea ese id
    const carritoActualizado = carrito.filter(item => item.id !== id);
    guardarCarrito(carritoActualizado);

    // ¡La parte que hace funcionar el globo!
    if (typeof actualizarContadorCarrito === "function") {
        actualizarContadorCarrito();
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

// 1. Ejecutar inmediatamente por si el Header ya está en el HTML
document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);

// 2. Crear el vigilante con instrucción de apagado automático
const vigilanteDOM = new MutationObserver((mutationsList, observer) => {
    const contadorElemento = document.getElementById("contador-carrito");
    
    // Si detecta que el contador ya fue inyectado en la pantalla
    if (contadorElemento) {
        actualizarContadorCarrito(); 
        observer.disconnect(); // <-- SOLUCIÓN: Apaga el vigilante para romper el bucle infinito
    }
});

// 3. Comenzar a vigilar el cuerpo de la página
vigilanteDOM.observe(document.body, { childList: true, subtree: true });