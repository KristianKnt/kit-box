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

function mostrarResultado (campo,esValido,textoValido,textoError) {
    if(esValido===true) {
        campo.classList.remove("text-danger");
        campo.classList.add("text-success");
        campo.textContent = textoValido;
    } else {
        campo.classList.remove("text-success");
        campo.classList.add("text-danger");
        campo.textContent = textoError;
    }
}

function revisarNombre (){
    const nombreEsValido = validarNombreYApellido(entradaNombre.value);
    mostrarResultado(campoValidacionNombre,nombreEsValido,"✓ Nombre válido","X Nombre inválido");
    return nombreEsValido;
}
entradaNombre.addEventListener("blur", revisarNombre);



function revisarApellido (){
    const ApellidoEsValido = validarNombreYApellido(entradaApellido.value);
    mostrarResultado(campoValidacionApellido,ApellidoEsValido,"✓ Apellido válido","X Apellido inválido");
    return ApellidoEsValido;
}
entradaApellido.addEventListener("blur", revisarApellido)


function revisarTelefono (){
    const TelefonoEsValido = validarTelefono(entradaTelefono.value);
    mostrarResultado(campoValidacionTelefono,TelefonoEsValido,"✓ Teléfono válido","X Teléfono inválido (10 dígitos)");
    return TelefonoEsValido;
}
entradaTelefono.addEventListener("blur", revisarTelefono)

function revisarCorreo (){
    const CorreoEsValido = validarCorreo(entradaEmail.value);
    mostrarResultado(campoValidacionCorreo, CorreoEsValido,"✓ Correo válido", "X Correo inválido (Ej: alguien@dominio.com)");
    return CorreoEsValido;
}

entradaEmail.addEventListener("blur", revisarCorreo);


function revisarMensaje (){
    let mensajeError;
    if (entradaMensaje.value.trim().length < minComentario){
        mensajeError = "X Mensaje demasiado corto. (min 30 caracteres)";
    } else {
        mensajeError = "X Mensaje demasiado largo. (max 3000 caracteres)";
    }
    const mensajeEsValido = validarComentario(entradaMensaje.value);
    mostrarResultado(campoValidacionMensaje,mensajeEsValido,"✓ Mensaje válido",mensajeError)
    return mensajeEsValido;
}

entradaMensaje.addEventListener("blur", revisarMensaje);


const formulario = document.getElementById("formulario-contacto");
const botonEnviar = document.getElementById("boton-enviar-formulario-contacto"); /*NUEVO*/
const mensajeEnvio = document.getElementById("mensaje-envio"); /*NUEVO: div donde sale la confirmacion*/
 
formulario.addEventListener("submit", async (e) => { /*NUEVO: async para poder usar await*/
    e.preventDefault();
    mensajeEnvio.textContent = "";
    mensajeEnvio.className = "";
 
    const nombreValidado = revisarNombre();
    const apellidoValidado = revisarApellido();
    const telefonoValidado = revisarTelefono();
    const correoValidado = revisarCorreo();
    const mensajeValidado = revisarMensaje();
 
    if (nombreValidado && apellidoValidado && telefonoValidado && correoValidado && mensajeValidado) {
 
        /*NUEVO: bloqueamos el boton para que no lo presionen dos veces*/
        botonEnviar.disabled = true;
        botonEnviar.textContent = "Enviando...";
 
        /*NUEVO: try/catch por si falla el internet o formspree*/
    try {
            /*enviamos los datos a la direccion que esta en el action del form*/
       const respuesta = await fetch(formulario.action, {
        method: "POST",
        body: new FormData(formulario), /*junta todos los inputs que tengan name*/
        headers: { "Accept": "application/json" }
            });
 
            if (respuesta.ok) {
                /*se envio bien*/
                mensajeEnvio.className = "alert alert-success";
                mensajeEnvio.textContent = "¡Gracias! Tu mensaje fue enviado.";
                formulario.reset(); /*vacia los inputs*/
                /*borramos los textos de las alertas*/
                campoValidacionNombre.textContent = "";
                campoValidacionApellido.textContent = "";
                campoValidacionTelefono.textContent = "";
                campoValidacionCorreo.textContent = "";
                campoValidacionMensaje.textContent = "";
            } else {
                /*formspree respondio con error*/
                mensajeEnvio.className = "alert alert-danger";
                mensajeEnvio.textContent = "No pudimos enviar tu mensaje. Intenta de nuevo.";
            }
 
    } catch (error) {
            /*no hubo conexion*/
            mensajeEnvio.className = "alert alert-danger";
            mensajeEnvio.textContent = "Hubo un problema de conexión. Intenta de nuevo.";
        }
            /*volvemos a activar el boton*/
        botonEnviar.disabled = false;
        botonEnviar.textContent = "Enviar";
    } else {
        mensajeEnvio.className = "alert alert-warning";
        mensajeEnvio.textContent = "Completa los datos correctamente para enviar el formulario.";
    }
});