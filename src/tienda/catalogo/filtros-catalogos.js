/* ===== FILTROS DEL CATÁLOGO kit-box =====
   Buscador + categorías + orden + "solo con stock".
   Usa cargarProductos() y pintarTarjetas() de catalogo.js,
   por eso en el HTML este archivo va DESPUÉS de catalogo.js. */

// Todos los productos tal como llegan (nunca se modifica)
let todosLosProductos = [];

// Lo que la persona eligió en este momento
const filtros = {
    texto: "",
    categoria: "todas",
    orden: "defecto",
    soloDisponibles: false
};


/* Quita tildes y mayúsculas para comparar sin problemas:
   "Carpintería" y "carpinteria" quedan iguales */
function normalizarTexto(texto) {
    return String(texto)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .trim();
}


/* ---------- CATEGORÍAS ---------- */

/* Crea un botón de categoría con su nombre y cuántos kits tiene */
function crearBotonCategoria(valor, texto, cantidad) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "catalogo-categoria";
    boton.dataset.categoria = valor;
    boton.setAttribute("aria-pressed", "false");

    const nombre = document.createElement("span");
    nombre.textContent = texto;

    const numero = document.createElement("span");
    numero.className = "catalogo-categoria-cantidad";
    numero.textContent = cantidad;

    boton.append(nombre, numero);
    return boton;
}

/* Arma la lista de categorías leyendo los productos.
   Si el admin crea una categoría nueva, aparece sola aquí. */
function pintarCategorias() {
    const contenedor = document.getElementById("lista-categorias");
    if (!contenedor) return;

    // Contamos cuántos productos hay por categoría
    const conteo = {};
    todosLosProductos.forEach((producto) => {
        conteo[producto.categoria] = (conteo[producto.categoria] || 0) + 1;
    });

    contenedor.replaceChildren();
    contenedor.appendChild(crearBotonCategoria("todas", "Todas", todosLosProductos.length));

    Object.keys(conteo)
        .sort((a, b) => a.localeCompare(b, "es"))
        .forEach((categoria) => {
            contenedor.appendChild(crearBotonCategoria(categoria, categoria, conteo[categoria]));
        });

    marcarCategoriaActiva();
}

/* Pinta de verde el botón de la categoría elegida */
function marcarCategoriaActiva() {
    document.querySelectorAll(".catalogo-categoria").forEach((boton) => {
        const activa = boton.dataset.categoria === filtros.categoria;
        boton.classList.toggle("activa", activa);
        boton.setAttribute("aria-pressed", String(activa));
    });
}


/* ---------- FILTRAR Y ORDENAR ---------- */

function obtenerProductosFiltrados() {
    const busqueda = normalizarTexto(filtros.texto);

    // 1. Filtrar
    const resultado = todosLosProductos.filter((producto) => {
        const coincideCategoria =
            filtros.categoria === "todas" || producto.categoria === filtros.categoria;

        // buscamos en nombre, descripción y categoría
        const textoProducto = normalizarTexto(
            `${producto.nombre} ${producto.descripcion} ${producto.categoria}`
        );
        const coincideTexto = busqueda === "" || textoProducto.includes(busqueda);

        const coincideStock = !filtros.soloDisponibles || Number(producto.stock) > 0;

        return coincideCategoria && coincideTexto && coincideStock;
    });

    // 2. Ordenar (sort cambia el arreglo, por eso trabajamos sobre "resultado", que es una copia)
    if (filtros.orden === "precio-menor") {
        resultado.sort((a, b) => Number(a.precio) - Number(b.precio));
    } else if (filtros.orden === "precio-mayor") {
        resultado.sort((a, b) => Number(b.precio) - Number(a.precio));
    } else if (filtros.orden === "nombre") {
        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    }

    return resultado;
}


/* ---------- MOSTRAR RESULTADOS ---------- */

function actualizarCatalogo() {
    const productos = obtenerProductosFiltrados();

    pintarTarjetas(productos); // función de catalogo.js

    // Texto "Mostrando X de Y kits"
    const resumen = document.getElementById("resumen-resultados");
    if (resumen) {
        let texto = `Mostrando ${productos.length} de ${todosLosProductos.length} kits`;
        if (filtros.categoria !== "todas") texto += ` en ${filtros.categoria}`;
        if (filtros.texto.trim() !== "") texto += ` para "${filtros.texto.trim()}"`;
        resumen.textContent = texto;
    }

    // Mensaje de "no encontramos nada"
    const sinResultados = document.getElementById("sin-resultados");
    if (sinResultados) sinResultados.hidden = productos.length > 0;

    // La "x" del buscador solo aparece si hay texto escrito
    const borrar = document.getElementById("borrar-busqueda");
    if (borrar) borrar.hidden = filtros.texto === "";

    // Numerito del botón Filtros: cuántas opciones extra están activas
    const contador = document.getElementById("contador-filtros");
    if (contador) {
        const activos = (filtros.orden !== "defecto" ? 1 : 0) + (filtros.soloDisponibles ? 1 : 0);
        contador.textContent = activos;
        contador.hidden = activos === 0;
    }

    marcarCategoriaActiva();
}

/* Deja todo como al principio */
function limpiarFiltros() {
    filtros.texto = "";
    filtros.categoria = "todas";
    filtros.orden = "defecto";
    filtros.soloDisponibles = false;

    document.getElementById("buscador-catalogo").value = "";
    document.getElementById("orden-defecto").checked = true;
    document.getElementById("solo-disponibles").checked = false;

    actualizarCatalogo();
}


/* ---------- EVENTOS ---------- */

function conectarEventos() {
    const buscador = document.getElementById("buscador-catalogo");

    // Busca mientras la persona escribe
    buscador.addEventListener("input", () => {
        filtros.texto = buscador.value;
        actualizarCatalogo();
    });

    // Con la tecla Escape se borra la búsqueda
    buscador.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            buscador.value = "";
            filtros.texto = "";
            actualizarCatalogo();
        }
    });

    // Botón "x" para borrar lo escrito
    document.getElementById("borrar-busqueda").addEventListener("click", () => {
        buscador.value = "";
        filtros.texto = "";
        actualizarCatalogo();
        buscador.focus();
    });

    // Clic en una categoría (un solo evento para todos los botones)
    document.getElementById("lista-categorias").addEventListener("click", (evento) => {
        const boton = evento.target.closest(".catalogo-categoria");
        if (!boton) return;
        filtros.categoria = boton.dataset.categoria;
        actualizarCatalogo();
    });

    // Opciones de "Ordenar por"
    document.querySelectorAll('input[name="orden"]').forEach((opcion) => {
        opcion.addEventListener("change", () => {
            filtros.orden = opcion.value;
            actualizarCatalogo();
        });
    });

    // Interruptor "Solo kits con stock"
    const soloDisponibles = document.getElementById("solo-disponibles");
    soloDisponibles.addEventListener("change", () => {
        filtros.soloDisponibles = soloDisponibles.checked;
        actualizarCatalogo();
    });

    // Botón del mensaje vacío
    document.getElementById("limpiar-filtros").addEventListener("click", limpiarFiltros);
}


/* ---------- ARRANQUE DE LA PÁGINA ---------- */

async function iniciarCatalogo() {
    todosLosProductos = await cargarProductos(); // función de catalogo.js
    pintarCategorias();
    conectarEventos();
    actualizarCatalogo();
}

document.addEventListener("DOMContentLoaded", iniciarCatalogo);
