import { inicializarCarrusel } from "../components/home-pages/carrusel/carrusel.js";

async function cargarComponente(id, ruta) {
    const elemento = document.getElementById(id);

    if (!elemento) return false;

    try {
        const response = await fetch(ruta);

        if (!response.ok) {
            throw new Error(`No se pudo cargar ${ruta}`);
        }

        elemento.innerHTML = await response.text();

        return true;
    } catch (error) {
        console.error(error);
    }
}

async function inicializarComponentes() {
    await cargarComponente(
        "header",
        "/src/components/header/header.html"
    );

    await cargarComponente(
        "footer",
        "/src/components/footer/footer.html"
    );

    await cargarComponente(
        "funcionamiento",
        "/src/components/home-pages/funcionamiento/funcionamiento.html"
    );

    /*se agrega un if*/
    const carruselCargado = await cargarComponente(
            "kits-destacados",
            "/src/components/home-pages/carrusel/carrusel.html"
        );

    if (carruselCargado) {
        inicializarCarrusel();
    }
}

inicializarComponentes();
