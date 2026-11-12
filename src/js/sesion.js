// ===================================================================================
// SESIÓN DEL USUARIO: localStorage de la sesión
// ===================================================================================
// Estas funciones antes estaban dentro de validacionesLogin.js, pero ese archivo solo
// se carga en la página de login. Aquí quedan para TODAS las páginas, porque las usan:
// - el login (validacionesLogin.js), para iniciar sesión
// - el header (header.js), para mostrar quién está conectado y cerrar sesión
// Por eso este archivo se carga en cada página ANTES de components.js.

// Clave donde se guarda quién tiene la sesión abierta
const CLAVE_SESION = "kitbox_sesion";

// Clave de la "notita" para saludar una sola vez después de iniciar sesión.
// Va en sessionStorage: se borra sola cuando se cierra el navegador.
const CLAVE_SALUDO_PENDIENTE = "kitbox_saludo_pendiente";

// 1. Guardar la sesión. OJO: solo nombre y correo, NUNCA la contraseña
function guardarSesion(usuario) {
    const sesion = {
        nombreCompleto: usuario.nombreCompleto,
        correo: usuario.correo,
        fechaInicio: new Date().toISOString()
    };

    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    return sesion;
}

// 2. Leer la sesión guardada (null si nadie ha iniciado sesión)
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

// 3. Saber si hay alguien con la sesión abierta
function haySesionActiva() {
    return obtenerSesion() !== null;
}

// 4. Cerrar la sesión
function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION);
}

// 5. Dejar la notita de "salúdala" (la deja el login justo antes de llevar al inicio)
function marcarSaludoPendiente() {
    sessionStorage.setItem(CLAVE_SALUDO_PENDIENTE, "si");
}

// 6. Leer la notita y botarla, para que el saludo salga UNA sola vez.
//    Devuelve true si había saludo pendiente.
function tomarSaludoPendiente() {
    const haySaludo = sessionStorage.getItem(CLAVE_SALUDO_PENDIENTE) !== null;
    sessionStorage.removeItem(CLAVE_SALUDO_PENDIENTE);
    return haySaludo;
}
