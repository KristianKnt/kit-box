// ===================================================================================
// INICIO DE SESIÓN: localStorage de la sesión 
// ===================================================================================

// Clave donde se guarda quién tiene la sesión abierta
const CLAVE_SESION = "kitbox_sesion";

// ------------------------------- LOCALSTORAGE DE LA SESIÓN -------------------------------

// 1. Buscar en kitbox_usuarios al usuario que tenga ese correo (null si no existe)
function buscarUsuarioPorCorreo(correo) {
    const correoBuscado = correo.trim().toLowerCase();

    return obtenerUsuarios().find(usuario => usuario.correo === correoBuscado) || null;
}

// 2. Guardar la sesión. OJO: solo nombre y correo, NUNCA la contraseña
function guardarSesion(usuario) {
    const sesion = {
        nombreCompleto: usuario.nombreCompleto,
        correo: usuario.correo,
        fechaInicio: new Date().toISOString()
    };

    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    return sesion;
}

// 3. Leer la sesión guardada (null si nadie ha iniciado sesión)
function obtenerSesion() {
    const sesionGuardada = localStorage.getItem(CLAVE_SESION);

    if (sesionGuardada === null) {
        return null;
    }

    try {
        return JSON.parse(sesionGuardada);
    } catch (error) {
        console.error("No se pudo leer la sesión guardada.", error);
        return null;
    }
}

// 4. Saber si hay alguien con la sesión abierta
function haySesionActiva() {
    return obtenerSesion() !== null;
}

// 5. Cerrar la sesión
function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION);
}

// 6. Iniciar sesión: el correo debe existir y la contraseña coincidir.
//    Devuelve la sesión si todo está bien, o null si no.
function iniciarSesion(correo, contrasena) {
    const usuario = buscarUsuarioPorCorreo(correo);

    if (usuario === null || usuario.contrasena !== contrasena) {
        return null;
    }

    return guardarSesion(usuario);
}

// ------------------------------- FORMULARIO DE INICIO DE SESIÓN -------------------------------

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("#contenedor-login form");

    if (!formulario) {
        console.error("No se encontró el formulario de inicio de sesión.");
        return;
    }

    if (typeof obtenerUsuarios !== "function") {
        console.error("Falta cargar ResgistoLocalStorage.js antes de validacionesLogin.js.");
        return;
    }

    const campos = {
        correo: document.getElementById("inputEmail"),
        contrasena: document.getElementById("inputPassword")
    };

    // Las validaciones las hace este JS, no las burbujas del navegador
    formulario.noValidate = true;

    // Espacio para la alerta de Bootstrap, justo encima del formulario
    const contenedorAlerta = document.createElement("div");
    contenedorAlerta.id = "alerta-login";
    contenedorAlerta.setAttribute("aria-live", "polite");
    formulario.before(contenedorAlerta);

    // Un mensaje de error de Bootstrap (invalid-feedback) debajo de cada campo
    Object.values(campos).forEach(campo => {
        const elementoError = document.createElement("div");
        elementoError.id = `error-${campo.id}`;
        elementoError.className = "invalid-feedback";
        campo.after(elementoError);
        campo.setAttribute("aria-describedby", elementoError.id);
    });

    // Mostrar el error debajo de SU campo y marcarlo en rojo
    function mostrarError(campo, mensaje) {
        document.getElementById(`error-${campo.id}`).textContent = mensaje;
        campo.classList.add("is-invalid");
        campo.setAttribute("aria-invalid", "true");
        return false;
    }

    // Quitar el error de un campo
    function limpiarError(campo) {
        document.getElementById(`error-${campo.id}`).textContent = "";
        campo.classList.remove("is-invalid");
        campo.removeAttribute("aria-invalid");
    }

    // Mostrar una alerta de Bootstrap. tipo: "danger", "success" o "info".
    // Se arma con textContent (no innerHTML) porque el nombre lo escribió el usuario.
    function mostrarAlerta(tipo, titulo, mensaje) {
        const alerta = document.createElement("div");
        alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
        alerta.setAttribute("role", "alert");

        const textoTitulo = document.createElement("strong");
        textoTitulo.textContent = titulo;

        const botonCerrar = document.createElement("button");
        botonCerrar.type = "button";
        botonCerrar.className = "btn-close";
        botonCerrar.setAttribute("data-bs-dismiss", "alert");
        botonCerrar.setAttribute("aria-label", "Cerrar");

        alerta.append(textoTitulo, ` ${mensaje}`, botonCerrar);
        contenedorAlerta.replaceChildren(alerta);
        return alerta;
    }

    function limpiarAlerta() {
        contenedorAlerta.replaceChildren();
    }

    // Validar cada campo
    function validarCampo(campo) {
        const valor = campo.value.trim();

        limpiarError(campo);

        if (campo === campos.correo) {
            if (!valor) {
                return mostrarError(campo, "El correo electrónico es obligatorio.");
            }
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexCorreo.test(valor)) {
                return mostrarError(campo, "Ingresa un correo electrónico válido, por ejemplo tu@correo.com.");
            }
        }

        if (campo === campos.contrasena && !campo.value) {
            return mostrarError(campo, "La contraseña es obligatoria.");
        }

        return true;
    }

    // Si ya hay una sesión abierta, avisarlo y dar la opción de cerrarla
    function mostrarSesionActiva() {
        const sesion = obtenerSesion();

        if (sesion === null) {
            return;
        }

        const alerta = mostrarAlerta("info", `Ya iniciaste sesión como ${sesion.nombreCompleto}.`, "¿No eres tú?");
        const botonSalir = document.createElement("button");
        botonSalir.type = "button";
        botonSalir.className = "btn btn-link alert-link p-0 align-baseline ms-1";
        botonSalir.textContent = "Cerrar sesión";
        botonSalir.addEventListener("click", () => {
            cerrarSesion();
            limpiarAlerta();
            campos.correo.focus();
        });
        alerta.querySelector(".btn-close").before(botonSalir);
    }

    mostrarSesionActiva();

    // Mientras escribe: si el campo ya estaba en rojo, revisar otra vez para quitar el error
    Object.values(campos).forEach(campo => {
        campo.addEventListener("input", () => {
            if (campo.classList.contains("is-invalid")) {
                validarCampo(campo);
            }
        });
    });

    // Al enviar el formulario
    formulario.addEventListener("submit", (event) => {
        event.preventDefault();
        limpiarAlerta();

        const formularioValido = Object.values(campos).map(validarCampo).every(Boolean);

        if (!formularioValido) {
            mostrarAlerta("danger", "No pudimos iniciar sesión.", "Revisa los campos marcados en rojo.");
            formulario.querySelector(".is-invalid").focus();
            return;
        }

        const sesion = iniciarSesion(campos.correo.value, campos.contrasena.value);

        // El mismo mensaje si el correo no existe o si la contraseña está mal:
        // así nadie puede averiguar qué correos están registrados
        if (sesion === null) {
            mostrarAlerta("danger", "Correo o contraseña incorrectos.", "Verifica tus datos e inténtalo de nuevo.");
            campos.contrasena.value = "";
            campos.contrasena.focus();
            return;
        }

        mostrarAlerta("success", `¡Hola, ${sesion.nombreCompleto}!`, "Iniciaste sesión. Te llevamos al inicio...");
        formulario.reset();

        // Después de 2 segundos, ir a la página de inicio
        setTimeout(() => {
            window.location.href = "../../index.html";
        }, 2000);
    });
});
