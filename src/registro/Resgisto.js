const CLAVE_USUARIOS = "kitbox_usuarios";

// Este archivo se carga como script clásico. La importación dinámica permite
// reutilizar el cliente HTTP sin cambiar el orden de scripts del formulario.
const apiClientPromise = Promise.all([
    import("../js/config/api.js"),
    import("../js/services/http.js")
]);

async function obtenerUsuarios() {
    try {
        const [{ API_ENDPOINTS }, { get }] = await apiClientPromise;
        const data = await get(API_ENDPOINTS.clientes);
        return Array.isArray(data) ? data : data?.content || [];
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return [];
    }
}

obtenerUsuarios();

function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

const formulario = document.getElementById("formulario-crear-cuenta");

async function enviarUsuario() {
    const formData = new FormData(formulario);
    const usuario = {
        nombre: formData.get("nombre").trim(),
        apellido: formData.get("apellido").trim(),
        telefono: formData.get("telefono"),
        correo: formData.get("correo").trim(),
        direccion: formData.get("direccion"),
        contrasenia: formData.get("contrasenia")
    };

    const [{ API_ENDPOINTS }, { post }] = await apiClientPromise;
    return post(API_ENDPOINTS.registro, usuario);
}

function correoYaRegistrado(correo) {
    const correoBuscado = correo.trim().toLowerCase();
    return obtenerUsuarios().then((usuarios) =>
        usuarios.some((usuario) => usuario.correo?.toLowerCase() === correoBuscado)
    );
}

function registrarUsuario(usuario) {
    return correoYaRegistrado(usuario.correo).then((yaRegistrado) => {
        if (yaRegistrado) return false;

        const usuarios = JSON.parse(localStorage.getItem(CLAVE_USUARIOS) || "[]");
        usuarios.push(usuario);
        guardarUsuarios(usuarios);
        return true;
    });
}
