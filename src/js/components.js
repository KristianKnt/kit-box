async function cargarComponente(id, ruta) {
    const elemento = document.getElementById(id);

    if (!elemento) return;

    try {
        const response = await fetch(ruta);

        if (!response.ok) {
            throw new Error(`No se pudo cargar ${ruta}`);
        }

        elemento.innerHTML = await response.text();

    } catch (error) {
        console.error(error);
    }
}

cargarComponente(
    "header",
    "/src/components/header/header.html"
);

cargarComponente(
    "footer",
    "/src/components/footer/footer.html"
);