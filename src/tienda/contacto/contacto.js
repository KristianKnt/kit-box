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
const campoValidacionNombre = document.getElementById("error-dato-nombre")
const campoValidacionApellido = document.getElementById("error-dato-apellido")
const campoValidacionTelefono = document.getElementById("error-dato-telefono")
const campoValidacionCorreo = document.getElementById("error-dato-email")
const campoValidacionMensaje = document.getElementById("error-dato-mensaje")

/*escuchamos el evento blur que es cuando se sale del input y ejecutamos la funcion*/
entradaNombre.addEventListener("blur", (e) => {
    if(validarNombreYApellido(entradaNombre.value)===true) {
        campoValidacionNombre.classList.remove("text-danger");
        campoValidacionNombre.classList.add("text-success");
        campoValidacionNombre.textContent = "✓ Nombre válido";
    } else {
        campoValidacionNombre.classList.remove("text-success");
        campoValidacionNombre.classList.add("text-danger");
        campoValidacionNombre.textContent = "X Nombre inválido"
    }
        
});


entradaApellido.addEventListener("blur", (e) => {
    if (validarNombreYApellido(entradaApellido.value)===true) {
        campoValidacionApellido.classList.remove("text-danger");
        campoValidacionApellido.classList.add("text-success");
        campoValidacionApellido.textContent = "✓ Apellido válido";
    } else {
        campoValidacionApellido.classList.remove("text-success");
        campoValidacionApellido.classList.add("text-danger");
        campoValidacionApellido.textContent = "X Apellido inválido"
    }

})

entradaTelefono.addEventListener("blur", (e) => {
        if (validarTelefono(entradaTelefono.value)===true) {
        campoValidacionTelefono.classList.remove("text-danger");
        campoValidacionTelefono.classList.add("text-success");
        campoValidacionTelefono.textContent = "✓ Teléfono válido"
    } else {
        campoValidacionTelefono.classList.remove("text-success");
        campoValidacionTelefono.classList.add("text-danger");
        campoValidacionTelefono.textContent = "X Teléfono inválido (10 dígitos)"
    }

})

entradaEmail.addEventListener("blur", (e) => {
    if (validarCorreo(entradaEmail.value)===true) {
        campoValidacionCorreo.classList.remove("text-danger");
        campoValidacionCorreo.classList.add("text-success");
        campoValidacionCorreo.textContent = "✓ Correo válido"
    } else {
        campoValidacionCorreo.classList.remove("text-success");
        campoValidacionCorreo.classList.add("text-danger");
        campoValidacionCorreo.textContent = "X Correo inválido (Ej: alguien@dominio.com)"
    }
})

entradaMensaje.addEventListener("blur", (e) => {
    if (validarComentario(entradaMensaje.value)===true) {
        campoValidacionMensaje.classList.remove("text-danger");
        campoValidacionMensaje.classList.add("text-success");
        campoValidacionMensaje.textContent = "✓ Mensaje válido"
    } else {
        if(entradaMensaje.value.length < minComentario){
            campoValidacionMensaje.classList.remove("text-success");
            campoValidacionMensaje.classList.add("text-danger");
            campoValidacionMensaje.textContent = "X Mensaje demasiado corto. (min 30 caracteres)"

        }
        else {
            campoValidacionMensaje.classList.remove("text-success");
            campoValidacionMensaje.classList.add("text-danger");
            campoValidacionMensaje.textContent = "X Mensaje demasiado largo. (max 3000 caracteres)"

        }
    }
})


