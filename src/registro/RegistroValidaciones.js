document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formulario-crear-cuenta");

    if (!formulario) {
        console.error("No se encontró el formulario de creación de cuenta.");
        return;
    }

    const campos = {
        nombre: document.getElementById("registro-nombre"),
        apellido: document.getElementById("registro-apellido"),
        correo: document.getElementById("registro-correo"),
        telefono: document.getElementById("registro-telefono"),
        contrasena: document.getElementById("registro-contrasena"),
        confirmarContrasena: document.getElementById("registro-confirmar-contrasena")
    };

    // Mostrar el mensaje, marcar visualmente y activar la burbuja nativa del navegador.
    function mostrarError(campo, mensaje) {
        const elementoError = document.getElementById(`error-${campo.id}`) || document.getElementById("error-contrasenas");

        if (elementoError) {
            elementoError.textContent = mensaje;
        }


        campo.setCustomValidity(mensaje);

        // Clases visuales de Bootstrap o personalizadas (borde rojo)
        campo.classList.add("is-invalid");
        campo.classList.remove("is-valid");

        return false;
    }

    // Limpiar el mensaje de error de un campo y restablecer la validez nativa.
    function limpiarError(campo) {
        const elementoError = document.getElementById(`error-${campo.id}`) || document.getElementById("error-contrasenas");

        if (elementoError && campo.id === "registro-confirmar-contrasena") {
            elementoError.textContent = "";
        }


        campo.setCustomValidity("");

        campo.classList.remove("is-invalid");
        campo.classList.remove("is-valid");
    }

    // Validar cada campo individualmente.
    function validarCampo(campo) {
        const valor = campo.value.trim();

        limpiarError(campo);

        switch (campo.name) {
            case "nombre":
                if (!valor) {
                    return mostrarError(campo, "El nombre es obligatorio.");
                }
                if (valor.length < 2) {
                    return mostrarError(campo, "El nombre debe tener al menos 2 caracteres.");
                }
                if (valor.length > 60) {
                    return mostrarError(campo, "El nombre no puede superar los 60 caracteres.");
                }
                break;

            case "apellido":
                if (!valor) {
                    return mostrarError(campo, "El apellido es obligatorio.");
                }
                if (valor.length < 2) {
                    return mostrarError(campo, "El apellido debe tener al menos 2 caracteres.");
                }
                if (valor.length > 60) {
                    return mostrarError(campo, "El apellido no puede superar los 60 caracteres.");
                }
                break;

            case "correo": {
                if (!valor) {
                    return mostrarError(campo, "El correo electrónico es obligatorio.");
                }
                const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!regexCorreo.test(valor)) {
                    return mostrarError(campo, "Ingresa un correo electrónico válido.");
                }
                break;
            }

            case "telefono":
                if (valor !== "") {
                    const regexTelefono = /^[+]?[0-9 ()-]{7,20}$/;
                    if (!regexTelefono.test(valor) || valor.length < 9) {
                        return mostrarError(campo, "Ingresa un número de teléfono válido.");
                    }
                }
                break;

            case "contrasena":
                if (!valor) {
                    return mostrarError(campo, "La contraseña es obligatoria.");
                }
                if (valor.length < 8) {
                    return mostrarError(campo, "La contraseña debe tener al menos 8 caracteres.");
                }
                if (valor.length > 128) {
                    return mostrarError(campo, "La contraseña no puede superar los 128 caracteres.");
                }

                // 1. Validar que tenga al menos una letra mayúscula
                const tieneMayuscula = /[A-Z]/.test(valor);
                if (!tieneMayuscula) {
                    return mostrarError(campo, "La contraseña debe contener al menos una letra mayúscula.");
                }

                // 2. Validar que tenga al menos un carácter especial (símbolos)
                const tieneEspecial = /[^A-Za-z0-9]/.test(valor);
                if (!tieneEspecial) {
                    return mostrarError(campo, "La contraseña debe contener al menos un carácter especial (ej. @, #, $, !, etc.).");
                }

                break;

            case "confirmar-contrasena": {
                if (!valor) {
                    return mostrarError(campo, "Debes confirmar tu contraseña.");
                }
                const contrasenaValor = campos.contrasena.value;
                if (valor !== contrasenaValor) {
                    return mostrarError(campo, "Las contraseñas no coinciden.");
                }
                break;
            }
        }

        campo.classList.add("is-valid");
        return true;
    }

    // Validar mientras el usuario escribe o cambia una opción.
    Object.values(campos).forEach(campo => {
        if (campo) {
            campo.addEventListener("input", () => {
                validarCampo(campo);
            });
            campo.addEventListener("change", () => {
                validarCampo(campo);
            });
        }
    });

    // Validar todos los campos antes de enviar el formulario.
    formulario.addEventListener("submit", (event) => {
        const camposValidos = Object.values(campos).map(validarCampo);
        const formularioValido = camposValidos.every(Boolean);

        if (!formularioValido) {
            event.preventDefault();
            event.stopImmediatePropagation();


            formulario.reportValidity();

            const mensajeRegistro = document.getElementById("mensaje-registro");
            if (mensajeRegistro) {
                mensajeRegistro.textContent = "Por favor, corrige los errores marcados en rojo antes de continuar.";
                mensajeRegistro.style.color = "#d9534f";
            }
        } else {

            event.preventDefault();

            const usuario = crearUsuario(
                `${campos.nombre.value} ${campos.apellido.value}`,
                campos.telefono.value,
                campos.correo.value,
                campos.contrasena.value
            );

            if (!registrarUsuario(usuario)) {
                mostrarError(campos.correo, "Este correo ya está registrado.");
                return;
            }

            //Mostrar la ventana emergente de alerta
            mostrarAlertaBonita("¡Cuenta creada exitosamente!");

            //limpiar todos los campos del formulario
            formulario.reset();


            Object.values(campos).forEach(campo => {
                if (campo) {
                    campo.classList.remove("is-valid", "is-invalid");
                }
            });


        }

    });
    // Función para crear un contenedor tipo alert sin pojnerle estilos css
    function mostrarAlertaBonita(mensaje) {
        // 1. fondo
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';

        // 2. caja centrada 
        const modal = document.createElement('div');
        modal.style.backgroundColor = 'white';
        modal.style.padding = '30px 20px';
        modal.style.borderRadius = '12px';
        modal.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
        modal.style.textAlign = 'center';
        modal.style.maxWidth = '320px';
        modal.style.width = '90%';
        modal.style.fontFamily = 'Arial, sans-serif';

        // 3. Texto del mensaje
        const texto = document.createElement('p');
        texto.textContent = mensaje;
        texto.style.fontSize = '16px';
        texto.style.color = '#333';
        texto.style.margin = '0 0 20px 0';
        texto.style.fontWeight = '500';

        // 4. Botón de aceptar estilizado
        const boton = document.createElement('button');
        boton.textContent = 'Aceptar';
        boton.style.backgroundColor = '#1E4437';
        boton.style.color = 'white';
        boton.style.border = 'none';
        boton.style.padding = '10px 24px';
        boton.style.borderRadius = '6px';
        boton.style.cursor = 'pointer';
        boton.style.fontSize = '14px';
        boton.style.fontWeight = 'bold';

        // Efecto hover simple para el botón
        boton.onmouseover = () => boton.style.backgroundColor = '#886F56';
        boton.onmouseout = () => boton.style.backgroundColor = '#1E4437';

        // 5. Acción cerrar alerta
        boton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        //Unir todo y mostrarlo en la pantalla
        modal.appendChild(texto);
        modal.appendChild(boton);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

});