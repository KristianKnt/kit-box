const API_URL_CLIENTE = "http://localhost:8080/api/cliente";

const formulario = document.getElementById("formulario-perfil");
const mensajeGeneral = document.getElementById("mensaje-perfil");
const btnConfirmarEliminar = document.getElementById("btn-confirmar-eliminar");

const campos = {
  nombre: document.getElementById("perfil-nombre"),
  apellido: document.getElementById("perfil-apellido"),
  correo: document.getElementById("perfil-correo"),
  telefono: document.getElementById("perfil-telefono"),
  direccion: document.getElementById("perfil-direccion"),
  contrasenia: document.getElementById("perfil-contrasenia"),
  confirmarContrasenia: document.getElementById("perfil-confirmar-contrasenia"),
};

let clienteActual = null;
let listaClientes = [];

// =========================================================================
// 1. UTILIDADES DE VALIDACIÓN (mismas reglas y clases CSS de registro)
// =========================================================================
function mostrarError(input, mensaje) {
  input.classList.remove("is-valid");
  input.classList.add("is-invalid");
  const contenedorError = document.getElementById(`error-${input.id}`);
  if (contenedorError) contenedorError.textContent = mensaje;
}

function limpiarError(input) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
  const contenedorError = document.getElementById(`error-${input.id}`);
  if (contenedorError) contenedorError.textContent = "";
}

function validarNombre(input, etiqueta) {
  const valor = input.value.trim();
  const regexLetras = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]{2,50}$/;
  if (!valor) {
    mostrarError(input, `El ${etiqueta} es obligatorio.`);
    return false;
  }
  if (!regexLetras.test(valor)) {
    mostrarError(input, `El ${etiqueta} solo debe contener letras (mínimo 2).`);
    return false;
  }
  limpiarError(input);
  return true;
}

function validarCorreo() {
  const valor = campos.correo.value.trim().toLowerCase();
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!valor) {
    mostrarError(campos.correo, "El correo electrónico es obligatorio.");
    return false;
  }
  if (!regexCorreo.test(valor)) {
    mostrarError(campos.correo, "Ingresa un correo electrónico válido.");
    return false;
  }

  // Verifica que otro cliente distinto no tenga ese mismo correo
  const correoOcupado = listaClientes.some(
    (c) => c.correo?.toLowerCase() === valor && c.id !== clienteActual?.id
  );
  if (correoOcupado) {
    mostrarError(campos.correo, "Este correo ya está registrado por otra cuenta.");
    return false;
  }

  limpiarError(campos.correo);
  return true;
}

function validarTelefono() {
  // Limpia espacios o guiones por si el usuario los escribe
  const valor = campos.telefono.value.replace(/[\s-]/g, "");
  campos.telefono.value = valor;

  const regexTelefono = /^[0-9]{10}$/;
  if (!valor) {
    mostrarError(campos.telefono, "El teléfono es obligatorio.");
    return false;
  }
  if (!regexTelefono.test(valor)) {
    mostrarError(campos.telefono, "Ingresa un número de celular válido de 10 dígitos.");
    return false;
  }
  limpiarError(campos.telefono);
  return true;
}

function validarDireccion() {
  const valor = campos.direccion.value.trim();
  if (valor.length < 5) {
    mostrarError(campos.direccion, "Ingresa una dirección válida (mínimo 5 caracteres).");
    return false;
  }
  limpiarError(campos.direccion);
  return true;
}

function validarContraseniaOpcional() {
  const pass = campos.contrasenia.value;
  const confirm = campos.confirmarContrasenia.value;

  // Si ambos están vacíos, el usuario no quiere cambiar su contraseña
  if (!pass && !confirm) {
    campos.contrasenia.classList.remove("is-invalid", "is-valid");
    campos.confirmarContrasenia.classList.remove("is-invalid", "is-valid");
    document.getElementById("error-perfil-contrasenia").textContent = "";
    document.getElementById("error-perfil-confirmar-contrasenia").textContent = "";
    return true;
  }

  // Misma regla que en registro: mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número
  const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!regexPass.test(pass)) {
    mostrarError(
      campos.contrasenia,
      "Mínimo 8 caracteres, incluyendo una mayúscula, una minúscula y un número."
    );
    return false;
  }
  limpiarError(campos.contrasenia);

  if (pass !== confirm) {
    mostrarError(campos.confirmarContrasenia, "Las contraseñas no coinciden.");
    return false;
  }
  limpiarError(campos.confirmarContrasenia);
  return true;
}

function validarFormularioCompleto() {
  const vNombre = validarNombre(campos.nombre, "nombre");
  const vApellido = validarNombre(campos.apellido, "apellido");
  const vCorreo = validarCorreo();
  const vTelefono = validarTelefono();
  const vDireccion = validarDireccion();
  const vPass = validarContraseniaOpcional();

  return vNombre && vApellido && vCorreo && vTelefono && vDireccion && vPass;
}

// =========================================================================
// 2. CARGAR DATOS DEL CLIENTE LOGUEADO DESDE LA API
// =========================================================================
function obtenerHeadersAuth() {
  const token = localStorage.getItem("kitbox_token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function cargarDatosPerfil() {
  const sesion = typeof obtenerSesion === "function" ? obtenerSesion() : null;

  if (!sesion) {
    window.location.href = "../login/login.html";
    return;
  }

  try {
    const response = await fetch(API_URL_CLIENTE, {
      headers: obtenerHeadersAuth(),
    });
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    listaClientes = await response.json();

    // Busca el cliente logueado por correo
    clienteActual = listaClientes.find(
      (c) => c.correo?.toLowerCase() === sesion.correo?.toLowerCase()
    );

    if (clienteActual) {
      campos.nombre.value = clienteActual.nombre || "";
      campos.apellido.value = clienteActual.apellido || "";
      campos.correo.value = clienteActual.correo || "";
      campos.telefono.value = clienteActual.telefono || "";
      campos.direccion.value = clienteActual.direccion || "";
    } else {
      // Respaldo con los datos que tenga sesion.js
      const partes = (sesion.nombreCompleto || "").trim().split(/\s+/);
      campos.nombre.value = partes[0] || "";
      campos.apellido.value = partes.slice(1).join(" ") || "";
      campos.correo.value = sesion.correo || "";
    }
  } catch (error) {
    console.error("Error al cargar datos del cliente:", error);
    mensajeGeneral.textContent = "No se pudieron cargar tus datos desde el servidor.";
    mensajeGeneral.style.color = "#B02A37";
  }
}

// =========================================================================
// 3. ACTUALIZAR DATOS (PUT)
// =========================================================================
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensajeGeneral.textContent = "";

  if (!validarFormularioCompleto()) return;

  if (!clienteActual?.id) {
    mensajeGeneral.textContent = "No se encontró el ID de tu cuenta para actualizar.";
    mensajeGeneral.style.color = "#B02A37";
    return;
  }

  const correoAnterior = clienteActual.correo.trim().toLowerCase();
  const correoNuevo = campos.correo.value.trim().toLowerCase();
  const cambioCorreo = correoAnterior !== correoNuevo;
  const cambioContrasenia = campos.contrasenia.value.trim().length > 0;

  const datosActualizados = {
    id: clienteActual.id,
    nombre: campos.nombre.value.trim(),
    apellido: campos.apellido.value.trim(),
    telefono: campos.telefono.value.trim(),
    correo: correoNuevo,
    rol: clienteActual.rol,
    direccion: campos.direccion.value.trim(),
  };

  // Solo envía contrasenia si el usuario escribió una nueva
  if (cambioContrasenia) {
    datosActualizados.contrasenia = campos.contrasenia.value;
  }

  try {
    const response = await fetch(`${API_URL_CLIENTE}/${clienteActual.id}`, {
      method: "PUT",
      headers: obtenerHeadersAuth(),
      body: JSON.stringify(datosActualizados),
    });

    if (!response.ok) {
      const errorTexto = await response.text();
      throw new Error(errorTexto || `Error HTTP: ${response.status}`);
    }

    const clienteRespuesta = await response.json();
    clienteActual = { ...clienteActual, ...clienteRespuesta };

    // Si cambió correo o contraseña, cerramos sesión y mostramos el modal estático
    if (cambioCorreo || cambioContrasenia) {
      if (typeof cerrarSesion === "function") {
        cerrarSesion();
      }
      localStorage.removeItem("kitbox_token");

      const modalElemento = document.getElementById("modalReinicioSesion");
      const modalReinicio = new bootstrap.Modal(modalElemento);
      modalReinicio.show();

      document.getElementById("btn-reiniciar-sesion").addEventListener("click", () => {
        window.location.href = "../login/login.html";
      });

      return;
    }

    // Si solo cambió nombre, apellido, teléfono o dirección:
    // Actualiza la sesión local para que el header muestre el nombre nuevo sin cerrar sesión
    const sesionActual = obtenerSesion();
    if (sesionActual) {
      const sesionNueva = {
        ...sesionActual,
        nombreCompleto: `${datosActualizados.nombre} ${datosActualizados.apellido}`.trim(),
        correo: datosActualizados.correo,
      };

      for (let i = 0; i < localStorage.length; i++) {
        const clave = localStorage.key(i);
        if (localStorage.getItem(clave)?.includes(sesionActual.correo)) {
          localStorage.setItem(clave, JSON.stringify(sesionNueva));
          break;
        }
      }
    }

    // Limpia los campos de contraseña y muestra confirmación
    campos.contrasenia.value = "";
    campos.confirmarContrasenia.value = "";
    mensajeGeneral.textContent = "¡Tus datos se actualizaron correctamente!";
    mensajeGeneral.style.color = "#198754";

    // Refresca el saludo del header sin recargar toda la página
    const headerContenedor = document.getElementById("header");
    if (headerContenedor) {
      const moduloHeader = await import("../../components/header/header.js");
      moduloHeader.mostrarUsuarioEnHeader(headerContenedor);
    }
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    mensajeGeneral.textContent = error.message || "Hubo un problema al guardar los cambios. Intenta de nuevo.";
    mensajeGeneral.style.color = "#B02A37";
  }
});

// =========================================================================
// 4. ELIMINAR CUENTA (DELETE)
// =========================================================================
btnConfirmarEliminar?.addEventListener("click", async () => {
  if (!clienteActual?.id) return;

  try {
    const response = await fetch(`${API_URL_CLIENTE}/${clienteActual.id}`, {
      method: "DELETE",
      headers: obtenerHeadersAuth(),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    if (typeof cerrarSesion === "function") {
      cerrarSesion();
    }
    localStorage.removeItem("kitbox_token");

    window.location.href = "../../index.html";
  } catch (error) {
    console.error("Error al eliminar la cuenta:", error);
    mensajeGeneral.textContent = "No se pudo eliminar la cuenta en este momento.";
    mensajeGeneral.style.color = "#B02A37";
  }
});

// Validación en tiempo real al salir de cada campo (blur)
campos.nombre.addEventListener("blur", () => validarNombre(campos.nombre, "nombre"));
campos.apellido.addEventListener("blur", () => validarNombre(campos.apellido, "apellido"));
campos.correo.addEventListener("blur", validarCorreo);
campos.telefono.addEventListener("blur", validarTelefono);
campos.direccion.addEventListener("blur", validarDireccion);
campos.contrasenia.addEventListener("blur", validarContraseniaOpcional);
campos.confirmarContrasenia.addEventListener("blur", validarContraseniaOpcional);

// Inicializar al cargar la página
cargarDatosPerfil();