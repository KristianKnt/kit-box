
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

      const tarjetasVisibles = Math.floor(
        (carrusel.clientWidth + 1) / paso
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
      }
    });

    anterior.addEventListener("click", () => {
      if (posicion > 0) {
        posicion--;
        actualizarCarrusel();
      }
    });

    window.addEventListener("resize", actualizarCarrusel);

    actualizarCarrusel();

  } catch (error) {
    console.error("No fue posible cargar el carrusel:", error);
    pista.textContent = "No se pudieron cargar los productos.";
    anterior.disabled = true;
    siguiente.disabled = true;
  }
}
