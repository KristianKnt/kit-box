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

  // Mostrar el mensaje y marcar visualmente el campo.
  function mostrarError(campo, mensaje) {
    const elementoError = document.getElementById(`error-${campo.id}`) || document.getElementById("error-contrasenas");

    if (elementoError) {
      elementoError.textContent = mensaje;
    }
    campo.classList.add("is-invalid");
    campo.classList.remove("is-valid");

    return false;
  }

  // Limpiar el mensaje de error de un campo.
  function limpiarError(campo) {
    const elementoError = document.getElementById(`error-${campo.id}`) || document.getElementById("error-contrasenas");

    if (elementoError && campo.id === "registro-confirmar-contrasena") {
      elementoError.textContent = "";
    }
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
        // El teléfono es opcional, por lo que si está vacío es válido
        if (valor !== "") {
          const regexTelefono = /^[+]?[0-9 ()-]{7,20}$/;
          if (!regexTelefono.test(valor)) {
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

  // Validar mientras el usuario escribe.
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

      const primerCampoInvalido = formulario.querySelector(".is-invalid");

      if (primerCampoInvalido) {
        primerCampoInvalido.focus();
      }
    } else {
      // --- TODO VÁLIDO ---
      // Aquí puedes guardar en LocalStorage o manejar los datos
      event.preventDefault(); // Comenta esta línea si luego envías los datos o recargas
      
      const mensajeRegistro = document.getElementById("mensaje-registro");
      if (mensajeRegistro) {
        mensajeRegistro.textContent = "¡Cuenta creada exitosamente!";
        mensajeRegistro.style.color = "#28a745";
      }
    }
  });
});