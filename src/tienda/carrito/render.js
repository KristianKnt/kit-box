function formatearPrecio(valor) {  // Formateo de int a precio en moneda local
  return "$" + Number(valor || 0).toLocaleString("es-CO");
}

// renderiza una tarjeta individual

// funcion temporal
function obtenerRutaImagen(ruta) {
    // Las rutas del JSON empiezan por src/assets/...
    // Reemplazamos "src/" por "../../" para llegar desde catalogo.html
    return ruta.replace(/^src\//, "../../");
}

// fin funcion temporal


function crearTarjetaCarrito(producto) {
  const nombre = producto.nombre;
  const imagen = obtenerRutaImagen(producto.imagen);
  const precio = Number(producto.precio);
  const cantidad = Number(producto.cantidad);
  const subtotal = precio * cantidad;
  const id = producto.id;

  // linea 31 imagen del producto
  // linea 37 nombre del producto
  // botón eliminar, linea 39 y 40
  // linea 39 tiene los elementos data-accion y data-id que se deben usar en cant-carrito.js para saber que boton se uso y sobre cual producto
  // linea 43 precio unitario del producto
  // lineas 47 y 48 boton de disminuir cantidad
  // linea 50 muestra la cantidad del productos que se han agregado al carrito
  // lineas 53 y 54 boton de aumentar cantidad
  // linea 57 subtotal

  return `
    <div class="col-12">
      <article class="card item-carrito shadow-sm" data-id="${id}">
        <div class="row g-0 align-items-center">

          <div class="col-4 col-md-3">
            <img src="${imagen}" alt="${nombre}" class="img-fluid rounded-start imagen-item-carrito">
          </div>

          <div class="col-8 col-md-9">
            <div class="card-body info-item-carrito">
              <div class="d-flex justify-content-between align-items-start gap-2">
                <h3 class="card-title h5 mb-1">${nombre}</h3>

                <button type="button" class="btn-close" data-accion="eliminar" data-id="${id}"
                  aria-label="Eliminar ${nombre} del carrito"></button>
              </div>

              <p class="card-text mb-2">${formatearPrecio(precio)} c/u</p>  

              <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div class="btn-group controles-cantidad" role="group" aria-label="Cantidad de ${nombre}">
                  <button type="button" class="btn btn-outline-secondary btn-sm" data-accion="disminuir"
                    data-id="${id}" aria-label="Disminuir cantidad">&minus;</button>

                  <span class="btn btn-light btn-sm disabled cantidad-item" aria-live="polite">${cantidad}</span>

                  <button
                    type="button" class="btn btn-outline-secondary btn-sm" data-accion="aumentar"
                    data-id="${id}" aria-label="Aumentar cantidad">+</button>
                </div>

                <p class="card-text fw-bold mb-0 subtotal-item">${formatearPrecio(subtotal)}</p>
              </div>
            </div>
          </div>

        </div>
      </article>
    </div>
  `;
}



// Renderizacion principal- Pinta todo el carrito

function renderizarCarrito(carrito = obtenerCarrito()) {  // usa lo guardado en el localStorage
  const lista = document.getElementById("lista-carrito");
  const vacio = document.getElementById("carrito-vacio");
  const total = document.getElementById("total-carrito");

  if (!lista || !vacio || !total) {
    console.error("Faltan elementos del carrito");
    return;
  }

  // Carrito vacío: mostrar mensaje y limpiar lo demás

  if (carrito.length === 0) {
    vacio.style.display = "";
    lista.innerHTML = "";
    total.textContent = formatearPrecio(0);
    return;
  }

  // Carrito con productos
  // linea 96: recorre el arreglo y convierte cada producto en su HTML
  // línea 94: inserte el HTML dentro de #lista-carrito

  vacio.style.display = "none";
  lista.innerHTML = `
    <div class="row g-4">
      ${carrito.map(crearTarjetaCarrito).join("")}  
    </div>
  `;
  total.textContent = formatearPrecio(calcularTotal());  // lo calcula del localStorage
}

// Primer dibujo al cargar la página
document.addEventListener("DOMContentLoaded", () => {  // se inicializa cuando el navegador termina de leer el HTML
  renderizarCarrito();
});