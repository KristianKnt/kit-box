const CLAVE_USUARIOS = "kitbox_usuarios";

// 1. Obtener la lista de usuarios guardados (lista vacía si todavía no hay ninguno)
//const api_URL_cliente = 'http://localhost:8080/api/cliente'
const api_URL_cliente = 'https://kit-box.cristian-rojascapera5.workers.dev/api/cliente'


async function obtenerUsuarios() {


    try {
        const response = await fetch(api_URL_cliente);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error al fetch de la API:", error);
        return []; // si falla, devolvemos una lista vacía para que la página no se rompa
    }

    // const usuariosGuardados = localStorage.getItem(CLAVE_USUARIOS);

    // if (usuariosGuardados === null) {
    //     return [];
    // }

    // try {
    //     const usuarios = JSON.parse(usuariosGuardados);

    //     if (!Array.isArray(usuarios)) {
    //         console.error("Los usuarios guardados no tienen un formato válido.");
    //         return [];
    //     }

    //     return usuarios;
    // } catch (error) {
    //     console.error("No se pudieron leer los usuarios guardados.", error);
    //     return [];
    // }
}

obtenerUsuarios();

// 2. Guardar la lista completa de usuarios
function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

// 3. Crear el objeto del usuario con los campos del formulario (modelo JSON)
const formulario = document.getElementById("formulario-crear-cuenta");

async function enviarUsuario() {      // (nombreCompleto, telefono, correo, contrasena)

    // const usuario = crearUsuario(
    //     `${campos.nombre.value} ${campos.apellido.value}`,
    //     campos.telefono.value,
    //     campos.correo.value,
    //     campos.contrasena.value
    // );
        const formData = new FormData(formulario);

                const usuario1 = {
                nombre: formData.get("nombre").trim(),
                apellido: formData.get("apellido").trim(),
                telefono: (formData.get("telefono")),
                correo: formData.get("correo").trim(),
                direccion: (formData.get("direccion")),
                contrasenia: formData.get("contrasenia"),
            };

    // if (!registrarUsuario(usuario)) {
    //     mostrarError(campos.correo, "Este correo ya está registrado.");
    //     return;
    // }

    // nombreCompleto: nombreCompleto.trim(),
    // telefono: telefono.trim(),
    // correo: correo.trim().toLowerCase(),
    // contrasena: contrasena

    try {
        const response = await fetch("https://kit-box.cristian-rojascapera5.workers.dev/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario1)
        })

        const data = await response.text();

        try {
            const data2 = JSON.parse(data)
            return data2
        } catch (error) {
            
        }

            if(!response.ok){
                throw new Error (data)
            }

        // localStorage.setItem("kitbox_token", data.token)

        return data
    } catch (error) {
        console.error("Error al enviar usuario ", error)
    }
    return
}

// 4. El correo es el nombre de usuario, así que no puede repetirse
function correoYaRegistrado(correo) {
    const correoBuscado = correo.trim().toLowerCase();

    return obtenerUsuarios().some(usuario => usuario.correo === correoBuscado);
}

// 5. Guardar un usuario nuevo. Devuelve true si se guardó y false si el correo ya existía
function registrarUsuario(usuario) {
    if (correoYaRegistrado(usuario.correo)) {
        return false;
    }

    const usuarios = obtenerUsuarios();
    usuarios.push(usuario);
    guardarUsuarios(usuarios);

    return true;
}