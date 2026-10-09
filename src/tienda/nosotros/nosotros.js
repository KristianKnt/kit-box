/*funcion con evento scroll*/

/*definimos variable */

const tarjetaNosotros = document.querySelector('.nuestro-equipo-contenedor-tarjetas');

window.addEventListener('scroll', (e) =>{ /*Escuchador de evento scroll */
    const topPosicionTarjeta = tarjetaNosotros.getBoundingClientRect().top; /*devuelve numero en pixeles */
    const topPosicionWindow = window.innerHeight; /**devuelve numero en pixeles */

    if (topPosicionTarjeta<topPosicionWindow){
        tarjetaNosotros.classList.add('visible');
    }else{
        tarjetaNosotros.classList.remove('visible');
    }
});