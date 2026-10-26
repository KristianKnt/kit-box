
document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario-producto");

  if (!formulario) {
    console.error("No se encontró el formulario de productos.");
    return;
  }

  const campos = {
    nombre: document.getElementById("dato-nombre"),
    descripcion: document.getElementById("dato-descripcion"),
    precio: document.getElementById("dato-precio"),
    imagen: document.getElementById("dato-imagen"),
    stock: document.getElementById("dato-stock"),
    categoria: document.getElementById("dato-categoria"),
    destacado: document.getElementById("dato-destacado")
  };

  // Mostrar el mensaje y marcar visualmente el campo.
  function mostrarError(campo, mensaje) {
    const elementoError = document.getElementById(`error-${campo.id}`);

    elementoError.textContent = mensaje;
    campo.classList.add("is-invalid");
    campo.classList.remove("is-valid");

    return false;
  }

  // Limpiar el mensaje de error de un campo.
  function limpiarError(campo) {
    const elementoError = document.getElementById(`error-${campo.id}`);

    elementoError.textContent = "";
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

        if (valor.length < 3) {
          return mostrarError(campo, "El nombre debe tener al menos 3 caracteres.");
        }

        if (valor.length > 100) {
          return mostrarError(campo, "El nombre no puede superar los 100 caracteres.");
        }
        break;

      case "descripcion":
        if (!valor) {
          return mostrarError(campo, "La descripción es obligatoria.");
        }

        if (valor.length < 10) {
          return mostrarError(campo, "La descripción debe tener al menos 10 caracteres.");
        }

        if (valor.length > 500) {
          return mostrarError(campo, "La descripción no puede superar los 500 caracteres.");
        }
        break;

      case "precio":
        if (valor === "") {
          return mostrarError(campo, "El precio es obligatorio.");
        }

        if (!Number.isFinite(Number(valor)) || Number(valor) <= 0) {
          return mostrarError(campo, "El precio debe ser mayor que cero.");
        }
        break;

      case "imagen":
        if (!valor) {
          return mostrarError(campo, "El nombre de la imagen es obligatorio.");
        }

        // La ruta debe comenzar con la carpeta de imágenes del proyecto
        // y terminar con una extensión de imagen permitida.
        const rutaValida =
          /^src\/assets\/imagenes\/[\w./-]+\.(jpg|jpeg|png|webp|svg)$/i;
        if (rutaValida.test(valor)) {
          return mostrarError(
            campo,
            "Ingresa un nombre válido, por ejemplo: src/assets/imagenes/img_json/01_Kit_de_Herramientas/herr_03.jpg"
          );
        }
        break;

      case "stock":
        if (valor === "") {
          return mostrarError(campo, "El stock es obligatorio.");
        }

        if (!Number.isInteger(Number(valor)) || Number(valor) < 0) {
          return mostrarError(campo, "El stock debe ser un entero igual o mayor que cero.");
        }
        break;

      case "categoria":
        if (!valor) {
          return mostrarError(campo, "Selecciona una categoría.");
        }

        if (![...campo.options].some(
          opcion => opcion.value === valor && !opcion.disabled
        )) {
          return mostrarError(campo, "Selecciona una categoría válida.");
        }
        break;

      case "destacado":
        if (valor !== "true" && valor !== "false") {
          return mostrarError(campo, "Selecciona Sí o No.");
        }
        break;
    }

    campo.classList.add("is-valid");
    return true;
  }

  // Validar mientras el usuario escribe o cambia una selección.
  Object.values(campos).forEach(campo => {
    campo.addEventListener("input", () => {
      validarCampo(campo);
    });

    campo.addEventListener("change", () => {
      validarCampo(campo);
    });
  });

  // Validar todos los campos antes de agregar el producto.
  formulario.addEventListener("submit", (event) => {
    const camposValidos = Object.values(campos).map(validarCampo);
    const formularioValido = camposValidos.every(Boolean);

    if (!formularioValido) {
      event.preventDefault();

      // Impide que el listener de admin.js agregue un producto inválido.
      event.stopImmediatePropagation();

      const primerCampoInvalido = formulario.querySelector(".is-invalid");

      if (primerCampoInvalido) {
        primerCampoInvalido.focus();
      }
    }
  });
});
