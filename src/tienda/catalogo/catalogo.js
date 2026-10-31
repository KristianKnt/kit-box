
/* Función para obtener la ruta correcta de las imágenes */
function obtenerRutaImagen(ruta) {
    // Las rutas del JSON empiezan por src/assets/...
    // Reemplazamos "src/" por "../../" para llegar desde catalogo.html
    return ruta.replace(/^src\//, "../../");
}


/* Trae los productos: primero mira el localStorage (lo que guarda el admin)
   y si no hay nada, los pide al JSON. Devuelve la lista de productos. */
async function cargarProductos() {
    try {
        const guardados = localStorage.getItem("kitbox_productos");

        if (guardados !== null) {
            return JSON.parse(guardados);
        }

        const respuesta = await fetch("../../data/productos.json");
        if (!respuesta.ok) {
            throw new Error(`Error al cargar el JSON: ${respuesta.status}`);
        }
        return await respuesta.json();

    } catch (error) {
        console.error("Error al cargar los productos:", error);
        return []; // si falla, devolvemos una lista vacía para que la página no se rompa
    }
}


/* Pinta las tarjetas de la lista que le pasemos.
   La usa filtros-catalogos.js cada vez que cambia la búsqueda o la categoría. */
function pintarTarjetas(productos) {
    // 1. Obtener el contenedor del HTML
    const contenedor = document.getElementById("lista-productos");

    if (!contenedor) {
        console.error("No se encontró el contenedor lista-productos");
        return;
    }

    // 2. Limpiar el contenedor
    contenedor.replaceChildren();

    // 3. Recorrer todos los productos
    productos.forEach((producto) => {

        // Crear la columna de Bootstrap
        const columna = document.createElement("div");
        columna.className = "col-12 col-sm-6 col-lg-3";

        // Crear la tarjeta
        const tarjeta = document.createElement("div");
        tarjeta.className = "card h-100 shadow-sm";

        // Crear la imagen
        const imagen = document.createElement("img");

        imagen.alt = producto.nombre;
        imagen.className = "card-img-top py-2";
        imagen.style.height = "220px";
        imagen.style.objectFit = "contain";

        // Mostrar un aviso si no se encuentra la imagen
        imagen.addEventListener("error", () => {
            console.error(
                "No se pudo cargar la imagen:",
                imagen.src
            );

            imagen.alt = "Imagen no disponible";
            imagen.style.display = "none";
        }, { once: true });

        // Asignar la ruta de la imagen usando la función anterior
        imagen.src = obtenerRutaImagen(producto.imagen);

        // Crear el cuerpo de la tarjeta
        const cuerpo = document.createElement("div");
        cuerpo.className = "card-body";

        // Nombre
        const nombre = document.createElement("h3");
        nombre.className = "card-title h5";
        nombre.textContent = producto.nombre;

        // Descripción
        const descripcion = document.createElement("p");
        descripcion.className = "card-text";
        descripcion.textContent = producto.descripcion;

        // Precio
        const precio = document.createElement("p");
        precio.className = "fw-bold text-success";
        precio.textContent =
            `Precio: ${Number(producto.precio).toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0
            })}`;

        // Stock
        const stock = document.createElement("p");
        stock.textContent = `Stock: ${producto.stock} unidades`;

        // Categoría
        const categoria = document.createElement("p");
        categoria.textContent = `Categoría: ${producto.categoria}`;
        //----------------------------------------------------------------------------------------------//
        //agregar botones agregar eliminar carrito
        // 1. Crear contenedor de acciones (para ordenar los botones en fila o columna)
        const contenedorAcciones = document.createElement("div");
        contenedorAcciones.className = "mt-auto d-flex gap-2 pt-2";

        const btnAgregar = document.createElement("button");
        btnAgregar.className = "btn btn-sm w-100 btn-agregar-carrito";
        btnAgregar.textContent = "Añadir";

        btnAgregar.dataset.id = producto.id;
        btnAgregar.dataset.nombre = producto.nombre;
        btnAgregar.dataset.precio = producto.precio;
        btnAgregar.dataset.imagen = producto.imagen;


        btnAgregar.addEventListener("click", () => {
            agregarProducto(producto);
            actualizarContadorCarrito();
            console.log("Producto agregado al carrito:", producto.nombre);
            console.log("Carrito actualizado:", obtenerCarrito());
        });


        const btnEliminar = document.createElement("button");
        btnEliminar.className = "btn btn-sm w-100 btn-eliminar-carrito";
        btnEliminar.textContent = "Eliminar";

        btnEliminar.addEventListener("click", () => {
            console.log("Eliminando producto con ID:", producto.id);
            actualizarContadorCarrito();
        });

        contenedorAcciones.append(btnAgregar, btnEliminar);
        //fin de añadir botones catalogo
        //-------------------------------------------------------------------------------------------//
        // Agregar la información al cuerpo
        cuerpo.append(
            nombre,
            descripcion,
            precio,
            stock,
            categoria,
            contenedorAcciones
        );

        // Agregar imagen y cuerpo a la tarjeta
        tarjeta.append(imagen, cuerpo);

        // Agregar tarjeta a la columna
        columna.appendChild(tarjeta);

        // Mostrar la columna en el catálogo
        contenedor.appendChild(columna);
    });
}

// Nota: la página arranca desde filtros-catalogos.js (ahí está el DOMContentLoaded),
// porque primero carga los productos, arma las categorías y después pinta.
