// Dirección de este archivo (components.js). Va arriba, antes de todo
const direccionDeEsteArchivo = document.currentScript.src;

async function cargar(id, archivo) {
  const contenedor = document.getElementById(id);

  if (!contenedor) return;

  const direccion = new URL(archivo, direccionDeEsteArchivo);

  try {
    const respuesta = await fetch(direccion);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const html = await respuesta.text();

    contenedor.innerHTML = html;

    // Resolver las rutas relativas de imágenes y enlaces.
    const elementos = contenedor.querySelectorAll("[src], [href]");

    elementos.forEach(elemento => {
      const atributo = elemento.hasAttribute("src")
        ? "src"
        : "href";

      const ruta = elemento.getAttribute(atributo);

      if (ruta && ruta.startsWith(".")) {
        elemento.setAttribute(
          atributo,
          new URL(ruta, direccion).href
        );
      }
    });

    // Inicializar el carrusel después de insertar su HTML.
    if (id === "kits-destacados") {
      const modulo = await import(
        "../components/home-pages/carrusel/carrusel.js"
      );

      await modulo.inicializarCarrusel(contenedor);
    }

  } catch (error) {
    console.error(`No se pudo cargar el componente "${id}":`, error);
  }
}

cargar("header", "../components/header/header.html");
cargar("footer", "../components/footer/footer.html");
cargar("kits-destacados", "../components/home-pages/carrusel/carrusel.html");
cargar("funcionamiento", "../components/home-pages/funcionamiento/funcionamiento.html");
cargar("banner_home_page", "../components/home-pages/Banner_home/bannerHome.html");
