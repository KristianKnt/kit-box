// Dirección de este archivo (components.js). Va arriba, antes de todo
const direccionDeEsteArchivo = document.currentScript.src;

async function cargar(id, archivo) {
    // 1. Buscar el div donde va el componente
    const contenedor = document.getElementById(id);
    if (!contenedor) return; // si la página no tiene ese div, no hace nada

    // 2. Calcular la dirección del archivo (header.html o footer.html)
    const direccion = new URL(archivo, direccionDeEsteArchivo);

    // 3. Pedir el archivo y sacar su texto
    const respuesta = await fetch(direccion);
    const html = await respuesta.text();

    // 4. Meter el texto dentro del div
    contenedor.innerHTML = html;

    // 5. Arreglar las rutas de imágenes y enlaces
    const elementos = contenedor.querySelectorAll("[src], [href]");

    elementos.forEach((elemento) => {
        let atributo = "href";
        if (elemento.hasAttribute("src")) {
            atributo = "src";
        }

        const ruta = elemento.getAttribute(atributo);

        // Solo se arreglan las rutas que empiezan con punto (../../assets/...)
        if (ruta.startsWith(".")) {
            elemento.setAttribute(atributo, new URL(ruta, direccion).href);
        }
    });
}

cargar("header", "../components/header/header.html");
cargar("footer", "../components/footer/footer.html");
cargar("kits-destacados", "../components/home-pages/carrusel/carrusel.html");
cargar("funcionamiento", "../components/home-pages/funcionamiento/funcionamiento.html");
cargar("banner_home_page", "../components/home-pages/Banner_home/bannerHome.html");
