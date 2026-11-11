// Arranca el carrusel del banner del inicio.
// Hace falta porque el banner llega con fetch (components.js) DESPUÉS de que la página cargó,
// y Bootstrap solo arranca solos (data-bs-ride) los carruseles que ya estaban en la página.
export function inicializarBanner(contenedor) {
  const carrusel = contenedor.querySelector(".carousel");

  if (!carrusel) {
    console.error("No se encontró el carrusel del banner.");
    return;
  }

  function arrancar() {
    bootstrap.Carousel.getOrCreateInstance(carrusel, {
      interval: 5000,     // cambia de foto cada 5 segundos
      ride: "carousel",   // empieza a moverse solo de una vez
      pause: "hover"      // se pausa con el mouse encima
    });
  }

  // Si el JS de Bootstrap todavía no ha cargado, esperar a que cargue la página.
  if (window.bootstrap) {
    arrancar();
  } else {
    window.addEventListener("load", arrancar, { once: true });
  }
}
