const CLAVE_USUARIOS = "kitbox_usuarios";

// 1. Obtener la lista de usuarios guardados (lista vacía si todavía no hay ninguno)
function obtenerUsuarios() {
    const usuariosGuardados = localStorage.getItem(CLAVE_USUARIOS);

    if (usuariosGuardados === null) {
        return [];
    }

    try {
        const usuarios = JSON.parse(usuariosGuardados);

        if (!Array.isArray(usuarios)) {
            console.error("Los usuarios guardados no tienen un formato válido.");
            return [];
        }

        return usuarios;
    } catch (error) {
        console.error("No se pudieron leer los usuarios guardados.", error);
        return [];
    }
}

// 2. Guardar la lista completa de usuarios
function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

// 3. Crear el objeto del usuario con los campos del formulario (modelo JSON)
function crearUsuario(nombreCompleto, telefono, correo, contrasena) {
    return {
        nombreCompleto: nombreCompleto.trim(),
        telefono: telefono.trim(),
        correo: correo.trim().toLowerCase(),
        contrasena: contrasena
    };
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