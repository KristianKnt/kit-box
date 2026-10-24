
/* Función para obtener la ruta correcta de las imágenes */
function obtenerRutaImagen(ruta) {
    // Las rutas del JSON empiezan por src/assets/...
    // Reemplazamos "src/" por "../../" para llegar desde catalogo.html
    return ruta.replace(/^src\//, "../../");
}


async function pintarTarjetas() {
    try {
        // 1. Obtener los productos del archivo JSON
        const respuesta = await fetch("../../data/productos.json");

        // Comprobar si el archivo se cargó correctamente
        if (!respuesta.ok) {
            throw new Error(`Error al cargar el JSON: ${respuesta.status}`);
        }

        // 2. Convertir la respuesta a datos JavaScript
        const productos = await respuesta.json();

        // 3. Obtener el contenedor del HTML
        const contenedor = document.getElementById("lista-productos");

        if (!contenedor) {
            throw new Error("No se encontró el contenedor lista-productos");
        }

        // 4. Limpiar el contenedor
        contenedor.replaceChildren();

        // 5. Recorrer todos los productos
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

            // Agregar la información al cuerpo
            cuerpo.append(
                nombre,
                descripcion,
                precio,
                stock,
                categoria
            );

            // Agregar imagen y cuerpo a la tarjeta
            tarjeta.append(imagen, cuerpo);

            // Agregar tarjeta a la columna
            columna.appendChild(tarjeta);

            // Mostrar la columna en el catálogo
            contenedor.appendChild(columna);
        });

        console.log("Productos cargados correctamente:", productos);

    } catch (error) {
        console.error("Error al mostrar los productos:", error);
    }
}


// Ejecutar la función cuando el HTML esté completamente cargado
document.addEventListener("DOMContentLoaded", pintarTarjetas);
