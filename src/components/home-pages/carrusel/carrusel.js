
export async function inicializarCarrusel(contenedor) {
  const carrusel = contenedor.querySelector(
    ".kits-destacados__carrusel"
  );

  const pista = contenedor.querySelector(
    ".kits-destacados__pista"
  );

  const anterior = contenedor.querySelector(
    ".kits-destacados__flecha--anterior"
  );

  const siguiente = contenedor.querySelector(
    ".kits-destacados__flecha--siguiente"
  );

  if (!carrusel || !pista || !anterior || !siguiente) {
    console.error("No se encontraron los elementos del carrusel.");
    return;
  }

  try {
    // 1. Obtener todos los productos del archivo JSON.
    const rutaJSON = new URL(
      "../../../data/productos.json",
      import.meta.url
    );

    const respuesta = await fetch(rutaJSON);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const productos = await respuesta.json();

    // 2. Conservar solamente los productos destacados.
    const productosDestacados = productos.filter(
      producto => producto.destacado === true
    );

    // 3. Si no hay productos destacados, informar al usuario.
    if (productosDestacados.length === 0) {
      pista.textContent = "No hay productos destacados disponibles.";
      anterior.disabled = true;
      siguiente.disabled = true;
      return;
    }

    // 4. Crear las tarjetas dinámicamente.
    pista.innerHTML = productosDestacados.map(producto => `
      <article class="kit-card">
        <div class="kit-card__imagen">
          <img
          src="${new URL(`../../../${producto.imagen.replace(/^src\//, "")}`, import.meta.url).href}"
          alt="${producto.nombre}"
          loading="lazy">
          <span class="kit-card__etiqueta">
            Destacado
          </span>
        </div>

        <div class="kit-card__contenido">
          <h3 class="kit-card__titulo">
            ${producto.nombre}
          </h3>

          <p class="kit-card__descripcion">
            ${producto.descripcion}
          </p>

          <div class="kit-card__pie">
            <p class="kit-card__precio">
              ${producto.precio.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    })}
            </p>

            <a
              href="#"
              class="kit-card__enlace"
              data-producto-id="${producto.id}"
            >
              Ver más
            </a>
          </div>
        </div>
      </article>
    `).join("");

    // 5. Configurar el movimiento del carrusel.
    let posicion = 0;

    function obtenerPaso() {
      const tarjeta = pista.querySelector(".kit-card");

      if (!tarjeta) return 0;

      const estilos = getComputedStyle(pista);
      const espacio = parseFloat(estilos.columnGap) || 0;

      return tarjeta.getBoundingClientRect().width + espacio;
    }

    function obtenerMaximo() {
      const paso = obtenerPaso();

      if (!paso) return 0;

      // Se suma un espacio porque la última tarjeta visible no lleva espacio a su derecha.
      // Sin esto, con 3 tarjetas visibles contaba solo 2 y al final quedaba un hueco vacío.
      const espacio = parseFloat(getComputedStyle(pista).columnGap) || 0;

      const tarjetasVisibles = Math.floor(
        (carrusel.clientWidth + espacio + 1) / paso
      );

      return Math.max(
        0,
        pista.children.length - tarjetasVisibles
      );
    }

    function actualizarCarrusel() {
      const paso = obtenerPaso();
      const maximo = obtenerMaximo();

      posicion = Math.min(posicion, maximo);

      pista.style.transform =
        `translateX(-${posicion * paso}px)`;

      anterior.disabled = posicion === 0;
      siguiente.disabled = posicion >= maximo;
    }

    siguiente.addEventListener("click", () => {
      if (posicion < obtenerMaximo()) {
        posicion++;
        actualizarCarrusel();
        reiniciarAutomatico();
      }
    });

    anterior.addEventListener("click", () => {
      if (posicion > 0) {
        posicion--;
        actualizarCarrusel();
        reiniciarAutomatico();
      }
    });

    window.addEventListener("resize", actualizarCarrusel);

    actualizarCarrusel();

    // 6. Movimiento automático (accesible).
    //    Avanza solo cada INTERVALO milisegundos y, al llegar al final, vuelve al primero.
    //    Se pausa con el mouse encima, con el teclado dentro del carrusel o con la pestaña oculta,
    //    y NO se mueve solo si la persona activó "reducir movimiento" en su equipo.
    const INTERVALO = 4000;
    const seccion = contenedor.querySelector(".kits-destacados") || contenedor;
    const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");

    let temporizador = null;
    let mouseEncima = false;
    let tecladoDentro = false;

    function avanzarAutomatico() {
      // Si ya está en el último, vuelve al primero.
      posicion = posicion >= obtenerMaximo() ? 0 : posicion + 1;
      actualizarCarrusel();
    }

    function puedeMoverseSolo() {
      return !reducirMovimiento.matches
        && !mouseEncima
        && !tecladoDentro
        && !document.hidden
        && obtenerMaximo() > 0;
    }

    function detenerAutomatico() {
      clearInterval(temporizador);
      temporizador = null;
    }

    // Arranca de cero el conteo (si se puede mover solo).
    function reiniciarAutomatico() {
      detenerAutomatico();

      if (puedeMoverseSolo()) {
        temporizador = setInterval(avanzarAutomatico, INTERVALO);
      }
    }

    // Pausar con el mouse encima.
    seccion.addEventListener("mouseenter", () => {
      mouseEncima = true;
      detenerAutomatico();
    });

    seccion.addEventListener("mouseleave", () => {
      mouseEncima = false;
      reiniciarAutomatico();
    });

    // Pausar mientras se navega con el teclado dentro del carrusel.
    seccion.addEventListener("focusin", () => {
      tecladoDentro = true;
      detenerAutomatico();
    });

    seccion.addEventListener("focusout", (evento) => {
      // Solo reanudar si el foco salió del carrusel (no si pasó de una flecha a otra).
      if (!seccion.contains(evento.relatedTarget)) {
        tecladoDentro = false;
        reiniciarAutomatico();
      }
    });

    // Pausar si la pestaña no se está viendo.
    document.addEventListener("visibilitychange", reiniciarAutomatico);

    // Si la persona cambia la opción de "reducir movimiento", respetarla al momento.
    reducirMovimiento.addEventListener("change", reiniciarAutomatico);

    reiniciarAutomatico();

  } catch (error) {
    console.error("No fue posible cargar el carrusel:", error);
    pista.textContent = "No se pudieron cargar los productos.";
    anterior.disabled = true;
    siguiente.disabled = true;
  }
}
