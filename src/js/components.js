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
    // Y MOSTRAR AL USUARIO SI TIENE LA SESIÓN ABIERTA

    if(id === "header") {
      const modulo = await import("../components/header/header.js");
      modulo.marcarEnlaceActivo(contenedor);
      modulo.mostrarUsuarioEnHeader(contenedor);
    }

    // Inicializar el carrusel después de insertar su HTML.
    if (id === "kits-destacados") {
      const modulo = await import(
        "../components/home-pages/carrusel/carrusel.js"
      );

      await modulo.inicializarCarrusel(contenedor);

      // Papel de relleno kraft cayendo detrás de los kits destacados (decoración del inicio).
      const papelRelleno = await import(
        "../components/home-pages/papel-relleno/papelRelleno.js"
      );

      papelRelleno.inicializarPapelRelleno(contenedor, 14);
    }

    // ARRANCAR EL BANNER DEL INICIO DESPUÉS DE INSERTAR SU HTML

    if (id === "banner_home_page") {
      const modulo = await import(
        "../components/home-pages/Banner_home/bannerHome.js"
      );

      modulo.inicializarBanner(contenedor);
    }

    // ABRIR EL POP-UP DE BIENVENIDA DEL INICIO DESPUÉS DE INSERTAR SU HTML

    if (id === "bienvenida") {
      const modulo = await import(
        "../components/home-pages/bienvenida/bienvenida.js"
      );

      modulo.inicializarBienvenida(contenedor);
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
cargar("bienvenida", "../components/home-pages/bienvenida/bienvenida.html");

// PAPEL DE RELLENO EN CUALQUIER PÁGINA
// Busca los elementos que tengan data-papel-relleno="cantidad" y les pone papelitos cayendo detrás.
// Ejemplo en el HTML: <main data-papel-relleno="20">
// Opcional: data-papel-velocidad="60" (píxeles por segundo). Si no se pone, usa 60.
// (El inicio no lo usa: ahí se llama después de cargar el carrusel, más arriba.)

const VELOCIDAD_PAPEL_RELLENO = 60;

async function cargarPapelRelleno() {
  const contenedores = document.querySelectorAll("[data-papel-relleno]");

  if (contenedores.length === 0) return;           // Esta página no lleva papelitos

  // Agrega el CSS del papel de relleno a la página (si no lo tiene ya)
  const rutaCss = new URL("../components/home-pages/papel-relleno/papelRelleno.css", direccionDeEsteArchivo);
  const yaTieneCss = [...document.querySelectorAll("link[rel='stylesheet']")]
    .some(link => link.href === rutaCss.href);

  if (!yaTieneCss) {
    const enlaceCss = document.createElement("link");
    enlaceCss.rel = "stylesheet";
    enlaceCss.href = rutaCss.href;
    document.head.appendChild(enlaceCss);
  }

  try {
    const rutaJs = new URL("../components/home-pages/papel-relleno/papelRelleno.js", direccionDeEsteArchivo);
    const papelRelleno = await import(rutaJs.href);

    contenedores.forEach(contenedor => {
      const cantidad = Number(contenedor.dataset.papelRelleno);
      const velocidad = Number(contenedor.dataset.papelVelocidad) || VELOCIDAD_PAPEL_RELLENO;

      papelRelleno.inicializarPapelRelleno(contenedor, cantidad, velocidad);
    });
  } catch (error) {
    console.error("No se pudo cargar el papel de relleno:", error);
  }
}

cargarPapelRelleno();
