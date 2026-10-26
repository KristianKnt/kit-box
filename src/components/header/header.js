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