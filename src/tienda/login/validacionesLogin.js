// ===================================================================================
// INICIO DE SESIÓN: localStorage de la sesión 
// ===================================================================================

async function iniciarSesion(correo, contrasena) {
    try {
        const [{ API_ENDPOINTS }, { get, post }] = await Promise.all([
            import("../../js/config/api.js"),
            import("../../js/services/http.js")
        ]);

        const data = await post(API_ENDPOINTS.login, {
            username: correo.trim(),
            password: contrasena
        });

        if (!data?.token) {
            throw new Error("El servidor no devolvió un token de sesión.");
        }

        localStorage.setItem("kitbox_token", data.token);

        const cliente = await get(
            `${API_ENDPOINTS.clientes}/correo/${encodeURIComponent(correo.trim())}`
        );

        // Guardamos también el rol ("ADMIN" o "CLIENTE") que viene del backend
        return guardarSesion({
            id: cliente.id,
            nombreCompleto: `${cliente.nombre} ${cliente.apellido}`.trim(),
            correo: cliente.correo,
            rol: cliente.rol
        });
    } catch (error) {
        console.error("Error al iniciar sesión ", error);
        return null;
    }
}

// ------------------------------- FORMULARIO DE INICIO DE SESIÓN -------------------------------

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("#formulario-login");

    if (!formulario) {
        console.error("No se encontró el formulario de inicio de sesión.");
        return;
    }

    const campos = {
        correo: document.getElementById("inputEmail"),
        contrasena: document.getElementById("inputPassword")
    };

    formulario.noValidate = true;

    const contenedorAlerta = document.createElement("div");
    contenedorAlerta.id = "alerta-login";
    contenedorAlerta.setAttribute("aria-live", "polite");
    formulario.before(contenedorAlerta);

    Object.values(campos).forEach(campo => {
        const elementoError = document.createElement("div");
        elementoError.id = `error-${campo.id}`;
        elementoError.className = "invalid-feedback";
        campo.after(elementoError);
        campo.setAttribute("aria-describedby", elementoError.id);
    });

    function mostrarError(campo, mensaje) {
        document.getElementById(`error-${campo.id}`).textContent = mensaje;
        campo.classList.add("is-invalid");
        campo.setAttribute("aria-invalid", "true");
        return false;
    }

    function limpiarError(campo) {
        document.getElementById(`error-${campo.id}`).textContent = "";
        campo.classList.remove("is-invalid");
        campo.removeAttribute("aria-invalid");
    }

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
            localStorage.removeItem("kitbox_token");
            limpiarAlerta();
            campos.correo.focus();
        });
        alerta.querySelector(".btn-close").before(botonSalir);
    }

    mostrarSesionActiva();

    Object.values(campos).forEach(campo => {
        campo.addEventListener("input", () => {
            if (campo.classList.contains("is-invalid")) {
                validarCampo(campo);
            }
        });
    });

    // Al enviar el formulario
    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();
        limpiarAlerta();

        const formularioValido = Object.values(campos).map(validarCampo).every(Boolean);

        if (!formularioValido) {
            mostrarAlerta("danger", "No pudimos iniciar sesión.", "Revisa los campos marcados en rojo.");
            formulario.querySelector(".is-invalid").focus();
            return;
        }

        const sesion = await iniciarSesion(campos.correo.value, campos.contrasena.value);

        if (sesion === null) {
            mostrarAlerta("danger", "Correo o contraseña incorrectos.", "Verifica tus datos e inténtalo de nuevo.");
            campos.contrasena.value = "";
            campos.contrasena.focus();
            return;
        }

        formulario.reset();

        // Identificamos si es ADMIN o CLIENTE
        const esAdmin = sesion.rol === "ADMIN";
        const rutaDestino = esAdmin
            ? "../admin/admin.html"   
            : "../../../index.html";

        const mensajeDestino = esAdmin
            ? "¡Felicidades por iniciar sesión! Te llevamos al panel de administrador..."
            : "¡Felicidades por iniciar sesión! Te llevamos al inicio...";

        mostrarAlerta("success", `¡Hola, ${sesion.nombreCompleto}!`, mensajeDestino);

        if (!esAdmin) {
            marcarSaludoPendiente();
        }

        setTimeout(() => {
            window.location.href = rutaDestino;
        }, 2000);
    });
});
