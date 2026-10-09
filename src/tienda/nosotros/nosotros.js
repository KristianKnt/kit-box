/*funcion con evento scroll*/

/*definimos variable */

const tarjetaNosotros = document.querySelectorAll('nuestro-equipo-contenedor-tarjetas');

window.addEventListener('scroll', (e) =>{ /*Escuchador de evento scroll */
    const topPosicionTarjeta = tarjetaNosotros.getBouningClientReact().top; /*devuelve numero en pixeles */
    const topPosicionWindow = window.innerHeight; /**devuelve numero en pixeles */

    if (topPosicionTarjeta<topPosicionWindow){
        contenedor.classList.add('visible');
    }else{
        contenedor.classList.remove('visible');
    }
});