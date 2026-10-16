export function inicializarCarrusel() {
  
  const carrusel = document.querySelector(
    ".kits-destacados__carrusel"
  );

  const pista = document.querySelector(
    ".kits-destacados__pista"
  );

  const anterior = document.querySelector(
    ".kits-destacados__flecha--anterior"
  );

  const siguiente = document.querySelector(
    ".kits-destacados__flecha--siguiente"
  );

  if (!carrusel || !pista || !anterior || !siguiente) {
    return;
  }

  let posicion = 0;

  function obtenerPaso() {
    const tarjeta = pista.querySelector(".kit-card");

    if (!tarjeta) return 0;

    const estilos = getComputedStyle(pista);
    const espacio = parseFloat(estilos.columnGap) || 0;

    return tarjeta.getBoundingClientRect().width + espacio;
  }

  function obtenerMaximo() {
    return Math.max(
      0,
      pista.children.length -
      Math.floor(
        carrusel.clientWidth / obtenerPaso()
      )
    );
  }

  function actualizarCarrusel() {
    const maximo = obtenerMaximo();

    posicion = Math.min(posicion, maximo);

    pista.style.transform =
      `translateX(-${posicion * obtenerPaso()}px)`;

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
}
