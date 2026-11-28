import { API_ENDPOINTS } from "../../js/config/api.js";
import { del, get, post } from "../../js/services/http.js";

/**
 * Obtiene los productos vigentes desde el backend.
 * El backend actual responde con { content: [...] }, pero se acepta también
 * un arreglo directo para mantener el servicio tolerante al formato REST.
 */
export async function obtenerProductos() {
    const cuerpo = await get(API_ENDPOINTS.productos);
    const productos = Array.isArray(cuerpo) ? cuerpo : cuerpo?.content;

    if (!Array.isArray(productos)) {
        throw new Error("La respuesta del backend no contiene una lista de productos");
    }

    return productos;
}

export async function cargarProductos() {
    return obtenerProductos();
}

export async function agregarProducto(producto) {
    try {
        // http.js agrega automáticamente Content-Type y el token disponible.
        return await post(API_ENDPOINTS.productos, producto);
    } catch (error) {
        console.error("Error creando producto:", error);
        throw error;
    }
}

export async function eliminarProductoAPI(id) {
    return del(`${API_ENDPOINTS.productos}/${encodeURIComponent(id)}`);
}
