// PAPEL DE RELLENO KRAFT
// Crea papelitos (como el relleno de las cajas de regalo) que caen despacio detrás del contenido
// de una sección. Es solo decoración: no se les puede hacer clic y los lectores de pantalla los ignoran.
//
// Uso: inicializarPapelRelleno(contenedor)            -> 10 papelitos, cada uno tarda de 9 a 15 s en caer
//      inicializarPapelRelleno(contenedor, 14)        -> la cantidad que se quiera
//      inicializarPapelRelleno(contenedor, 36, 60)    -> además, velocidad en píxeles por segundo
// La velocidad sirve para contenedores altos: así caen igual de despacio sin importar cuánto mida la sección.
//
// Quién lo usa:
// - El inicio (kits destacados): components.js lo llama después de cargar el carrusel.
// - Cualquier otra página: basta con ponerle al elemento el atributo data-papel-relleno="cantidad"
//   y components.js se encarga del resto (ver cargarPapelRelleno en components.js).

const CANTIDAD_POR_DEFECTO = 10;
const CANTIDAD_DE_COLORES = 4;   // los colores están en papelRelleno.css (--color1 a --color4)
const SEGUNDOS_MINIMOS = 9;      // si no se pasa velocidad, cada caída dura entre 9 y 15 segundos
const SEGUNDOS_MAXIMOS = 15;
const CAMBIO_DE_ALTO_MINIMO = 0.1;  // con velocidad: si el alto cambia más de 10 %, se recalculan los tiempos

// Devuelve un número al azar entre minimo y maximo (con decimales).
function numeroAlAzar(minimo, maximo) {
  return minimo + Math.random() * (maximo - minimo);
}

// Le da a UN papelito cuánto tarda en caer y en qué punto del camino arranca.
// segundosMinimos y segundosMaximos: entre cuántos segundos puede tardar en cruzar el contenedor.
function ponerTiempos(papelito, segundosMinimos, segundosMaximos) {
  // Velocidad: cuántos segundos tarda en cruzar el contenedor (lento = sutil).
  papelito.style.animationDuration = `${numeroAlAzar(segundosMinimos, segundosMaximos)}s`;

  // Retraso NEGATIVO: así, al abrir la página, cada papelito ya va a mitad de camino
  // y no salen todos juntos desde arriba.
  papelito.style.animationDelay = `-${numeroAlAzar(0, segundosMaximos)}s`;
}

// Fabrica UN papelito con tamaño, color, posición y giro al azar (los tiempos los pone ponerTiempos).
// El azar es lo que hace que se vea natural: si todos cayeran igual, parecería una máquina.
function crearPapelito(numero) {
  const papelito = document.createElement("span");

  // Color: se van turnando los 4 colores de la paleta (1, 2, 3, 4, 1, 2...).
  const color = (numero % CANTIDAD_DE_COLORES) + 1;
  papelito.className = `papel-relleno__papelito papel-relleno__papelito--color${color}`;

  // Forma: la mitad son tiritas largas y la otra mitad cuadritos.
  if (Math.random() < 0.5) {
    papelito.classList.add("papel-relleno__papelito--tira");
  }

  // Desde dónde cae (de 2% a 96% del ancho, para que no queden pegados al borde).
  papelito.style.left = `${numeroAlAzar(2, 96)}%`;

  // Cuánto se corre de lado y cuánto gira mientras cae (el CSS lee estas variables).
  papelito.style.setProperty("--desvio", `${numeroAlAzar(-40, 40)}px`);
  papelito.style.setProperty("--giro", `${numeroAlAzar(-200, 200)}deg`);

  return papelito;
}

export function inicializarPapelRelleno(contenedor, cantidad = CANTIDAD_POR_DEFECTO, velocidad) {
  if (!contenedor) {
    console.error("No se encontró el contenedor para el papel de relleno.");
    return;
  }

  // Si la persona activó "reducir movimiento" en su equipo, no se crea nada.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  // Si ya tiene papelitos (por ejemplo, si se llama dos veces), no se duplican.
  if (contenedor.querySelector(".papel-relleno")) {
    return;
  }

  // Esta clase prepara el contenedor (ver papelRelleno.css) sin tocar el CSS de la sección.
  contenedor.classList.add("con-papel-relleno");

  // Capa decorativa que va DETRÁS del contenido.
  const capa = document.createElement("div");
  capa.className = "papel-relleno";
  capa.setAttribute("aria-hidden", "true");

  const papelitos = [];

  for (let numero = 0; numero < cantidad; numero++) {
    const papelito = crearPapelito(numero);
    papelitos.push(papelito);
    capa.appendChild(papelito);
  }

  // prepend = la pone de primera dentro del contenedor, antes del contenido.
  contenedor.prepend(capa);

  // Sin velocidad: cada caída dura de 9 a 15 segundos y listo.
  if (!velocidad) {
    papelitos.forEach((papelito) => ponerTiempos(papelito, SEGUNDOS_MINIMOS, SEGUNDOS_MAXIMOS));
    return;
  }

  // Con velocidad: cada caída dura alto del contenedor ÷ píxeles por segundo,
  // con un 25 % de azar para arriba y para abajo.
  let altoMedido = 0;

  function ajustarTiempos() {
    const alto = contenedor.offsetHeight;

    // Si el alto casi no cambió, no se toca nada (así los papelitos no dan saltos).
    if (altoMedido && Math.abs(alto - altoMedido) / altoMedido < CAMBIO_DE_ALTO_MINIMO) {
      return;
    }

    altoMedido = alto;
    const segundosPromedio = alto / velocidad;
    papelitos.forEach((papelito) => ponerTiempos(papelito, segundosPromedio * 0.75, segundosPromedio * 1.25));
  }

  ajustarTiempos();

  // Si el contenedor cambia de alto (por ejemplo, el catálogo pinta sus tarjetas después de cargar
  // o la persona gira el celular), se vuelven a calcular los tiempos.
  if ("ResizeObserver" in window) {
    new ResizeObserver(ajustarTiempos).observe(contenedor);
  }
}
