const base = document.currentScript.src;

async function cargar(id, archivo) {
    const contenedor = document.getElementById(id);
    if (!contenedor) return;

    const url = new URL(archivo, base);
    const respuesta = await fetch(url);
    contenedor.innerHTML = await respuesta.text();

    contenedor.querySelectorAll("[src], [href]").forEach((el) => {
        const atributo = el.hasAttribute("src") ? "src" : "href";
        const valor = el.getAttribute(atributo);

        if (valor.startsWith(".")) {
            el.setAttribute(atributo, new URL(valor, url).href);
        }
    });
}

cargar("header", "../components/header/header.html");
cargar("footer", "../components/footer/footer.html");