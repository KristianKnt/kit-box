// FUNCIÓN PARA INSERTAR DIVS HTML DE UN ARCHIVO TEMPORAL/PROVISIONAL AL ARCHIVO HTML FINAL

// Dirección de este archivo (components.js). Va arriba, antes de todo

const direccionDeEsteArchivo = document.currentScript.src;

async function cargar(id, archivo) {
  const contenedor = document.getElementById(id);  // Busca el div de destino

  if (!contenedor) return;                         // Busca el div de destino   

  const direccion = new URL(archivo, direccionDeEsteArchivo);  // Construye la ruta completa del archivo

  try {
    const respuesta = await fetch(direccion);      // Descarga el HTML y lo inserta

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const html = await respuesta.text();           // Descarga el HTML y lo inserta

    contenedor.innerHTML = html;                   // Descarga el HTML y lo inserta 

    // RESOLVER LAS RUTAS RELATIVAS DE LAS IMÁGENES Y ENLACES

    const elementos = contenedor.querySelectorAll("[src], [href]");   // Corrige las rutas de las imágenes

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

    // MARCAR/SUBRAYAR EL ENLACE EN LA PÁGINA ACTUAL DEL HEADER

    if(id === "header") {
      const modulo = await import("../components/header/header.js");
      modulo.marcarEnlaceActivo(contenedor);
    }

    // Inicializar el carrusel después de insertar su HTML.
    if (id === "kits-destacados") {
      const modulo = await import(
        "../components/home-pages/carrusel/carrusel.js"
      );

      await modulo.inicializarCarrusel(contenedor);
    }

    // ARRANCAR EL BANNER DEL INICIO DESPUÉS DE INSERTAR SU HTML

    if (id === "banner_home_page") {
      const modulo = await import(
        "../components/home-pages/Banner_home/bannerHome.js"
      );

      modulo.inicializarBanner(contenedor);
    }

  } catch (error) {
    console.error(`No se pudo cargar el componente "${id}":`, error);
  }
}

// LLAMAR: LE PASA LOS DATOS A LA FUNCIÓN CARGAR

cargar("header", "../components/header/header.html");
cargar("footer", "../components/footer/footer.html");
cargar("kits-destacados", "../components/home-pages/carrusel/carrusel.html");
cargar("funcionamiento", "../components/home-pages/funcionamiento/funcionamiento.html");  // Hace la llamada a la funcion asincrona "cargar"
cargar("banner_home_page", "../components/home-pages/Banner_home/bannerHome.html");
