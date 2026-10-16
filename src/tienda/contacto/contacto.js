/**reglas*/
const reglaCorreo = /^[^\s@]+\@[^\s@]+\.[^\s@]+$/; /*regex \s espacio \@ apra el @ y \. para punto*/
const reglaTelefono = /^\d{10}$/; /*regex para digitos con inicio y fin */
const reglaNomApe = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/; /*regex para aceptar mayus minus tildes ñ y ü */
const minComentario = 30;
const maxComentario = 3000;

/*funcion de validar nombre y apellido*/
function validarNombreYApellido (parameter) {
    const parametroSinEspacios = parameter.trim();
    if (reglaNomApe.test(parametroSinEspacios) === true) { /*se combina con test para que devuelva un true o false */
        return true; 
    } else {
        return false;
    }
}


/**funcion de validar correo */
function validarCorreo (correo) {
    const correoSinEspacios = correo.trim();
    if(reglaCorreo.test(correoSinEspacios)===true) {
        return true;
    }else {
        return false;
    }
}

/*funcion de validar telefono */
function validarTelefono (telefono) {
    const telSinEspacios = telefono.trim();
    if (reglaTelefono.test(telSinEspacios) === true) {
        return true;
    }else {
        return false;
    }
}

/**funcion de validar comentario */
function validarComentario (comentario) {
   const numCaracteres = comentario.trim().length; /**quitamos espacios y nos devuelve numero de caracteres sin espacio*/
    if(numCaracteres < minComentario ){
        return false; /*El Mensaje es demasiado corto*/
    }
    else if (numCaracteres > maxComentario){
        return false;
    } else {
        return true;
    }
};

/**traer elementos del DOM*/
const entradaNombre = document.getElementById("dato-nombre");
const entradaApellido = document.getElementById("dato-apellido");
const entradaTelefono = document.getElementById("dato-telefono");
const entradaEmail = document.getElementById("dato-email");
const entradaMensaje = document.getElementById("dato-mensaje")

/*escuchamos el evento input y ejecutamos la funcion*/
entradaNombre.addEventListener("input", (e) => {
    console.log(validarNombreYApellido(entradaNombre.value));
        
});


entradaApellido.addEventListener("input", (e) => {
    console.log(validarNombreYApellido(entradaApellido.value));

})

entradaTelefono.addEventListener("input", (e) => {
    console.log(validarTelefono(entradaTelefono.value));
})

entradaEmail.addEventListener("input", (e) => {
    console.log(validarCorreo(entradaEmail.value));
})

entradaMensaje.addEventListener("input", (e) => {
    console.log(validarComentario(entradaMensaje.value));
})


