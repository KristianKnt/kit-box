// POP-UP DE BIENVENIDA DEL INICIO
// Abre el modal de Bootstrap con el video de kit-box cada vez que se carga el inicio.
// Lo llama components.js después de insertar bienvenida.html.
//
// Cómo funciona:
// - El video arranca solo y en silencio (los navegadores no dejan arrancar con sonido).
// - El botón "Activar sonido" prende y apaga el sonido.
// - Al cerrar (X, Esc, clic afuera o "Empezar"), el video se detiene y vuelve al inicio.
// - Si la persona activó "reducir movimiento", el video no arranca solo: se muestran los controles para que le dé play.
// - Si hay alguien con la sesión abierta, el título lo saluda por su nombre: "¡Bienvenido a Kit-Box, Dayana!"

const TEXTO_ACTIVAR_SONIDO = "Activar sonido";
const TEXTO_SILENCIAR = "Silenciar";

// Pone el botón de sonido de acuerdo a si el video está en silencio o no.
function actualizarBotonSonido(botonSonido, video) {
  botonSonido.textContent = video.muted ? TEXTO_ACTIVAR_SONIDO : TEXTO_SILENCIAR;
  botonSonido.setAttribute("aria-pressed", String(!video.muted));
}

// Si hay sesión abierta, pone el nombre de la persona en el título.
// obtenerSesion y obtenerPrimerNombre vienen de js/sesion.js (si la página no lo cargó, el título queda igual).
function saludarPorNombre(modal) {
  if (typeof obtenerSesion !== "function") return;

  const sesion = obtenerSesion();

  if (sesion === null) return;                      // sin sesión: queda "¡Bienvenido a Kit-Box!"

  const primerNombre = obtenerPrimerNombre(sesion.nombreCompleto);

  if (primerNombre === "") return;

  // textContent (no innerHTML) porque el nombre lo escribió el usuario
  modal.querySelector(".bienvenida__titulo").textContent = `¡Bienvenido a Kit-Box, ${primerNombre}!`;
}

// Intenta reproducir el video. Si el navegador no lo deja, muestra los controles
// para que la persona le dé play ella misma.
function reproducirVideo(video) {
  video.play().catch(() => {
    video.controls = true;
  });
}

export function inicializarBienvenida(contenedor) {
  const modal = contenedor.querySelector("#modal-bienvenida");

  if (!modal) {
    console.error("No se encontró el pop-up de bienvenida.");
    return;
  }

  // bootstrap existe porque index.html carga bootstrap.bundle.min.js antes de components.js.
  if (typeof bootstrap === "undefined") {
    console.error("Bootstrap no está cargado: no se puede abrir el pop-up de bienvenida.");
    return;
  }

  const video = modal.querySelector(".bienvenida__video");
  const botonSonido = modal.querySelector(".bienvenida__sonido");
  const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  saludarPorNombre(modal);

  // Se asegura de que arranque en silencio (el atributo muted del HTML a veces no basta).
  video.muted = true;

  if (reducirMovimiento) {
    video.controls = true;      // la persona decide si le da play
    botonSonido.hidden = true;  // los controles del video ya traen el sonido
  }

  // Botón de sonido: si está en silencio lo prende, y al revés.
  botonSonido.addEventListener("click", () => {
    video.muted = !video.muted;
    actualizarBotonSonido(botonSonido, video);

    if (video.paused) {
      reproducirVideo(video);
    }
  });

  // Cuando el pop-up ya se ve, arranca el video.
  modal.addEventListener("shown.bs.modal", () => {
    if (!reducirMovimiento) {
      reproducirVideo(video);
    }
  });

  // Cuando se cierra, el video para, vuelve al principio y queda otra vez en silencio.
  modal.addEventListener("hidden.bs.modal", () => {
    video.pause();
    video.currentTime = 0;
    video.muted = true;
    actualizarBotonSonido(botonSonido, video);
  });

  // Abre el pop-up.
  const ventana = new bootstrap.Modal(modal);
  ventana.show();
}
