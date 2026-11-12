 export function marcarEnlaceActivo(contenedor){

    const nombre = ruta => ruta.split('/').pop().replace(/\.html$/, '') || 'index';
    const paginaActual = nombre(window.location.pathname);

    document.querySelectorAll('.menu-navegacion a').forEach(enlace => {
        const paginaEnlace = nombre(new URL (enlace.href).pathname);
        if (paginaEnlace === paginaActual) {
            enlace.setAttribute('aria-current', 'page');
        }
    });
}


// ===================================================================================
// USUARIO CON SESIÓN EN EL HEADER
// ===================================================================================
// Si hay alguien con la sesión abierta, cambia "Iniciar Sesión" por un botón con sus
// iniciales y "Hola, Nombre". Al hacerle clic se abre un menú para cerrar sesión.
// Las funciones obtenerSesion, cerrarSesion y tomarSaludoPendiente vienen de js/sesion.js.

const SEGUNDOS_SALUDO = 5;   // cuánto dura en pantalla el saludo después de iniciar sesión

// "Dayana Marcela Vallejo" -> { primerNombre: "Dayana", iniciales: "DM" }
function sacarNombreEIniciales(nombreCompleto) {
  const palabras = (nombreCompleto || "").trim().split(/\s+/).filter(Boolean);

  if (palabras.length === 0) {
    return { primerNombre: "", iniciales: "?" };
  }

  const primeraLetra = palabras[0][0];
  const segundaLetra = palabras.length > 1 ? palabras[1][0] : "";

  return {
    primerNombre: obtenerPrimerNombre(nombreCompleto),   // viene de js/sesion.js
    iniciales: (primeraLetra + segundaLetra).toUpperCase()
  };
}

// Muestra el saludo "¡Qué bueno verte, Dayana!" y lo quita solo después de unos segundos.
function mostrarSaludo(primerNombre) {
  const saludo = document.createElement("div");
  saludo.className = "saludo-sesion";
  saludo.setAttribute("role", "status");

  // textContent (no innerHTML) porque el nombre lo escribió el usuario
  const titulo = document.createElement("strong");
  titulo.textContent = `¡Qué bueno verte, ${primerNombre}!`;
  saludo.append(titulo, " Ya iniciaste sesión.");

  document.body.appendChild(saludo);

  setTimeout(() => {
    saludo.classList.add("saludo-sesion--saliendo");
    setTimeout(() => saludo.remove(), 400);   // espera a que termine de desvanecerse
  }, SEGUNDOS_SALUDO * 1000);
}

export function mostrarUsuarioEnHeader(contenedor) {
  // Si la página no cargó js/sesion.js, el header se queda como siempre
  if (typeof obtenerSesion !== "function") {
    console.error("Falta cargar js/sesion.js antes de components.js.");
    return;
  }

  const sesion = obtenerSesion();

  if (sesion === null) return;                    // nadie ha iniciado sesión: se deja "Iniciar Sesión"

  const botonIniciarSesion = contenedor.querySelector(".btn-iniciar-sesion");
  const bloqueUsuario = contenedor.querySelector(".usuario-sesion");
  const botonUsuario = bloqueUsuario.querySelector(".usuario-boton");
  const menu = bloqueUsuario.querySelector(".usuario-menu");
  const botonSalir = bloqueUsuario.querySelector(".usuario-menu-salir");

  const { primerNombre, iniciales } = sacarNombreEIniciales(sesion.nombreCompleto);

  // 1. Llenar los datos (con textContent, porque los escribió el usuario)
  bloqueUsuario.querySelector(".usuario-iniciales").textContent = iniciales;
  bloqueUsuario.querySelector(".usuario-saludo").textContent = primerNombre ? `Hola, ${primerNombre}` : "Mi cuenta";
  bloqueUsuario.querySelector(".usuario-menu-nombre").textContent = sesion.nombreCompleto;
  bloqueUsuario.querySelector(".usuario-menu-correo").textContent = sesion.correo;
  botonUsuario.setAttribute("aria-label", `Cuenta de ${sesion.nombreCompleto}`);

  // 2. Cambiar "Iniciar Sesión" por el botón del usuario
  botonIniciarSesion.hidden = true;
  bloqueUsuario.hidden = false;

  // 3. Abrir y cerrar el menú
  function abrirMenu() {
    document.querySelector(".saludo-sesion")?.remove();   // si el saludo sigue en pantalla, se quita para no tapar el menú
    menu.hidden = false;
    botonUsuario.setAttribute("aria-expanded", "true");
  }

  function cerrarMenu() {
    menu.hidden = true;
    botonUsuario.setAttribute("aria-expanded", "false");
  }

  botonUsuario.addEventListener("click", () => {
    if (menu.hidden) {
      abrirMenu();
    } else {
      cerrarMenu();
    }
  });

  // Clic afuera del bloque del usuario: se cierra
  document.addEventListener("click", (evento) => {
    if (!bloqueUsuario.contains(evento.target)) {
      cerrarMenu();
    }
  });

  // Tecla Esc: se cierra y el foco vuelve al botón
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !menu.hidden) {
      cerrarMenu();
      botonUsuario.focus();
    }
  });

  // 4. Cerrar sesión: se borra la sesión y vuelve el botón "Iniciar Sesión"
  botonSalir.addEventListener("click", () => {
    cerrarSesion();
    cerrarMenu();
    bloqueUsuario.hidden = true;
    botonIniciarSesion.hidden = false;
    botonIniciarSesion.focus();
  });

  // 5. Saludo de bienvenida: solo una vez, justo después de iniciar sesión.
  //    En el inicio sale el pop-up del video primero; el saludo aparece cuando se cierra.
  if (tomarSaludoPendiente()) {
    const hayPopupDeBienvenida = document.getElementById("bienvenida") !== null && typeof bootstrap !== "undefined";

    if (hayPopupDeBienvenida) {
      document.addEventListener("hidden.bs.modal", () => mostrarSaludo(primerNombre), { once: true });
    } else {
      mostrarSaludo(primerNombre);
    }
  }
}
